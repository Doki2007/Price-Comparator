import httpx
import asyncio
from abc import ABC, abstractmethod
from urllib.parse import quote

class BaseScraper(ABC):
    def __init__(self, tienda_nombre, base_url, custom_params=None):
        self.tienda_nombre = tienda_nombre
        self.base_url = base_url
        self.custom_params = custom_params or {}
        self.headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Accept": "application/json"
        }

    @abstractmethod
    async def buscar(self, producto):
        pass

class VtexScraper(BaseScraper):
    """Motor optimizado para Metro, Wong y Plaza Vea"""
    async def buscar(self, producto):
        producto_encoded = quote(producto)
        # Usamos el endpoint de búsqueda por palabra clave
        url = f"{self.base_url}/api/catalog_system/pub/products/search/{producto_encoded}"
        
        # Mezclamos los parámetros base con los específicos de la tienda
        params = {"_from": "0", "_to": "49"}
        params.update(self.custom_params)
        
        async with httpx.AsyncClient(headers=self.headers, timeout=15.0, follow_redirects=True) as client:
            try:
                response = await client.get(url, params=params)
                if response.status_code in [200, 206]:
                    return self.normalizar(response.json())
                print(f"⚠️ {self.tienda_nombre} respondió {response.status_code}")
                return []
            except Exception as e:
                print(f"❌ Error en {self.tienda_nombre}: {e}")
                return []

    def normalizar(self, data):
        productos_limpios = []
        for item in data:
            try:
                if not item.get('items'): continue
                sku_item = item['items'][0]
                sellers = sku_item.get('sellers', [])
                if not sellers: continue
                
                oferta = sellers[0].get('commertialOffer', {})
                precio_actual = oferta.get('Price', 0)
                if precio_actual == 0: continue

                # Normalización de links
                link = item.get('link', '')
                if link.startswith('/'):
                    link = f"{self.base_url}{link}"

                productos_limpios.append({
                    "id": f"{self.tienda_nombre}-{item['productId']}",
                    "nombre": item['productName'],
                    "marca": item['brand'],
                    "tienda": self.tienda_nombre,
                    "precio": precio_actual,
                    "precio_lista": oferta.get('ListPrice', precio_actual),
                    "imagen": sku_item['images'][0]['imageUrl'] if sku_item['images'] else "",
                    "link": link
                })
            except: continue
        return productos_limpios

class MetroScraper(VtexScraper):
    def __init__(self):
        super().__init__("Metro", "https://www.metro.pe")

class WongScraper(VtexScraper):
    def __init__(self):
        # Agregamos sc=70 que es el canal de venta online confirmado
        super().__init__("Wong", "https://www.wong.pe", custom_params={"sc": "70"})

class PlazaVeaScraper(VtexScraper):
    def __init__(self):
        super().__init__("Plaza Vea", "https://www.plazavea.com.pe")
