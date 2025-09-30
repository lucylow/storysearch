import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  ExternalLink,
  Calendar,
  User,
  Tag,
  Image,
  Link,
  Search,
  Filter,
  Download,
  Eye,
  Zap,
  CheckCircle,
  AlertCircle,
  Clock,
  Globe,
  Target,
  Database,
  BarChart3,
  Grid3X3,
  List,
  SortAsc,
  SortDesc
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { CrawlResult, CrawlTarget } from '../../services/webCrawlerService';

interface CrawlResultsGridProps {
  results: CrawlResult[];
  targets: CrawlTarget[];
  onIndexResults: (targetId?: string) => void;
}

const CrawlResultsGrid: React.FC<CrawlResultsGridProps> = ({
  results,
  targets,
  onIndexResults
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTarget, setSelectedTarget] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'title' | 'date' | 'wordCount' | 'status'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedResults, setSelectedResults] = useState<Set<string>>(new Set());

  const filteredAndSortedResults = useMemo(() => {
    let filtered = results;

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(result =>
        result.title.toLowerCase().includes(query) ||
        result.content.toLowerCase().includes(query) ||
        result.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Filter by target
    if (selectedTarget !== 'all') {
      filtered = filtered.filter(result => result.crawlTargetId === selectedTarget);
    }

    // Sort results
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'date':
          comparison = a.crawledAt.getTime() - b.crawledAt.getTime();
          break;
        case 'wordCount':
          comparison = a.wordCount - b.wordCount;
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [results, searchQuery, selectedTarget, sortBy, sortOrder]);

  const getTargetName = (targetId: string) => {
    const target = targets.find(t => t.id === targetId);
    return target?.name || 'Unknown Target';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      case 'error': return 'text-red-600 bg-red-100 dark:bg-red-900/20';
      case 'blocked': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-4 h-4" />;
      case 'error': return <AlertCircle className="w-4 h-4" />;
      case 'blocked': return <Clock className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const handleSelectResult = (resultId: string) => {
    const newSelected = new Set(selectedResults);
    if (newSelected.has(resultId)) {
      newSelected.delete(resultId);
    } else {
      newSelected.add(resultId);
    }
    setSelectedResults(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedResults.size === filteredAndSortedResults.length) {
      setSelectedResults(new Set());
    } else {
      setSelectedResults(new Set(filteredAndSortedResults.map(r => r.id)));
    }
  };

  const handleIndexSelected = () => {
    // Index selected results
    onIndexResults();
    setSelectedResults(new Set());
  };

  const ResultCard: React.FC<{ result: CrawlResult }> = ({ result }) => (
    <Card className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
      selectedResults.has(result.id) ? 'ring-2 ring-primary' : ''
    }`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="p-2 bg-primary/10 rounded-lg">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-base truncate">{result.title}</CardTitle>
              <p className="text-sm text-muted-foreground truncate">
                {getTargetName(result.crawlTargetId)}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge className={`text-xs ${getStatusColor(result.status)}`}>
              <div className="flex items-center gap-1">
                {getStatusIcon(result.status)}
                {result.status}
              </div>
            </Badge>
            
            <input
              type="checkbox"
              checked={selectedResults.has(result.id)}
              onChange={() => handleSelectResult(result.id)}
              className="w-4 h-4"
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* URL */}
        <div className="flex items-center gap-2">
          <ExternalLink className="w-4 h-4 text-muted-foreground" />
          <a
            href={result.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary hover:underline truncate"
          >
            {result.url}
          </a>
        </div>

        {/* Content Preview */}
        <p className="text-sm text-muted-foreground line-clamp-3">
          {result.description || result.content.substring(0, 200)}...
        </p>

        {/* Metadata */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span>{formatDate(result.crawledAt)}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-muted-foreground" />
            <span>{result.wordCount} words</span>
          </div>
        </div>

        {/* Tags */}
        {result.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {result.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {result.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{result.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 pt-2 border-t border-border">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(result.url, '_blank')}
            className="flex-1"
          >
            <Eye className="w-4 h-4 mr-2" />
            View
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onIndexResults()}
          >
            <Zap className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const ResultListItem: React.FC<{ result: CrawlResult }> = ({ result }) => (
    <Card className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
      selectedResults.has(result.id) ? 'ring-2 ring-primary' : ''
    }`}>
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <input
            type="checkbox"
            checked={selectedResults.has(result.id)}
            onChange={() => handleSelectResult(result.id)}
            className="w-4 h-4"
          />
          
          <div className="p-2 bg-primary/10 rounded-lg">
            <FileText className="w-5 h-5 text-primary" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-medium truncate">{result.title}</h3>
              <Badge className={`text-xs ${getStatusColor(result.status)}`}>
                <div className="flex items-center gap-1">
                  {getStatusIcon(result.status)}
                  {result.status}
                </div>
              </Badge>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Globe className="w-4 h-4" />
                {getTargetName(result.crawlTargetId)}
              </div>
              
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {formatDate(result.crawledAt)}
              </div>
              
              <div className="flex items-center gap-1">
                <FileText className="w-4 h-4" />
                {result.wordCount} words
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
              {result.description || result.content.substring(0, 100)}...
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(result.url, '_blank')}
            >
              <Eye className="w-4 h-4" />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => onIndexResults()}
            >
              <Zap className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Crawl Results</h2>
          <p className="text-sm text-muted-foreground">
            {filteredAndSortedResults.length} results found
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          {selectedResults.size > 0 && (
            <Button
              variant="outline"
              onClick={handleIndexSelected}
              className="mr-2"
            >
              <Zap className="w-4 h-4 mr-2" />
              Index Selected ({selectedResults.size})
            </Button>
          )}
          
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search results..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <Select value={selectedTarget} onValueChange={setSelectedTarget}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by target" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Targets</SelectItem>
            {targets.map(target => (
              <SelectItem key={target.id} value={target.id}>
                {target.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="title">Title</SelectItem>
            <SelectItem value="date">Date</SelectItem>
            <SelectItem value="wordCount">Word Count</SelectItem>
            <SelectItem value="status">Status</SelectItem>
          </SelectContent>
        </Select>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
        >
          {sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
        </Button>
        
        <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid3X3 className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Select All */}
      {filteredAndSortedResults.length > 0 && (
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={selectedResults.size === filteredAndSortedResults.length}
            onChange={handleSelectAll}
            className="w-4 h-4"
          />
          <span className="text-sm text-muted-foreground">
            Select all {filteredAndSortedResults.length} results
          </span>
        </div>
      )}

      {/* Results */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAndSortedResults.map((result) => (
            <motion.div
              key={result.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -2 }}
            >
              <ResultCard result={result} />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredAndSortedResults.map((result) => (
            <motion.div
              key={result.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <ResultListItem result={result} />
            </motion.div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {filteredAndSortedResults.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No crawl results found</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery || selectedTarget !== 'all'
              ? 'Try adjusting your search criteria or filters'
              : 'Start crawling to see results here'
            }
          </p>
          {!searchQuery && selectedTarget === 'all' && (
            <Button>
              <Target className="w-4 h-4 mr-2" />
              Start Crawling
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default CrawlResultsGrid;
