# ⚖️ PriceCompare

**Motor de comparación de precios en tiempo real para los supermercados más grandes de Perú.**

> 🌐 [English Version](README.md)

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-4.2-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110-009688?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3.12-3776AB?style=flat-square&logo=python&logoColor=white)](https://www.python.org/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vite.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

---

![PriceCompare — Vista previa de resultados de búsqueda](docs/images/preview.png)

---

## ✨ Características y Decisiones de Ingeniería

- **Scraping paralelo por Ingeniería Inversa** — Los datos se extraen de las APIs privadas VTEX de **Metro**, **Wong** y **Plaza Vea** simultáneamente usando `asyncio.gather`, sin necesidad de automatización de navegador.
- **Registro Polimórfico de Scrapers** — Una clase abstracta `BaseScraper` con una lista `SCRAPERS_REGISTRY`. Agregar una nueva tienda es una sola definición de clase — cero cambios en el routing.
- **Caché TTL en Memoria** — Los resultados de búsqueda se cachean por 1 hora usando `cachetools.TTLCache` (máximo 200 entradas), reduciendo drásticamente las llamadas redundantes a fuentes externas.
- **Historial de Precios en SQLite** — Cada precio scrapeado se persiste con timestamps mediante lógica UPSERT, habilitando análisis futuro de tendencias de precio por SKU.
- **Integración con AbortController** — Las peticiones HTTP obsoletas se cancelan automáticamente cuando se dispara una nueva búsqueda, previniendo condiciones de carrera y estados de error falsos.
- **Búsqueda con Debounce (500ms)** — Un hook genérico `useDebounce` retrasa las llamadas a la API mientras el usuario escribe, reduciendo carga en el servidor sin sacrificar la percepción de velocidad.
- **Estado Sincronizado con la URL** — Las búsquedas y los filtros activos de tienda se serializan en los parámetros de la URL (`?q=leche&tiendas=Metro,Wong`), permitiendo **links de búsqueda compartibles**.
- **Badge de Mejor Precio Computado** — El precio más bajo entre todos los resultados filtrados se calcula dinámicamente y se renderiza como un badge visual — no se almacena en el modelo de datos.
- **Contexto de Filtros entre Componentes** — Un `FilterContext` con React Context API comparte el estado de los filtros de tienda globalmente sin prop-drilling.
- **Toggle Grilla / Lista** — Los usuarios pueden alternar entre una grilla de tarjetas y un layout de lista compacta con un solo clic.

---

## 🛠️ Stack Tecnológico

| Capa | Tecnología | Propósito |
|---|---|---|
| **Frontend** | React 19, TypeScript 5.2 | SPA basada en componentes |
| **Estilos** | Tailwind CSS 4.2 | Diseño responsivo utility-first |
| **Bundler** | Vite 8 | Servidor dev con HMR y builds de producción |
| **Routing** | React Router DOM 7 | Sincronización de parámetros URL |
| **Backend** | FastAPI, Python 3.12 | API REST asíncrona (`/api/v1/`) |
| **Cliente HTTP** | httpx | Peticiones asíncronas a APIs externas VTEX |
| **Base de Datos** | SQLite | Persistencia del historial de precios |
| **Caché** | cachetools (TTLCache) | Caché en memoria de resultados por 1 hora |
| **Validación** | Pydantic 2 | Validación de esquemas request/response |
| **Hosting Frontend** | Vercel | Auto-deploy desde branch `main` |
| **Hosting Backend** | Render | Servidor FastAPI con auto-sleep |

---

## 🚀 Inicio Rápido

### Requisitos Previos

- **Node.js** ≥ 18 y **pnpm**
- **Python** ≥ 3.10

### 1. Clonar el repositorio

```bash
git clone https://github.com/Doki2007/Price-Comparator.git
cd Price-Comparator
```

### 2. Configurar el Backend

```bash
cd backend
python -m venv .venv

# Windows
.venv\Scripts\activate
# macOS / Linux
source .venv/bin/activate

pip install -r requirements.txt
python main.py
```

La API estará disponible en `http://localhost:8000`. Documentación interactiva en `http://localhost:8000/docs`.

### 3. Configurar el Frontend

```bash
cd frontend
pnpm install
pnpm run dev
```

La aplicación estará disponible en `http://localhost:5173`.

> [!NOTE]
> Por defecto, el frontend apunta a la API de producción en Render. Para usar tu backend local, actualiza la URL de fetch en [`frontend/src/hooks/useFetchApi.ts`](frontend/src/hooks/useFetchApi.ts) a `http://localhost:8000/api/v1/search`.

---

## 📁 Estructura del Proyecto

```
compare-prices/
├── backend/
│   ├── api/
│   │   └── router.py          # Handlers de rutas FastAPI (búsqueda, historial)
│   ├── database.py             # Init SQLite, lógica UPSERT, consultas de historial
│   ├── main.py                 # Entry point de FastAPI + configuración CORS
│   ├── schemas.py              # Modelos Pydantic (ProductOut, SearchResponse)
│   ├── scrapers.py             # BaseScraper → VtexScraper → Metro/Wong/PlazaVea
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/         # Header, Footer, Skeleton
│   │   │   └── products/       # ProductCard (variantes grilla/lista)
│   │   ├── contexts/
│   │   │   └── FilterContext.tsx  # Estado global de filtros por tienda
│   │   ├── hooks/
│   │   │   ├── useFetchApi.ts    # Fetcher con AbortController
│   │   │   └── useDebounce.ts    # Utilidad genérica de debounce
│   │   ├── types/
│   │   │   └── types.ts          # Product, Store, FilterContextType
│   │   ├── App.tsx               # Orquestador principal (filtros, URL sync, búsqueda)
│   │   └── main.tsx              # Root de React con providers
│   ├── package.json
│   └── vite.config.ts
├── AGENTS.md                     # Directrices para agentes AI
├── LICENSE
└── README.md
```

---

## 🗺️ Roadmap

- [x] Motor de scraping VTEX para Metro, Wong y Plaza Vea
- [x] Backend FastAPI con scraping paralelo asíncrono
- [x] Caché TTL en memoria para reducir llamadas a APIs externas
- [x] Persistencia SQLite con historial de precios por SKU
- [x] Frontend React con tarjetas de producto en grilla/lista
- [x] Búsqueda con debounce y AbortController
- [x] Pills de filtro por tienda con React Context
- [x] Sincronización de parámetros URL (links compartibles)
- [x] Cálculo dinámico del badge "Mejor Precio"
- [x] Despliegue en Vercel + Render
- [ ] Gráficos de historial de precios por producto (línea temporal)
- [ ] Animaciones GSAP con scroll y micro-interacciones premium
- [ ] Toggle de modo oscuro
- [ ] Agregar más tiendas (Tottus, Vivanda)
- [ ] Rotación de User-Agent y estrategias anti-ban en headers
- [ ] Opciones de ordenamiento (precio asc/desc, tienda, relevancia)
- [ ] Refinamientos de diseño responsivo mobile-first
- [ ] Migración a PostgreSQL para persistencia en producción

---

## 📄 Licencia

Este proyecto está licenciado bajo la [Licencia MIT](LICENSE).

**© 2026 Jamir Garro**
