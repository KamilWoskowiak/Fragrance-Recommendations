import pytest
from pydantic import ValidationError
from app.model.schemas import RecommendationRequest, AccordBasedRecommendationRequest, TimePreference, SeasonPreference

def test_recommendation_request_valid():
    req = RecommendationRequest(
        liked_fragrances=["A", "B"],
        time_pref=TimePreference.day,
        season_pref=SeasonPreference.cold,
        diversity_factor=0.5,
        top_k=3
    )
    assert req.liked_fragrances == ["A", "B"]
    assert req.time_pref == TimePreference.day
    assert req.season_pref == SeasonPreference.cold
    assert req.diversity_factor == 0.5
    assert req.top_k == 3

def test_recommendation_request_invalid_liked_fragrances_empty():
    # Empty liked_fragrances should fail (min_length=1)
    with pytest.raises(ValidationError):
        RecommendationRequest(liked_fragrances=[], time_pref=TimePreference.day)

def test_recommendation_request_invalid_top_k():
    # top_k must be >=1 and <=20
    with pytest.raises(ValidationError):
        RecommendationRequest(liked_fragrances=["A"], top_k=0)
    with pytest.raises(ValidationError):
        RecommendationRequest(liked_fragrances=["A"], top_k=21)

def test_recommendation_request_invalid_diversity_factor():
    # diversity_factor must be between 0.0 and 1.0
    with pytest.raises(ValidationError):
        RecommendationRequest(liked_fragrances=["A"], diversity_factor=-0.1)
    with pytest.raises(ValidationError):
        RecommendationRequest(liked_fragrances=["A"], diversity_factor=1.1)

def test_accord_based_request_valid():
    req = AccordBasedRecommendationRequest(
        accord_preferences={"Citrus & Fresh": 0.7},
        time_pref=TimePreference.both
    )
    assert isinstance(req.accord_preferences, dict)
    assert "Citrus & Fresh" in req.accord_preferences

def test_accord_based_request_invalid_empty_preferences():
    # accord_preferences must have at least one item (min_length=1)
    with pytest.raises(ValidationError):
        AccordBasedRecommendationRequest(accord_preferences={}, time_pref=TimePreference.both)
