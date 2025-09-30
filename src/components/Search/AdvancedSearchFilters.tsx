import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Filter,
  X,
  Calendar,
  Tag,
  User,
  FileText,
  Image,
  Video,
  Music,
  Globe,
  Clock,
  Star,
  TrendingUp,
  Search,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';

export interface SearchFilters {
  // Content Types
  contentType: string[];
  
  // Date Range
  dateRange: {
    start?: Date;
    end?: Date;
    preset?: 'today' | 'week' | 'month' | 'quarter' | 'year' | 'all';
  };
  
  // Authors
  authors: string[];
  
  // Tags
  tags: string[];
  
  // File Types
  fileTypes: string[];
  
  // Language
  language: string;
  
  // Content Quality
  quality: {
    minRelevance: number;
    minWordCount: number;
    hasImages: boolean;
    hasVideos: boolean;
    hasAudio: boolean;
  };
  
  // Advanced Options
  advanced: {
    exactPhrase: boolean;
    includeSynonyms: boolean;
    fuzzyMatching: boolean;
    caseSensitive: boolean;
  };
  
  // Sort Options
  sortBy: 'relevance' | 'date' | 'title' | 'author' | 'popularity';
  sortOrder: 'asc' | 'desc';
}

interface AdvancedSearchFiltersProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  onClose?: () => void;
  isOpen?: boolean;
}

