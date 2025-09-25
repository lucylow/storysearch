import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Mic, 
  MicOff, 
  X, 
  Filter, 
  History, 
  TrendingUp,
  ArrowLeft,
  Camera,
  FileText
} from 'lucide-react';
import { useSearch } from '../../hooks/useSearch';
import { useVoiceSearch } from '../../hooks/useVoiceSearch';

interface MobileSearchInterfaceProps {
  onBack?: () => void;
  isFullscreen?: boolean;
}

const MobileSearchInterface: React.FC<MobileSearchInterfaceProps> = ({ 
  onBack, 
  isFullscreen = false 
}) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState(-1);

  const { 
    search, 
    isLoading, 
    suggestions, 
    searchHistory, 
    popularSearches 
  } = useSearch();
  
  const { isListening, startListening, stopListening } = useVoiceSearch();
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus on mount for mobile
  useEffect(() => {
    if (isFullscreen) {
      inputRef.current?.focus();
    }
  }, [isFullscreen]);

  const handleSearch = async (searchQuery: string = query) => {
    if (searchQuery.trim()) {
      await search(searchQuery);
      setShowSuggestions(false);
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

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    handleSearch(suggestion);
  };

  return (
    <div className={`w-full ${isFullscreen ? 'h-screen bg-background' : ''}`}>
      {/* Header */}
      {isFullscreen && (
        <div className="flex items-center justify-between p-4 border-b border-border">
          <button
            onClick={onBack}
            className="p-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-semibold">Search</h1>
          <div className="w-10" /> {/* Spacer */}
        </div>
      )}

      {/* Search Input */}
      <div className="p-4">
        <div className="relative">
          <div className={`relative flex items-center bg-background border-2 rounded-2xl shadow-lg transition-all duration-300 ${
            isFocused ? 'border-primary shadow-xl shadow-primary/20' : 'border-border'
          }`}>
            <Search className="absolute left-4 w-5 h-5 text-muted-foreground" />
            
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
              placeholder="Search your Storyblok content..."
              className="flex-1 px-12 py-4 text-lg bg-transparent border-none outline-none placeholder:text-muted-foreground"
            />

            <div className="flex items-center gap-2 pr-4">
              {/* Voice Search Button */}
              <button
                onClick={handleVoiceSearch}
                className={`p-2 rounded-full transition-colors ${
                  isListening 
                    ? 'bg-red-100 text-red-600 animate-pulse' 
                    : 'hover:bg-accent text-muted-foreground'
                }`}
                title={isListening ? 'Stop listening' : 'Voice search'}
              >
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              {/* Clear Button */}
              {query && (
                <button
                  onClick={() => {
                    setQuery('');
                    inputRef.current?.focus();
                  }}
                  className="p-2 rounded-full hover:bg-accent text-muted-foreground transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}

              {/* Search Button */}
              <button
                onClick={() => handleSearch()}
                disabled={isLoading || !query.trim()}
                className="px-6 py-2 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  'Search'
                )}
              </button>
            </div>
          </div>

          {/* Suggestions Dropdown */}
          <AnimatePresence>
            {showSuggestions && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 right-0 mt-2 bg-background rounded-2xl shadow-xl border border-border overflow-hidden z-50 max-h-[60vh] overflow-y-auto"
              >
                {/* Search Suggestions */}
                {suggestions.suggestions.length > 0 && (
                  <div className="p-4 border-b border-border">
                    <div className="flex items-center gap-2 mb-3">
                      <Search className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium text-muted-foreground">Suggestions</span>
                    </div>
                    <div className="space-y-1">
                      {suggestions.suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                            selectedSuggestion === index
                              ? 'bg-primary/10 text-primary'
                              : 'hover:bg-accent text-foreground'
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
                  <div className="p-4 border-b border-border">
                    <div className="flex items-center gap-2 mb-3">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-muted-foreground">Popular</span>
                    </div>
                    <div className="space-y-1">
                      {popularSearches.slice(0, 4).map((popular, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(popular.query)}
                          className="w-full text-left px-3 py-2 rounded-lg hover:bg-accent text-foreground flex items-center justify-between"
                        >
                          <span>{popular.query}</span>
                          <span className="text-xs text-muted-foreground">{popular.count}</span>
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
                      <span className="text-sm font-medium text-muted-foreground">Recent</span>
                    </div>
                    <div className="space-y-1">
                      {searchHistory.slice(0, 4).map((history, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(history)}
                          className="w-full text-left px-3 py-2 rounded-lg hover:bg-accent text-foreground"
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
      </div>

      {/* Quick Actions */}
      {!isFullscreen && (
        <div className="px-4 pb-4">
          <div className="grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center gap-2 p-3 bg-accent rounded-xl hover:bg-accent/80 transition-colors">
              <Camera className="w-4 h-4" />
              <span className="text-sm">Scan Document</span>
            </button>
            <button className="flex items-center justify-center gap-2 p-3 bg-accent rounded-xl hover:bg-accent/80 transition-colors">
              <FileText className="w-4 h-4" />
              <span className="text-sm">Upload File</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileSearchInterface;
