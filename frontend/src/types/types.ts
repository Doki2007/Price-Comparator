export interface Product {
  id: string;
  store: "Plaza Vea" | "Metro" | "Wong";
  price: string;
  isBestPrice: boolean;
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
