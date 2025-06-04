import pytest
from pydantic import ValidationError

from app.model.schemas import (
    RecommendationRequest,
    AccordBasedRecommendationRequest,
    TimePreference, SeasonPreference
)

def test_recommendation_request_validates():
    req = RecommendationRequest(liked_fragrances=["Scent0"],
                                time_pref=TimePreference.day,
                                season_pref=SeasonPreference.hot,
                                top_k=5)
    assert req.top_k == 5

def test_recommendation_request_too_many_items():
    with pytest.raises(ValidationError):
        RecommendationRequest(liked_fragrances=[f"a{i}" for i in range(11)])

def test_accord_based_request_invalid_weight():
    with pytest.raises(ValidationError):
        AccordBasedRecommendationRequest(
            accord_preferences={"Woody & Earthy": 1.2}
        )
