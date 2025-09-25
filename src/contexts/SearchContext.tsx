import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { SearchResult } from '../services/storyblokService';

interface SearchContextType {
  query: string;
  setQuery: (query: string) => void;
  results: SearchResult[];
  setResults: (results: SearchResult[]) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  hasSearched: boolean;
  setHasSearched: (searched: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
  filters: {
    type: string[];
    dateRange: string;
    tags: string[];
  };
  setFilters: (filters: {
    type: string[];
    dateRange: string;
    tags: string[];
  }) => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    type: [],
    dateRange: 'all',
    tags: []
  });

  return (
    <SearchContext.Provider value={{
      query,
      setQuery,
      results,
      setResults,
      isLoading,
      setIsLoading,
      hasSearched,
      setHasSearched,
      error,
      setError,
      filters,
      setFilters
    }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearchContext = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearchContext must be used within SearchProvider');
  }
  return context;
};