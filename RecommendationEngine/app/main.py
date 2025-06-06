from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.controller import router
from mangum import Mangum

app = FastAPI(title="Fragrance Recommendation API")

origins = [
    "https://fragrance-recommendations.vercel.app",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)

handler = Mangum(app)