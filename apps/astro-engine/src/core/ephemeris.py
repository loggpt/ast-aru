import asyncio
import swisseph as swe
from datetime import datetime
from pydantic import BaseModel

# Ensure swepath is set to default or download ephemeris files if needed
# For now, swe will use built-in semi-analytic models or minimal ephemeris.

class AstroResult(BaseModel):
    sun_degree: float
    moon_degree: float
    ascendant_degree: float
    mahadasha: str

def _sync_calculate(lat: float, lon: float, timestamp: datetime) -> AstroResult:
    # Set the sidereal mode to Lahiri (often used in Vedic)
    swe.set_sid_mode(swe.SIDM_LAHIRI)
    
    # Calculate Julian Day for UTC timestamp
    year, month, day = timestamp.year, timestamp.month, timestamp.day
    hour = timestamp.hour + timestamp.minute / 60.0 + timestamp.second / 3600.0
    
    jd = swe.julday(year, month, day, hour)
    
    # Calculate Sun
    sun_calc, _ = swe.calc_ut(jd, swe.SUN, swe.FLG_SWIEPH | swe.FLG_SIDEREAL)
    sun_deg = sun_calc[0]
    
    # Calculate Moon
    moon_calc, _ = swe.calc_ut(jd, swe.MOON, swe.FLG_SWIEPH | swe.FLG_SIDEREAL)
    moon_deg = moon_calc[0]
    
    # Calculate Ascendant
    # swe.houses expects (jd_ut, lat, lon, hsys='P' for Placidus, return: cusps, ascmc)
    # ascmc[0] is Ascendant
    cusps, ascmc = swe.houses(jd, lat, lon, b'P')
    asc_deg = ascmc[0]
    
    # Rough Mahadasha calculation placeholder (using Nakshatra of Moon)
    # 360 / 27 nakshatras = 13 degrees 20 minutes (13.333)
    nakshatra_num = int(moon_deg / (360 / 27))
    dasha_lords = ["Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury"]
    mahadasha = dasha_lords[nakshatra_num % 9]
    
    return AstroResult(
        sun_degree=sun_deg,
        moon_degree=moon_deg,
        ascendant_degree=asc_deg,
        mahadasha=mahadasha
    )

async def calculate_ephemeris(lat: float, lon: float, timestamp: datetime) -> AstroResult:
    """
    Runs the synchronous pyswisseph calculations in a thread pool 
    so they do not block the asyncio event loop.
    """
    return await asyncio.to_thread(_sync_calculate, lat, lon, timestamp)
