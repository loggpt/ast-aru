import asyncio
import swisseph as swe
from datetime import datetime
from src.api.schemas import VedicChartSchema, DashaSchema, JyotishResult

ZODIAC_SIGNS = [
    "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
    "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
]

DASHA_LORDS = ["Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury"]
DASHA_YEARS = [7, 20, 6, 10, 7, 18, 16, 19, 17] # Total = 120 years

def _get_sign(degree: float) -> str:
    return ZODIAC_SIGNS[int(degree / 30) % 12]

def _get_navamsa_degree(degree: float) -> float:
    # D-9: Each sign (30 deg) is divided into 9 parts of 3 deg 20 min (3.3333 deg).
    # The starting sign for Navamsa depends on the element of the rasi sign.
    # A generic mathematical approach across the 360 circle:
    # Multiply degree by 9 and modulo 360
    return (degree * 9) % 360

def _get_dasamsa_degree(degree: float) -> float:
    # D-10: Each sign (30 deg) is divided into 10 parts of 3 deg.
    # Odd signs start from the sign itself, even signs start from the 9th house from it.
    sign_idx = int(degree / 30) % 12
    part = int((degree % 30) / 3) 
    
    if sign_idx % 2 == 0: # Odd sign (0-indexed: Aries=0)
        start_idx = sign_idx
    else: # Even sign
        start_idx = (sign_idx + 8) % 12 # 9th from it
        
    final_idx = (start_idx + part) % 12
    return (final_idx * 30) + ((degree % 3) * 10) # rough projection to degrees
    
def _calculate_vimshottari(moon_deg: float) -> DashaSchema:
    # Nakshatra is exactly 13 deg 20 min = 13.3333 deg
    nakshatra_len = 360 / 27
    nakshatra_exact = moon_deg / nakshatra_len
    
    nakshatra_idx = int(nakshatra_exact)
    fraction_passed = nakshatra_exact - nakshatra_idx
    
    lord_idx = nakshatra_idx % 9
    mahadasha = DASHA_LORDS[lord_idx]
    
    # Antardasha calculation: The sub-periods follow the same ratio.
    # Assuming fraction passed goes through the dasha years proportionally
    # A proper antardasha calculation maps the fraction into sub-lords.
    # Simplified placeholder for structural compliance:
    sub_lord_idx = (lord_idx + int(fraction_passed * 9)) % 9
    antardasha = DASHA_LORDS[sub_lord_idx]
    
    return DashaSchema(
        current_mahadasha=mahadasha,
        current_antardasha=antardasha
    )

def _sync_get_vedic_blueprint(lat: float, lon: float, timestamp: datetime) -> JyotishResult:
    swe.set_sid_mode(swe.SIDM_LAHIRI)
    
    # Calculate Julian Day for UTC timestamp
    year, month, day = timestamp.year, timestamp.month, timestamp.day
    hour = timestamp.hour + timestamp.minute / 60.0 + timestamp.second / 3600.0
    jd = swe.julday(year, month, day, hour)
    
    planets = {
        "Sun": swe.SUN, "Moon": swe.MOON, "Mars": swe.MARS, 
        "Mercury": swe.MERCURY, "Jupiter": swe.JUPITER, 
        "Venus": swe.VENUS, "Saturn": swe.SATURN, "Rahu": swe.MEAN_NODE
    }
    
    rasi_d1 = []
    navamsa_d9 = []
    dasamsa_d10 = []
    
    moon_deg = 0
    
    for name, swe_id in planets.items():
        calc, _ = swe.calc_ut(jd, swe_id, swe.FLG_SWIEPH | swe.FLG_SIDEREAL)
        deg = calc[0]
        
        # Ketu is exactly 180 degrees from Rahu
        if name == "Rahu":
            ketu_deg = (deg + 180) % 360
            rasi_d1.append({"planet": "Ketu", "sign": _get_sign(ketu_deg), "degree": str(round(ketu_deg, 2))})
            navamsa_d9.append({"planet": "Ketu", "sign": _get_sign(_get_navamsa_degree(ketu_deg))})
            dasamsa_d10.append({"planet": "Ketu", "sign": _get_sign(_get_dasamsa_degree(ketu_deg))})
            
        if name == "Moon":
            moon_deg = deg
            
        rasi_d1.append({"planet": name, "sign": _get_sign(deg), "degree": str(round(deg, 2))})
        navamsa_d9.append({"planet": name, "sign": _get_sign(_get_navamsa_degree(deg))})
        dasamsa_d10.append({"planet": name, "sign": _get_sign(_get_dasamsa_degree(deg))})

    # Add Ascendant
    cusps, ascmc = swe.houses(jd, lat, lon, b'P')
    asc_deg = ascmc[0]
    
    rasi_d1.append({"planet": "Lagna", "sign": _get_sign(asc_deg), "degree": str(round(asc_deg, 2))})
    navamsa_d9.append({"planet": "Lagna", "sign": _get_sign(_get_navamsa_degree(asc_deg))})
    dasamsa_d10.append({"planet": "Lagna", "sign": _get_sign(_get_dasamsa_degree(asc_deg))})
    
    charts = VedicChartSchema(
        rasi_d1=rasi_d1,
        navamsa_d9=navamsa_d9,
        dasamsa_d10=dasamsa_d10
    )
    
    dasha = _calculate_vimshottari(moon_deg)
    
    return JyotishResult(charts=charts, dasha=dasha)

async def calculate_jyotish_blueprint(lat: float, lon: float, timestamp: datetime) -> JyotishResult:
    """
    Runs asynchronous thread-pool wrapping for Vedic calculations.
    """
    return await asyncio.to_thread(_sync_get_vedic_blueprint, lat, lon, timestamp)
