import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Sparkles,
  Brain,
  Target,
  TrendingUp,
  MessageCircle,
  Lightbulb,
  Zap,
  ChevronRight,
  Star,
  Clock,
  Users,
  BarChart3,
  Settings,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { algoliaService, AgentRecommendation } from '../../services/algoliaService';

interface SearchResult {
  id: string;
  title: string;
  content: string;
  type: 'article' | 'documentation' | 'tutorial' | 'guide';
  url: string;
  thumbnail?: string;
  tags: string[];
  createdAt: string;
  relevanceScore: number;
  aiInsights?: {
    summary: string;
    keyTopics: string[];
    sentiment: 'positive' | 'neutral' | 'negative';
    complexity: 'beginner' | 'intermediate' | 'advanced';
    estimatedReadTime: number;
  };
}


interface AIResponse {
  answer: string;
  confidence: number;
  sources: SearchResult[];
  followUpQuestions: string[];
  relatedTopics: string[];
}

const EnhancedSearchInterface: React.FC = () => {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [aiResponse, setAiResponse] = useState<AIResponse | null>(null);
  const [agentRecommendations, setAgentRecommendations] = useState<AgentRecommendation[]>([]);
  const [similarContent, setSimilarContent] = useState<Record<string, unknown>[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('search');
  const [customRelevanceEnabled, setCustomRelevanceEnabled] = useState(true);

  // Enhanced search with AI features
  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setQuery(searchQuery);

    // Update search history
    setSearchHistory(prev => {
      const updated = [...prev, searchQuery];
      return updated.slice(-10); // Keep last 10 searches
    });

    try {
      // Build enhanced context for recommendations
      const enhancedContext = {
        searchHistory: [...searchHistory, searchQuery],
        currentPage: window.location.pathname,
        timestamp: new Date().toISOString(),
        previousQuery: query || '',
        hasResults: true,
        sessionDuration: Date.now()
      };

      // Parallel execution of all AI features
      const [
        searchResultsData,
        aiResponseData,
        recommendationsData
      ] = await Promise.all([
        customRelevanceEnabled 
          ? algoliaService.searchWithCustomRelevance(searchQuery)
          : algoliaService.search(searchQuery),
        algoliaService.askAI(searchQuery),
        algoliaService.getAgentRecommendations('user-1', enhancedContext)
      ]);

      setSearchResults(searchResultsData);
      setAiResponse(aiResponseData);
      setAgentRecommendations(recommendationsData);

      // Find similar content for the first result if available
      if (searchResultsData.length > 0) {
        const similarData = await algoliaService.findSimilarContent(searchResultsData[0].id);
        setSimilarContent(similarData);
      }

      // Track user behavior
      algoliaService.updateUserBehavior('user-1', 'search', { query: searchQuery, timestamp: new Date().toISOString() });
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load proactive recommendations on component mount
  useEffect(() => {
    const loadRecommendations = async () => {
      try {
        // Build rich context for recommendations
        const context = {
          searchHistory: searchHistory || [],
          currentPage: window.location.pathname,
          timestamp: new Date().toISOString(),
          previousQuery: query || '',
          hasResults: searchResults.length > 0
        };
        
        const recommendations = await algoliaService.getAgentRecommendations('user-1', context);
        setAgentRecommendations(recommendations);
      } catch (error) {
        console.error('Error loading recommendations:', error);
      }
    };

    loadRecommendations();
  }, []);

  // State for search history tracking
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  const handleContentClick = (contentId: string) => {
    algoliaService.updateUserBehavior('user-1', 'click', { contentId });
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'beginner': return 'bg-green-100 text-green-800 border-green-200';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'advanced': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'medium': return <Info className="w-4 h-4 text-yellow-500" />;
      case 'low': return <CheckCircle className="w-4 h-4 text-green-500" />;
      default: return <Info className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            StorySearch AI
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Advanced Algolia AI implementation featuring AskAI, Agent Studio, Looking Similar, and Custom Relevance
          </p>
        </motion.div>

        {/* Enhanced Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-4xl mx-auto mb-8"
        >
          <div className="relative">
            <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 w-6 h-6 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Ask me anything about content management, development, or best practices..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch(query)}
              className="w-full px-16 py-6 text-lg glass rounded-3xl border-2 border-border focus:border-primary focus:outline-none focus:shadow-[0_0_40px_hsl(var(--primary)/0.3)] transition-all duration-500"
            />
            <Button
              onClick={() => handleSearch(query)}
              disabled={isLoading}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 rounded-2xl"
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                />
              ) : (
                <Sparkles className="w-5 h-5" />
              )}
            </Button>
          </div>
          
          {/* Settings Toggle */}
          <div className="flex justify-center mt-4">
            <div className="flex items-center space-x-2 glass rounded-full px-4 py-2">
              <Settings className="w-4 h-4 text-muted-foreground" />
              <Label htmlFor="custom-relevance" className="text-sm">Custom Relevance</Label>
              <input
                id="custom-relevance"
                type="checkbox"
                checked={customRelevanceEnabled}
                onChange={(e) => setCustomRelevanceEnabled(e.target.checked)}
                className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary focus:ring-2"
              />
            </div>
          </div>
        </motion.div>

        {/* AI Features Showcase */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-7xl mx-auto">
          <TabsList className="grid w-full grid-cols-4 mb-8 glass">
            <TabsTrigger value="search" className="flex items-center space-x-2">
              <Brain className="w-4 h-4" />
              <span>AskAI</span>
            </TabsTrigger>
            <TabsTrigger value="agent" className="flex items-center space-x-2">
              <Zap className="w-4 h-4" />
              <span>Agent Studio</span>
            </TabsTrigger>
            <TabsTrigger value="similar" className="flex items-center space-x-2">
              <Target className="w-4 h-4" />
              <span>Looking Similar</span>
            </TabsTrigger>
            <TabsTrigger value="relevance" className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4" />
              <span>Custom Relevance</span>
            </TabsTrigger>
          </TabsList>

          {/* AskAI Tab */}
          <TabsContent value="search" className="space-y-6">
            {aiResponse && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* AI Answer */}
                <Card className="glass border-primary/20">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Brain className="w-5 h-5 text-primary" />
                      <span>AI Answer</span>
                      <Badge variant="secondary" className="ml-auto">
                        {Math.round(aiResponse.confidence * 100)}% confidence
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg leading-relaxed mb-4">{aiResponse.answer}</p>
                    
                    {/* Follow-up Questions */}
                    {aiResponse.followUpQuestions.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
                          Follow-up Questions
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {aiResponse.followUpQuestions.map((question, index) => (
                            <Button
                              key={index}
                              variant="outline"
                              size="sm"
                              onClick={() => handleSearch(question)}
                              className="glass hover:bg-primary/10"
                            >
                              <MessageCircle className="w-3 h-3 mr-1" />
                              {question}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Related Topics */}
                    {aiResponse.relatedTopics.length > 0 && (
                      <div className="space-y-3 mt-6">
                        <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
                          Related Topics
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {aiResponse.relatedTopics.map((topic, index) => (
                            <Badge key={index} variant="secondary" className="glass">
                              {topic}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* AI Sources */}
                {aiResponse.sources.length > 0 && (
                  <Card className="glass">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Lightbulb className="w-5 h-5 text-yellow-500" />
                        <span>Relevant Sources</span>
                      </CardTitle>
                      <CardDescription>
                        Content that supports this AI-generated answer
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4 md:grid-cols-2">
                        {aiResponse.sources.map((source) => (
                          <motion.div
                            key={source.id}
                            whileHover={{ scale: 1.02 }}
                            className="p-4 glass rounded-lg border border-border/50 cursor-pointer"
                            onClick={() => handleContentClick(source.id)}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="font-semibold text-sm line-clamp-2">{source.title}</h4>
                              <Badge variant="outline" className="ml-2 shrink-0">
                                {source.type}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                              {source.content}
                            </p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <Progress value={source.relevanceScore} className="w-16 h-1" />
                                <span className="text-xs text-muted-foreground">
                                  {Math.round(source.relevanceScore)}%
                                </span>
                              </div>
                              <ArrowRight className="w-4 h-4 text-muted-foreground" />
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </motion.div>
            )}

            {/* Search Results */}
            {searchResults.length > 0 && (
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Search className="w-5 h-5 text-blue-500" />
                    <span>Search Results</span>
                    <Badge variant="secondary" className="ml-auto">
                      {searchResults.length} results
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {searchResults.map((result) => (
                      <motion.div
                        key={result.id}
                        whileHover={{ scale: 1.01 }}
                        className="p-4 glass rounded-lg border border-border/50 cursor-pointer"
                        onClick={() => handleContentClick(result.id)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-lg line-clamp-2">{result.title}</h3>
                          <div className="flex items-center space-x-2 ml-4">
                            <Badge variant="outline">{result.type}</Badge>
                            {result.aiInsights && (
                              <Badge className={getComplexityColor(result.aiInsights.complexity)}>
                                {result.aiInsights.complexity}
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <p className="text-muted-foreground line-clamp-3 mb-3">{result.content}</p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex flex-wrap gap-1">
                            {result.tags.slice(0, 4).map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {result.tags.length > 4 && (
                              <Badge variant="secondary" className="text-xs">
                                +{result.tags.length - 4} more
                              </Badge>
                            )}
                          </div>
                          
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            {result.aiInsights && (
                              <div className="flex items-center space-x-1">
                                <Clock className="w-3 h-3" />
                                <span>{result.aiInsights.estimatedReadTime} min</span>
                              </div>
                            )}
                            <div className="flex items-center space-x-1">
                              <Star className="w-3 h-3" />
                              <span>{Math.round(result.relevanceScore)}%</span>
                            </div>
                            <ArrowRight className="w-4 h-4" />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Agent Studio Tab */}
          <TabsContent value="agent" className="space-y-6">
            {/* Contextual Intelligence Insights */}
            {searchHistory.length > 0 && (
              <Card className="glass border-blue/20 bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-900/20 dark:to-purple-900/20">
                <CardContent className="pt-6">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 glass rounded-lg">
                      <Brain className="w-6 h-6 text-blue-500" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold mb-2 flex items-center space-x-2">
                        <span>Contextual Intelligence Active</span>
                        <Badge variant="secondary" className="animate-pulse">Live</Badge>
                      </h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Analyzing your search patterns, interests, and session behavior to deliver personalized recommendations
                      </p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div className="text-center p-2 glass rounded-lg">
                          <div className="text-xs text-muted-foreground mb-1">Searches</div>
                          <div className="text-lg font-bold">{searchHistory.length}</div>
                        </div>
                        <div className="text-center p-2 glass rounded-lg">
                          <div className="text-xs text-muted-foreground mb-1">Context</div>
                          <div className="text-lg font-bold">{searchHistory.length >= 3 ? 'Rich' : 'Building'}</div>
                        </div>
                        <div className="text-center p-2 glass rounded-lg">
                          <div className="text-xs text-muted-foreground mb-1">Relevance</div>
                          <div className="text-lg font-bold">{agentRecommendations.length > 0 ? Math.round(agentRecommendations[0].confidence * 100) + '%' : '-'}</div>
                        </div>
                        <div className="text-center p-2 glass rounded-lg">
                          <div className="text-xs text-muted-foreground mb-1">Mode</div>
                          <div className="text-lg font-bold">
                            {new Date().getHours() >= 9 && new Date().getHours() <= 17 ? 'Work' : 'Learn'}
                          </div>
                        </div>
                      </div>
                      {searchHistory.length >= 2 && (
                        <div className="mt-3 p-3 bg-primary/5 rounded-lg border border-primary/10">
                          <div className="text-xs font-medium text-primary mb-1">Recent Search Pattern Detected</div>
                          <div className="text-xs text-muted-foreground flex flex-wrap gap-1">
                            {searchHistory.slice(-3).map((search, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {search.length > 20 ? search.substring(0, 20) + '...' : search}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="glass border-purple/20">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="w-5 h-5 text-purple-500" />
                  <span>Intelligent Recommendations</span>
                  {agentRecommendations.length > 0 && (
                    <Badge variant="secondary" className="ml-auto">
                      {agentRecommendations.length} personalized
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription>
                  Context-aware suggestions powered by advanced AI analysis of your behavior, interests, and session goals
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  {agentRecommendations.map((rec) => (
                    <motion.div
                      key={rec.id}
                      whileHover={{ scale: 1.02 }}
                      className="p-6 glass rounded-lg border border-border/50"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          {getPriorityIcon(rec.priority)}
                          <Badge
                            variant={rec.type === 'trending' ? 'default' : 'secondary'}
                            className="capitalize"
                          >
                            {rec.type}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-1">
                          <TrendingUp className="w-3 h-3 text-green-500" />
                          <span className="text-xs font-medium">{rec.estimatedValue}/10</span>
                        </div>
                      </div>

                      <h4 className="font-semibold mb-2 line-clamp-2">{rec.title}</h4>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{rec.reason}</p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-muted-foreground">Confidence:</span>
                          <Progress value={rec.confidence * 100} className="w-16 h-1" />
                          <span className="text-xs text-muted-foreground">
                            {Math.round(rec.confidence * 100)}%
                          </span>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handleSearch(rec.title)}
                          className="shrink-0"
                        >
                          <ChevronRight className="w-3 h-3 mr-1" />
                          Explore
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Looking Similar Tab */}
          <TabsContent value="similar" className="space-y-6">
            {similarContent.length > 0 ? (
              <Card className="glass border-green/20">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="w-5 h-5 text-green-500" />
                    <span>Intelligent Content Relationships</span>
                  </CardTitle>
                  <CardDescription>
                    Content similar to your most relevant search result
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {similarContent.map((similarity, index) => (
                      <motion.div
                        key={similarity.contentId}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 glass rounded-lg border border-border/50"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <Badge
                            variant="outline"
                            className={`capitalize ${
                              similarity.relationshipType === 'semantic'
                                ? 'border-blue-200 text-blue-800'
                                : similarity.relationshipType === 'structural'
                                ? 'border-purple-200 text-purple-800'
                                : 'border-green-200 text-green-800'
                            }`}
                          >
                            {similarity.relationshipType}
                          </Badge>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-muted-foreground">Similarity:</span>
                            <Progress 
                              value={similarity.similarityScore * 100} 
                              className="w-20 h-2"
                            />
                            <span className="text-sm font-medium">
                              {Math.round(similarity.similarityScore * 100)}%
                            </span>
                          </div>
                        </div>

                        <p className="text-sm text-muted-foreground mb-3">
                          {similarity.reasoning}
                        </p>

                        {similarity.sharedConcepts.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            <span className="text-xs text-muted-foreground mr-2">Shared concepts:</span>
                            {similarity.sharedConcepts.map((concept: string) => (
                              <Badge key={concept} variant="secondary" className="text-xs">
                                {concept}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="glass">
                <CardContent className="text-center py-12">
                  <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Perform a search to see intelligent content relationships
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Custom Relevance Tab */}
          <TabsContent value="relevance" className="space-y-6">
            <Card className="glass border-orange/20">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5 text-orange-500" />
                  <span>Tailored Ranking Algorithms</span>
                </CardTitle>
                <CardDescription>
                  Customize search relevance based on your preferences and behavior
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  {/* User Preferences */}
                  <div className="space-y-4">
                    <h4 className="font-semibold flex items-center space-x-2">
                      <Users className="w-4 h-4" />
                      <span>User Preferences</span>
                    </h4>
                    <div className="space-y-3 p-4 glass rounded-lg">
                      <div>
                        <Label className="text-sm font-medium">Preferred Content Types</Label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {['tutorial', 'guide', 'documentation', 'article'].map((type) => (
                            <Badge key={type} variant="secondary" className="capitalize">
                              {type}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <Separator />
                      <div>
                        <Label className="text-sm font-medium">Complexity Level</Label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <Badge className="bg-green-100 text-green-800">beginner</Badge>
                          <Badge className="bg-yellow-100 text-yellow-800">intermediate</Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* AI Weights */}
                  <div className="space-y-4">
                    <h4 className="font-semibold flex items-center space-x-2">
                      <Brain className="w-4 h-4" />
                      <span>AI Weights</span>
                    </h4>
                    <div className="space-y-3 p-4 glass rounded-lg">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label className="text-sm">Semantic Similarity</Label>
                          <span className="text-sm text-muted-foreground">40%</span>
                        </div>
                        <Progress value={40} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label className="text-sm">User Behavior</Label>
                          <span className="text-sm text-muted-foreground">30%</span>
                        </div>
                        <Progress value={30} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label className="text-sm">Content Quality</Label>
                          <span className="text-sm text-muted-foreground">20%</span>
                        </div>
                        <Progress value={20} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label className="text-sm">Freshness</Label>
                          <span className="text-sm text-muted-foreground">10%</span>
                        </div>
                        <Progress value={10} className="h-2" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Impact Demonstration */}
                {searchResults.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="font-semibold">Custom Relevance Impact</h4>
                    <div className="p-4 glass rounded-lg">
                      <p className="text-sm text-muted-foreground mb-3">
                        When enabled, Custom Relevance adjusts search rankings based on:
                      </p>
                      <ul className="space-y-1 text-sm">
                        <li className="flex items-center space-x-2">
                          <CheckCircle className="w-3 h-3 text-green-500" />
                          <span>Your preferred content types (+20% boost)</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <CheckCircle className="w-3 h-3 text-green-500" />
                          <span>Complexity matching your level (+15% boost)</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <CheckCircle className="w-3 h-3 text-green-500" />
                          <span>Recent content freshness (+10% boost)</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <CheckCircle className="w-3 h-3 text-green-500" />
                          <span>Your click history and preferences</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Achievement Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <Card className="glass border-primary/30 max-w-4xl mx-auto">
            <CardContent className="py-8">
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                🏆 Achievement Unlocked: Advanced Algolia AI Implementation
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
                <div className="text-center">
                  <Brain className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                  <h4 className="font-semibold text-sm">AskAI</h4>
                  <p className="text-xs text-muted-foreground">Natural language query processing</p>
                </div>
                <div className="text-center">
                  <Zap className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                  <h4 className="font-semibold text-sm">Agent Studio</h4>
                  <p className="text-xs text-muted-foreground">Proactive content recommendations</p>
                </div>
                <div className="text-center">
                  <Target className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <h4 className="font-semibold text-sm">Looking Similar</h4>
                  <p className="text-xs text-muted-foreground">Intelligent content relationships</p>
                </div>
                <div className="text-center">
                  <BarChart3 className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                  <h4 className="font-semibold text-sm">Custom Relevance</h4>
                  <p className="text-xs text-muted-foreground">Tailored ranking algorithms</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default EnhancedSearchInterface;
