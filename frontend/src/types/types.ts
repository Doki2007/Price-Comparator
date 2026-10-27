export interface Product {
  id: string;
  store: "Plaza Vea" | "Metro" | "Wong";
  price: string;
  name: string;
  brand: string;
  imageUrl: string;
  link: string;
}

export interface BackendProduct {
  id: string;
  name: string;
  brand?: string | null;
  store: string;
  price: number;
  list_price?: number | null;
  image?: string | null;
  link?: string | null;
}

export interface BackendSearchResponse {
  query: string;
  total_results: number;
  products: BackendProduct[];
}


// Para compartir el estado de los filtros entre componentes
export type Store = "Plaza Vea" | "Wong" | "Metro";

// Interfaz del contexto de filtros
export interface FilterContextType{
  activeStores: Store[];
  setActiveStores: React.Dispatch<React.SetStateAction<Store[]>>;
}

export interface CacheEntry<T>{
  data: T;
  timestamp: number;
}