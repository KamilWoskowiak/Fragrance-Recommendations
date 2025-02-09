from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.controller import router

app = FastAPI(title="Fragrance Recommendation API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="localhost", port=8000)