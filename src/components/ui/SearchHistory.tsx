import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, X, TrendingUp, Star, Search } from 'lucide-react';

interface SearchHistoryItem {
  query: string;
  timestamp: number;
  resultCount?: number;
}

interface SearchHistoryProps {
  onSearchSelect: (query: string) => void;
  maxItems?: number;
}

const SearchHistory: React.FC<SearchHistoryProps> = ({ 
  onSearchSelect,
  maxItems = 10 
}) => {
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    const savedHistory = localStorage.getItem('storysearch_history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Failed to load search history');
      }
    }
  }, []);

  const addToHistory = (query: string, resultCount?: number) => {
    const newItem: SearchHistoryItem = {
      query,
      timestamp: Date.now(),
      resultCount
    };

    const updatedHistory = [
      newItem,
      ...history.filter(item => item.query !== query)
    ].slice(0, maxItems);

    setHistory(updatedHistory);
    localStorage.setItem('storysearch_history', JSON.stringify(updatedHistory));
  };

  const removeFromHistory = (query: string) => {
    const updatedHistory = history.filter(item => item.query !== query);
    setHistory(updatedHistory);
    localStorage.setItem('storysearch_history', JSON.stringify(updatedHistory));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('storysearch_history');
  };

  const getTimeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  if (history.length === 0) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setShowHistory(!showHistory)}
        className="flex items-center space-x-2 px-4 py-2 glass rounded-lg border border-border hover:border-primary/30 transition-all"
      >
        <Clock className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm text-foreground">Recent Searches</span>
        <span className="text-xs text-muted-foreground">({history.length})</span>
      </button>

      <AnimatePresence>
        {showHistory && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 mt-2 w-80 glass rounded-xl border border-border/50 shadow-2xl z-50 p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-foreground">Search History</h4>
              <button
                onClick={clearHistory}
                className="text-xs text-muted-foreground hover:text-destructive transition-colors"
              >
                Clear all
              </button>
            </div>

            <div className="space-y-1 max-h-96 overflow-y-auto custom-scrollbar">
              {history.map((item, index) => (
                <motion.div
                  key={`${item.query}-${item.timestamp}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group flex items-center justify-between p-2 rounded-lg hover:bg-primary/5 transition-colors cursor-pointer"
                  onClick={() => {
                    onSearchSelect(item.query);
                    setShowHistory(false);
                  }}
                >
                  <div className="flex items-center space-x-2 flex-1">
                    <Search className="w-3 h-3 text-muted-foreground" />
                    <span className="text-sm text-foreground group-hover:text-primary transition-colors line-clamp-1">
                      {item.query}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-muted-foreground">
                      {getTimeAgo(item.timestamp)}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFromHistory(item.query);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-destructive/10 rounded transition-all"
                    >
                      <X className="w-3 h-3 text-muted-foreground hover:text-destructive" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export { SearchHistory };
export type { SearchHistoryItem };
