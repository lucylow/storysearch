import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  Users,
  Search,
  Clock,
  Target,
  Zap,
  Brain,
  Eye,
  ThumbsUp,
  RefreshCw,
  Sparkles,
  Lightbulb,
  Activity
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { storyblokService, ContentInsight } from '../../services/storyblokService';
import { aiAnalyticsService, AIAnalyticsInsight, AIAnalyticsReport, AnalyticsData } from '../../services/aiAnalyticsService';

const AnalyticsDashboard: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [aiInsights, setAiInsights] = useState<ContentInsight[]>([]);
  const [insightsLoading, setInsightsLoading] = useState(false);
  const [aiAnalyticsInsights, setAiAnalyticsInsights] = useState<AIAnalyticsInsight[]>([]);
  const [aiReport, setAiReport] = useState<AIAnalyticsReport | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [selectedInsightType, setSelectedInsightType] = useState<'all' | 'trend' | 'anomaly' | 'recommendation' | 'prediction' | 'optimization'>('all');

  const generateAIInsights = async () => {
    setInsightsLoading(true);
    try {
      // Simulate content data for insights generation
      const mockContent = [
        { id: 1, name: 'Getting Started Guide', content: 'Learn how to set up Storyblok with your favorite framework' },
        { id: 2, name: 'API Documentation', content: 'Complete reference for Storyblok API endpoints and methods' },
        { id: 3, name: 'Content Modeling', content: 'Best practices for structuring your content in Storyblok' }
      ];
      
      const insights = await storyblokService.generateContentInsights(mockContent as any);
      setAiInsights(insights);
    } catch (error) {
      console.error('Failed to generate AI insights:', error);
      // Fallback insights
      setAiInsights([
        {
          metric: 'Content Quality Score',
          value: 87,
          trend: 'up',
          description: 'Overall content quality has improved by 12% this month',
          actionable: true,
          recommendation: 'Focus on SEO optimization for underperforming content'
        },
        {
          metric: 'User Engagement Rate',
          value: '73%',
          trend: 'stable',
          description: 'Users are spending more time on AI-recommended content',
          actionable: true,
          recommendation: 'Increase AI-powered content suggestions'
        },
        {
          metric: 'Search Success Rate',
          value: '94%',
          trend: 'up',
          description: 'AI-enhanced search queries show higher success rates',
          actionable: false
        }
      ]);
    } finally {
      setInsightsLoading(false);
    }
  };

  const generateAIAnalytics = async () => {
    if (!analytics) return;
    
    setAiLoading(true);
    try {
      const [insights, report] = await Promise.all([
        aiAnalyticsService.generateAnalyticsInsights(analytics),
        aiAnalyticsService.generateAnalyticsReport(analytics)
      ]);
      
      setAiAnalyticsInsights(insights);
      setAiReport(report);
    } catch (error) {
      console.error('Failed to generate AI analytics:', error);
      // Set fallback data
      setAiAnalyticsInsights([]);
      setAiReport(null);
    } finally {
      setAiLoading(false);
    }
  };

  const generatePredictions = async () => {
    if (!analytics) return;
    
    try {
      const predictions = await aiAnalyticsService.generateTrendPredictions(analytics);
      // You can add predictions to the report or display them separately
      console.log('Generated predictions:', predictions);
    } catch (error) {
      console.error('Failed to generate predictions:', error);
    }
  };

  const generateAnomalyDetection = async () => {
    if (!analytics) return;
    
    try {
      const anomalies = await aiAnalyticsService.detectAnomalies(analytics);
      console.log('Detected anomalies:', anomalies);
    } catch (error) {
      console.error('Failed to detect anomalies:', error);
    }
  };

  useEffect(() => {
    // Simulate loading analytics data
    const loadAnalytics = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setAnalytics({
        totalSearches: 15847,
        successRate: 94.2,
        avgResponseTime: 0.23,
        userSatisfaction: 4.8,
        bounceRate: 12.3,
        avgSessionDuration: 4.2,
        uniqueVisitors: 8947,
        returningVisitors: 6900,
        topQueries: [
          { query: "headless cms benefits", count: 1247, intent: "Educational", successRate: 96.2, avgTime: 2.3 },
          { query: "storyblok vs wordpress", count: 892, intent: "Comparison", successRate: 94.8, avgTime: 3.1 },
          { query: "how to migrate cms", count: 734, intent: "Tutorial", successRate: 97.1, avgTime: 4.2 },
          { query: "api integration guide", count: 623, intent: "Implementation", successRate: 93.5, avgTime: 2.8 },
          { query: "content modeling best practices", count: 567, intent: "Best Practices", successRate: 95.7, avgTime: 3.5 }
        ],
        contentPerformance: [
          { title: "Getting Started Guide", views: 3421, engagement: 87, type: "Tutorial", conversionRate: 12.3, avgTimeOnPage: 4.2 },
          { title: "Migration Case Study", views: 2876, engagement: 92, type: "Case Study", conversionRate: 15.7, avgTimeOnPage: 5.8 },
          { title: "API Documentation", views: 2543, engagement: 78, type: "Documentation", conversionRate: 8.9, avgTimeOnPage: 3.1 },
          { title: "Best Practices", views: 2198, engagement: 85, type: "Guide", conversionRate: 11.2, avgTimeOnPage: 4.7 }
        ],
        deviceBreakdown: [
          { device: "Desktop", percentage: 45.2, searches: 7163 },
          { device: "Mobile", percentage: 38.7, searches: 6133 },
          { device: "Tablet", percentage: 16.1, searches: 2551 }
        ],
        geographicData: [
          { country: "United States", searches: 4234, percentage: 26.7 },
          { country: "United Kingdom", searches: 2876, percentage: 18.1 },
          { country: "Germany", searches: 1987, percentage: 12.5 },
          { country: "Canada", searches: 1654, percentage: 10.4 },
          { country: "Australia", searches: 1234, percentage: 7.8 }
        ],
        trends: {
          searchVolume: [
            { period: "Week 1", searches: 2341, successRate: 92.1 },
            { period: "Week 2", searches: 2876, successRate: 94.3 },
            { period: "Week 3", searches: 3421, successRate: 95.7 },
            { period: "Week 4", searches: 4123, successRate: 96.2 },
            { period: "Week 5", searches: 3086, successRate: 94.8 }
          ],
          popularTopics: [
            { topic: "Headless CMS", growth: 23.4, searches: 3421 },
            { topic: "API Integration", growth: 18.7, searches: 2876 },
            { topic: "Migration", growth: 15.2, searches: 1987 },
            { topic: "Performance", growth: 12.8, searches: 1654 }
          ],
          hourlyActivity: [
            { hour: "00:00", searches: 234 },
            { hour: "06:00", searches: 456 },
            { hour: "09:00", searches: 1234 },
            { hour: "12:00", searches: 1876 },
            { hour: "15:00", searches: 1654 },
            { hour: "18:00", searches: 1432 },
            { hour: "21:00", searches: 987 }
          ]
        },
        realTimeActivity: [
          { query: "best headless cms 2024", intent: "Comparison", time: "2s ago", location: "San Francisco, CA", device: "Desktop" },
          { query: "how to setup storyblok", intent: "Tutorial", time: "5s ago", location: "London, UK", device: "Mobile" },
          { query: "content modeling guide", intent: "Educational", time: "8s ago", location: "Berlin, DE", device: "Desktop" },
          { query: "api rate limits", intent: "Documentation", time: "12s ago", location: "Toronto, CA", device: "Tablet" },
          { query: "migration checklist", intent: "Implementation", time: "15s ago", location: "Sydney, AU", device: "Mobile" }
        ]
      });
      
      setLoading(false);
    };

      loadAnalytics();
      generateAIInsights();
      generateAIAnalytics();
    }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!analytics) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            StorySearch AI Analytics
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Real-time insights into your AI-powered content discovery platform
          </p>
        </motion.div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            {
              title: "Total Searches",
              value: analytics.totalSearches.toLocaleString(),
              icon: Search,
              color: "text-blue-600",
              bgColor: "bg-blue-100 dark:bg-blue-900/20"
            },
            {
              title: "Success Rate",
              value: `${analytics.successRate}%`,
              icon: Target,
              color: "text-green-600",
              bgColor: "bg-green-100 dark:bg-green-900/20"
            },
            {
              title: "Avg Response Time",
              value: `${analytics.avgResponseTime}s`,
              icon: Zap,
              color: "text-yellow-600",
              bgColor: "bg-yellow-100 dark:bg-yellow-900/20"
            },
            {
              title: "User Satisfaction",
              value: `${analytics.userSatisfaction}/5`,
              icon: ThumbsUp,
              color: "text-purple-600",
              bgColor: "bg-purple-100 dark:bg-purple-900/20"
            }
          ].map((metric, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
                  <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                    <metric.icon className={`h-4 w-4 ${metric.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metric.value}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* AI Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Brain className="h-5 w-5 mr-2 text-purple-600" />
                  AI Performance Insights
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={generateAIInsights}
                  disabled={insightsLoading}
                  className="text-xs"
                >
                  {insightsLoading ? (
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin mr-2" />
                  ) : (
                    <RefreshCw className="w-4 h-4 mr-2" />
                  )}
                  Refresh Insights
                </Button>
              </CardTitle>
              <CardDescription>
                Advanced AI capabilities powering your content discovery
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg">
                  <div className="text-3xl font-bold text-purple-600 mb-2">96.8%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 capitalize mb-3">Intent Accuracy</div>
                  <Progress value={96.8} className="h-2" />
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg">
                  <div className="text-3xl font-bold text-purple-600 mb-2">94.1%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 capitalize mb-3">Semantic Matching</div>
                  <Progress value={94.1} className="h-2" />
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg">
                  <div className="text-3xl font-bold text-purple-600 mb-2">89.3%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 capitalize mb-3">Personalization Score</div>
                  <Progress value={89.3} className="h-2" />
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg">
                  <div className="text-3xl font-bold text-purple-600 mb-2">91.7%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 capitalize mb-3">Content Recommendations</div>
                  <Progress value={91.7} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* AI-Generated Content Insights */}
        {aiInsights.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-8"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Sparkles className="h-5 w-5 mr-2 text-blue-600" />
                  AI-Generated Content Insights
                </CardTitle>
                <CardDescription>
                  Intelligent analysis and recommendations for your content strategy
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {aiInsights.map((insight, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 glass rounded-lg border border-border/50"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-medium text-sm text-foreground mb-1">
                            {insight.metric}
                          </h4>
                          <div className="text-2xl font-bold text-blue-600 mb-1">
                            {insight.value}
                          </div>
                        </div>
                        <div className={`p-1 rounded-full ${
                          insight.trend === 'up' ? 'bg-green-100 text-green-600' :
                          insight.trend === 'down' ? 'bg-red-100 text-red-600' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {insight.trend === 'up' ? '↗' : insight.trend === 'down' ? '↘' : '→'}
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-3">
                        {insight.description}
                      </p>
                      
                      {insight.actionable && insight.recommendation && (
                        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                          <div className="flex items-start gap-2">
                            <Lightbulb className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-xs font-medium text-blue-800 dark:text-blue-200 mb-1">
                                Recommendation
                              </p>
                              <p className="text-xs text-blue-700 dark:text-blue-300">
                                {insight.recommendation}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* AI Analytics Insights */}
        {aiAnalyticsInsights.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-8"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Brain className="h-5 w-5 mr-2 text-purple-600" />
                    AI Analytics Insights
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={generateAIAnalytics}
                      disabled={aiLoading}
                      className="text-xs"
                    >
                      {aiLoading ? (
                        <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin mr-2" />
                      ) : (
                        <RefreshCw className="w-4 h-4 mr-2" />
                      )}
                      Refresh AI Analytics
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={generatePredictions}
                      className="text-xs"
                    >
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Predictions
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={generateAnomalyDetection}
                      className="text-xs"
                    >
                      <Activity className="w-4 h-4 mr-2" />
                      Anomalies
                    </Button>
                  </div>
                </CardTitle>
                <CardDescription>
                  Advanced AI-powered analytics and insights generated from your data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {aiAnalyticsInsights.map((insight, index) => (
                    <motion.div
                      key={insight.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 glass rounded-lg border border-border/50 hover:border-primary/30 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="font-medium text-sm text-foreground">
                              {insight.title}
                            </h4>
                            <Badge 
                              variant={insight.priority === 'high' ? 'destructive' : insight.priority === 'medium' ? 'default' : 'secondary'}
                              className="text-xs"
                            >
                              {insight.priority}
                            </Badge>
                          </div>
                          <div className="text-2xl font-bold text-purple-600 mb-1">
                            {typeof insight.metrics.current === 'number' 
                              ? insight.metrics.current.toLocaleString() 
                              : insight.metrics.current}
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className={`text-xs font-medium ${
                              insight.metrics.trend === 'up' ? 'text-green-600' :
                              insight.metrics.trend === 'down' ? 'text-red-600' :
                              'text-gray-600'
                            }`}>
                              {insight.metrics.trend === 'up' ? '↗' : insight.metrics.trend === 'down' ? '↘' : '→'}
                              {insight.metrics.trend}
                            </div>
                            <div className="text-xs text-gray-500">
                              {Math.round(insight.confidence * 100)}% confidence
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-3">
                        {insight.description}
                      </p>
                      
                      <div className="mb-3">
                        <div className="text-xs font-medium text-gray-600 mb-1">Impact</div>
                        <p className="text-xs text-gray-700 dark:text-gray-300">
                          {insight.impact}
                        </p>
                      </div>
                      
                      {insight.actionable && insight.recommendation && (
                        <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                          <div className="flex items-start gap-2">
                            <Lightbulb className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-xs font-medium text-purple-800 dark:text-purple-200 mb-1">
                                AI Recommendation
                              </p>
                              <p className="text-xs text-purple-700 dark:text-purple-300">
                                {insight.recommendation}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* AI Analytics Report */}
        {aiReport && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mb-8"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Sparkles className="h-5 w-5 mr-2 text-blue-600" />
                  AI Analytics Report
                </CardTitle>
                <CardDescription>
                  Comprehensive AI-generated analysis of your platform performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Executive Summary */}
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Executive Summary</h4>
                    <p className="text-sm text-blue-800 dark:text-blue-200">{aiReport.summary}</p>
                  </div>

                  {/* Key Findings */}
                  <div>
                    <h4 className="font-semibold mb-3">Key Findings</h4>
                    <div className="space-y-2">
                      {aiReport.keyFindings.map((finding, index) => (
                        <div key={index} className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                          <p className="text-sm text-gray-700 dark:text-gray-300">{finding}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Predictions */}
                  {aiReport.predictions.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-3">AI Predictions (Next 30 Days)</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {aiReport.predictions.map((prediction, index) => (
                          <div key={index} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-sm">{prediction.metric}</span>
                              <Badge variant="outline" className="text-xs">
                                {Math.round(prediction.confidence * 100)}% confidence
                              </Badge>
                            </div>
                            <div className="text-lg font-bold text-blue-600 mb-1">
                              {prediction.predictedValue.toLocaleString()}
                            </div>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              {prediction.reasoning}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recommendations */}
                  {aiReport.recommendations.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-3">AI Recommendations</h4>
                      <div className="space-y-3">
                        {aiReport.recommendations.map((rec, index) => (
                          <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                            <div className="flex items-start justify-between mb-2">
                              <h5 className="font-medium text-sm">{rec.title}</h5>
                              <div className="flex items-center space-x-2">
                                <Badge 
                                  variant={rec.priority === 'high' ? 'destructive' : rec.priority === 'medium' ? 'default' : 'secondary'}
                                  className="text-xs"
                                >
                                  {rec.priority}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {rec.effort} effort
                                </Badge>
                              </div>
                            </div>
                            <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                              {rec.description}
                            </p>
                            <p className="text-xs text-blue-600 dark:text-blue-400">
                              Expected Impact: {rec.expectedImpact}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Risk Factors */}
                  {aiReport.riskFactors.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-3">Risk Assessment</h4>
                      <div className="space-y-3">
                        {aiReport.riskFactors.map((risk, index) => (
                          <div key={index} className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                            <div className="flex items-start justify-between mb-2">
                              <h5 className="font-medium text-sm text-red-900 dark:text-red-100">{risk.risk}</h5>
                              <Badge variant="destructive" className="text-xs">
                                {Math.round(risk.probability * 100)}% probability
                              </Badge>
                            </div>
                            <p className="text-sm text-red-800 dark:text-red-200 mb-2">
                              Impact: {risk.impact}
                            </p>
                            <p className="text-xs text-red-700 dark:text-red-300">
                              Mitigation: {risk.mitigation}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Top Search Queries */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
                  Top Search Queries
                </CardTitle>
                <CardDescription>
                  Most popular searches with AI intent classification
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.topQueries.map((query, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="font-medium">{query.query}</div>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {query.intent}
                          </Badge>
                          <span className="text-sm text-gray-500">
                            {query.count} searches
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">#{index + 1}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Content Performance */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
                  Content Performance
                </CardTitle>
                <CardDescription>
                  Top performing content with engagement metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.contentPerformance.map((content, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="font-medium">{content.title}</div>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {content.type}
                          </Badge>
                          <div className="flex items-center text-sm text-gray-500">
                            <Eye className="h-3 w-3 mr-1" />
                            {content.views.toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-green-600">
                          {content.engagement}% engagement
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Trending Topics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-orange-600" />
                Trending Topics
              </CardTitle>
              <CardDescription>
                Emerging content topics with growth metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {analytics.trends.popularTopics.map((topic, index) => (
                  <div key={index} className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="font-medium mb-2">{topic.topic}</div>
                    <div className="text-2xl font-bold text-orange-600 mb-1">
                      +{topic.growth}%
                    </div>
                    <div className="text-sm text-gray-500">growth this month</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Real-time Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2 text-red-600" />
                Real-time Activity
              </CardTitle>
              <CardDescription>
                Live search activity and AI processing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { query: "best headless cms 2024", intent: "Comparison", time: "2s ago" },
                  { query: "how to setup storyblok", intent: "Tutorial", time: "5s ago" },
                  { query: "content modeling guide", intent: "Educational", time: "8s ago" },
                  { query: "api rate limits", intent: "Documentation", time: "12s ago" },
                  { query: "migration checklist", intent: "Implementation", time: "15s ago" }
                ].map((activity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9 + index * 0.1 }}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <div>
                        <div className="font-medium">"{activity.query}"</div>
                        <Badge variant="outline" className="text-xs mt-1">
                          {activity.intent}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">{activity.time}</div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
