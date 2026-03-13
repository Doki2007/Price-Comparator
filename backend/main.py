import asyncio
import database
from scrapers import MetroScraper, WongScraper, PlazaVeaScraper

async def buscar_en_todas_las_tiendas(termino):
    # Inicializamos los scrapers
    tiendas = [
        MetroScraper(),
        WongScraper(),
        PlazaVeaScraper()
    ]
    
    print(f"🔍 Buscando '{termino}' en {len(tiendas)} tiendas simultáneamente...")
    
    # Lanzamos todas las búsquedas en paralelo 🚀
    tareas = [t.buscar(termino) for t in tiendas]
    resultados = await asyncio.gather(*tareas)
    
    # Aplanamos la lista de listas
    todos_los_productos = [p for sublista in resultados for p in sublista]
    
    if todos_los_productos:
        print(f"✅ Se encontraron {len(todos_los_productos)} productos en total.")
        database.guardar_productos_completo(todos_los_productos)
        print("💾 Base de datos actualizada con historial.")
    else:
        print("⚠️ No se encontraron productos.")

if __name__ == "__main__":
    # Aseguramos que la DB existe
    database.iniciar_db()
    
    # Ejemplo de uso
    termino_busqueda = "leche gloria"
    asyncio.run(buscar_en_todas_las_tiendas(termino_busqueda))
