import { useCallback, useState, useEffect } from 'react';
import { useSearchContext } from '../contexts/SearchContext';
import { storyblokService } from '../services/storyblokService';
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

  const [suggestions, setSuggestions] = useState<{
    suggestions: string[];
    popular: string[];
    trending: string[];
    categories: Array<{ name: string; count: number }>;
  }>({
    suggestions: [],
    popular: [],
    trending: [],
    categories: []
  });
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [popularSearches, setPopularSearches] = useState<Array<{ query: string; count: number }>>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [suggestionsData, historyData, popularData] = await Promise.all([
          algoliaService.getSuggestions(''),
          algoliaService.getSearchHistory(),
          algoliaService.getPopularSearches()
        ]);
        
        setSuggestions(suggestionsData);
        setSearchHistory(historyData);
        setPopularSearches(popularData);
      } catch (err) {
        console.error('Failed to load initial search data:', err);
      }
    };

    loadInitialData();
  }, []);

  // Update suggestions when query changes
  useEffect(() => {
    const updateSuggestions = async () => {
      if (query.length > 0) {
        try {
          const suggestionsData = await algoliaService.getSuggestions(query);
          setSuggestions(suggestionsData);
          setShowSuggestions(true);
        } catch (err) {
          console.error('Failed to get suggestions:', err);
        }
      } else {
        setShowSuggestions(false);
      }
    };

    const timeoutId = setTimeout(updateSuggestions, 300);
    return () => clearTimeout(timeoutId);
  }, [query]);

  const search = useCallback(async (searchQuery?: string, searchFilters?: any) => {
    const queryToSearch = searchQuery || query;
    
    if (!queryToSearch.trim()) {
      setResults([]);
      setShowSuggestions(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    setHasSearched(true);
    setShowSuggestions(false);

    try {
      // Use enhanced Algolia search with filters
      const searchFilters_ = searchFilters || filters;
      const searchResults = await algoliaService.search(queryToSearch, {
        type: searchFilters_?.type,
        dateRange: searchFilters_?.dateRange,
        tags: searchFilters_?.tags,
        sortBy: searchFilters_?.sortBy || 'relevance',
        limit: searchFilters_?.limit || 50
      });

      setResults(searchResults);
      
      if (searchQuery) {
        setQuery(searchQuery);
      }

      // Save search query to history
      await algoliaService.saveSearchQuery(queryToSearch);
      
      // Update search history
      setSearchHistory(prev => {
        const newHistory = [queryToSearch, ...prev.filter(item => item !== queryToSearch)];
        return newHistory.slice(0, 10); // Keep last 10 searches
      });

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, [query, setQuery, setResults, setIsLoading, setError, setHasSearched, filters]);

  const clearSearch = useCallback(() => {
    setQuery('');
    setResults([]);
    setHasSearched(false);
    setError(null);
    setShowSuggestions(false);
  }, [setQuery, setResults, setHasSearched, setError]);

  const searchWithFilters = useCallback(async (searchQuery: string, customFilters: any) => {
    await search(searchQuery, customFilters);
  }, [search]);

  const getSearchSuggestions = useCallback(async (query: string) => {
    try {
      const suggestionsData = await algoliaService.getSuggestions(query);
      setSuggestions(suggestionsData);
      return suggestionsData;
    } catch (err) {
      console.error('Failed to get suggestions:', err);
      return { suggestions: [], popular: [], trending: [], categories: [] };
    }
  }, []);

  const toggleSuggestions = useCallback(() => {
    setShowSuggestions(prev => !prev);
  }, []);

  return {
    query,
    setQuery,
    results,
    isLoading,
    hasSearched,
    error,
    search,
    clearSearch,
    searchWithFilters,
    suggestions,
    searchHistory,
    popularSearches,
    showSuggestions,
    setShowSuggestions,
    getSearchSuggestions,
    toggleSuggestions
  };
};