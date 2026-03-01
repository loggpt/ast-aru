from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from datetime import datetime
from src.core.ephemeris import calculate_ephemeris, AstroResult

router = APIRouter()

class AstroRequest(BaseModel):
    latitude: float = Field(..., ge=-90, le=90)
    longitude: float = Field(..., ge=-180, le=180)
    timestamp: datetime

class AstroResponse(BaseModel):
    status: str
    data: AstroResult

@router.post("/calculate", response_model=AstroResponse)
async def calculate_astro(request: AstroRequest):
    try:
        # Offload the SWISSEPH calculations to the asyncio thread pool
        result = await calculate_ephemeris(
            lat=request.latitude,
            lon=request.longitude,
            timestamp=request.timestamp
        )
        
        return AstroResponse(status="success", data=result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
