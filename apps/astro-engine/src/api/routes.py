import asyncio
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from datetime import datetime
from src.core.ephemeris import calculate_ephemeris, AstroResult
from src.core.jyotish import calculate_jyotish_blueprint, JyotishResult

router = APIRouter()

class AstroRequest(BaseModel):
    latitude: float = Field(..., ge=-90, le=90)
    longitude: float = Field(..., ge=-180, le=180)
    timestamp: datetime

class AstroResponse(BaseModel):
    status: str
    ephemeris: AstroResult
    vedic: JyotishResult

@router.post("/calculate", response_model=AstroResponse)
async def calculate_astro(request: AstroRequest):
    try:
        # Offload both SWISSEPH calculations to the asyncio thread pool concurrently
        ephemeris_task = calculate_ephemeris(
            lat=request.latitude,
            lon=request.longitude,
            timestamp=request.timestamp
        )
        
        vedic_task = calculate_jyotish_blueprint(
            lat=request.latitude,
            lon=request.longitude,
            timestamp=request.timestamp
        )
        
        ephemeris_result, vedic_result = await asyncio.gather(ephemeris_task, vedic_task)
        
        return AstroResponse(
            status="success", 
            ephemeris=ephemeris_result,
            vedic=vedic_result
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

