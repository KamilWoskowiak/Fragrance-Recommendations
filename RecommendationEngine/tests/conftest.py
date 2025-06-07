import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.service.recommender import FragranceRecommender

@pytest.fixture(scope="module")
def client():
    return TestClient(app)

@pytest.fixture(scope="module")
def recommender():
    return FragranceRecommender()
