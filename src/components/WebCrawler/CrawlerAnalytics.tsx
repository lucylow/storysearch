import React from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  Activity,
  Target,
  Database,
  Clock,
  CheckCircle,
  AlertCircle,
  Globe,
  Calendar,
  Zap,
  FileText,
  Network,
  Users,
  Timer
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import type { CrawlAnalytics } from '../../services/webCrawlerService';

interface CrawlerAnalyticsProps {
  analytics: CrawlAnalytics | null;
}

const CrawlerAnalytics: React.FC<CrawlerAnalyticsProps> = ({ analytics }) => {
  if (!analytics) {
    return (
      <div className="text-center py-12">
        <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No analytics data available</h3>
        <p className="text-muted-foreground">Start crawling to see analytics here</p>
      </div>
    );
  }

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16', '#F97316'];

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold">Crawl Analytics</h2>
        <p className="text-sm text-muted-foreground">
          Insights and performance metrics for your web crawling activities
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Targets</p>
                <p className="text-2xl font-bold">{analytics.totalTargets}</p>
                <p className="text-xs text-muted-foreground">
                  {analytics.activeTargets} active
                </p>
              </div>
              <Target className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pages Crawled</p>
                <p className="text-2xl font-bold">{formatNumber(analytics.totalPagesCrawled)}</p>
                <p className="text-xs text-muted-foreground">
                  {formatNumber(analytics.totalContentIndexed)} indexed
                </p>
              </div>
              <Network className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Success Rate</p>
                <p className="text-2xl font-bold">{Math.round(analytics.successRate)}%</p>
                <p className="text-xs text-muted-foreground">
                  {Math.round(analytics.errorRate)}% errors
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg. Crawl Time</p>
                <p className="text-2xl font-bold">{formatDuration(analytics.averageCrawlTime)}</p>
                <p className="text-xs text-muted-foreground">
                  per session
                </p>
              </div>
              <Timer className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Crawl History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Crawl History (Last 30 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analytics.crawlHistory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={(value) => new Date(value).toLocaleDateString()}
                    formatter={(value: any, name: string) => [
                      name === 'pagesCrawled' ? formatNumber(value) : value,
                      name === 'pagesCrawled' ? 'Pages Crawled' : name === 'errors' ? 'Errors' : 'Success Rate (%)'
                    ]}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="pagesCrawled" 
                    stroke="#3B82F6" 
                    fill="#3B82F6" 
                    fillOpacity={0.2}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="errors" 
                    stroke="#EF4444" 
                    fill="#EF4444" 
                    fillOpacity={0.2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Top Domains */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Top Crawled Domains
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.topDomains.slice(0, 8).map((domain, index) => (
                <div key={domain.domain} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-sm font-medium truncate">{domain.domain}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-muted rounded-full h-2">
                      <div 
                        className="h-2 rounded-full"
                        style={{ 
                          width: `${(domain.count / analytics.topDomains[0].count) * 100}%`,
                          backgroundColor: COLORS[index % COLORS.length]
                        }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground w-12 text-right">
                      {formatNumber(domain.count)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content Types and Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Content Types */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Content Types Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analytics.contentTypes}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {analytics.contentTypes.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any) => formatNumber(value)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Performance Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Success Rate</span>
                  <span className="text-sm text-muted-foreground">{Math.round(analytics.successRate)}%</span>
                </div>
                <Progress value={analytics.successRate} className="h-2" />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Error Rate</span>
                  <span className="text-sm text-muted-foreground">{Math.round(analytics.errorRate)}%</span>
                </div>
                <Progress value={analytics.errorRate} className="h-2" />
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {formatNumber(analytics.totalPagesCrawled)}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Pages</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {formatNumber(analytics.totalContentIndexed)}
                  </div>
                  <div className="text-sm text-muted-foreground">Content Indexed</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Recent Crawl Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analytics.crawlHistory.slice(-7).reverse().map((day, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">
                      {new Date(day.date).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {formatNumber(day.pagesCrawled)} pages crawled
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm font-medium text-green-600">
                      {Math.round(day.successRate)}% success
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {day.errors} errors
                    </div>
                  </div>
                  
                  <Badge variant="outline" className={
                    day.successRate > 80 ? 'text-green-600 border-green-600' :
                    day.successRate > 60 ? 'text-yellow-600 border-yellow-600' :
                    'text-red-600 border-red-600'
                  }>
                    {day.successRate > 80 ? 'Excellent' :
                     day.successRate > 60 ? 'Good' : 'Needs Attention'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CrawlerAnalytics;
