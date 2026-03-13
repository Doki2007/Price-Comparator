import requests
import json
import database  # Tu módulo de base de datos (Nivel 3)
from urllib.parse import quote  # IMPORTANTE: Para convertir espacios en %20

def obtener_datos_crudos(busqueda):
    """
    PASO 1: EXTRACCIÓN
    Usa la URL directa que descubriste: .../search/{producto}
    """
    # 1. Limpiamos la búsqueda para que sea válida en una URL
    # "shampoo head shoulders" se convierte en "shampoo%20head%20shoulders"
    busqueda_codificada = quote(busqueda)
    
    # 2. Construimos la URL ganadora 🏆
    url = f"https://www.metro.pe/api/catalog_system/pub/products/search/{busqueda_codificada}"
    
    # Parámetros SOLO de paginación (ya no enviamos 'ft' ni 'sc')
    params = {
        "_from": "0",
        "_to": "49"
    }

    # Headers estándar (sin cookies complejas por ahora, a ver si pasa)
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "application/json"
    }

    print(f"📡 Consultando: {url}")
    
    try:
        response = requests.get(url, headers=headers, params=params, timeout=10)
        
        if response.status_code in [200, 206]:
            return response.json()
        else:
            print(f"❌ Error {response.status_code}: Metro rechazó la conexión.")
            return []
            
    except Exception as e:
        print(f"❌ Error de conexión: {e}")
        return []

def normalizar_datos(data_cruda):
    """
    PASO 2: NORMALIZACIÓN
    (Esta lógica se mantiene igual, es sólida)
    """
    productos_limpios = []
    print(f"🧹 Procesando {len(data_cruda)} productos...")

    for producto in data_cruda:
        try:
            id_producto = producto.get("productId")
            nombre = producto.get("productName")
            marca = producto.get("brand")
            link = producto.get("link", "") # En VTEX a veces el link ya viene completo o relativo
            if link.startswith("/"):
                link = "https://www.metro.pe" + link
            
            # Validación de integridad
            if not producto.get("items"): continue
                
            item = producto["items"][0]
            
            # Imagen
            imagen = ""
            if item.get("images"): imagen = item["images"][0]["imageUrl"]
            
            # Precios
            sellers = item.get("sellers", [])
            if not sellers: continue
                
            info_venta = sellers[0]["commertialOffer"]
            precio_actual = info_venta.get("Price", 0)
            
            if precio_actual == 0:
                continue
                
            precio_lista = info_venta.get("ListPrice", 0)
            
            # Descuento
            descuento = "0%"
            if precio_lista > precio_actual and precio_lista > 0:
                calc = round(((precio_lista - precio_actual) / precio_lista) * 100)
                descuento = f"{calc}%"

            producto_saneado = {
                "id": id_producto,
                "nombre": nombre,
                "marca": marca,
                "tienda": "Metro",
                "precio": precio_actual,
                "precio_lista": precio_lista,
                "descuento": descuento,
                "imagen": imagen,
                "link": link
            }
            productos_limpios.append(producto_saneado)
            
        except Exception:
            continue

    return productos_limpios

# --- EJECUCIÓN ---
if __name__ == "__main__":
    # 1. Base de datos lista
    database.iniciar_db()
    
    # 2. Búsqueda exacta (puedes probar con espacios sin miedo)
    termino = "shampoo head shoulders"
    
    # 3. Flujo ETL
    datos = obtener_datos_crudos(termino)
    
    if datos:
        limpios = normalizar_datos(datos)
        print(f"\n✅ ¡ÉXITO! {len(limpios)} productos encontrados.")
        
        # Guardar en BD todo de un solo golpe masivo
        database.guardar_productos_masivo(limpios)
        print(f"💾 {len(limpios)} productos guardados masivamente en 'precios.db'.")
    else:
        print("⚠️ No llegaron datos. Revisa si Metro pide Cookies.")