const AdvancedSearchFilters: React.FC<AdvancedSearchFiltersProps> = ({
  filters,
  onFiltersChange,
  onClose,
  isOpen = true
}) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['contentType', 'dateRange']));
  const [tempFilters, setTempFilters] = useState<SearchFilters>(filters);

  useEffect(() => {
    setTempFilters(filters);
  }, [filters]);

  const updateFilters = (updates: Partial<SearchFilters>) => {
    const newFilters = { ...tempFilters, ...updates };
    setTempFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const resetFilters = () => {
    const defaultFilters: SearchFilters = {
      contentType: [],
      dateRange: { preset: 'all' },
      authors: [],
      tags: [],
      fileTypes: [],
      language: 'all',
      quality: {
        minRelevance: 0,
        minWordCount: 0,
        hasImages: false,
        hasVideos: false,
        hasAudio: false
      },
      advanced: {
        exactPhrase: false,
        includeSynonyms: true,
        fuzzyMatching: true,
        caseSensitive: false
      },
      sortBy: 'relevance',
      sortOrder: 'desc'
    };
    updateFilters(defaultFilters);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (tempFilters.contentType.length > 0) count++;
    if (tempFilters.dateRange.preset !== 'all') count++;
    if (tempFilters.authors.length > 0) count++;
    if (tempFilters.tags.length > 0) count++;
    if (tempFilters.fileTypes.length > 0) count++;
    if (tempFilters.language !== 'all') count++;
    if (tempFilters.quality.minRelevance > 0) count++;
    if (tempFilters.quality.minWordCount > 0) count++;
    if (tempFilters.quality.hasImages || tempFilters.quality.hasVideos || tempFilters.quality.hasAudio) count++;
    if (tempFilters.advanced.exactPhrase || !tempFilters.advanced.includeSynonyms || 
        !tempFilters.advanced.fuzzyMatching || tempFilters.advanced.caseSensitive) count++;
    return count;
  };

  const FilterSection: React.FC<{
    title: string;
    section: string;
    icon: React.ReactNode;
    children: React.ReactNode;
  }> = ({ title, section, icon, children }) => {
    const isExpanded = expandedSections.has(section);
    
    return (
      <div className="border-b border-border last:border-b-0">
        <button
          onClick={() => toggleSection(section)}
          className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            {icon}
            <span className="font-medium">{title}</span>
          </div>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          )}
        </button>
        
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="p-4 pt-0 space-y-4">
                {children}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 300 }}
      className="fixed right-0 top-0 h-full w-96 bg-background border-l border-border shadow-xl z-50 overflow-y-auto"
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <SlidersHorizontal className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">Advanced Filters</h2>
            {getActiveFiltersCount() > 0 && (
              <Badge variant="secondary" className="ml-2">
                {getActiveFiltersCount()}
              </Badge>
            )}
          </div>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Reset Button */}
        <div className="mb-6">
          <Button variant="outline" onClick={resetFilters} className="w-full">
            <Filter className="w-4 h-4 mr-2" />
            Reset All Filters
          </Button>
        </div>

        {/* Filter Sections */}
        <div className="space-y-0">
          <FilterSection
            title="Content Type"
            section="contentType"
            icon={<FileText className="w-4 h-4" />}
          >
            <div className="grid grid-cols-2 gap-2">
              {['article', 'blog', 'documentation', 'tutorial', 'guide', 'news', 'review', 'case-study'].map(type => (
                <label key={type} className="flex items-center space-x-2 cursor-pointer">
                  <Checkbox
                    checked={tempFilters.contentType.includes(type)}
                    onCheckedChange={(checked) => {
                      const newTypes = checked
                        ? [...tempFilters.contentType, type]
                        : tempFilters.contentType.filter(t => t !== type);
                      updateFilters({ contentType: newTypes });
                    }}
                  />
                  <span className="text-sm capitalize">{type.replace('-', ' ')}</span>
                </label>
              ))}
            </div>
          </FilterSection>

          <FilterSection
            title="Date Range"
            section="dateRange"
            icon={<Calendar className="w-4 h-4" />}
          >
            <Select
              value={tempFilters.dateRange.preset}
              onValueChange={(value) => updateFilters({
                dateRange: { ...tempFilters.dateRange, preset: value as any }
              })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select date range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
          </FilterSection>

          <FilterSection
            title="Authors"
            section="authors"
            icon={<User className="w-4 h-4" />}
          >
            <div className="space-y-2">
              <Input
                placeholder="Add author name..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                    const newAuthors = [...tempFilters.authors, e.currentTarget.value.trim()];
                    updateFilters({ authors: newAuthors });
                    e.currentTarget.value = '';
                  }
                }}
              />
              <div className="flex flex-wrap gap-2">
                {tempFilters.authors.map(author => (
                  <Badge key={author} variant="secondary" className="cursor-pointer" onClick={() => {
                    updateFilters({ authors: tempFilters.authors.filter(a => a !== author) });
                  }}>
                    {author} <X className="w-3 h-3 ml-1" />
                  </Badge>
                ))}
              </div>
            </div>
          </FilterSection>

          <FilterSection
            title="Tags"
            section="tags"
            icon={<Tag className="w-4 h-4" />}
          >
            <div className="space-y-2">
              <Input
                placeholder="Add tag..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                    const newTags = [...tempFilters.tags, e.currentTarget.value.trim()];
                    updateFilters({ tags: newTags });
                    e.currentTarget.value = '';
                  }
                }}
              />
              <div className="flex flex-wrap gap-2">
                {tempFilters.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => {
                    updateFilters({ tags: tempFilters.tags.filter(t => t !== tag) });
                  }}>
                    {tag} <X className="w-3 h-3 ml-1" />
                  </Badge>
                ))}
              </div>
            </div>
          </FilterSection>

          <FilterSection
            title="File Types"
            section="fileTypes"
            icon={<FileText className="w-4 h-4" />}
          >
            <div className="grid grid-cols-2 gap-2">
              {['pdf', 'doc', 'docx', 'txt', 'html', 'md'].map(type => (
                <label key={type} className="flex items-center space-x-2 cursor-pointer">
                  <Checkbox
                    checked={tempFilters.fileTypes.includes(type)}
                    onCheckedChange={(checked) => {
                      const newTypes = checked
                        ? [...tempFilters.fileTypes, type]
                        : tempFilters.fileTypes.filter(t => t !== type);
                      updateFilters({ fileTypes: newTypes });
                    }}
                  />
                  <span className="text-sm uppercase">{type}</span>
                </label>
              ))}
            </div>
          </FilterSection>

          <FilterSection
            title="Content Quality"
            section="quality"
            icon={<Star className="w-4 h-4" />}
          >
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Minimum Relevance: {tempFilters.quality.minRelevance}%
                </label>
                <Slider
                  value={[tempFilters.quality.minRelevance]}
                  onValueChange={([value]) => updateFilters({
                    quality: { ...tempFilters.quality, minRelevance: value }
                  })}
                  max={100}
                  step={5}
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Minimum Word Count: {tempFilters.quality.minWordCount}
                </label>
                <Slider
                  value={[tempFilters.quality.minWordCount]}
                  onValueChange={([value]) => updateFilters({
                    quality: { ...tempFilters.quality, minWordCount: value }
                  })}
                  max={5000}
                  step={100}
                  className="w-full"
                />
              </div>
              
              <div className="space-y-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <Checkbox
                    checked={tempFilters.quality.hasImages}
                    onCheckedChange={(checked) => updateFilters({
                      quality: { ...tempFilters.quality, hasImages: !!checked }
                    })}
                  />
                  <span className="text-sm">Has Images</span>
                </label>
                
                <label className="flex items-center space-x-2 cursor-pointer">
                  <Checkbox
                    checked={tempFilters.quality.hasVideos}
                    onCheckedChange={(checked) => updateFilters({
                      quality: { ...tempFilters.quality, hasVideos: !!checked }
                    })}
                  />
                  <span className="text-sm">Has Videos</span>
                </label>
                
                <label className="flex items-center space-x-2 cursor-pointer">
                  <Checkbox
                    checked={tempFilters.quality.hasAudio}
                    onCheckedChange={(checked) => updateFilters({
                      quality: { ...tempFilters.quality, hasAudio: !!checked }
                    })}
                  />
                  <span className="text-sm">Has Audio</span>
                </label>
              </div>
            </div>
          </FilterSection>

          <FilterSection
            title="Sort & Language"
            section="sort"
            icon={<TrendingUp className="w-4 h-4" />}
          >
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Sort By</label>
                <Select
                  value={tempFilters.sortBy}
                  onValueChange={(value) => updateFilters({ sortBy: value as any })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Relevance</SelectItem>
                    <SelectItem value="date">Date</SelectItem>
                    <SelectItem value="title">Title</SelectItem>
                    <SelectItem value="author">Author</SelectItem>
                    <SelectItem value="popularity">Popularity</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Language</label>
                <Select
                  value={tempFilters.language}
                  onValueChange={(value) => updateFilters({ language: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Languages</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                    <SelectItem value="it">Italian</SelectItem>
                    <SelectItem value="pt">Portuguese</SelectItem>
                    <SelectItem value="ru">Russian</SelectItem>
                    <SelectItem value="zh">Chinese</SelectItem>
                    <SelectItem value="ja">Japanese</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </FilterSection>
        </div>
      </div>
    </motion.div>
  );
};

export default AdvancedSearchFilters;
