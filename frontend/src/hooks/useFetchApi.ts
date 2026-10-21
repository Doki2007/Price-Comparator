import { useState, useRef } from "react";
import { BackendSearchResponse, Product } from "../types/types";

export const useFetchApi = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<string | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);


  const getProducts = async (query: string) => {

    // 1. Matamos cualquier petición anterior ANTES de crear la nueva
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // 2. AHORA creamos el controlador para ESTA nueva petición
    const controller = new AbortController();
    const {signal} = controller;
    abortControllerRef.current = controller;

    // 3. Empezamos el estado visual
    setIsLoading(true);
    setIsError(null);

    try {
      const response = await fetch(
        `https://price-comparator-3f04.onrender.com/api/v1/search?q=${encodeURIComponent(query)}`,
        {signal}
      );

      if (!response.ok) throw new Error("Error al obtener los productos");

      const data = (await response.json()) as BackendSearchResponse;
      const mappedProducts: Product[] = data.products.map((item) => ({
        id: item.id,
        store: item.store as "Plaza Vea" | "Metro" | "Wong",
        price: `${item.price.toFixed(2)}`,
        isBestPrice: false,
        name: item.name,
        brand: item.brand || "Genérico",
        imageUrl: item.image || "",
        link: item.link || "",
      }));
      setProducts(mappedProducts);
      setIsLoading(false);// Apagamos aqi el loading para que siempre se vea el Skeleton

    } catch (error) {
      
      if( error instanceof Error){
        if(error.name === 'AbortError'){
          console.log('Peticion cancelada por el usuario (AbortController)')
          return;
        }
      }

      console.error("Error al obtener los productos", error);
      setIsError("Error al obtener los productos");
      setIsLoading(false);
    } 
  };

  return {
    searchQuery,
    setSearchQuery,
    products,
    isLoading,
    isError,
    getProducts,
  };
};
