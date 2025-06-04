import asyncio
from pathlib import Path

import pandas as pd
import pytest
from fastapi.testclient import TestClient
from httpx import AsyncClient
import pytest_asyncio

from app.main import app as fastapi_app
from app.api.controller import recommender as _recommender
from app.config import NUMERIC_FEATURE_COLS, ACCORD_COLS

@pytest.fixture(scope="session")
def sample_df() -> pd.DataFrame:
    row_template = {
        "brand": "BrandA",
        "name":  "Scent{}",
        "ratingValue":     4.2,
        "ratingCount":     123,
        "gender_score":    0.0,
        "priceValue_score":0.0,
        "timeOfDay_score": 1.0,
        "season_score":   -1.0,
        **{c: 0.0 for c in ACCORD_COLS},
    }

    rows = []
    for i in range(5):
        row = row_template.copy()
        row["name"] = row["name"].format(i)
        row["Woody & Earthy"] = 0.8 - i * 0.1
        row["Citrus & Fresh"] = 0.1 + i * 0.1
        rows.append(row)

    df = pd.DataFrame(rows)

    df["notesBreakdown"] = "Top notes, heart notes, base notes"
    return df[["brand", "name", "ratingValue", "ratingCount",
               *NUMERIC_FEATURE_COLS, "notesBreakdown"
               ]]

@pytest.fixture(scope="session", autouse=True)
def patch_global_recommender_df(sample_df):
    _recommender.df = sample_df
    _recommender.valid_names = set(sample_df["name"])
    _recommender.valid_names_brands = set(
        sample_df.apply(lambda r: (r["brand"], r["name"]), axis=1)
    )

@pytest.fixture(scope="session")
def client():
    return TestClient(fastapi_app)

@pytest_asyncio.fixture()
async def async_client():
    async with AsyncClient(app=fastapi_app, base_url="http://test") as ac:
        yield ac
