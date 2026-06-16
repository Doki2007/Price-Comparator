export interface HeaderProps {
  view: "grid" | "list";
  setView: (view: "grid" | "list") => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSearch: (query: string) => void;
}
