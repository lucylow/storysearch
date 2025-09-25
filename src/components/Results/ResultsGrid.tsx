import React, { useState, useMemo } from 'react';
import { useSearch } from '../../hooks/useSearch';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Filter, 
  SortAsc, 
  SortDesc, 
  Grid3X3, 
  List, 
  Calendar,
  Star,
  TrendingUp,
  Clock,
  X,
  ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ResultCard from './ResultCard';
import { SearchResultSkeleton, SearchProgressBar, EmptyState } from '../UI/Skeleton';
import type { SearchResult } from '../../services/storyblokService';

const ResultsGrid: React.FC = () => {
  const { results, isLoading, hasSearched, error } = useSearch();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'relevance' | 'date' | 'title' | 'popularity'>('relevance');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  // Get unique types and tags from results
  const availableTypes = useMemo(() => {
    const types = [...new Set(results.map(result => result.type))];
    return types;
  }, [results]);

  const availableTags = useMemo(() => {
    const tags = [...new Set(results.flatMap(result => result.tags))];
    return tags.sort();
  }, [results]);

  // Filter and sort results
  const filteredAndSortedResults = useMemo(() => {
    let filtered = results;

    // Apply type filter
    if (selectedTypes.length > 0) {
      filtered = filtered.filter(result => selectedTypes.includes(result.type));
    }

    // Apply tag filter
    if (selectedTags.length > 0) {
      filtered = filtered.filter(result => 
        selectedTags.some(tag => result.tags.includes(tag))
      );
    }

    // Sort results
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'relevance':
          comparison = b.relevanceScore - a.relevanceScore;
          break;
        case 'date':
          comparison = new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime();
          break;
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'popularity':
          // Mock popularity based on relevance score and content length
          const aPopularity = a.relevanceScore * (a.content.length / 100);
          const bPopularity = b.relevanceScore * (b.content.length / 100);
          comparison = bPopularity - aPopularity;
          break;
      }

      return sortOrder === 'asc' ? -comparison : comparison;
    });

    return filtered;
  }, [results, selectedTypes, selectedTags, sortBy, sortOrder]);

  const toggleTypeFilter = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const toggleTagFilter = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSelectedTypes([]);
    setSelectedTags([]);
  };

  const activeFiltersCount = selectedTypes.length + selectedTags.length;

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
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6"
      >
        {/* Loading Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h2 className="text-2xl font-bold text-foreground">Searching...</h2>
            <SearchProgressBar progress={75} text="Finding relevant content" />
          </div>
        </div>

        {/* Skeleton Results */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <SearchResultSkeleton />
            </motion.div>
          ))}
        </div>
      </motion.div>
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
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Results Header with Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold text-foreground">
            Search Results
          </h2>
          <Badge variant="outline" className="text-sm">
            {filteredAndSortedResults.length} of {results.length} results
          </Badge>
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="text-sm">
              {activeFiltersCount} filter{activeFiltersCount > 1 ? 's' : ''} applied
            </Badge>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {/* View Mode Toggle */}
          <div className="flex items-center border border-border rounded-lg p-1">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="h-8 w-8 p-0"
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="h-8 w-8 p-0"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>

          {/* Sort Controls */}
          <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
            <SelectTrigger className="w-32 h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">
                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4" />
                  <span>Relevance</span>
                </div>
              </SelectItem>
              <SelectItem value="date">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>Date</span>
                </div>
              </SelectItem>
              <SelectItem value="title">
                <div className="flex items-center space-x-2">
                  <SortAsc className="w-4 h-4" />
                  <span>Title</span>
                </div>
              </SelectItem>
              <SelectItem value="popularity">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4" />
                  <span>Popularity</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="h-8 w-8 p-0"
          >
            {sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
          </Button>

          {/* Filter Toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="h-8 px-3"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 text-xs">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
        </div>
      </div>

      {/* Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-2">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Filter Results</CardTitle>
                  <div className="flex items-center space-x-2">
                    {activeFiltersCount > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearFilters}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        Clear all
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowFilters(false)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Content Types */}
                <div>
                  <h4 className="font-medium mb-3">Content Types</h4>
                  <div className="flex flex-wrap gap-2">
                    {availableTypes.map(type => (
                      <Button
                        key={type}
                        variant={selectedTypes.includes(type) ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => toggleTypeFilter(type)}
                        className="capitalize"
                      >
                        {type}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <h4 className="font-medium mb-3">Tags</h4>
                  <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                    {availableTags.map(tag => (
                      <Button
                        key={tag}
                        variant={selectedTags.includes(tag) ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => toggleTagFilter(tag)}
                        className="text-xs"
                      >
                        {tag}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results Grid/List */}
      <motion.div
        className={viewMode === 'grid' 
          ? "grid gap-6 md:grid-cols-2 lg:grid-cols-3" 
          : "space-y-4"
        }
        layout
      >
        <AnimatePresence mode="popLayout">
          {filteredAndSortedResults.map((result, index) => (
            <motion.div
              key={result.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.05 }}
            >
              <ResultCard result={result} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* No Results Message */}
      {filteredAndSortedResults.length === 0 && results.length > 0 && (
        <div className="text-center py-12">
          <div className="text-muted-foreground text-lg font-semibold mb-2">
            No results match your filters
          </div>
          <p className="text-muted-foreground mb-4">
            Try adjusting your filters or clearing them to see all results
          </p>
          <Button onClick={clearFilters} variant="outline">
            Clear Filters
          </Button>
        </div>
      )}
    </motion.div>
  );
};

export default ResultsGrid;