import { HeaderProps } from "./Header.types";

export const Header = ({
  view,
  setView,
  searchQuery,
  setSearchQuery,
  onSearch,
}: HeaderProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <header className="glass-header text-white sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="bg-turquoise p-2 rounded-lg">
              <i className="fas fa-balance-scale text-xl text-brown"></i>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">
              Price<span className="text-turquoise">Compare</span>
            </h1>
          </div>

          {/* <!-- Search Bar --> */}
          <div className="relative w-full md:max-w-2xl">
            <form
              onSubmit={handleSubmit}
              className="relative w-full md:max-w-2xl"
            >
              <input
                type="text"
                placeholder="Ej: Leche Gloria Azul 400g - Por favor, sé lo más exacto posible para encontrar el producto idéntico."
                className="w-full bg-white text-charcoal px-5 py-3 rounded-xl border-none focus:ring-4 focus:ring-turquoise/30 outline-none transition-all shadow-inner"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                className="absolute right-2 top-2 bg-turquoise text-brown font-bold px-6 py-1.5 rounded-lg hover:bg-turquoise-dark transition-colors"
                type="submit"
              >
                <i className="fas fa-search"></i>
              </button>
            </form>
          </div>

          {/* <!-- View Switch --> */}
          <div className="flex bg-brown-dark rounded-xl p-1 shadow-inner border border-white/10">
            <button
              id="grid-btn"
              onClick={() => setView("grid")}
              className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${view === "grid" ? "bg-turquoise text-brown font-bold" : "text-white hover:text-turquoise"}`}
            >
              <i className="fas fa-th-large"></i> Grilla
            </button>
            <button
              id="list-btn"
              onClick={() => setView("list")}
              className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${view === "list" ? "bg-turquoise text-brown font-bold" : "text-white hover:text-turquoise"}`}
            >
              <i className="fas fa-list"></i> Lista
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
