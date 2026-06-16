import sqlite3
from datetime import datetime

DB_NAME = "precios.db"

def iniciar_db():
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    
    # Tabla principal de productos (datos únicos)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS products (
            sku TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            brand TEXT,
            store TEXT NOT NULL,
            image TEXT,
            link TEXT,
            category TEXT,
            last_updated TIMESTAMP
        )
    """)

    # Tabla de historial de precios
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS price_histories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            sku TEXT NOT NULL,
            price REAL NOT NULL,
            list_price REAL,
            date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (sku) REFERENCES products (sku)
        )
    """)
    
    # Índice para búsquedas rápidas por nombre
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_nombre_prod ON products(name)")
    
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
                INSERT INTO products (sku, name, brand, store, image, link, category, last_updated)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                ON CONFLICT(sku) DO UPDATE SET
                    name=excluded.name,
                    image=excluded.image,
                    last_updated=excluded.last_updated
            """, (p['id'], p['name'], p['brand'], p['store'], p['image'], p['link'], p.get('category'), now))

            # 2. Insertar en historial siempre (o podrías validar si el precio cambió)
            cursor.execute("""
                INSERT INTO price_histories (sku, price, list_price, date)
                VALUES (?, ?, ?, ?)
            """, (p['id'], p['price'], p['list_price'], now))
            
        conn.commit()
    except Exception as e:
        print(f"[ERROR] Error masivo en DB: {e}")
        conn.rollback()
    finally:
        conn.close()

def obtener_historial_precios(sku: str) -> list:
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    cursor.execute("""
        SELECT id, sku, price, list_price, date
        FROM price_histories
        WHERE sku = ?
        ORDER BY date DESC
    """, (sku,))
    
    filas = cursor.fetchall()
    conn.close()
    
    return [dict(fila) for fila in filas]

def obtener_producto(sku: str) -> dict:
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    cursor.execute("""
        SELECT sku as id, name, brand, store, image, link, category, last_updated
        FROM products
        WHERE sku = ?
    """, (sku,))
    
    fila = cursor.fetchone()
    conn.close()
    
    return dict(fila) if fila else None
