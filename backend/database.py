import sqlite3
from datetime import datetime

DB_NAME = "precios.db"

def iniciar_db():
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    
    # Tabla principal de productos (datos únicos)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS productos (
            sku TEXT PRIMARY KEY,
            nombre TEXT NOT NULL,
            marca TEXT,
            tienda TEXT NOT NULL,
            imagen TEXT,
            link TEXT,
            categoria TEXT,
            last_updated TIMESTAMP
        )
    """)

    # Tabla de historial de precios
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS historial_precios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            sku TEXT NOT NULL,
            precio REAL NOT NULL,
            precio_lista REAL,
            fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (sku) REFERENCES productos (sku)
        )
    """)
    
    # Índice para búsquedas rápidas por nombre
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_nombre_prod ON productos(nombre)")
    
    conn.commit()
    conn.close()

def guardar_productos_completo(productos_limpios):
    """
    Lógica Senior: 
    1. Inserta/Actualiza el producto.
    2. Si el precio cambió, inserta una nueva entrada en el historial.
    """
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    now = datetime.now().isoformat()

    try:
        for p in productos_limpios:
            # 1. UPSERT en productos
            cursor.execute("""
                INSERT INTO productos (sku, nombre, marca, tienda, imagen, link, last_updated)
                VALUES (?, ?, ?, ?, ?, ?, ?)
                ON CONFLICT(sku) DO UPDATE SET
                    nombre=excluded.nombre,
                    imagen=excluded.imagen,
                    last_updated=excluded.last_updated
            """, (p['id'], p['nombre'], p['marca'], p['tienda'], p['imagen'], p['link'], now))

            # 2. Insertar en historial siempre (o podrías validar si el precio cambió)
            cursor.execute("""
                INSERT INTO historial_precios (sku, precio, precio_lista, fecha)
                VALUES (?, ?, ?, ?)
            """, (p['id'], p['precio'], p['precio_lista'], now))
            
        conn.commit()
    except Exception as e:
        print(f"❌ Error masivo en DB: {e}")
        conn.rollback()
    finally:
        conn.close()
