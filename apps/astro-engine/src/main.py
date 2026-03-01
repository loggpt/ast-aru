from fastapi import FastAPI
from src.api.routes import router as astro_router

app = FastAPI(title="Sovereign Architect OS - Astro Engine", version="1.0.0")

app.include_router(astro_router, prefix="/api/v1/astro", tags=["Astrology"])

@app.get("/health")
async def health_check():
    return {"status": "ok"}
