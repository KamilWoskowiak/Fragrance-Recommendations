from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_FILE = BASE_DIR / "data" / "fragrances.csv"

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