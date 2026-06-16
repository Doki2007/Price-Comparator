import { ProductCardProps } from "./ProductCard.types";

export const ProductCard = ({ view, product }: ProductCardProps) => {
  const storeConfig = {
    "Plaza Vea": { bg: "bg-yellow-400", text: "text-charcoal" },
    Metro: { bg: "bg-red-600", text: "text-white" },
    Wong: { bg: "bg-green-700", text: "text-white" },
  };

  const currentStoreConfig = storeConfig[product.store];

  return (
    <div
      className={`product-card bg-white rounded-2xl overflow-hidden border border-brown/5 shadow-sm group ${view === "list" ? "flex items-center" : ""}`}
    >
      <div
        className={`relative bg-gray-50 flex items-center justify-center p-4 ${view === "list" ? "h-32 w-32 shrink-0" : "h-48"}`}
      >
        <img
          src={product.imageUrl}
          alt={product.name}
          className="max-h-full object-contain"
        />

        {/* Etiqueta de la tienda dinámica */}
        <div
          className={`absolute top-3 left-3 font-bold text-xs px-2 py-1 rounded shadow-sm ${currentStoreConfig.bg} ${currentStoreConfig.text}`}
        >
          {product.store}
        </div>

        {/* Etiqueta de Mejor Precio condicional */}
        {product.isBestPrice && (
          <div className="absolute top-3 right-3 bg-turquoise text-brown font-bold text-[10px] px-2 py-1 rounded-full shadow-lg animate-pulse-subtle border border-brown/10">
            MEJOR PRECIO
          </div>
        )}
      </div>

      <div className="p-5 flex-1">
        <p className="text-[10px] text-turquoise font-black tracking-widest uppercase mb-1">
          {product.brand}
        </p>
        <h3 className="text-charcoal font-bold text-sm leading-tight mb-4 group-hover:text-brown transition-colors">
          {product.name}
        </h3>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-black text-brown leading-none">
              S/ {product.price}
            </span>
          </div>
          <a
            href={product.link}
            target="_blank"
            className="bg-turquoise hover:bg-brown hover:text-white text-brown font-bold p-2.5 rounded-xl transition-all shadow-md active:scale-95"
          >
            <i className="fas fa-external-link-alt"></i>
          </a>
        </div>
      </div>
    </div>
  );
};
