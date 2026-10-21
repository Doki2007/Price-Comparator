import { useEffect, useState } from "react";
import { Header, Footer, ProductCard } from "./components";
import { useFetchApi } from "./hooks/useFetchApi";
import { Skeleton } from "./components/layout/Skeleton/Skeleton";
import { useFilterContext } from "./contexts/FilterContext";
import { Store } from "./types/types";
import { useDebounce } from "./hooks/useDebounce";
import { useSearchParams } from "react-router-dom";

function App() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const {
    searchQuery,
    getProducts,
    setSearchQuery,

    products,
    isLoading,
    isError,
  } = useFetchApi();

  const { activeStores, setActiveStores } = useFilterContext(); 

  const debouncedSearch = useDebounce(searchQuery, 500);

  const [searchParams, setSearchParams] = useSearchParams(); //inicializamos el hook de la url

  useEffect(() => {
    const params = new URLSearchParams(searchParams); // Clona la URL actual
    if (searchQuery) {
      params.set("q", searchQuery);
    } else {
      params.delete("q"); // Si borra todo el input, limpiamos la URL
    } //si escribes algo se actualiza la URL
    if (activeStores.length > 0) params.set("tiendas", activeStores.join(",")); //si cambiamos el filtro, se actualiza la URL

    setSearchParams(params);
  }, [searchQuery, activeStores, setSearchParams]);

  useEffect(() => {
    //extraemos lo que sea que este en la url al entrar
    const queryEnUrl = searchParams.get('q');
    const tiendasEnUrl = searchParams.get('tiendas');

    //si alguien nos mando un link con la busqueda q=leche
    if (queryEnUrl) {
      setSearchQuery(queryEnUrl); //actualizamos el input
      getProducts(queryEnUrl); // dsparamos el fetch de inmediato
    }

    // si alguien mando filtros, los seteamos tambien
    if (tiendasEnUrl) {
      // como vienen pegados por coma, "wong,Metro" los separamos en un array
      const storeArray = tiendasEnUrl.split(',') as Store[];
      setActiveStores(storeArray);
    }
  }, [])


  useEffect(() => {
  // Solo disparamos la API si hay texto real (evitamos buscar un string vacío al cargar la página)
    if (debouncedSearch.trim() !== "") {
      getProducts(debouncedSearch);
    }
  }, [debouncedSearch]); // React vigila esta variable paciente


  const toggleStore = (storeName: Store) => {
    setActiveStores( (prevStores) => 
      prevStores.includes(storeName) 
      ? prevStores.filter( s => s !== storeName) // Si existe, la quitamos
      : [...prevStores, storeName] // Si no existe, la agregamos
    )
  }

  const filteredProducts = products.filter( product => 
    activeStores.includes(product.store)
  ).sort((a,b)=> Number(a.price) - Number(b.price));
  console.log(filteredProducts);

  const lowestPrice = Math.min(...filteredProducts.map(p => Number(p.price)))
  

  return (
      <div className="flex flex-col min-h-screen">
        <Header
          view={view}
          setView={setView}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onSearch={getProducts}
        />

        <main className="container max-w-7xl mx-auto px-4 py-8 flex-grow">
          <div
            id="results-container"
            className="animate-fade-in flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full"
          >
            <div>
              <h2 className="text-xl font-semibold text-brown">
                Resultados de comparación
              </h2>
              {filteredProducts.length > 0 && (
                <p className="text-sm text-gray-500">
                  Mostrando precios exactos encontrados de {filteredProducts.length}{" "}
                  productos
                </p>
              )}
            </div>
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2 text-sm font-medium px-3 py-1.5 bg-white border border-brown/10 rounded-full shadow-sm"
              onClick={() => toggleStore('Metro')}>
                <span className="size-3 rounded-full bg-red-500"></span> Metro
              </div>
              <div className="flex items-center gap-2 text-sm font-medium px-3 py-1.5 bg-white border border-brown/10 rounded-full shadow-sm"
              onClick={() => toggleStore('Plaza Vea')}>
                <span className="w-3 h-3 rounded-full bg-yellow-500"></span>{" "}
                Plaza Vea
              </div>
              <div className="flex items-center gap-2 text-sm font-medium px-3 py-1.5 bg-white border border-brown/10 rounded-full shadow-sm"
              onClick={() => toggleStore('Wong')}>
                <span className="w-3 h-3 rounded-full bg-green-600"></span> Wong
              </div>
            </div>
          </div>

          {isError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative my-4 text-center">
              <span>{isError}</span>
            </div>
          )}

        <div className="mt-12">
          <div 
            className={`grid ${view === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8" : "grid-cols-1 gap-4"}`}
          >
            {isLoading ? (
              [...Array(8)].map((_, index) => (
                <Skeleton key={index} view={view} />
              ))
            ) : (
              filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  view={view}
                  isBestPrice={Number(product.price) === lowestPrice}
                />
              ))
            )}
          </div>
        </div>
        </main>

        <Footer />
      </div>
    
  );
}

export default App;
