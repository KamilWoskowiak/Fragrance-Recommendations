import pytest
from httpx import AsyncClient
from starlette.status import HTTP_200_OK, HTTP_400_BAD_REQUEST


@pytest.mark.asyncio
async def test_root(async_client: AsyncClient):
    r = await async_client.get("/")
    assert r.status_code == HTTP_200_OK
    assert r.json() == {"message": "Fragrance Recommendation API"}


@pytest.mark.asyncio
async def test_list_fragrances(async_client: AsyncClient):
    r = await async_client.get("/fragrances")
    assert r.status_code == HTTP_200_OK
    assert "fragrances" in r.json()
    assert len(r.json()["fragrances"]) > 0


@pytest.mark.asyncio
async def test_recommend_by_fragrances_success(async_client: AsyncClient):
    payload = {
        "liked_fragrances": ["Scent0", "Scent1"],
        "top_k": 2
    }
    r = await async_client.post("/recommend-by-fragrances", json=payload)
    assert r.status_code == HTTP_200_OK
    data = r.json()
    assert len(data) == 2
    assert "name" in data[0]


@pytest.mark.asyncio
async def test_recommend_by_fragrances_invalid(async_client: AsyncClient):
    payload = {"liked_fragrances": ["NotARealScent"]}
    r = await async_client.post("/recommend-by-fragrances", json=payload)
    assert r.status_code == HTTP_400_BAD_REQUEST
    assert "Invalid fragrance names" in r.json()["detail"]


@pytest.mark.asyncio
async def test_recommend_by_accords_success(async_client: AsyncClient):
    payload = {
        "accord_preferences": {"Woody & Earthy": 0.8, "Floral": 0.2},
        "time_pref": "night",
        "top_k": 3
    }
    r = await async_client.post("/recommend-by-accords", json=payload)
    assert r.status_code == HTTP_200_OK
    assert len(r.json()) == 3


@pytest.mark.asyncio
async def test_recommend_by_accords_invalid_weight(async_client: AsyncClient):
    payload = {
        "accord_preferences": {"Woody & Earthy": 1.5}
    }
    r = await async_client.post("/recommend-by-accords", json=payload)
    assert r.status_code == HTTP_400_BAD_REQUEST
    assert "Invalid weights" in r.json()["detail"]
