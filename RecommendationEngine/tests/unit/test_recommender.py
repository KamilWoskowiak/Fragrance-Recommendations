import numpy as np
import pytest

from app.api.controller import recommender
from app.config import NUMERIC_FEATURE_COLS
from app.model.schemas import TimePreference, SeasonPreference

def test_build_user_profile(sample_df):
    liked = [sample_df.loc[0, "name"], sample_df.loc[1, "name"]]
    profile = recommender.build_user_profile(liked)
    assert isinstance(profile, np.ndarray)
    manual = sample_df[sample_df["name"].isin(liked)][NUMERIC_FEATURE_COLS].mean().values
    assert np.allclose(profile, manual)

def test_get_recommendations_basic(sample_df):
    liked = [sample_df.loc[0, "name"]]
    user_vec = recommender.build_user_profile(liked)
    recs = recommender.get_recommendations(user_vec,
                                           time_pref=TimePreference.both,
                                           season_pref=SeasonPreference.both,
                                           top_k=3,
                                           diversity_factor=0.0)
    assert len(recs) == 3
    for r in recs:
        assert set(r.dict().keys()) == {
            "name","brand","rating_value","rating_count",
            "gender_label","price_value_label",
            "match_score","dominant_accords","notes_breakdown"
        }
        assert r.name not in liked

@pytest.mark.parametrize("diversity", [0.0, 0.5, 1.0])
def test_similarity_diversity_tuning(diversity):
    sims = np.array([1.0, 0.8, 0.3])
    adjusted = recommender.adjust_similarity_diversity(sims, diversity_factor=diversity)
    assert np.all(adjusted <= 1.0)
    assert np.all(adjusted >= 0.0)
