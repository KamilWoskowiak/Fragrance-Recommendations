import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from app.config import NUMERIC_FEATURE_COLS, ACCORD_COLS, DATA_FILE
from app.model.schemas import TimePreference, SeasonPreference, RecommendationResponse


class FragranceRecommender:
    def __init__(self):
        self.df = pd.read_csv(DATA_FILE)
        self.valid_names = set(self.df["name"].str.strip().values)
        self.valid_names_brands = set(
            self.df.apply(lambda r: (r["brand"].strip(), r["name"].strip()), axis=1)
        )

    @staticmethod
    def calculate_rating_score(row):
        C, m = 10, 3.0
        v, n = row["ratingValue"], row["ratingCount"]
        return (v * n + m * C) / (n + C)

    @staticmethod
    def get_dominant_accords(row, threshold=0.30):
        accords = {c: row[c] for c in ACCORD_COLS if row[c] > threshold}
        return sorted(accords.items(), key=lambda x: x[1], reverse=True)

    @staticmethod
    def calculate_time_score(row, time_pref):
        if time_pref == TimePreference.both:
            return 1.0
        score = row["timeOfDay_score"]
        return ((score if time_pref == TimePreference.day else -score) + 2) / 4

    @staticmethod
    def calculate_season_score(row, season_pref):
        if season_pref == SeasonPreference.both:
            return 1.0
        score = row["season_score"]
        return ((-score if season_pref == SeasonPreference.cold else score) + 2) / 4

    @staticmethod
    def get_gender_label(score):
        if score <= -0.9:
            return "Very Feminine"
        elif score <= -0.3:
            return "Feminine"
        elif score <= 0.3:
            return "Unisex"
        elif score <= 0.9:
            return "Masculine"
        return "Very Masculine"

    @staticmethod
    def format_price_value(score):
        if score <= -1.5:
            return "Very Overpriced"
        elif score <= -0.5:
            return "Overpriced"
        elif score <= 0.5:
            return "Fair Price"
        elif score <= 1.5:
            return "Good Value"
        return "Excellent Value"

    @staticmethod
    def mmr_re_rank(df, feature_cols, k, lambda_):
        if df.empty:
            return df

        selected, remaining = [], df.index.tolist()
        vectors = df[feature_cols].values
        sim_mat = cosine_similarity(vectors, vectors)

        while len(selected) < k and remaining:
            if not selected:
                best = remaining[0]
            else:
                mmr_scores = []
                for idx in remaining:
                    relevance = df.at[idx, "final_score"]
                    novelty = sim_mat[idx, selected].max()
                    mmr_scores.append(lambda_ * relevance - (1 - lambda_) * novelty)
                best = remaining[int(np.argmax(mmr_scores))]
            selected.append(best)
            remaining.remove(best)

        return df.loc[selected]

    def build_user_profile(self, liked_fragrances):
        liked_df = self.df[self.df["name"].isin(liked_fragrances)].copy()
        return liked_df[NUMERIC_FEATURE_COLS].mean(axis=0).values

    def get_recommendations(
        self,
        user_vector,
        time_pref: TimePreference,
        season_pref: SeasonPreference,
        top_k: int = 5,
        diversity_factor: float = 0.0,
    ):
        sims = cosine_similarity(user_vector.reshape(1, -1), self.df[NUMERIC_FEATURE_COLS].values)[0]

        temp = self.df.copy()
        temp["similarity"] = sims
        temp["rating_score"] = temp.apply(self.calculate_rating_score, axis=1)
        temp["time_match"] = temp.apply(lambda r: self.calculate_time_score(r, time_pref), axis=1)
        temp["season_match"] = temp.apply(lambda r: self.calculate_season_score(r, season_pref), axis=1)

        for col in ["rating_score", "priceValue_score"]:
            temp[f"{col}_norm"] = (temp[col] - temp[col].min()) / (temp[col].max() - temp[col].min() + 1e-9)

        sim_w = 0.35 * (1 - diversity_factor)
        temp["final_score"] = (
            sim_w * temp["similarity"]
            + 0.20 * temp["rating_score_norm"]
            + 0.15 * temp["priceValue_score_norm"]
            + 0.15 * temp["time_match"]
            + 0.15 * temp["season_match"]
        )

        pool_size = max(30, top_k * 10)
        candidates = temp.sort_values("final_score", ascending=False).head(pool_size)
        lambda_ = 1 - diversity_factor
        diversified = (
            self.mmr_re_rank(candidates, NUMERIC_FEATURE_COLS, k=top_k, lambda_=lambda_)
            .sort_values("final_score", ascending=False)
        )

        results = []
        for _, row in diversified.iterrows():
            results.append(
                RecommendationResponse(
                    name=row["name"],
                    brand=row["brand"],
                    rating_value=row["ratingValue"],
                    rating_count=row["ratingCount"],
                    gender_label=self.get_gender_label(row["gender_score"]),
                    price_value_label=self.format_price_value(row["priceValue_score"]),
                    match_score=float(row["final_score"]),
                    dominant_accords=self.get_dominant_accords(row),
                    notes_breakdown=row["notesBreakdown"],
                )
            )
        return results

    def get_recommendations_by_accords(
        self,
        accord_preferences: dict[str, float],
        time_pref: TimePreference,
        season_pref: SeasonPreference,
        top_k: int = 5,
        diversity_factor: float = 0.0,
    ):
        invalid = set(accord_preferences) - set(ACCORD_COLS)
        if invalid:
            raise ValueError(f"Invalid accord names: {invalid}")

        user_vec = np.zeros(len(NUMERIC_FEATURE_COLS))
        for accord, weight in accord_preferences.items():
            if not 0.0 <= weight <= 1.0:
                raise ValueError(f"Weight for {accord} must be in [0, 1]")
            user_vec[NUMERIC_FEATURE_COLS.index(accord)] = weight

        for i, feat in enumerate(NUMERIC_FEATURE_COLS):
            if feat not in accord_preferences:
                user_vec[i] = 0 if feat in {"gender_score", "timeOfDay_score", "season_score"} else 0.5

        return self.get_recommendations(
            user_vector=user_vec,
            time_pref=time_pref,
            season_pref=season_pref,
            top_k=top_k,
            diversity_factor=diversity_factor,
        )
