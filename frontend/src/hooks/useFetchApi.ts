import { useState } from "react";
import { BackendSearchResponse, Product } from "../types/types";

export const useFetchApi = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<string | null>(null);

  const getProducts = async (query: string) => {
    setIsLoading(true);
    setIsError(null);

    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/search?q=${encodeURIComponent(query)}`,
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
    } catch (error) {
      console.error("Error al obtener los productos", error);
      setIsError("Error al obtener los productos");
    } finally {
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
