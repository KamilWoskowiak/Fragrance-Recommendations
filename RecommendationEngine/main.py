import numpy as np
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity

NUMERIC_FEATURE_COLS = [
    "Woody & Earthy", "Smoky & Leathery", "Resinous & Balsamic",
    "Citrus & Fresh", "Green & Herbal", "Warm & Spicy",
    "Sweet & Gourmand", "Floral", "Powdery & Soft", "Synthetic",
    "Uncommon", "gender_score", "priceValue_score", "timeOfDay_score",
    "season_score"
]

ACCORD_COLS = [
    "Woody & Earthy", "Smoky & Leathery", "Resinous & Balsamic",
    "Citrus & Fresh", "Green & Herbal", "Warm & Spicy",
    "Sweet & Gourmand", "Floral", "Powdery & Soft", "Synthetic",
    "Uncommon"
]


def load_data():
    return pd.read_csv('./data/fragrances.csv')


def calculate_rating_score(row):
    C = 10
    m = 3.0
    v = row['ratingValue']
    n = row['ratingCount']
    return (v * n + m * C) / (n + C)


def get_dominant_accords(row, threshold=0.3):
    accords = {col: row[col] for col in ACCORD_COLS if row[col] > threshold}
    return sorted(accords.items(), key=lambda x: x[1], reverse=True)


def calculate_time_score(row, time_pref):
    if time_pref == 'both':
        return 1.0

    time_score = row['timeOfDay_score']
    if time_pref == 'day':
        return (time_score + 2) / 4
    elif time_pref == 'night':
        return (-time_score + 2) / 4
    return 1.0


def calculate_season_score(row, season_pref):
    if season_pref == 'both':
        return 1.0

    season_score = row['season_score']
    if season_pref == 'cold':
        return (-season_score + 2) / 4
    elif season_pref == 'hot':
        return (season_score + 2) / 4
    return 1.0


def build_user_profile(df, liked_fragrances):
    liked_df = df[df['name'].isin(liked_fragrances)].copy()

    if liked_df.empty:
        print("No matching liked fragrances found in dataset.")
        return np.zeros(len(NUMERIC_FEATURE_COLS))

    return liked_df[NUMERIC_FEATURE_COLS].mean(axis=0).values


def adjust_similarity_diversity(similarities, diversity_factor):
    similarities = np.clip(similarities, 1e-10, 1)  # Prevent zero/negative values
    adjusted_similarities = np.power(similarities, 1 - diversity_factor)
    noise = np.random.normal(0, 0.1 * diversity_factor, len(similarities))
    return np.clip(adjusted_similarities + noise, 0, 1)


def get_gender_label(score):
    if score <= -1:
        return "Very Feminine"
    elif score <= -0.3:
        return "Feminine"
    elif score <= 0.3:
        return "Unisex"
    elif score <= 0.7:
        return "Masculine"
    else:
        return "Very Masculine"


def get_recommendations(df, user_vector, time_pref, season_pref, feature_cols=NUMERIC_FEATURE_COLS,
                        top_k=5, diversity_factor=0.0):
    X = df[feature_cols].values
    user_vector_2d = user_vector.reshape(1, -1)
    base_similarities = cosine_similarity(user_vector_2d, X)[0]
    adjusted_similarities = adjust_similarity_diversity(base_similarities, diversity_factor)

    df = df.copy()
    df['similarity'] = adjusted_similarities
    df['rating_score'] = df.apply(calculate_rating_score, axis=1)
    df['time_match'] = df.apply(lambda x: calculate_time_score(x, time_pref), axis=1)
    df['season_match'] = df.apply(lambda x: calculate_season_score(x, season_pref), axis=1)

    for col in ['rating_score', 'priceValue_score']:
        df[f'{col}_norm'] = (df[col] - df[col].min()) / (df[col].max() - df[col].min())

    df['final_score'] = (
            0.35 * df['similarity'] +
            0.20 * df['rating_score_norm'] +
            0.15 * df['priceValue_score_norm'] +
            0.15 * df['time_match'] +
            0.15 * df['season_match']
    )

    recommended = df.sort_values(by='final_score', ascending=False).head(top_k).copy()
    recommended['gender_label'] = recommended['gender_score'].apply(get_gender_label)

    return recommended.reset_index(drop=True)


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


def recommend_fragrances(liked_fragrances, time_pref='both', season_pref='both',
                         diversity_factor=0.0, top_k=5):
    df = load_data()
    user_vector = build_user_profile(df, liked_fragrances)
    recommended_df = get_recommendations(
        df, user_vector, time_pref, season_pref,
        NUMERIC_FEATURE_COLS, top_k, diversity_factor
    )

    print("\nRecommendation Parameters:")
    print(f"- Liked fragrances: {liked_fragrances}")
    print(f"- Time preference: {time_pref}")
    print(f"- Season preference: {season_pref}")
    print(f"- Diversity factor: {diversity_factor}")
    print("\nTop", top_k, "Recommended Fragrances:\n")

    for idx, row in recommended_df.iterrows():
        print(f"{idx + 1}. {row['name']} by {row['brand']}")
        print(f"   Rating: {row['ratingValue']:.1f}/5 ({row['ratingCount']} reviews)")
        print(f"   Gender: {row['gender_label']}")
        print(f"   Price Value: {format_price_value(row['priceValue_score'])}")
        print(f"   Match Score: {row['final_score']:.2f}")
        print("   Dominant Accords:", end=" ")
        dominant_accords = get_dominant_accords(row)
        print(", ".join([f"{accord} ({score:.1f})" for accord, score in dominant_accords[:3]]))
        if row['notesBreakdown']:
            print(f"   Notes: {row['notesBreakdown']}")
        print()

    return recommended_df


if __name__ == "__main__":
    recommendations = recommend_fragrances(
        liked_fragrances=["Amore Caffè", "XJ 1861 Naxos", "MYSLF Le Parfum"],
        time_pref='night',
        season_pref='cold',
        diversity_factor=0.5,
        top_k=5
    )