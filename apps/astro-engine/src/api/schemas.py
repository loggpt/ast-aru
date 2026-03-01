from pydantic import BaseModel, Field
from typing import List, Dict

class VedicChartSchema(BaseModel):
    rasi_d1: List[Dict[str, str]]
    navamsa_d9: List[Dict[str, str]]
    dasamsa_d10: List[Dict[str, str]]

class DashaSchema(BaseModel):
    current_mahadasha: str
    current_antardasha: str

class JyotishResult(BaseModel):
    charts: VedicChartSchema
    dasha: DashaSchema
