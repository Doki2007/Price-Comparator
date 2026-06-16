import { useState } from "react";
import { Header, Footer, ProductCard } from "./components";
import { useFetchApi } from "./hooks/useFetchApi";
import { Skeleton } from "./components/layout/Skeleton/Skeleton";

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

  return (
    <>
      <Header
        view={view}
        setView={setView}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearch={getProducts}
      />

      {/* <!-- Main Content --> */}
      <main className="container max-w-7xl mx-auto px-4 py-8">
        {/* <!-- Results Summary --> */}

        <div
          id="results-container"
          className="animate-fade-in flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full"
        >
          <div>
            <h2 className="text-xl font-semibold text-brown">
              Resultados de comparación
            </h2>
            {products.length > 0 && (
              <p className="text-sm text-gray-500">
                Mostrando precios exactos encontrados de {products.length}{" "}
                productos
              </p>
            )}
          </div>
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2 text-sm font-medium px-3 py-1.5 bg-white border border-brown/10 rounded-full shadow-sm">
              <span className="size-3 rounded-full bg-red-500"></span> Metro
            </div>
            <div className="flex items-center gap-2 text-sm font-medium px-3 py-1.5 bg-white border border-brown/10 rounded-full shadow-sm">
              <span className="w-3 h-3 rounded-full bg-yellow-500"></span> Plaza
              Vea
            </div>
            <div className="flex items-center gap-2 text-sm font-medium px-3 py-1.5 bg-white border border-brown/10 rounded-full shadow-sm">
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
          {isLoading ? (
            <div
              className={`grid ${view === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8" : "grid-cols-1 gap-4"}`}
            >
              <Skeleton view={view} />
              <Skeleton view={view} />
              <Skeleton view={view} />
              <Skeleton view={view} />
            </div>
          ) : (
            <div
              className={`grid ${view === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8" : "grid-cols-1 gap-4"}`}
            >
              {products.map((product) => (
                <ProductCard key={product.id} view={view} product={product} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

export default App;
