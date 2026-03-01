from fastapi.testclient import TestClient
from src.main import app
from datetime import datetime

client = TestClient(app)

def test_health_check():
    response = client.get("/api/v1/astro/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}

def test_calculate_astro():
    # Use Mumbai coordinates and a known timestamp
    payload = {
        "latitude": 19.0760,
        "longitude": 72.8777,
        "timestamp": "2026-03-01T07:53:00.000Z"
    }
    
    response = client.post("/api/v1/astro/calculate", json=payload)
    assert response.status_code == 200
    data = response.json()
    
    assert data["status"] == "success"
    assert "ephemeris" in data
    assert "vedic" in data
    
    # Check Vedic structure
    charts = data["vedic"]["charts"]
    dasha = data["vedic"]["dasha"]
    
    assert "rasi_d1" in charts
    assert "navamsa_d9" in charts
    assert "dasamsa_d10" in charts
    assert "current_mahadasha" in dasha
    assert "current_antardasha" in dasha
    
    # Verify Lagna (Ascendant) exists in D-1
    lagnas = [p for p in charts["rasi_d1"] if p["planet"] == "Lagna"]
    assert len(lagnas) == 1
    # Lagna should have a sign
    assert lagnas[0]["sign"] in [
        "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
        "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
    ]
