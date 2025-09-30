import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  TrendingUp, 
  Lightbulb, 
  Target, 
  AlertTriangle,
  CheckCircle,
  Info,
  ArrowRight,
  Filter,
  RefreshCw,
  Eye,
  Brain,
  Zap,
  BarChart3
} from 'lucide-react';
import { aiAgentService, type DiscoveryInsight } from '@/services/aiAgentService';

interface DiscoveryDashboardProps {
  className?: string;
}

const DiscoveryDashboard: React.FC<DiscoveryDashboardProps> = ({ className }) => {
  const [query, setQuery] = useState('');
  const [insights, setInsights] = useState<DiscoveryInsight[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedInsight, setSelectedInsight] = useState<DiscoveryInsight | null>(null);

  const handleDiscover = async () => {
    if (!query.trim()) return;

    try {
      setIsLoading(true);
      const discoveryResults = await aiAgentService.discoverContent(query);
      setInsights(discoveryResults);
    } catch (error) {
      console.error('Discovery failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'pattern': return <BarChart3 className="h-5 w-5" />;
      case 'trend': return <TrendingUp className="h-5 w-5" />;
      case 'gap': return <Target className="h-5 w-5" />;
      case 'opportunity': return <Lightbulb className="h-5 w-5" />;
      case 'anomaly': return <AlertTriangle className="h-5 w-5" />;
      default: return <Info className="h-5 w-5" />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'pattern': return 'text-blue-600 bg-blue-100';
      case 'trend': return 'text-green-600 bg-green-100';
      case 'gap': return 'text-orange-600 bg-orange-100';
      case 'opportunity': return 'text-purple-600 bg-purple-100';
      case 'anomaly': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const groupedInsights = insights.reduce((acc, insight) => {
    if (!acc[insight.type]) {
      acc[insight.type] = [];
    }
    acc[insight.type].push(insight);
    return acc;
  }, {} as Record<string, DiscoveryInsight[]>);

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Content Discovery</h1>
          <p className="text-muted-foreground">
            AI-powered content exploration and insight generation
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Search Interface */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="h-5 w-5" />
            <span>Discovery Query</span>
          </CardTitle>
          <CardDescription>
            Enter a topic or query to discover insights, patterns, and opportunities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g., headless CMS trends, content optimization, API performance..."
              className="flex-1"
              onKeyPress={(e) => e.key === 'Enter' && handleDiscover()}
            />
            <Button onClick={handleDiscover} disabled={isLoading || !query.trim()}>
              {isLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Discovering...
                </>
              ) : (
                <>
                  <Brain className="h-4 w-4 mr-2" />
                  Discover
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Insights Display */}
      {insights.length > 0 && (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="patterns">Patterns</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="gaps">Gaps</TabsTrigger>
            <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Insights</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{insights.length}</div>
                  <p className="text-xs text-muted-foreground">
                    Discovered insights
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">High Impact</CardTitle>
                  <Zap className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {insights.filter(i => i.impact === 'high').length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    High impact insights
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg Confidence</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {Math.round(insights.reduce((acc, i) => acc + i.confidence, 0) / insights.length * 100)}%
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Average confidence
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Categories</CardTitle>
                  <Eye className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {new Set(insights.map(i => i.category)).size}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Unique categories
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Discovery Summary</CardTitle>
                <CardDescription>
                  Key insights discovered for "{query}"
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(groupedInsights).map(([type, typeInsights]) => (
                    <div key={type} className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <div className={`p-2 rounded-full ${getInsightColor(type)}`}>
                          {getInsightIcon(type)}
                        </div>
                        <h4 className="font-medium capitalize">{type}s</h4>
                        <Badge variant="outline">{typeInsights.length}</Badge>
                      </div>
                      <div className="space-y-1">
                        {typeInsights.slice(0, 2).map(insight => (
                          <div key={insight.id} className="text-sm text-muted-foreground">
                            • {insight.title}
                          </div>
                        ))}
                        {typeInsights.length > 2 && (
                          <div className="text-sm text-muted-foreground">
                            • +{typeInsights.length - 2} more...
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {Object.entries(groupedInsights).map(([type, typeInsights]) => (
            <TabsContent key={type} value={type} className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                {typeInsights.map(insight => (
                  <Card key={insight.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-full ${getInsightColor(insight.type)}`}>
                            {getInsightIcon(insight.type)}
                          </div>
                          <div>
                            <CardTitle className="text-lg">{insight.title}</CardTitle>
                            <CardDescription>{insight.description}</CardDescription>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getImpactColor(insight.impact)}>
                            {insight.impact} impact
                          </Badge>
                          <Badge variant="outline" className={getConfidenceColor(insight.confidence)}>
                            {Math.round(insight.confidence * 100)}% confidence
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Evidence:</h4>
                        <ul className="space-y-1">
                          {insight.evidence.map((evidence, index) => (
                            <li key={index} className="flex items-start space-x-2 text-sm">
                              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                              <span>{evidence}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">Recommendations:</h4>
                        <ul className="space-y-1">
                          {insight.recommendations.map((recommendation, index) => (
                            <li key={index} className="flex items-start space-x-2 text-sm">
                              <ArrowRight className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                              <span>{recommendation}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">{insight.category}</Badge>
                          <div className="flex space-x-1">
                            {insight.tags.slice(0, 3).map(tag => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setSelectedInsight(insight)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      )}

      {/* Insight Detail Modal */}
      {selectedInsight && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${getInsightColor(selectedInsight.type)}`}>
                    {getInsightIcon(selectedInsight.type)}
                  </div>
                  <div>
                    <CardTitle>{selectedInsight.title}</CardTitle>
                    <CardDescription>{selectedInsight.description}</CardDescription>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setSelectedInsight(null)}
                >
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-4">
                <Badge className={getImpactColor(selectedInsight.impact)}>
                  {selectedInsight.impact} impact
                </Badge>
                <Badge variant="outline" className={getConfidenceColor(selectedInsight.confidence)}>
                  {Math.round(selectedInsight.confidence * 100)}% confidence
                </Badge>
                <Badge variant="outline">{selectedInsight.category}</Badge>
              </div>

              <div>
                <h4 className="font-medium mb-3">Evidence:</h4>
                <ul className="space-y-2">
                  {selectedInsight.evidence.map((evidence, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                      <span className="text-sm">{evidence}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-3">Recommendations:</h4>
                <ul className="space-y-2">
                  {selectedInsight.recommendations.map((recommendation, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <ArrowRight className="h-4 w-4 text-blue-600 mt-1 flex-shrink-0" />
                      <span className="text-sm">{recommendation}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-3">Tags:</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedInsight.tags.map(tag => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="text-xs text-muted-foreground">
                Discovered on {selectedInsight.discoveredAt.toLocaleString()}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Empty State */}
      {insights.length === 0 && !isLoading && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Brain className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Start Discovering</h3>
            <p className="text-muted-foreground text-center max-w-md">
              Enter a topic or query above to discover insights, patterns, and opportunities 
              in your content ecosystem.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DiscoveryDashboard;
