from fastapi import APIRouter, HTTPException
from typing import List

from app.config import ACCORD_COLS
from app.model.schemas import RecommendationRequest, RecommendationResponse, AccordBasedRecommendationRequest
from app.service.recommender import FragranceRecommender

router = APIRouter()
recommender = FragranceRecommender()


@router.get("/")
async def root():
    return {"message": "Fragrance Recommendation API"}


@router.get("/fragrances")
async def list_fragrances():
    return {"fragrances": sorted(list(recommender.valid_names_brands))}

@router.get("/accords")
async def list_fragrances_accord():
    return {"accords": sorted(ACCORD_COLS)}


@router.post("/recommend-by-fragrances", response_model=List[RecommendationResponse])
async def recommend_fragrances(request: RecommendationRequest):
    try:
        invalid_names = [name for name in request.liked_fragrances
                         if name not in recommender.valid_names]
        if invalid_names:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid fragrance names: {', '.join(invalid_names)}"
            )

        user_vector = recommender.build_user_profile(request.liked_fragrances)
        recommendations = recommender.get_recommendations(
            user_vector,
            request.time_pref,
            request.season_pref,
            request.top_k,
            request.diversity_factor
        )

        response = []
        for _, row in recommendations.iterrows():
            response.append(RecommendationResponse(
                name=row['name'],
                brand=row['brand'],
                rating_value=row['ratingValue'],
                rating_count=row['ratingCount'],
                gender_label=recommender.get_gender_label(row['gender_score']),
                price_value_label=recommender.format_price_value(row['priceValue_score']),
                match_score=row['final_score'],
                dominant_accords=recommender.get_dominant_accords(row)[:3],
                notes_breakdown=row['notesBreakdown']
            ))

        return response

    except Exception as e:
        print(str(e))
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/recommend-by-accords", response_model=List[RecommendationResponse])
async def recommend_fragrances_by_accords(request: AccordBasedRecommendationRequest):
    try:
        invalid_accords = set(request.accord_preferences.keys()) - set(ACCORD_COLS)
        if invalid_accords:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid accord names: {', '.join(invalid_accords)}"
            )

        invalid_weights = [
            accord for accord, weight in request.accord_preferences.items()
            if not 0 <= weight <= 1
        ]
        if invalid_weights:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid weights for accords: {', '.join(invalid_weights)}. Weights must be between 0 and 1."
            )

        recommendations = recommender.get_recommendations_by_accords(
            accord_preferences=request.accord_preferences,
            time_pref=request.time_pref,
            season_pref=request.season_pref,
            top_k=request.top_k,
            diversity_factor=request.diversity_factor
        )

        return recommendations

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"An error occurred while processing your request: {str(e)}"
        )