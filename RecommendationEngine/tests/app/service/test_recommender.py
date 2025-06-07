import pytest
import numpy as np
from app.service.recommender import FragranceRecommender
from app.config import NUMERIC_FEATURE_COLS, ACCORD_COLS
from app.model.schemas import TimePreference, SeasonPreference, RecommendationResponse

def test_recommender_initialization(recommender):
    # Must load a DataFrame and populate valid_names sets
    assert hasattr(recommender, 'df')
    assert hasattr(recommender, 'valid_names')
    assert hasattr(recommender, 'valid_names_brands')
    assert isinstance(recommender.valid_names, set)
    assert isinstance(recommender.valid_names_brands, set)
    # Check numeric feature columns are present
    for col in NUMERIC_FEATURE_COLS:
        assert col in recommender.df.columns

def test_build_user_profile(recommender):
    # Build profile for a single known fragrance
    sample_name = next(iter(recommender.valid_names))
    user_profile = recommender.build_user_profile([sample_name])
    assert isinstance(user_profile, np.ndarray)
    assert user_profile.shape[0] == len(NUMERIC_FEATURE_COLS)

def test_get_recommendations_by_accords_invalid_key(recommender):
    # Accord name not in ACCORD_COLS should raise ValueError
    with pytest.raises(ValueError):
        recommender.get_recommendations_by_accords(
            accord_preferences={"InvalidAccord": 0.5},
            time_pref=TimePreference.both,
            season_pref=SeasonPreference.both
        )

def test_get_recommendations_by_accords_invalid_weight(recommender):
    valid_accord = ACCORD_COLS[0]
    # Weight outside [0,1] should raise ValueError
    with pytest.raises(ValueError):
        recommender.get_recommendations_by_accords(
            accord_preferences={valid_accord: -0.1},
            time_pref=TimePreference.both,
            season_pref=SeasonPreference.both
        )
    with pytest.raises(ValueError):
        recommender.get_recommendations_by_accords(
            accord_preferences={valid_accord: 1.1},
            time_pref=TimePreference.both,
            season_pref=SeasonPreference.both
        )

def test_get_recommendations_by_accords_valid(recommender):
    valid_accord = ACCORD_COLS[0]
    # Valid input should return 'top_k' recommendations
    results = recommender.get_recommendations_by_accords(
        accord_preferences={valid_accord: 0.5},
        time_pref=TimePreference.both,
        season_pref=SeasonPreference.both,
        top_k=3,
        diversity_factor=0.0
    )
    assert isinstance(results, list)
    assert len(results) == 3
    for res in results:
        assert isinstance(res, RecommendationResponse)
        # Check key fields are present
        assert hasattr(res, 'name')
        assert hasattr(res, 'brand')
        assert hasattr(res, 'match_score')
