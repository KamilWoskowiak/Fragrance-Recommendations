import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.service.recommender import FragranceRecommender

@pytest.fixture(scope="module")
def client():
    with TestClient(app) as c:
        yield c

@pytest.fixture(scope="module")
def recommender():
    return FragranceRecommender()
