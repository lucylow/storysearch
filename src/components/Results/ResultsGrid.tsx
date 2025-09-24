import React from 'react';
import { useSearch } from '../../hooks/useSearch';
import { motion, AnimatePresence } from 'framer-motion';
import ResultCard from './ResultCard';
import EmptyState from '../UI/EmptyState';
import LoadingSpinner from '../UI/LoadingSpinner';

const ResultsGrid: React.FC = () => {
  const { results, isLoading, hasSearched, error } = useSearch();

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-destructive text-lg font-semibold">Error loading results</div>
        <p className="text-muted-foreground mt-2">{error}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="large" text="Searching your content..." />
      </div>
    );
  }

  if (!hasSearched) {
    return (
      <EmptyState 
        icon="🔍"
        title="Ready to explore your content"
        description="Start typing to discover relevant Storyblok content with AI-powered search"
      />
    );
  }

  if (results.length === 0) {
    return (
      <EmptyState 
        icon="😕"
        title="No results found"
        description="Try different keywords or ask our AI assistant for help"
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Results Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">
          Found {results.length} result{results.length !== 1 ? 's' : ''}
        </h2>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <span>Sorted by relevance</span>
        </div>
      </div>

      {/* Results Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence>
          {results.map((result, index) => (
            <motion.div
              key={result.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
            >
              <ResultCard result={result} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default ResultsGrid;