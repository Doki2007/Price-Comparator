import { createContext, useContext, useState } from "react"
import { FilterContextType, Store } from "../types/types"

const FilterContext = createContext<FilterContextType | null>(null);

// Para compartir el estado de los filtros entre componentes
export const FilterProvider = ({children}: {children: React.ReactNode}) => {
  const [activeStores, setActiveStores] = useState<Store[]>(['Plaza Vea', 'Metro', 'Wong']);
  
  return (
    <FilterContext.Provider value={{activeStores, setActiveStores}}>
      {children}
    </FilterContext.Provider>
  )
}

// Para usar el contexto en cualquier componente
export const useFilterContext = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilterContext must be used within FilterContext');
  }
  return context;
}