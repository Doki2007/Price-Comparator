# pyrefly: ignore [missing-import]
from fastapi import APIRouter, HTTPException, status
from typing import List
import asyncio  
import database
from schemas import SearchResponse, ProductOut, HistorialOut
from scrapers import SCRAPERS_REGISTRY
from cachetools import TTLCache

router = APIRouter()

# Creamos un Caché en memoria.
# Guarda hasta 200 búsquedas distintas, y las borra solas después de 1 hora (3600 segundos)
search_cache = TTLCache(maxsize=200, ttl=3600)

@router.get("/health", status_code=status.HTTP_200_OK)
async def health_check():
    return {"status": "ok", "message": "API running"}

@router.get("/search", response_model=SearchResponse)
async def search_products(q: str):
    # Normalizamos la búsqueda para la llave de la caché
    q_normalizado = q.strip().lower()

    # Si alguien ya buscó lo mismo recientemente, devolvemos la caché
    if q_normalizado in search_cache:
        print(f"[CACHE HIT] Devolviendo resultados para '{q_normalizado}' de memoria sin escrapear.")
        return search_cache[q_normalizado]

    print(f"[CACHE MISS] Buscando '{q_normalizado}' en tiempo real en supermercados...")
    
    # Inicializamos dinámicamente los scrapers disponibles en el registro
    tiendas = [ScraperClass() for ScraperClass in SCRAPERS_REGISTRY]
    
    # Lanzamos todas las búsquedas en paralelo
    tareas = [t.buscar(q) for t in tiendas]
    resultados = await asyncio.gather(*tareas)
    
    # Aplanamos la lista de listas
    todos_los_productos = [p for sublista in resultados for p in sublista]
    
    # Importante: Guardamos en SQLite si encontramos algo
    if todos_los_productos:
        database.guardar_productos_completo(todos_los_productos)
    
    # Creamos la respuesta oficial
    response = SearchResponse(
        query=q,
        total_results=len(todos_los_productos),
        products=[ProductOut(**p) for p in todos_los_productos]
    )

    # Guardamos en nuestra caché por 1 hora antes de devolverla al usuario
    search_cache[q_normalizado] = response

    return response

@router.get("/products/{sku}/history", response_model=List[HistorialOut])
async def get_price_history(sku: str):
    historial = database.obtener_historial_precios(sku)
    if not historial:
        raise HTTPException(status_code=404, detail="Product history not found")
    return [HistorialOut(**h) for h in historial]
