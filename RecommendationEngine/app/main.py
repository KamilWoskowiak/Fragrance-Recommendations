from mangum import Mangum
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi_limiter import FastAPILimiter
from fastapi_limiter.depends import RateLimiter
import redis.asyncio as redis
from contextlib import asynccontextmanager
import os

@asynccontextmanager
async def lifespan(app: FastAPI):
    redis_url = os.getenv("REDIS_URL")
    if not redis_url:
        raise RuntimeError("REDIS_URL is not set")
    redis_client = await redis.from_url(
        redis_url,
        encoding="utf-8",
        decode_responses=True,
    )
    await FastAPILimiter.init(redis_client)
    print("Redis rate-limiter INITIALISED")
    try:
        yield
    finally:
        await FastAPILimiter.close()

        await redis_client.aclose()
        print("Redis connection CLOSED")

app = FastAPI(
    title="Fragrance Recommendation API",
    lifespan=lifespan,
)

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

from app.api.controller import router

router.dependencies.append(Depends(RateLimiter(times=100, seconds=60)))
app.include_router(router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

handler = Mangum(app)