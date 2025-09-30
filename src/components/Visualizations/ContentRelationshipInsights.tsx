import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain,
  Sparkles,
  TrendingUp,
  Target,
  Lightbulb,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  Network,
  Link2,
  Users,
  Calendar,
  Tag,
  BarChart3,
  PieChart,
  Activity,
  Zap,
  Eye,
  Filter,
  Download,
  Share2,
  BookOpen,
  GitBranch,
  Layers,
  Globe
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';
import type { SearchResult } from '../../services/storyblokService';

interface RelationshipInsight {
  id: string;
  type: 'pattern' | 'anomaly' | 'recommendation' | 'trend' | 'optimization';
  title: string;
  description: string;
  confidence: number;
  impact: 'low' | 'medium' | 'high';
  actionable: boolean;
  category: string;
  relatedContent: string[];
  metrics: {
    before?: number;
    after?: number;
    improvement?: number;
  };
  visualization?: {
    type: 'chart' | 'graph' | 'heatmap';
    data: any[];
  };
}

interface ContentRelationshipInsightsProps {
  content: SearchResult[];
  selectedContent?: SearchResult | null;
  onInsightSelect?: (insight: RelationshipInsight) => void;
  onApplyRecommendation?: (insight: RelationshipInsight) => void;
}

const ContentRelationshipInsights: React.FC<ContentRelationshipInsightsProps> = ({
  content,
  selectedContent,
  onInsightSelect,
  onApplyRecommendation
}) => {
  const [insights, setInsights] = useState<RelationshipInsight[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedInsight, setSelectedInsight] = useState<RelationshipInsight | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'pattern' | 'anomaly' | 'recommendation' | 'trend' | 'optimization'>('all');
  const [showDetails, setShowDetails] = useState(false);

  // Generate AI-powered insights
  const generateInsights = async () => {
    setLoading(true);
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const generatedInsights: RelationshipInsight[] = [
      {
        id: 'insight-1',
        type: 'pattern',
        title: 'Strong Semantic Clustering in Tutorial Content',
        description: 'Tutorial content shows significant clustering around "getting started" and "setup" themes, indicating cohesive educational pathways.',
        confidence: 0.87,
        impact: 'high',
        actionable: true,
        category: 'Content Organization',
        relatedContent: content.filter(c => c.type === 'tutorial').map(c => c.id),
        metrics: {
          before: 65,
          after: 87,
          improvement: 22
        },
        visualization: {
          type: 'chart',
          data: [
            { name: 'Getting Started', value: 45, color: '#3B82F6' },
            { name: 'Setup', value: 32, color: '#10B981' },
            { name: 'Configuration', value: 23, color: '#F59E0B' }
          ]
        }
      },
      {
        id: 'insight-2',
        type: 'recommendation',
        title: 'Cross-Reference Documentation Gaps',
        description: 'Several tutorial pieces lack proper documentation references. Adding cross-links could improve content discoverability by 34%.',
        confidence: 0.92,
        impact: 'medium',
        actionable: true,
        category: 'Content Linking',
        relatedContent: content.filter(c => c.type === 'tutorial' || c.type === 'documentation').map(c => c.id),
        metrics: {
          before: 23,
          after: 57,
          improvement: 34
        }
      },
      {
        id: 'insight-3',
        type: 'trend',
        title: 'Increasing Collaborative Content Creation',
        description: 'Content created in the last 30 days shows 40% more cross-team collaboration, indicating improved content strategy.',
        confidence: 0.78,
        impact: 'high',
        actionable: false,
        category: 'Collaboration',
        relatedContent: content.filter((_, index) => index % 3 === 0).map(c => c.id),
        metrics: {
          before: 35,
          after: 49,
          improvement: 14
        },
        visualization: {
          type: 'chart',
          data: [
            { month: 'Jan', collaboration: 35 },
            { month: 'Feb', collaboration: 42 },
            { month: 'Mar', collaboration: 38 },
            { month: 'Apr', collaboration: 49 }
          ]
        }
      },
      {
        id: 'insight-4',
        type: 'optimization',
        title: 'Content Type Distribution Optimization',
        description: 'Current content distribution shows 60% tutorials vs 25% documentation. Optimizing this ratio could improve user experience.',
        confidence: 0.85,
        impact: 'medium',
        actionable: true,
        category: 'Content Strategy',
        relatedContent: content.map(c => c.id),
        metrics: {
          before: 60,
          after: 45,
          improvement: -15
        },
        visualization: {
          type: 'chart',
          data: [
            { type: 'Tutorials', current: 60, optimal: 45 },
            { type: 'Documentation', current: 25, optimal: 35 },
            { type: 'Guides', current: 15, optimal: 20 }
          ]
        }
      },
      {
        id: 'insight-5',
        type: 'anomaly',
        title: 'Isolated Component Documentation',
        description: 'Component documentation shows 23% fewer cross-references compared to other content types, potentially limiting discoverability.',
        confidence: 0.73,
        impact: 'low',
        actionable: true,
        category: 'Content Discovery',
        relatedContent: content.filter(c => c.type === 'component').map(c => c.id),
        metrics: {
          before: 45,
          after: 22,
          improvement: -23
        }
      }
    ];
    
    setInsights(generatedInsights);
    setLoading(false);
  };

  useEffect(() => {
    generateInsights();
  }, [content]);

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'pattern': return <Network className="w-4 h-4" />;
      case 'anomaly': return <AlertTriangle className="w-4 h-4" />;
      case 'recommendation': return <Lightbulb className="w-4 h-4" />;
      case 'trend': return <TrendingUp className="w-4 h-4" />;
      case 'optimization': return <Target className="w-4 h-4" />;
      default: return <Brain className="w-4 h-4" />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'pattern': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20';
      case 'anomaly': return 'text-orange-600 bg-orange-100 dark:bg-orange-900/20';
      case 'recommendation': return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      case 'trend': return 'text-purple-600 bg-purple-100 dark:bg-purple-900/20';
      case 'optimization': return 'text-indigo-600 bg-indigo-100 dark:bg-indigo-900/20';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-600 bg-red-100 dark:bg-red-900/20';
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
      case 'low': return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  const filteredInsights = insights.filter(insight => 
    filterType === 'all' || insight.type === filterType
  );

  const handleInsightClick = (insight: RelationshipInsight) => {
    setSelectedInsight(insight);
    onInsightSelect?.(insight);
  };

  const handleApplyRecommendation = (insight: RelationshipInsight) => {
    onApplyRecommendation?.(insight);
    // Show success feedback
  };

  return (
    <div className="w-full h-full bg-background/95 backdrop-blur-xl rounded-xl border border-border overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <Brain className="w-6 h-6 text-primary" />
          <div>
            <h2 className="text-lg font-semibold">Content Relationship Insights</h2>
            <p className="text-sm text-muted-foreground">
              AI-powered analysis of content relationships and patterns
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={generateInsights}
            disabled={loading}
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            {loading ? 'Analyzing...' : 'Refresh'}
          </Button>
        </div>
      </div>

      <div className="flex h-[calc(100vh-120px)]">
        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            {/* Filter Tabs */}
            <div className="flex items-center gap-2 mb-6">
              <TabsList>
                <TabsTrigger value="all" onClick={() => setFilterType('all')}>
                  All ({insights.length})
                </TabsTrigger>
                <TabsTrigger value="patterns" onClick={() => setFilterType('pattern')}>
                  Patterns ({insights.filter(i => i.type === 'pattern').length})
                </TabsTrigger>
                <TabsTrigger value="recommendations" onClick={() => setFilterType('recommendation')}>
                  Recommendations ({insights.filter(i => i.type === 'recommendation').length})
                </TabsTrigger>
                <TabsTrigger value="trends" onClick={() => setFilterType('trend')}>
                  Trends ({insights.filter(i => i.type === 'trend').length})
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Insights Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredInsights.map((insight, index) => (
                <motion.div
                  key={insight.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card 
                    className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                      selectedInsight?.id === insight.id ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => handleInsightClick(insight)}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${getInsightColor(insight.type)}`}>
                            {getInsightIcon(insight.type)}
                          </div>
                          <div>
                            <CardTitle className="text-sm">{insight.title}</CardTitle>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {insight.category}
                              </Badge>
                              <Badge 
                                variant="outline" 
                                className={`text-xs ${getImpactColor(insight.impact)}`}
                              >
                                {insight.impact} impact
                              </Badge>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <div className="text-right">
                            <div className="text-sm font-medium">
                              {Math.round(insight.confidence * 100)}%
                            </div>
                            <div className="text-xs text-muted-foreground">confidence</div>
                          </div>
                          {insight.actionable && (
                            <Button
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleApplyRecommendation(insight);
                              }}
                            >
                              Apply
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        {insight.description}
                      </p>
                      
                      {/* Metrics */}
                      {insight.metrics && (
                        <div className="grid grid-cols-3 gap-4 mb-4">
                          <div className="text-center">
                            <div className="text-xs text-muted-foreground">Before</div>
                            <div className="text-lg font-semibold">{insight.metrics.before}%</div>
                          </div>
                          <div className="text-center">
                            <div className="text-xs text-muted-foreground">After</div>
                            <div className="text-lg font-semibold">{insight.metrics.after}%</div>
                          </div>
                          <div className="text-center">
                            <div className="text-xs text-muted-foreground">Change</div>
                            <div className={`text-lg font-semibold ${
                              (insight.metrics.improvement || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {(insight.metrics.improvement || 0) >= 0 ? '+' : ''}{insight.metrics.improvement}%
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* Visualization Preview */}
                      {insight.visualization && (
                        <div className="h-32 bg-muted/50 rounded-lg p-2">
                          {insight.visualization.type === 'chart' && (
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={insight.visualization.data}>
                                <Bar dataKey="value" fill="#3B82F6" />
                              </BarChart>
                            </ResponsiveContainer>
                          )}
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between mt-4">
                        <div className="text-xs text-muted-foreground">
                          {insight.relatedContent.length} related items
                        </div>
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4 mr-1" />
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-80 border-l border-border bg-background/50 backdrop-blur-sm overflow-y-auto">
          <Tabs defaultValue="summary" className="h-full">
            <TabsList className="grid w-full grid-cols-2 m-4">
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="summary" className="p-4 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Insight Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Total Insights</span>
                    <span className="text-sm font-medium">{insights.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Actionable</span>
                    <span className="text-sm font-medium">
                      {insights.filter(i => i.actionable).length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">High Impact</span>
                    <span className="text-sm font-medium">
                      {insights.filter(i => i.impact === 'high').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Avg. Confidence</span>
                    <span className="text-sm font-medium">
                      {insights.length > 0 ? Math.round(insights.reduce((sum, i) => sum + i.confidence, 0) / insights.length * 100) : 0}%
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Insight Types</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {['pattern', 'recommendation', 'trend', 'optimization', 'anomaly'].map(type => {
                      const count = insights.filter(i => i.type === type).length;
                      return (
                        <div key={type} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`p-1 rounded ${getInsightColor(type)}`}>
                              {getInsightIcon(type)}
                            </div>
                            <span className="text-sm capitalize">{type}</span>
                          </div>
                          <Badge variant="outline" className="text-xs">{count}</Badge>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="p-4 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Confidence Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-32">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={[
                        { range: '90-100%', count: insights.filter(i => i.confidence >= 0.9).length },
                        { range: '80-89%', count: insights.filter(i => i.confidence >= 0.8 && i.confidence < 0.9).length },
                        { range: '70-79%', count: insights.filter(i => i.confidence >= 0.7 && i.confidence < 0.8).length },
                        { range: '60-69%', count: insights.filter(i => i.confidence >= 0.6 && i.confidence < 0.7).length }
                      ]}>
                        <Bar dataKey="count" fill="#3B82F6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Impact Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>High Impact</span>
                        <span>{insights.filter(i => i.impact === 'high').length}</span>
                      </div>
                      <Progress value={(insights.filter(i => i.impact === 'high').length / insights.length) * 100} className="h-1" />
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Medium Impact</span>
                        <span>{insights.filter(i => i.impact === 'medium').length}</span>
                      </div>
                      <Progress value={(insights.filter(i => i.impact === 'medium').length / insights.length) * 100} className="h-1" />
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Low Impact</span>
                        <span>{insights.filter(i => i.impact === 'low').length}</span>
                      </div>
                      <Progress value={(insights.filter(i => i.impact === 'low').length / insights.length) * 100} className="h-1" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ContentRelationshipInsights;
