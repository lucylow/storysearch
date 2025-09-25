import React, { useState, useRef, useEffect } from 'react';
import { Search, Mic, Camera, Sparkles, MessageCircle, Brain, Zap, TrendingUp, Lightbulb, ArrowRight, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearch } from '../../hooks/useSearch';
import { useVoiceSearch } from '../../hooks/useVoiceSearch';
import { storyblokService, SearchEnhancement } from '../../services/storyblokService';
import AIChatInterface from './AIChatInterface';

interface SearchInterfaceProps {
  mode: 'standard' | 'ai-chat';
}

const SearchInterface: React.FC<SearchInterfaceProps> = ({ mode }) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [enhancement, setEnhancement] = useState<SearchEnhancement | null>(null);
  const [showEnhancement, setShowEnhancement] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const { search, isLoading } = useSearch();
  const { isListening, startListening, stopListening } = useVoiceSearch();
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  // Debounced query enhancement
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (query.trim() && query.length > 3) {
      debounceRef.current = setTimeout(async () => {
        setIsEnhancing(true);
        try {
          const enhanced = await storyblokService.enhanceSearchQuery(query);
          setEnhancement(enhanced);
          setShowEnhancement(true);
        } catch (error) {
          console.error('Query enhancement failed:', error);
        } finally {
          setIsEnhancing(false);
        }
      }, 500);
    } else {
      setEnhancement(null);
      setShowEnhancement(false);
    }

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query]);

  const handleSearch = async (searchQuery: string = query) => {
    if (searchQuery.trim()) {
      await search(searchQuery);
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

  const quickQueries = [
    "How to set up Storyblok with Next.js?",
    "Best practices for headless CMS",
    "Content modeling examples",
    "API integration tutorials"
  ];

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Search Input Area */}
      <AnimatePresence mode="wait">
        {mode === 'standard' ? (
          <motion.div
            key="standard-search"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="relative"
          >
            <motion.div 
              className="relative"
              animate={{ 
                scale: isFocused ? 1.02 : 1,
                y: isFocused ? -2 : 0
              }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Ask anything about your Storyblok content..."
                className="w-full px-8 py-6 text-xl glass rounded-3xl border-2 border-border focus:border-primary focus:outline-none focus:shadow-[0_0_40px_hsl(var(--primary)/0.3)] transition-all duration-500 bg-gradient-to-r from-background/50 to-background/30 backdrop-blur-xl"
              />
              
              {/* Search Actions */}
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex gap-3">
                <motion.button
                  onClick={handleVoiceSearch}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className={`p-3 rounded-full transition-all duration-300 ${
                    isListening 
                      ? 'bg-destructive/20 text-destructive animate-pulse-glow shadow-[0_0_20px_hsl(var(--destructive)/0.4)]' 
                      : 'glass text-muted-foreground hover:text-foreground hover:bg-primary/10 hover:shadow-[0_0_15px_hsl(var(--primary)/0.2)]'
                  }`}
                  title="Voice Search"
                >
                  <Mic className="w-6 h-6" />
                </motion.button>
                
                <motion.button
                  onClick={() => handleSearch()}
                  disabled={isLoading}
                  whileHover={{ scale: isLoading ? 1 : 1.1 }}
                  whileTap={{ scale: isLoading ? 1 : 0.9 }}
                  className="p-3 bg-ai-gradient text-white rounded-full hover:shadow-[0_0_30px_hsl(var(--primary)/0.5)] disabled:opacity-50 transition-all duration-300"
                  title="Search"
                >
                  {isLoading ? (
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Search className="w-6 h-6" />
                  )}
                </motion.button>
              </div>
            </motion.div>

            {/* AI Enhancement Suggestions */}
            <AnimatePresence>
              {isFocused && query && enhancement && showEnhancement && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 right-0 mt-2 glass rounded-xl border border-border z-50"
                >
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Brain className="w-4 h-4 text-purple-600" />
                        AI Enhanced Search
                      </div>
                      <button
                        onClick={() => setShowEnhancement(false)}
                        className="text-xs h-6 px-2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        ✕
                      </button>
                    </div>

                    {/* Enhanced Query */}
                    {enhancement.enhancedQuery !== enhancement.originalQuery && (
                      <div className="mb-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                        <div className="flex items-center gap-2 mb-2">
                          <Zap className="w-4 h-4 text-purple-600" />
                          <span className="text-sm font-medium text-purple-800 dark:text-purple-200">Enhanced Query</span>
                        </div>
                        <p className="text-sm text-purple-700 dark:text-purple-300 mb-2">{enhancement.enhancedQuery}</p>
                        <button
                          onClick={() => {
                            setQuery(enhancement.enhancedQuery);
                            handleSearch(enhancement.enhancedQuery);
                          }}
                          className="h-7 px-3 text-xs bg-purple-600 hover:bg-purple-700 text-white rounded transition-colors"
                        >
                          Use Enhanced Query
                        </button>
                      </div>
                    )}

                    {/* Intent Classification */}
                    <div className="mb-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-foreground">Search Intent</span>
                      </div>
                      <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full border border-primary/20">
                        {enhancement.intent}
                      </span>
                    </div>

                    {/* Suggestions */}
                    {enhancement.suggestions.length > 0 && (
                      <div className="mb-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Lightbulb className="w-4 h-4 text-yellow-600" />
                          <span className="text-sm font-medium text-foreground">Suggestions</span>
                        </div>
                        <div className="space-y-1">
                          {enhancement.suggestions.slice(0, 3).map((suggestion, index) => (
                            <button
                              key={index}
                              onClick={() => {
                                setQuery(suggestion);
                                handleSearch(suggestion);
                              }}
                              className="w-full text-left p-2 text-sm rounded-lg hover:bg-primary/5 transition-colors text-foreground hover:text-primary flex items-center gap-2"
                            >
                              <ArrowRight className="w-3 h-3 text-muted-foreground" />
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Related Queries */}
                    {enhancement.relatedQueries.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingUp className="w-4 h-4 text-green-600" />
                          <span className="text-sm font-medium text-foreground">Related Searches</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {enhancement.relatedQueries.slice(0, 4).map((relatedQuery, index) => (
                            <button
                              key={index}
                              onClick={() => {
                                setQuery(relatedQuery);
                                handleSearch(relatedQuery);
                              }}
                              className="text-xs px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/30 transition-colors"
                            >
                              {relatedQuery}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Quick Suggestions */}
            <AnimatePresence>
              {isFocused && !query && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 right-0 mt-2 glass rounded-xl border border-border z-50"
                >
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-3 text-sm text-muted-foreground">
                      <Sparkles className="w-4 h-4" />
                      Try these quick searches
                    </div>
                    <div className="space-y-2">
                      {quickQueries.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setQuery(suggestion);
                            handleSearch(suggestion);
                          }}
                          className="w-full text-left p-3 rounded-lg hover:bg-primary/5 transition-colors text-foreground hover:text-primary"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ) : (
          <AIChatInterface />
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchInterface;