from pydantic import BaseModel, validator, Field
from typing import List, Optional, Tuple
from enum import Enum

class TimePreference(str, Enum):
    day = "day"
    night = "night"
    both = "both"

class SeasonPreference(str, Enum):
    hot = "hot"
    cold = "cold"
    both = "both"

class RecommendationRequest(BaseModel):
    liked_fragrances: List[str] = Field(..., min_items=1, max_items=10)
    time_pref: TimePreference = Field(default=TimePreference.both)
    season_pref: SeasonPreference = Field(default=SeasonPreference.both)
    diversity_factor: float = Field(default=0.0, ge=0.0, le=1.0)
    top_k: int = Field(default=5, ge=1, le=20)

class AccordBasedRecommendationRequest(BaseModel):
    accord_preferences: dict[str, float] = Field(..., min_items=1, max_items=10)
    time_pref: TimePreference = Field(default=TimePreference.both)
    season_pref: SeasonPreference = Field(default=SeasonPreference.both)
    diversity_factor: float = Field(default=0.0, ge=0.0, le=1.0)
    top_k: int = Field(default=5, ge=1, le=20)

class RecommendationResponse(BaseModel):
    name: str
    brand: str
    rating_value: float
    rating_count: int
    gender_label: str
    price_value_label: str
    match_score: float
    dominant_accords: List[Tuple[str, float]]
    notes_breakdown: Optional[str]
