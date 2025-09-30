import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Layers,
  Grid3X3,
  Map,
  Target,
  Sparkles,
  TrendingUp,
  Users,
  Calendar,
  Tag,
  Filter,
  Search,
  Eye,
  EyeOff,
  RotateCcw,
  Settings,
  Zap,
  Brain,
  Link2,
  Network
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import type { SearchResult } from '../../services/storyblokService';

interface ContentCluster {
  id: string;
  name: string;
  description: string;
  color: string;
  center: { x: number; y: number };
  radius: number;
  items: SearchResult[];
  keywords: string[];
  strength: number;
  type: 'semantic' | 'temporal' | 'collaborative' | 'hierarchical';
  connections: number;
}

interface ContentClusterMapProps {
  content: SearchResult[];
  onClusterSelect?: (cluster: ContentCluster | null) => void;
  onContentSelect?: (content: SearchResult | null) => void;
  selectedCluster?: string | null;
  selectedContent?: string | null;
}

const ContentClusterMap: React.FC<ContentClusterMapProps> = ({
  content,
  onClusterSelect,
  onContentSelect,
  selectedCluster,
  selectedContent
}) => {
  const [viewMode, setViewMode] = useState<'map' | 'grid' | 'network'>('map');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    types: [] as string[],
    dateRange: 'all',
    minItems: 1,
    showLabels: true
  });

  // Generate clusters based on content
  const clusters = useMemo(() => {
    if (!content.length) return [];

    // Group content by type and similarity
    const typeGroups = content.reduce((acc, item) => {
      if (!acc[item.type]) acc[item.type] = [];
      acc[item.type].push(item);
      return acc;
    }, {} as Record<string, SearchResult[]>);

    // Create clusters
    const generatedClusters: ContentCluster[] = [];
    let clusterId = 0;

    Object.entries(typeGroups).forEach(([type, items], index) => {
      // Split large groups into smaller clusters
      const clusterSize = Math.min(8, Math.max(3, Math.ceil(items.length / 3)));
      
      for (let i = 0; i < items.length; i += clusterSize) {
        const clusterItems = items.slice(i, i + clusterSize);
        const keywords = Array.from(
          new Set(clusterItems.flatMap(item => item.tags))
        ).slice(0, 5);

        const angle = (index * 2 * Math.PI) / Object.keys(typeGroups).length + (i / clusterSize) * 0.5;
        const distance = 200 + (i / clusterSize) * 100;
        
        generatedClusters.push({
          id: `cluster-${clusterId++}`,
          name: `${type.charAt(0).toUpperCase() + type.slice(1)} Cluster ${Math.floor(i / clusterSize) + 1}`,
          description: `Collection of ${type} content with shared themes`,
          color: getTypeColor(type),
          center: {
            x: 400 + Math.cos(angle) * distance,
            y: 300 + Math.sin(angle) * distance
          },
          radius: Math.max(60, Math.min(120, clusterItems.length * 8 + 40)),
          items: clusterItems,
          keywords,
          strength: clusterItems.length / 10,
          type: getClusterType(type),
          connections: Math.floor(Math.random() * 5) + 1
        });
      }
    });

    return generatedClusters;
  }, [content]);

  const getTypeColor = (type: string): string => {
    const colors = {
      story: '#3B82F6',
      component: '#10B981',
      folder: '#8B5CF6',
      tutorial: '#F59E0B',
      guide: '#6366F1',
      documentation: '#14B8A6',
      article: '#EC4899'
    };
    return colors[type as keyof typeof colors] || '#6B7280';
  };

  const getClusterType = (type: string): 'semantic' | 'temporal' | 'collaborative' | 'hierarchical' => {
    const typeMap = {
      story: 'semantic',
      component: 'hierarchical',
      folder: 'hierarchical',
      tutorial: 'semantic',
      guide: 'semantic',
      documentation: 'hierarchical',
      article: 'temporal'
    };
    return typeMap[type as keyof typeof typeMap] || 'semantic';
  };

  // Filter clusters based on current filters
  const filteredClusters = clusters.filter(cluster => {
    if (filters.types.length > 0) {
      const clusterTypes = Array.from(new Set(cluster.items.map(item => item.type)));
      if (!filters.types.some(type => clusterTypes.includes(type))) {
        return false;
      }
    }
    if (cluster.items.length < filters.minItems) {
      return false;
    }
    return true;
  });

  const handleClusterClick = (cluster: ContentCluster) => {
    onClusterSelect?.(cluster);
  };

  const handleContentClick = (content: SearchResult) => {
    onContentSelect?.(content);
  };

  return (
    <div className="w-full h-full bg-background/95 backdrop-blur-xl rounded-xl border border-border overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <Layers className="w-6 h-6 text-primary" />
          <div>
            <h2 className="text-lg font-semibold">Content Cluster Map</h2>
            <p className="text-sm text-muted-foreground">
              {filteredClusters.length} clusters, {content.length} total items
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
            <Button
              variant={viewMode === 'map' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('map')}
            >
              <Map className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'network' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('network')}
            >
              <Network className="w-4 h-4" />
            </Button>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex h-[calc(100vh-120px)]">
        {/* Main Visualization Area */}
        <div className="flex-1 relative overflow-hidden">
          {viewMode === 'map' && (
            <div className="w-full h-full relative">
              <svg width="100%" height="100%" className="absolute inset-0">
                {/* Background Grid */}
                <defs>
                  <pattern id="clusterGrid" width="50" height="50" patternUnits="userSpaceOnUse">
                    <path d="M 50 0 L 0 0 0 50" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.1"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#clusterGrid)" />

                {/* Cluster Circles */}
                {filteredClusters.map((cluster, index) => (
                  <motion.g
                    key={cluster.id}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <circle
                      cx={cluster.center.x}
                      cy={cluster.center.y}
                      r={cluster.radius}
                      fill={cluster.color}
                      fillOpacity={0.2}
                      stroke={cluster.color}
                      strokeWidth={2}
                      className="cursor-pointer hover:fill-opacity-30 transition-all duration-200"
                      onClick={() => handleClusterClick(cluster)}
                    />
                    
                    {/* Cluster Label */}
                    {filters.showLabels && (
                      <text
                        x={cluster.center.x}
                        y={cluster.center.y - cluster.radius - 10}
                        textAnchor="middle"
                        className="text-sm font-medium fill-current pointer-events-none"
                      >
                        {cluster.name}
                      </text>
                    )}
                    
                    {/* Item Dots */}
                    {cluster.items.map((item, itemIndex) => {
                      const angle = (itemIndex / cluster.items.length) * 2 * Math.PI;
                      const distance = cluster.radius * 0.7;
                      const x = cluster.center.x + Math.cos(angle) * distance;
                      const y = cluster.center.y + Math.sin(angle) * distance;
                      
                      return (
                        <motion.circle
                          key={item.id}
                          cx={x}
                          cy={y}
                          r={6}
                          fill={cluster.color}
                          className="cursor-pointer hover:r-8 transition-all duration-200"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleContentClick(item);
                          }}
                          whileHover={{ scale: 1.5 }}
                        />
                      );
                    })}
                  </motion.g>
                ))}
              </svg>
            </div>
          )}

          {viewMode === 'grid' && (
            <div className="p-6 h-full overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredClusters.map((cluster, index) => (
                  <motion.div
                    key={cluster.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Card 
                      className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                        selectedCluster === cluster.id ? 'ring-2 ring-primary' : ''
                      }`}
                      onClick={() => handleClusterClick(cluster)}
                    >
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-sm flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: cluster.color }}
                            />
                            {cluster.name}
                          </CardTitle>
                          <Badge variant="outline" className="text-xs">
                            {cluster.items.length} items
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-xs text-muted-foreground mb-3">
                          {cluster.description}
                        </p>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">Strength</span>
                            <span className="font-medium">{Math.round(cluster.strength * 100)}%</span>
                          </div>
                          <Progress value={cluster.strength * 100} className="h-1" />
                        </div>
                        
                        <div className="mt-3">
                          <div className="text-xs text-muted-foreground mb-2">Keywords</div>
                          <div className="flex flex-wrap gap-1">
                            {cluster.keywords.slice(0, 3).map(keyword => (
                              <Badge key={keyword} variant="outline" className="text-xs">
                                {keyword}
                              </Badge>
                            ))}
                            {cluster.keywords.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{cluster.keywords.length - 3}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {viewMode === 'network' && (
            <div className="p-6 h-full overflow-y-auto">
              <div className="space-y-4">
                {filteredClusters.map((cluster, index) => (
                  <motion.div
                    key={cluster.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Card 
                      className={`cursor-pointer transition-all duration-200 ${
                        selectedCluster === cluster.id ? 'ring-2 ring-primary' : ''
                      }`}
                      onClick={() => handleClusterClick(cluster)}
                    >
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-4 h-4 rounded-full" 
                              style={{ backgroundColor: cluster.color }}
                            />
                            <div>
                              <CardTitle className="text-sm">{cluster.name}</CardTitle>
                              <p className="text-xs text-muted-foreground">{cluster.description}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {cluster.type}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {cluster.items.length} items
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <div className="text-xs text-muted-foreground">Strength</div>
                            <div className="text-lg font-semibold">{Math.round(cluster.strength * 100)}%</div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground">Connections</div>
                            <div className="text-lg font-semibold">{cluster.connections}</div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="text-xs text-muted-foreground">Top Items</div>
                          <div className="space-y-1">
                            {cluster.items.slice(0, 3).map(item => (
                              <div 
                                key={item.id}
                                className="flex items-center justify-between p-2 bg-muted/50 rounded-lg cursor-pointer hover:bg-muted transition-colors"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleContentClick(item);
                                }}
                              >
                                <span className="text-xs font-medium truncate">{item.title}</span>
                                <Badge variant="outline" className="text-xs ml-2">
                                  {item.type}
                                </Badge>
                              </div>
                            ))}
                            {cluster.items.length > 3 && (
                              <div className="text-xs text-muted-foreground text-center py-1">
                                +{cluster.items.length - 3} more items
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="w-80 border-l border-border bg-background/50 backdrop-blur-sm overflow-y-auto">
          <Tabs defaultValue="overview" className="h-full">
            <TabsList className="grid w-full grid-cols-2 m-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="insights">Insights</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="p-4 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Cluster Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Total Clusters</span>
                    <span className="text-sm font-medium">{clusters.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Avg. Items/Cluster</span>
                    <span className="text-sm font-medium">
                      {clusters.length > 0 ? Math.round(clusters.reduce((sum, c) => sum + c.items.length, 0) / clusters.length) : 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Strongest Cluster</span>
                    <span className="text-sm font-medium">
                      {clusters.length > 0 ? Math.round(Math.max(...clusters.map(c => c.strength)) * 100) : 0}%
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Cluster Types</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {['semantic', 'temporal', 'collaborative', 'hierarchical'].map(type => {
                      const count = clusters.filter(c => c.type === type).length;
                      return (
                        <div key={type} className="flex items-center justify-between">
                          <span className="text-sm capitalize">{type}</span>
                          <Badge variant="outline" className="text-xs">{count}</Badge>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="insights" className="p-4 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Brain className="w-4 h-4" />
                    AI Insights
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-800 dark:text-blue-200">Pattern Detected</span>
                    </div>
                    <p className="text-xs text-blue-700 dark:text-blue-300">
                      Tutorial content shows strong semantic clustering around "getting started" themes.
                    </p>
                  </div>

                  <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-green-800 dark:text-green-200">Recommendation</span>
                    </div>
                    <p className="text-xs text-green-700 dark:text-green-300">
                      Consider creating more collaborative content between documentation and tutorials.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="absolute top-16 right-4 w-80 bg-background/95 backdrop-blur-xl rounded-xl border border-border p-4 z-50"
          >
            <h3 className="font-semibold mb-4">Filters</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Content Types</label>
                <div className="mt-2 space-y-2">
                  {['story', 'component', 'folder', 'tutorial', 'guide', 'documentation', 'article'].map(type => (
                    <label key={type} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={filters.types.includes(type)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFilters(prev => ({
                              ...prev,
                              types: [...prev.types, type]
                            }));
                          } else {
                            setFilters(prev => ({
                              ...prev,
                              types: prev.types.filter(t => t !== type)
                            }));
                          }
                        }}
                      />
                      <span className="text-sm capitalize">{type}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">Minimum Items per Cluster</label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={filters.minItems}
                  onChange={(e) => setFilters(prev => ({
                    ...prev,
                    minItems: parseInt(e.target.value)
                  }))}
                  className="w-full mt-2"
                />
                <div className="text-xs text-muted-foreground mt-1">{filters.minItems} items</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ContentClusterMap;
