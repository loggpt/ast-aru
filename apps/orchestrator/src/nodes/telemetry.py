import os
import httpx
from src.state import SovereignState

async def fetch_telemetry(state: SovereignState) -> SovereignState:
    """
    Fetches the unified astrological and esoteric data from the API Gateway
    using the coordinates provided in the state.
    """
    # Prefer internal Docker network URL over localhost
    api_url = os.environ.get("API_GATEWAY_URL", "http://localhost:3000")
    endpoint = f"{api_url}/api/v1/timing/analyze"
    
    payload = {
        "latitude": state["latitude"],
        "longitude": state["longitude"],
        "timestamp": state["timestamp"]
    }
    
    async with httpx.AsyncClient() as client:
        response = await client.post(endpoint, json=payload, timeout=30.0)
        response.raise_for_status()
        data = response.json()
        
        # Merge telemetry into state
        state["telemetry_data"] = data.get("data", {})
        
        # Log system message indicating telemetry was successfully retrieved
        state["messages"].append({"role": "system", "content": "Telemetry successfully retrieved from API Gateway."})
        
    return state
