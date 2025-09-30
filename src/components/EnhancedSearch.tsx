import React, { useState, useEffect } from 'react';
import { Search, Filter, TrendingUp, Users, Music, ShoppingBag, Play, Star, Megaphone, ListMusic } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockData, trendingQueries, contentTypeDefinitions } from '@/data/mockData';

const EnhancedSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [searchMode, setSearchMode] = useState('all');
  const [isSearching, setIsSearching] = useState(false);

  const searchModes = [
    { id: 'all', label: 'All Content', icon: Search },
    { id: 'brands', label: 'Brands', icon: ShoppingBag },
    { id: 'influencers', label: 'Influencers', icon: Users },
    { id: 'music', label: 'Music', icon: Music }
  ];

  const contentTypes = Object.keys(contentTypeDefinitions);

  const getContentTypeIcon = (type: string) => {
    const iconMap: { [key: string]: any } = {
      product: ShoppingBag,
      video: Play,
      music_release: Music,
      campaign: Megaphone,
      brand_endorsement: Star,
      music_playlist: ListMusic
    };
    const Icon = iconMap[type] || Search;
    return <Icon className="w-4 h-4" />;
  };

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    
    // Simulate search delay for demo
    setTimeout(() => {
      let filteredResults = mockData;
      
      // Apply search query filter
      if (searchQuery) {
        const queryLower = searchQuery.toLowerCase();
        filteredResults = mockData.filter(item => 
          item.title.toLowerCase().includes(queryLower) ||
          item.description.toLowerCase().includes(queryLower) ||
          item.fullTextContent.toLowerCase().includes(queryLower) ||
          item.tags.some((tag: string) => tag.toLowerCase().includes(queryLower)) ||
          item.brandOrPerson.toLowerCase().includes(queryLower)
        );
      }
      
      // Apply search mode filter
      if (searchMode !== 'all') {
        filteredResults = filteredResults.filter(item => {
          switch (searchMode) {
            case 'brands':
              return item.brandOrPerson === 'Nike';
            case 'influencers':
              return item.brandOrPerson === 'iShowSpeed';
            case 'music':
              return item.brandOrPerson === 'BLACKPINK';
            default:
              return true;
          }
        });
      }
      
      // Apply content type filters
      if (selectedFilters.length > 0) {
        filteredResults = filteredResults.filter(item => 
          selectedFilters.includes(item.contentType)
        );
      }
      
      // Sort by relevance and engagement
      filteredResults.sort((a, b) => {
        if (a.engagementScore !== b.engagementScore) {
          return b.engagementScore - a.engagementScore;
        }
        return new Date(b.datePublished).getTime() - new Date(a.datePublished).getTime();
      });
      
      setResults(filteredResults);
      setIsSearching(false);
    }, 800);
  };

  const handleFilterToggle = (filter: string) => {
    setSelectedFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  useEffect(() => {
    if (query) {
      handleSearch(query);
    }
  }, [searchMode, selectedFilters]);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Search Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          StorySearch AI
        </h1>
        <p className="text-gray-600 text-lg">
          Discover content across brands, influencers, and music with AI-powered intelligence
        </p>
      </div>

      {/* Search Modes */}
      <div className="flex justify-center space-x-2">
        {searchModes.map((mode) => {
          const Icon = mode.icon;
          return (
            <Button
              key={mode.id}
              variant={searchMode === mode.id ? "default" : "outline"}
              onClick={() => setSearchMode(mode.id)}
              className="flex items-center space-x-2"
            >
              <Icon className="w-4 h-4" />
              <span>{mode.label}</span>
            </Button>
          );
        })}
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
        <Input
          type="text"
          placeholder="Ask anything... 'Show me Nike's latest campaigns' or 'What music does iShowSpeed use?'"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch(query)}
          className="pl-10 pr-4 py-3 text-lg"
        />
        <Button 
          onClick={() => handleSearch(query)}
          disabled={isSearching}
          className="absolute right-2 top-1.5"
        >
          {isSearching ? 'Searching...' : 'Search'}
        </Button>
      </div>

      {/* Content Type Filters */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-500">Content Types</h3>
        <div className="flex flex-wrap gap-2">
          {contentTypes.map((type) => (
            <Badge 
              key={type}
              variant={selectedFilters.includes(type) ? "default" : "secondary"}
              className="cursor-pointer hover:bg-blue-100 flex items-center space-x-1"
              onClick={() => handleFilterToggle(type)}
            >
              {getContentTypeIcon(type)}
              <span className="capitalize">{type.replace('_', ' ')}</span>
            </Badge>
          ))}
        </div>
      </div>

      {/* Trending Queries */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-500">Trending Searches</h3>
        <div className="flex flex-wrap gap-2">
          {trendingQueries.map((trendQuery, index) => (
            <Badge 
              key={index}
              variant="outline" 
              className="cursor-pointer hover:bg-blue-100"
              onClick={() => {
                setQuery(trendQuery);
                handleSearch(trendQuery);
              }}
            >
              {trendQuery}
            </Badge>
          ))}
        </div>
      </div>

      {/* AI Insights Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5" />
            <span>AI Content Insights</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">89%</div>
              <div className="text-sm text-gray-600">Query Understanding Accuracy</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">23%</div>
              <div className="text-sm text-gray-600">Engagement Improvement</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">91%</div>
              <div className="text-sm text-gray-600">Content Relevance Score</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search Results */}
      {results.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Search Results ({results.length})</h2>
            <Badge variant="outline">
              {searchMode === 'all' ? 'All Content' : searchModes.find(m => m.id === searchMode)?.label}
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.map((item) => (
              <Card key={item.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        {getContentTypeIcon(item.contentType)}
                        <Badge variant="secondary" className="capitalize">
                          {item.contentType.replace('_', ' ')}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-green-600">
                          {item.engagementScore}%
                        </div>
                        <div className="text-xs text-gray-500">Engagement</div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium line-clamp-2">{item.title}</h3>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {item.description}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        {item.brandOrPerson}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {new Date(item.datePublished).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-1">
                      {item.tags.slice(0, 3).map((tag: string) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {item.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{item.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                    
                    <Button size="sm" className="w-full">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* No Results State */}
      {query && results.length === 0 && !isSearching && (
        <Card>
          <CardContent className="p-8 text-center">
            <Search className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium mb-2">No results found</h3>
            <p className="text-gray-600">
              Try adjusting your search terms or filters to find what you're looking for.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EnhancedSearch;
