from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class BaseProduct(BaseModel):
    id: str  # sku
    name: str
    brand: Optional[str] = None
    store: str
    price: float
    list_price: Optional[float] = None
    image: Optional[str] = None
    link: Optional[str] = None

class ProductOut(BaseProduct):
    last_updated: Optional[datetime] = None

class HistorialOut(BaseModel):
    id: int
    sku: str
    price: float
    list_price: Optional[float] = None
    date: datetime

class SearchResponse(BaseModel):
    query: str
    total_results: int
    products: List[ProductOut]
