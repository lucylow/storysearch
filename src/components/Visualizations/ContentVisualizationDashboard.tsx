import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart3,
  Network,
  Layers,
  Brain,
  Eye,
  EyeOff,
  Maximize2,
  Minimize2,
  RotateCcw,
  Settings,
  Download,
  Share2,
  Filter,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  Grid,
  List,
  Zap,
  Target,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ContentRelationshipGraph from './ContentRelationshipGraph';
import ContentClusterMap from './ContentClusterMap';
import ContentRelationshipInsights from './ContentRelationshipInsights';
import type { SearchResult } from '../../services/storyblokService';

interface ContentVisualizationDashboardProps {
  content: SearchResult[];
  onContentSelect?: (content: SearchResult | null) => void;
  onClose?: () => void;
}

type VisualizationMode = 'graph' | 'clusters' | 'insights' | 'split';
type ViewMode = 'fullscreen' | 'sidebar' | 'modal';

const ContentVisualizationDashboard: React.FC<ContentVisualizationDashboardProps> = ({
  content,
  onContentSelect,
  onClose
}) => {
  const [mode, setMode] = useState<VisualizationMode>('graph');
  const [viewMode, setViewMode] = useState<ViewMode>('fullscreen');
  const [selectedContent, setSelectedContent] = useState<SearchResult | null>(null);
  const [selectedCluster, setSelectedCluster] = useState<string | null>(null);
  const [selectedInsight, setSelectedInsight] = useState<any>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const visualizationModes = [
    {
      id: 'graph' as const,
      name: 'Relationship Graph',
      description: 'Interactive network visualization of content relationships',
      icon: Network,
      color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/20'
    },
    {
      id: 'clusters' as const,
      name: 'Cluster Map',
      description: 'Content clustering and grouping visualization',
      icon: Layers,
      color: 'text-green-600 bg-green-100 dark:bg-green-900/20'
    },
    {
      id: 'insights' as const,
      name: 'AI Insights',
      description: 'AI-powered relationship analysis and recommendations',
      icon: Brain,
      color: 'text-purple-600 bg-purple-100 dark:bg-purple-900/20'
    },
    {
      id: 'split' as const,
      name: 'Split View',
      description: 'Combined graph and insights view',
      icon: BarChart3,
      color: 'text-orange-600 bg-orange-100 dark:bg-orange-900/20'
    }
  ];

  const handleContentSelect = (content: SearchResult | null) => {
    setSelectedContent(content);
    onContentSelect?.(content);
  };

  const handleClusterSelect = (cluster: any) => {
    setSelectedCluster(cluster?.id || null);
  };

  const handleInsightSelect = (insight: any) => {
    setSelectedInsight(insight);
  };

  const handleApplyRecommendation = (insight: any) => {
    // Handle applying recommendations
    console.log('Applying recommendation:', insight);
  };

  const renderVisualization = () => {
    switch (mode) {
      case 'graph':
        return (
          <ContentRelationshipGraph
            content={content}
            selectedContent={selectedContent}
            onContentSelect={handleContentSelect}
          />
        );
      case 'clusters':
        return (
          <ContentClusterMap
            content={content}
            selectedCluster={selectedCluster}
            selectedContent={selectedContent}
            onClusterSelect={handleClusterSelect}
            onContentSelect={handleContentSelect}
          />
        );
      case 'insights':
        return (
          <ContentRelationshipInsights
            content={content}
            selectedContent={selectedContent}
            onInsightSelect={handleInsightSelect}
            onApplyRecommendation={handleApplyRecommendation}
          />
        );
      case 'split':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full">
            <div className="h-full">
              <ContentRelationshipGraph
                content={content}
                selectedContent={selectedContent}
                onContentSelect={handleContentSelect}
              />
            </div>
            <div className="h-full">
              <ContentRelationshipInsights
                content={content}
                selectedContent={selectedContent}
                onInsightSelect={handleInsightSelect}
                onApplyRecommendation={handleApplyRecommendation}
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const getCurrentModeInfo = () => {
    return visualizationModes.find(m => m.id === mode);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`fixed inset-0 z-50 bg-background/95 backdrop-blur-xl ${
        viewMode === 'modal' ? 'p-4' : ''
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${getCurrentModeInfo()?.color}`}>
              {getCurrentModeInfo()?.icon && React.createElement(getCurrentModeInfo()!.icon, { className: "w-6 h-6" })}
            </div>
            <div>
              <h1 className="text-xl font-semibold">Content Visualization Dashboard</h1>
              <p className="text-sm text-muted-foreground">
                {getCurrentModeInfo()?.description}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Mode Selector */}
          <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
            {visualizationModes.map((modeInfo) => {
              const Icon = modeInfo.icon;
              return (
                <Button
                  key={modeInfo.id}
                  variant={mode === modeInfo.id ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setMode(modeInfo.id)}
                  className="flex items-center gap-2"
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{modeInfo.name}</span>
                </Button>
              );
            })}
          </div>

          {/* View Controls */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode(viewMode === 'fullscreen' ? 'sidebar' : 'fullscreen')}
            >
              {viewMode === 'fullscreen' ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-4 h-4" />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSettings(!showSettings)}
            >
              <Settings className="w-4 h-4" />
            </Button>
            
            {onClose && (
              <Button
                variant="outline"
                size="sm"
                onClick={onClose}
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`${viewMode === 'fullscreen' ? 'h-[calc(100vh-80px)]' : 'h-[calc(100vh-160px)]'} overflow-hidden`}>
        {viewMode === 'sidebar' ? (
          <div className="flex h-full">
            {/* Sidebar */}
            <div className="w-80 border-r border-border bg-background/50 backdrop-blur-sm overflow-y-auto">
              <div className="p-4 space-y-4">
                {/* Content Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Content Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Total Items</span>
                      <span className="text-sm font-medium">{content.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Content Types</span>
                      <span className="text-sm font-medium">
                        {Array.from(new Set(content.map(c => c.type))).length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Avg. Tags</span>
                      <span className="text-sm font-medium">
                        {content.length > 0 ? Math.round(content.reduce((sum, c) => sum + c.tags.length, 0) / content.length) : 0}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                {/* Selected Content */}
                {selectedContent && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Selected Content</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">{selectedContent.title}</h4>
                        <Badge variant="outline" className="text-xs">
                          {selectedContent.type}
                        </Badge>
                        <p className="text-xs text-muted-foreground">
                          {selectedContent.content.substring(0, 100)}...
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Selected Insight */}
                {selectedInsight && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Selected Insight</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">{selectedInsight.title}</h4>
                        <Badge variant="outline" className="text-xs">
                          {selectedInsight.type}
                        </Badge>
                        <p className="text-xs text-muted-foreground">
                          {selectedInsight.description}
                        </p>
                        <div className="flex justify-between">
                          <span className="text-xs text-muted-foreground">Confidence</span>
                          <span className="text-xs font-medium">
                            {Math.round(selectedInsight.confidence * 100)}%
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            {/* Main Visualization */}
            <div className="flex-1">
              {renderVisualization()}
            </div>
          </div>
        ) : (
          renderVisualization()
        )}
      </div>

      {/* Quick Actions Bar */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
        <div className="flex items-center gap-2 bg-background/90 backdrop-blur-sm rounded-full px-4 py-2 border border-border shadow-lg">
          <Button variant="ghost" size="sm">
            <Download className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Share2 className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <RotateCcw className="w-4 h-4" />
          </Button>
          <div className="w-px h-4 bg-border mx-2" />
          <Button variant="ghost" size="sm">
            <Eye className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Zap className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="absolute top-20 right-4 w-80 bg-background/95 backdrop-blur-xl rounded-xl border border-border p-4 z-50"
          >
            <h3 className="font-semibold mb-4">Filters</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Content Types</label>
                <div className="mt-2 space-y-2">
                  {Array.from(new Set(content.map(c => c.type))).map(type => (
                    <label key={type} className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked />
                      <span className="text-sm capitalize">{type}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">Date Range</label>
                <select className="w-full mt-2 p-2 border border-border rounded-lg bg-background">
                  <option value="all">All Time</option>
                  <option value="week">Last Week</option>
                  <option value="month">Last Month</option>
                  <option value="year">Last Year</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="absolute top-20 right-4 w-80 bg-background/95 backdrop-blur-xl rounded-xl border border-border p-4 z-50"
          >
            <h3 className="font-semibold mb-4">Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Visualization Quality</label>
                <select className="w-full mt-2 p-2 border border-border rounded-lg bg-background">
                  <option value="high">High Quality</option>
                  <option value="medium">Medium Quality</option>
                  <option value="low">Low Quality</option>
                </select>
              </div>
              
              <div>
                <label className="text-sm font-medium">Animation Speed</label>
                <input
                  type="range"
                  min="0.1"
                  max="2"
                  step="0.1"
                  defaultValue="1"
                  className="w-full mt-2"
                />
              </div>
              
              <div>
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked />
                  <span className="text-sm">Show Labels</span>
                </label>
              </div>
              
              <div>
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked />
                  <span className="text-sm">Enable Animations</span>
                </label>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ContentVisualizationDashboard;
