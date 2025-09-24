import React, { useState, useRef } from 'react';
import { Search, Mic, Camera, Sparkles, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearch } from '../../hooks/useSearch';
import { useVoiceSearch } from '../../hooks/useVoiceSearch';
import AIChatInterface from './AIChatInterface';

interface SearchInterfaceProps {
  mode: 'standard' | 'ai-chat';
}

const SearchInterface: React.FC<SearchInterfaceProps> = ({ mode }) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const { search, isLoading } = useSearch();
  const { isListening, startListening, stopListening } = useVoiceSearch();
  const inputRef = useRef<HTMLInputElement>(null);

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
            <div className={`relative transition-all duration-300 ${
              isFocused ? 'scale-105' : 'scale-100'
            }`}>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Ask anything about your Storyblok content..."
                className="w-full px-6 py-4 text-lg glass rounded-2xl border-2 border-border focus:border-primary focus:outline-none focus:shadow-[0_0_30px_hsl(var(--primary)/0.2)] transition-all duration-300"
              />
              
              {/* Search Actions */}
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-2">
                <button
                  onClick={handleVoiceSearch}
                  className={`p-2 rounded-full transition-all ${
                    isListening 
                      ? 'bg-destructive/10 text-destructive animate-pulse-glow' 
                      : 'glass text-muted-foreground hover:text-foreground'
                  }`}
                  title="Voice Search"
                >
                  <Mic className="w-5 h-5" />
                </button>
                
                <button
                  onClick={() => handleSearch()}
                  disabled={isLoading}
                  className="p-2 bg-ai-gradient text-white rounded-full hover:shadow-[0_0_20px_hsl(var(--primary)/0.4)] disabled:opacity-50 transition-all"
                  title="Search"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Search className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

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