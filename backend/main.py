# pyrefly: ignore [missing-import]
from fastapi import FastAPI
# pyrefly: ignore [missing-import]
from fastapi.middleware.cors import CORSMiddleware
from api.router import router as api_router
import database

# Aseguramos que la DB existe al iniciar la aplicación
database.iniciar_db()

app = FastAPI(
    title="Compare Prices Core API", 
    description="API for scraping and comparing prices across different supermarkets.",
    version="1.0.0"
)

# Configuración CORS para permitir peticiones desde el Frontend (Astro/React)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For development, it allows all. In production, this should be specific.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluimos el router de la API
app.include_router(api_router, prefix="/api/v1")

if __name__ == "__main__":
    # pyrefly: ignore [missing-import]
    import uvicorn
    # Lanzamos el servidor de forma programática para facilitar el desarrollo
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
