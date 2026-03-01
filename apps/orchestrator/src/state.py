from typing import TypedDict, Dict, Any, List
from pydantic import BaseModel, Field

class SovereignState(TypedDict):
    """
    State representing the context of a celestial query across the LangGraph workflow.
    """
    user_query: str
    latitude: float
    longitude: float
    timestamp: str  # ISO-8601 format
    telemetry_data: Dict[str, Any]
    messages: List[Dict[str, str]]
