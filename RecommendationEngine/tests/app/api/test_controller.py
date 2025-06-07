import pytest

def test_root_endpoint(client):
    res = client.get("/")
    assert res.status_code == 200
    assert res.json() == {"message": "Fragrance Recommendation API"}

def test_list_fragrances_endpoint(client):
    res = client.get("/fragrances")
    assert res.status_code == 200
    data = res.json()
    assert "fragrances" in data
    assert isinstance(data["fragrances"], list)
    # Each item should be a (brand, name) pair
    if data["fragrances"]:
        first = data["fragrances"][0]
        assert isinstance(first, (list, tuple))
        assert len(first) == 2

def test_list_accords_endpoint(client):
    res = client.get("/accords")
    assert res.status_code == 200
    data = res.json()
    assert "accords" in data
    assert isinstance(data["accords"], list)
    if data["accords"]:
        assert all(isinstance(x, str) for x in data["accords"])

def test_recommend_by_fragrances_valid(client):
    # Use a valid fragrance from the dataset
    valid_name = "Oudh 36"
    res = client.post("/recommend-by-fragrances", json={"liked_fragrances": [valid_name]})
    assert res.status_code == 200
    recommendations = res.json()
    assert isinstance(recommendations, list)
    assert len(recommendations) <= 5  # default top_k = 5
    if recommendations:
        rec = recommendations[0]
        assert "name" in rec and "brand" in rec and "match_score" in rec

def test_recommend_by_fragrances_invalid(client):
    res = client.post("/recommend-by-fragrances", json={"liked_fragrances": ["Unknown Fragrance"]})
    assert res.status_code == 500
    assert "Invalid fragrance names" in res.json()["detail"]

def test_recommend_by_accords_valid(client):
    res = client.post("/recommend-by-accords", json={"accord_preferences": {"Citrus & Fresh": 0.5}})
    assert res.status_code == 200
    recommendations = res.json()
    assert isinstance(recommendations, list)
    assert len(recommendations) <= 5

def test_recommend_by_accords_invalid_accord(client):
    res = client.post("/recommend-by-accords", json={"accord_preferences": {"Invalid": 0.5}})
    assert res.status_code == 500
    assert "Invalid accord names" in res.json()["detail"]

def test_recommend_by_accords_invalid_weight(client):
    res = client.post("/recommend-by-accords", json={"accord_preferences": {"Citrus & Fresh": -0.5}})
    assert res.status_code == 500
    assert "between 0 and 1" in res.json()["detail"]
