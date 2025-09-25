import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  X, 
  Clock, 
  TrendingUp, 
  Star,
  Calendar,
  Tag,
  SortAsc,
  SortDesc,
  Mic,
  MicOff,
  History,
  Sparkles
} from 'lucide-react';
import { useSearch } from '../../hooks/useSearch';
import { useVoiceSearch } from '../../hooks/useVoiceSearch';

interface AdvancedSearchInterfaceProps {
  mode: 'standard' | 'ai-chat';
  onModeChange?: (mode: 'standard' | 'ai-chat') => void;
}

interface SearchFilters {
  type: string[];
  dateRange: string;
  tags: string[];
  sortBy: 'relevance' | 'date' | 'popularity';
}

const AdvancedSearchInterface: React.FC<AdvancedSearchInterfaceProps> = ({ 
  mode, 
  onModeChange 
}) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    type: [],
    dateRange: 'all',
    tags: [],
    sortBy: 'relevance'
  });
  const [selectedSuggestion, setSelectedSuggestion] = useState<number>(-1);

  const { 
    search, 
    isLoading, 
    suggestions, 
    searchHistory, 
    popularSearches, 
    showSuggestions,
    setShowSuggestions,
    toggleSuggestions
  } = useSearch();
  
  const { isListening, startListening, stopListening } = useVoiceSearch();
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const contentTypes = [
    { value: 'tutorial', label: 'Tutorials', count: 45 },
    { value: 'documentation', label: 'Documentation', count: 32 },
    { value: 'guide', label: 'Guides', count: 28 },
    { value: 'article', label: 'Articles', count: 22 }
  ];

  const dateRanges = [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'year', label: 'This Year' }
  ];

  const sortOptions = [
    { value: 'relevance', label: 'Relevance', icon: SortAsc },
    { value: 'date', label: 'Date', icon: Calendar },
    { value: 'popularity', label: 'Popularity', icon: TrendingUp }
  ];

  const handleSearch = async (searchQuery: string = query) => {
    if (searchQuery.trim()) {
      await search(searchQuery, filters);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (selectedSuggestion >= 0 && suggestions.suggestions[selectedSuggestion]) {
        const selected = suggestions.suggestions[selectedSuggestion];
        setQuery(selected);
        handleSearch(selected);
      } else {
        handleSearch();
      }
      setShowSuggestions(false);
      setSelectedSuggestion(-1);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedSuggestion(prev => 
        prev < suggestions.suggestions.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedSuggestion(prev => 
        prev > 0 ? prev - 1 : suggestions.suggestions.length - 1
      );
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setSelectedSuggestion(-1);
    }
  };

  const handleVoiceSearch = async () => {
    if (isListening) {
      stopListening();
    } else {
      const result = await startListening();
      if (result) {
        setQuery(result);
        handleSearch(result);
      }
    }
  };

  const handleFilterChange = (filterType: keyof SearchFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    handleSearch(suggestion);
  };

  const clearFilters = () => {
    setFilters({
      type: [],
      dateRange: 'all',
      tags: [],
      sortBy: 'relevance'
    });
  };

  const hasActiveFilters = filters.type.length > 0 || 
    filters.dateRange !== 'all' || 
    filters.tags.length > 0;

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative w-full max-w-4xl mx-auto px-4 sm:px-6">
      {/* Search Input */}
      <div className="relative">
        <div className={`relative flex items-center bg-white/90 backdrop-blur-sm border-2 rounded-xl sm:rounded-2xl shadow-lg transition-all duration-300 ${
          isFocused ? 'border-primary shadow-xl shadow-primary/20' : 'border-gray-200'
        }`}>
          <Search className="absolute left-3 sm:left-4 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
          
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              setIsFocused(true);
              setShowSuggestions(true);
            }}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyDown}
            placeholder="Search your Storyblok content with AI..."
            className="flex-1 px-10 sm:px-12 py-3 sm:py-4 text-base sm:text-lg bg-transparent border-none outline-none placeholder:text-gray-400"
          />

          <div className="flex items-center gap-1 sm:gap-2 pr-2 sm:pr-4">
            {/* Voice Search Button */}
            <button
              onClick={handleVoiceSearch}
              className={`p-1.5 sm:p-2 rounded-full transition-colors ${
                isListening 
                  ? 'bg-red-100 text-red-600 animate-pulse' 
                  : 'hover:bg-gray-100 text-gray-500'
              }`}
              title={isListening ? 'Stop listening' : 'Voice search'}
            >
              {isListening ? <MicOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Mic className="w-4 h-4 sm:w-5 sm:h-5" />}
            </button>

            {/* Filter Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-1.5 sm:p-2 rounded-full transition-colors relative ${
                hasActiveFilters 
                  ? 'bg-primary/10 text-primary' 
                  : 'hover:bg-gray-100 text-gray-500'
              }`}
              title="Search filters"
            >
              <Filter className="w-4 h-4 sm:w-5 sm:h-5" />
              {hasActiveFilters && (
                <div className="absolute -top-1 -right-1 w-2 h-2 sm:w-3 sm:h-3 bg-primary rounded-full"></div>
              )}
            </button>

            {/* Search Button */}
            <button
              onClick={() => handleSearch()}
              disabled={isLoading}
              className="px-3 sm:px-6 py-1.5 sm:py-2 bg-primary text-white rounded-lg sm:rounded-xl hover:bg-primary/90 disabled:opacity-50 transition-colors text-sm sm:text-base"
            >
              {isLoading ? (
                <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span className="hidden sm:inline">Search</span>
                  <Search className="w-4 h-4 sm:hidden" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Search Suggestions Dropdown */}
        <AnimatePresence>
          {showSuggestions && (query.length > 0 || suggestions.suggestions.length > 0) && (
            <motion.div
              ref={suggestionsRef}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl sm:rounded-2xl shadow-xl border border-gray-200 overflow-hidden z-50 max-h-[70vh] overflow-y-auto"
            >
              {/* Search Suggestions */}
              {suggestions.suggestions.length > 0 && (
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-gray-600">Suggestions</span>
                  </div>
                  <div className="space-y-1">
                    {suggestions.suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                          selectedSuggestion === index
                            ? 'bg-primary/10 text-primary'
                            : 'hover:bg-gray-50 text-gray-700'
                        }`}
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Popular Searches */}
              {query.length === 0 && popularSearches.length > 0 && (
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-gray-600">Popular</span>
                  </div>
                  <div className="space-y-1">
                    {popularSearches.slice(0, 4).map((popular, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(popular.query)}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700 flex items-center justify-between"
                      >
                        <span>{popular.query}</span>
                        <span className="text-xs text-gray-400">{popular.count}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Search History */}
              {query.length === 0 && searchHistory.length > 0 && (
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <History className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-gray-600">Recent</span>
                  </div>
                  <div className="space-y-1">
                    {searchHistory.slice(0, 4).map((history, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(history)}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700"
                      >
                        {history}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Advanced Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-gray-200 p-4 sm:p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Search Filters</h3>
              <button
                onClick={clearFilters}
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                Clear all
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {/* Content Type Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content Type
                </label>
                <div className="space-y-2">
                  {contentTypes.map((type) => (
                    <label key={type.value} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.type.includes(type.value)}
                        onChange={(e) => {
                          const newTypes = e.target.checked
                            ? [...filters.type, type.value]
                            : filters.type.filter(t => t !== type.value);
                          handleFilterChange('type', newTypes);
                        }}
                        className="rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        {type.label} ({type.count})
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Date Range Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date Range
                </label>
                <select
                  value={filters.dateRange}
                  onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                >
                  {dateRanges.map((range) => (
                    <option key={range.value} value={range.value}>
                      {range.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort By Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort By
                </label>
                <div className="space-y-2">
                  {sortOptions.map((option) => {
                    const Icon = option.icon;
                    return (
                      <label key={option.value} className="flex items-center">
                        <input
                          type="radio"
                          name="sortBy"
                          value={option.value}
                          checked={filters.sortBy === option.value}
                          onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                          className="text-primary focus:ring-primary"
                        />
                        <Icon className="w-4 h-4 ml-2 text-gray-500" />
                        <span className="ml-2 text-sm text-gray-700">{option.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Apply Filters Button */}
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => handleSearch()}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdvancedSearchInterface;
