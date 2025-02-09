import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from app.config import NUMERIC_FEATURE_COLS, ACCORD_COLS, DATA_FILE
from app.model.schemas import TimePreference, SeasonPreference, RecommendationResponse


class FragranceRecommender:
    def __init__(self):
        self.df = pd.read_csv(DATA_FILE)
        self.valid_names = set(self.df['name'].str.strip().values)
        self.valid_names_brands = set(
            self.df.apply(lambda row: (row['brand'].strip(), row['name'].strip()), axis=1)
        )

    def calculate_rating_score(self, row):
        C = 10
        m = 3.0
        v = row['ratingValue']
        n = row['ratingCount']
        return (v * n + m * C) / (n + C)

    def get_dominant_accords(self, row, threshold=0.3):
        accords = {col: row[col] for col in ACCORD_COLS if row[col] > threshold}
        return sorted(accords.items(), key=lambda x: x[1], reverse=True)

    def calculate_time_score(self, row, time_pref):
        if time_pref == TimePreference.both:
            return 1.0
        time_score = row['timeOfDay_score']
        if time_pref == TimePreference.day:
            return (time_score + 2) / 4
        elif time_pref == TimePreference.night:
            return (-time_score + 2) / 4
        return 1.0

    def calculate_season_score(self, row, season_pref):
        if season_pref == SeasonPreference.both:
            return 1.0
        season_score = row['season_score']
        if season_pref == SeasonPreference.cold:
            return (-season_score + 2) / 4
        elif season_pref == SeasonPreference.hot:
            return (season_score + 2) / 4
        return 1.0

    def build_user_profile(self, liked_fragrances):
        liked_df = self.df[self.df['name'].isin(liked_fragrances)].copy()
        return liked_df[NUMERIC_FEATURE_COLS].mean(axis=0).values

    def adjust_similarity_diversity(self, similarities, diversity_factor):
        similarities = np.clip(similarities, 1e-10, 1)
        adjusted_similarities = np.power(similarities, 1 - diversity_factor)
        noise = np.random.normal(0, 0.1 * diversity_factor, len(similarities))
        return np.clip(adjusted_similarities + noise, 0, 1)

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
        else:
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
        else:
            return "Excellent Value"

    def get_recommendations(self, user_vector, time_pref, season_pref, top_k=5, diversity_factor=0.0):
        X = self.df[NUMERIC_FEATURE_COLS].values
        user_vector_2d = user_vector.reshape(1, -1)
        base_similarities = cosine_similarity(user_vector_2d, X)[0]
        adjusted_similarities = self.adjust_similarity_diversity(base_similarities, diversity_factor)

        temp_df = self.df.copy()
        temp_df['similarity'] = adjusted_similarities
        temp_df['rating_score'] = temp_df.apply(self.calculate_rating_score, axis=1)
        temp_df['time_match'] = temp_df.apply(lambda x: self.calculate_time_score(x, time_pref), axis=1)
        temp_df['season_match'] = temp_df.apply(lambda x: self.calculate_season_score(x, season_pref), axis=1)

        for col in ['rating_score', 'priceValue_score']:
            temp_df[f'{col}_norm'] = (temp_df[col] - temp_df[col].min()) / (temp_df[col].max() - temp_df[col].min())

        temp_df['final_score'] = (
                0.35 * temp_df['similarity'] +
                0.20 * temp_df['rating_score_norm'] +
                0.15 * temp_df['priceValue_score_norm'] +
                0.15 * temp_df['time_match'] +
                0.15 * temp_df['season_match']
        )

        recommendations = temp_df.sort_values(by='final_score', ascending=False).head(top_k)

        results = []
        for _, row in recommendations.iterrows():
            results.append(
                RecommendationResponse(
                    name=row['name'],
                    brand=row['brand'],
                    rating_value=row['ratingValue'],
                    rating_count=row['ratingCount'],
                    gender_label=self.get_gender_label(row['gender_score']),
                    price_value_label=self.format_price_value(row['priceValue_score']),
                    match_score=float(row['final_score']),
                    dominant_accords=self.get_dominant_accords(row),
                    notes_breakdown=row['notesBreakdown']  # Changed from notes_breakdown to notesBreakdown
                )
            )
        return results

    def get_recommendations_by_accords(
            self,
            accord_preferences: dict[str, float],
            time_pref: TimePreference,
            season_pref: SeasonPreference,
            top_k: int = 5,
            diversity_factor: float = 0.0
    ):
        invalid_accords = set(accord_preferences.keys()) - set(ACCORD_COLS)
        if invalid_accords:
            raise ValueError(f"Invalid accord names: {invalid_accords}")

        user_vector = np.zeros(len(NUMERIC_FEATURE_COLS))

        for accord, weight in accord_preferences.items():
            if not 0 <= weight <= 1:
                raise ValueError(f"Weight for {accord} must be between 0 and 1")
            idx = NUMERIC_FEATURE_COLS.index(accord)
            user_vector[idx] = weight

        for i, feature in enumerate(NUMERIC_FEATURE_COLS):
            if feature not in accord_preferences:
                if feature in ['gender_score', 'timeOfDay_score', 'season_score']:
                    user_vector[i] = 0
                elif feature == 'priceValue_score':
                    user_vector[i] = 0.5

        return self.get_recommendations(
            user_vector=user_vector,
            time_pref=time_pref,
            season_pref=season_pref,
            top_k=top_k,
            diversity_factor=diversity_factor
        )