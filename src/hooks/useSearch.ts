import { useCallback } from 'react';
import { useSearchContext } from '../contexts/SearchContext';
import { algoliaService } from '../services/algoliaService';

export const useSearch = () => {
  const {
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
    filters
  } = useSearchContext();

  const search = useCallback(async (searchQuery?: string) => {
    const queryToSearch = searchQuery || query;
    
    if (!queryToSearch.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const searchResults = await algoliaService.search(queryToSearch, filters);
      setResults(searchResults);
      if (searchQuery) {
        setQuery(searchQuery);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, [query, filters, setQuery, setResults, setIsLoading, setError, setHasSearched]);

  const clearSearch = useCallback(() => {
    setQuery('');
    setResults([]);
    setHasSearched(false);
    setError(null);
  }, [setQuery, setResults, setHasSearched, setError]);

  return {
    query,
    setQuery,
    results,
    isLoading,
    hasSearched,
    error,
    search,
    clearSearch
  };
};