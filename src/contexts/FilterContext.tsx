import React, { createContext, useState, useContext, ReactNode } from 'react';
import type { FilterState } from './FilterContext'; // Importar o tipo para si mesmo para exportação

// Define o formato do estado dos filtros
export interface FilterState {
  priceRange: { min: number; max: number };
  inStockOnly: boolean;
  frameStatus: 'all' | 'framed' | 'unframed';
  sortBy: 'default' | 'price-asc' | 'price-desc' | 'title-asc' | 'title-desc';
}

// Define o tipo do contexto
interface FilterContextType {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;
  isDefault: boolean;
}

// Estado inicial dos filtros
const initialFilters: FilterState = {
  priceRange: { min: 0, max: 10000 }, // Um valor máximo inicial alto
  inStockOnly: false,
  frameStatus: 'all',
  sortBy: 'default',
};

// Cria o contexto
export const FilterContext = createContext<FilterContextType | undefined>(undefined);

// Cria o provedor do contexto
export const FilterProvider = ({ children }: { children: ReactNode }) => {
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  
  const resetFilters = () => {
    setFilters(initialFilters);
  };
  
  // Verifica se os filtros estão no estado padrão
  const isDefault = JSON.stringify(filters) === JSON.stringify(initialFilters);

  const value = {
    filters,
    setFilters,
    resetFilters,
    isDefault,
  };

  return (
    <FilterContext.Provider value={value}>
      {children}
    </FilterContext.Provider>
  );
};

// Hook customizado para usar o contexto facilmente
export const useFilters = () => {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error('useFilters deve ser usado dentro de um FilterProvider');
  }
  return context;
}; 