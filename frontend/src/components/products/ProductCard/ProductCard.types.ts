import { Product } from "../../../types/types";

export interface ProductCardProps {
  view: "grid" | "list";
  product: Product;
}
