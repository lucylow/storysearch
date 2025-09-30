import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Network,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Filter,
  Settings,
  Eye,
  EyeOff,
  Layers,
  GitBranch,
  Link,
  Target,
  Sparkles,
  TrendingUp,
  Users,
  Calendar,
  Tag,
  BookOpen,
  Search,
  X
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { SearchResult } from '../../services/storyblokService';

interface ContentNode {
  id: string;
  title: string;
  type: string;
  x: number;
  y: number;
  size: number;
  color: string;
  data: SearchResult;
  connections: number;
  centrality: number;
  cluster: number;
}

interface ContentEdge {
  id: string;
  source: string;
  target: string;
  strength: number;
  type: 'semantic' | 'temporal' | 'collaborative' | 'hierarchical';
  color: string;
}

interface ContentCluster {
  id: number;
  name: string;
  color: string;
  nodes: string[];
  description: string;
  keywords: string[];
}

interface ContentRelationshipGraphProps {
  content: SearchResult[];
  selectedContent?: SearchResult | null;
  onContentSelect?: (content: SearchResult | null) => void;
  onClose?: () => void;
}

const ContentRelationshipGraph: React.FC<ContentRelationshipGraphProps> = ({
  content,
  selectedContent,
  onContentSelect,
  onClose
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Graph state
  const [nodes, setNodes] = useState<ContentNode[]>([]);
  const [edges, setEdges] = useState<ContentEdge[]>([]);
  const [clusters, setClusters] = useState<ContentCluster[]>([]);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  
  // View state
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [viewMode, setViewMode] = useState<'network' | 'cluster' | 'timeline'>('network');
  const [showFilters, setShowFilters] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  // Filter state
  const [nodeFilters, setNodeFilters] = useState({
    types: [] as string[],
    dateRange: 'all',
    minConnections: 0,
    showClusters: true
  });

  // Color schemes
  const nodeColors = {
    story: '#3B82F6',
    component: '#10B981',
    folder: '#8B5CF6',
    tutorial: '#F59E0B',
    guide: '#6366F1',
    documentation: '#14B8A6',
    article: '#EC4899'
  };

  const edgeColors = {
    semantic: '#3B82F6',
    temporal: '#10B981',
    collaborative: '#F59E0B',
    hierarchical: '#8B5CF6'
  };

  // Generate content relationships
  const generateRelationships = useCallback(() => {
    if (!content.length) return;

    // Create nodes
    const newNodes: ContentNode[] = content.map((item, index) => {
      const connections = Math.floor(Math.random() * 8) + 1;
      const centrality = Math.random();
      
      return {
        id: item.id,
        title: item.title,
        type: item.type,
        x: Math.random() * 800 + 100,
        y: Math.random() * 600 + 100,
        size: Math.max(20, Math.min(60, connections * 5 + 20)),
        color: nodeColors[item.type as keyof typeof nodeColors] || '#6B7280',
        data: item,
        connections,
        centrality,
        cluster: Math.floor(Math.random() * 4) + 1
      };
    });

    // Create edges based on relationships
    const newEdges: ContentEdge[] = [];
    newNodes.forEach((node, i) => {
      newNodes.slice(i + 1).forEach((otherNode, j) => {
        // Semantic similarity (shared tags)
        const sharedTags = node.data.tags.filter(tag => otherNode.data.tags.includes(tag));
        if (sharedTags.length > 0) {
          newEdges.push({
            id: `${node.id}-${otherNode.id}-semantic`,
            source: node.id,
            target: otherNode.id,
            strength: sharedTags.length / Math.max(node.data.tags.length, otherNode.data.tags.length),
            type: 'semantic',
            color: edgeColors.semantic
          });
        }

        // Temporal relationships (similar creation dates)
        const dateDiff = Math.abs(
          new Date(node.data.createdAt).getTime() - new Date(otherNode.data.createdAt).getTime()
        );
        if (dateDiff < 30 * 24 * 60 * 60 * 1000) { // Within 30 days
          newEdges.push({
            id: `${node.id}-${otherNode.id}-temporal`,
            source: node.id,
            target: otherNode.id,
            strength: Math.max(0.1, 1 - dateDiff / (30 * 24 * 60 * 60 * 1000)),
            type: 'temporal',
            color: edgeColors.temporal
          });
        }

        // Collaborative relationships (random for demo)
        if (Math.random() < 0.3) {
          newEdges.push({
            id: `${node.id}-${otherNode.id}-collaborative`,
            source: node.id,
            target: otherNode.id,
            strength: Math.random() * 0.5 + 0.3,
            type: 'collaborative',
            color: edgeColors.collaborative
          });
        }
      });
    });

    // Generate clusters
    const newClusters: ContentCluster[] = [
      {
        id: 1,
        name: 'Tutorials & Guides',
        color: '#F59E0B',
        nodes: newNodes.filter(n => ['tutorial', 'guide'].includes(n.type)).map(n => n.id),
        description: 'Educational content and step-by-step guides',
        keywords: ['tutorial', 'guide', 'learning', 'education']
      },
      {
        id: 2,
        name: 'Technical Documentation',
        color: '#14B8A6',
        nodes: newNodes.filter(n => n.type === 'documentation').map(n => n.id),
        description: 'Technical references and API documentation',
        keywords: ['documentation', 'api', 'reference', 'technical']
      },
      {
        id: 3,
        name: 'Content Stories',
        color: '#3B82F6',
        nodes: newNodes.filter(n => ['story', 'article'].includes(n.type)).map(n => n.id),
        description: 'Main content pieces and articles',
        keywords: ['story', 'article', 'content', 'blog']
      },
      {
        id: 4,
        name: 'Components & Structure',
        color: '#8B5CF6',
        nodes: newNodes.filter(n => ['component', 'folder'].includes(n.type)).map(n => n.id),
        description: 'Reusable components and content structure',
        keywords: ['component', 'folder', 'structure', 'reusable']
      }
    ];

    setNodes(newNodes);
    setEdges(newEdges);
    setClusters(newClusters);
  }, [content]);

  useEffect(() => {
    generateRelationships();
  }, [generateRelationships]);

  // Handle node click
  const handleNodeClick = (nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId);
    if (node) {
      setSelectedNode(nodeId);
      onContentSelect?.(node.data);
    }
  };

  // Handle zoom and pan
  const handleZoom = (delta: number) => {
    setZoom(prev => Math.max(0.1, Math.min(3, prev + delta)));
  };

  const handlePan = (deltaX: number, deltaY: number) => {
    setPan(prev => ({
      x: prev.x + deltaX,
      y: prev.y + deltaY
    }));
  };

  // Filter nodes based on current filters
  const filteredNodes = nodes.filter(node => {
    if (nodeFilters.types.length > 0 && !nodeFilters.types.includes(node.type)) {
      return false;
    }
    if (node.connections < nodeFilters.minConnections) {
      return false;
    }
    return true;
  });

  const filteredEdges = edges.filter(edge => {
    return filteredNodes.some(n => n.id === edge.source) && 
           filteredNodes.some(n => n.id === edge.target);
  });

  return (
    <div className="w-full h-full bg-background/95 backdrop-blur-xl rounded-xl border border-border overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <Network className="w-6 h-6 text-primary" />
          <div>
            <h2 className="text-lg font-semibold">Content Relationship Graph</h2>
            <p className="text-sm text-muted-foreground">
              {filteredNodes.length} nodes, {filteredEdges.length} connections
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
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

      <div className="flex h-[calc(100vh-120px)]">
        {/* Main Graph Area */}
        <div className="flex-1 relative">
          <div
            ref={containerRef}
            className="w-full h-full relative overflow-hidden cursor-grab active:cursor-grabbing"
            onWheel={(e) => handleZoom(e.deltaY > 0 ? -0.1 : 0.1)}
          >
            <svg
              ref={svgRef}
              width="100%"
              height="100%"
              className="absolute inset-0"
              style={{
                transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                transformOrigin: 'center center'
              }}
            >
              {/* Grid */}
              <defs>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />

              {/* Edges */}
              {filteredEdges.map(edge => {
                const sourceNode = filteredNodes.find(n => n.id === edge.source);
                const targetNode = filteredNodes.find(n => n.id === edge.target);
                if (!sourceNode || !targetNode) return null;

                return (
                  <motion.line
                    key={edge.id}
                    x1={sourceNode.x}
                    y1={sourceNode.y}
                    x2={targetNode.x}
                    y2={targetNode.y}
                    stroke={edge.color}
                    strokeWidth={edge.strength * 3}
                    opacity={0.6}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5 }}
                  />
                );
              })}

              {/* Nodes */}
              {filteredNodes.map(node => (
                <motion.g
                  key={node.id}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3, delay: Math.random() * 0.5 }}
                >
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={node.size}
                    fill={node.color}
                    stroke={selectedNode === node.id ? '#FFFFFF' : 'transparent'}
                    strokeWidth={selectedNode === node.id ? 3 : 0}
                    className="cursor-pointer transition-all duration-200 hover:scale-110"
                    onClick={() => handleNodeClick(node.id)}
                    onMouseEnter={() => setHoveredNode(node.id)}
                    onMouseLeave={() => setHoveredNode(null)}
                  />
                  
                  {/* Node label */}
                  <text
                    x={node.x}
                    y={node.y + node.size + 15}
                    textAnchor="middle"
                    className="text-xs fill-current pointer-events-none"
                    style={{ fontSize: '10px' }}
                  >
                    {node.title.length > 15 ? node.title.substring(0, 15) + '...' : node.title}
                  </text>
                </motion.g>
              ))}
            </svg>

            {/* Zoom Controls */}
            <div className="absolute top-4 right-4 flex flex-col gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleZoom(0.1)}
                className="w-8 h-8 p-0"
              >
                <ZoomIn className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleZoom(-0.1)}
                className="w-8 h-8 p-0"
              >
                <ZoomOut className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}
                className="w-8 h-8 p-0"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-80 border-l border-border bg-background/50 backdrop-blur-sm overflow-y-auto">
          <Tabs defaultValue="overview" className="h-full">
            <TabsList className="grid w-full grid-cols-3 m-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="clusters">Clusters</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="p-4 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Graph Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Total Nodes</span>
                    <span className="text-sm font-medium">{nodes.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Total Edges</span>
                    <span className="text-sm font-medium">{edges.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Clusters</span>
                    <span className="text-sm font-medium">{clusters.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Avg. Connections</span>
                    <span className="text-sm font-medium">
                      {nodes.length > 0 ? Math.round(nodes.reduce((sum, n) => sum + n.connections, 0) / nodes.length) : 0}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Content Types</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {Object.entries(nodeColors).map(([type, color]) => {
                      const count = nodes.filter(n => n.type === type).length;
                      return (
                        <div key={type} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                            <span className="text-sm capitalize">{type}</span>
                          </div>
                          <span className="text-sm text-muted-foreground">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="clusters" className="p-4 space-y-4">
              {clusters.map(cluster => (
                <Card key={cluster.id}>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cluster.color }} />
                      <CardTitle className="text-sm">{cluster.name}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground mb-3">{cluster.description}</p>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-xs text-muted-foreground">Nodes</span>
                        <span className="text-xs font-medium">{cluster.nodes.length}</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {cluster.keywords.map(keyword => (
                          <Badge key={keyword} variant="outline" className="text-xs">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="details" className="p-4 space-y-4">
              {selectedNode && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Selected Content</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium text-sm">{nodes.find(n => n.id === selectedNode)?.title}</h4>
                        <p className="text-xs text-muted-foreground">
                          {nodes.find(n => n.id === selectedNode)?.type}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-xs text-muted-foreground">Connections</span>
                          <span className="text-xs font-medium">
                            {nodes.find(n => n.id === selectedNode)?.connections}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-xs text-muted-foreground">Centrality</span>
                          <span className="text-xs font-medium">
                            {Math.round((nodes.find(n => n.id === selectedNode)?.centrality || 0) * 100)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Legend</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h5 className="text-xs font-medium mb-2">Edge Types</h5>
                      <div className="space-y-1">
                        {Object.entries(edgeColors).map(([type, color]) => (
                          <div key={type} className="flex items-center gap-2">
                            <div className="w-4 h-0.5" style={{ backgroundColor: color }} />
                            <span className="text-xs capitalize">{type}</span>
                          </div>
                        ))}
                      </div>
                    </div>
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
                  {Object.keys(nodeColors).map(type => (
                    <label key={type} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={nodeFilters.types.includes(type)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNodeFilters(prev => ({
                              ...prev,
                              types: [...prev.types, type]
                            }));
                          } else {
                            setNodeFilters(prev => ({
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ContentRelationshipGraph;
