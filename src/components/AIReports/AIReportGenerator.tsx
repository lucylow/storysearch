import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Download,
  TrendingUp,
  Users,
  FileSearch,
  Sparkles,
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock,
  Target,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  BarChart3,
  Activity,
  Eye,
  Zap,
  Brain,
  ArrowUp,
  ArrowDown,
  Minus,
  RefreshCw,
  Filter,
  Search,
  Globe,
  Smartphone,
  Monitor,
  PieChart,
  LineChart,
  BarChart,
  Info
} from 'lucide-react';
import { aiReportService, type AIReport } from '../../services/aiReportService';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Separator } from '../ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

const AIReportGenerator: React.FC = () => {
  const [selectedType, setSelectedType] = useState<AIReport['type']>('comprehensive');
  const [selectedPeriod, setSelectedPeriod] = useState('last-30-days');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentReport, setCurrentReport] = useState<AIReport | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set([0]));
  const [activeTab, setActiveTab] = useState('overview');

  const reportTypes = [
    {
      type: 'comprehensive' as const,
      icon: Sparkles,
      title: 'Comprehensive Report',
      description: 'Complete intelligence across all metrics',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      gradient: 'from-purple-500 to-purple-600'
    },
    {
      type: 'search-analytics' as const,
      icon: TrendingUp,
      title: 'Search Analytics',
      description: 'Query patterns and performance',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      type: 'content-performance' as const,
      icon: FileSearch,
      title: 'Content Performance',
      description: 'Article engagement and gaps',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      gradient: 'from-green-500 to-green-600'
    },
    {
      type: 'user-insights' as const,
      icon: Users,
      title: 'User Insights',
      description: 'Behavior patterns and personas',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      gradient: 'from-orange-500 to-orange-600'
    }
  ];

  const periods = [
    { value: 'last-7-days', label: 'Last 7 Days', icon: Calendar },
    { value: 'last-30-days', label: 'Last 30 Days', icon: Calendar },
    { value: 'last-90-days', label: 'Last 90 Days', icon: Calendar },
    { value: 'last-year', label: 'Last Year', icon: Calendar }
  ];

  // Mock analytics data for better visualization
  const mockAnalyticsData = {
    overview: {
      totalSearches: 1247,
      avgResponseTime: 0.3,
      successRate: 94.2,
      userSatisfaction: 4.7,
      bounceRate: 28.5,
      avgSessionDuration: 3.2,
      uniqueVisitors: 892,
      returningVisitors: 355
    },
    topQueries: [
      { query: 'Nike Air Max', count: 156, trend: 'up', change: 12 },
      { query: 'BLACKPINK fashion', count: 134, trend: 'up', change: 8 },
      { query: 'iShowSpeed gaming', count: 98, trend: 'down', change: -5 },
      { query: 'running shoes', count: 87, trend: 'stable', change: 0 },
      { query: 'K-pop music', count: 76, trend: 'up', change: 15 }
    ],
    deviceBreakdown: [
      { device: 'Desktop', percentage: 45, searches: 561 },
      { device: 'Mobile', percentage: 40, searches: 499 },
      { device: 'Tablet', percentage: 15, searches: 187 }
    ],
    geographicData: [
      { country: 'United States', searches: 456, percentage: 36.6 },
      { country: 'South Korea', searches: 234, percentage: 18.8 },
      { country: 'United Kingdom', searches: 189, percentage: 15.2 },
      { country: 'Canada', searches: 156, percentage: 12.5 },
      { country: 'Australia', searches: 98, percentage: 7.9 },
      { country: 'Others', searches: 114, percentage: 9.1 }
    ]
  };

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    try {
      const report = await aiReportService.generateReport(selectedType, selectedPeriod);
      setCurrentReport(report);
      setExpandedSections(new Set([0]));
    } catch (error) {
      console.error('Failed to generate report:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExport = async (format: 'pdf' | 'json' | 'markdown' | 'csv') => {
    if (!currentReport) return;
    
    const exportedData = await aiReportService.exportReport(currentReport, format);
    
    const blob = new Blob([exportedData], { 
      type: format === 'json' ? 'application/json' : 'text/plain' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentReport.title.replace(/\s+/g, '-')}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const toggleSection = (index: number) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedSections(newExpanded);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-200 dark:border-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-200 dark:border-yellow-800';
      case 'low': return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-200 dark:border-green-800';
      default: return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-200 dark:border-gray-800';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <ArrowUp className="w-4 h-4 text-green-600" />;
      case 'down': return <ArrowDown className="w-4 h-4 text-red-600" />;
      default: return <Minus className="w-4 h-4 text-gray-600" />;
    }
  };

  const getDeviceIcon = (device: string) => {
    switch (device) {
      case 'Desktop': return <Monitor className="w-4 h-4" />;
      case 'Mobile': return <Smartphone className="w-4 h-4" />;
      case 'Tablet': return <Monitor className="w-4 h-4" />;
      default: return <Globe className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              AI Analytics Dashboard
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Comprehensive intelligence reports powered by advanced AI analysis. 
            Get actionable insights, trends, and recommendations for your content strategy.
          </p>
        </motion.div>

        {/* Quick Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {[
            { label: 'Total Searches', value: mockAnalyticsData.overview.totalSearches.toLocaleString(), icon: Search, color: 'text-blue-600', bgColor: 'bg-blue-50', trend: '+12%' },
            { label: 'Success Rate', value: `${mockAnalyticsData.overview.successRate}%`, icon: Target, color: 'text-green-600', bgColor: 'bg-green-50', trend: '+3%' },
            { label: 'Avg Response Time', value: `${mockAnalyticsData.overview.avgResponseTime}s`, icon: Zap, color: 'text-purple-600', bgColor: 'bg-purple-50', trend: '-15%' },
            { label: 'User Satisfaction', value: `${mockAnalyticsData.overview.userSatisfaction}/5`, icon: Users, color: 'text-orange-600', bgColor: 'bg-orange-50', trend: '+8%' }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
            >
              <Card className="hover:shadow-lg transition-all duration-300 border-0 shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                      <stat.icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                    <Badge variant="secondary" className="text-xs font-medium">
                      {stat.trend}
                    </Badge>
                  </div>
                  <div className="mt-4">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stat.value}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {stat.label}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Report Configuration */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                Generate AI Report
              </CardTitle>
              <CardDescription className="text-base">
                Select report type and time period for comprehensive AI analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Enhanced Report Type Selection */}
              <div>
                <label className="text-base font-semibold text-gray-900 dark:text-white mb-4 block">
                  Choose Report Type
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {reportTypes.map((type) => {
                    const Icon = type.icon;
                    const isSelected = selectedType === type.type;
                    
                    return (
                      <motion.button
                        key={type.type}
                        onClick={() => setSelectedType(type.type)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`p-6 rounded-xl border-2 transition-all text-left group ${
                          isSelected
                            ? `border-purple-500 bg-gradient-to-br ${type.bgColor} shadow-lg`
                            : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                        }`}
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`p-2 rounded-lg ${isSelected ? `bg-gradient-to-br ${type.gradient}` : 'bg-gray-100'} group-hover:scale-110 transition-transform`}>
                            <Icon className={`w-5 h-5 ${isSelected ? 'text-white' : type.color}`} />
                          </div>
                          <h3 className="font-semibold text-base">{type.title}</h3>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                          {type.description}
                        </p>
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="mt-3 flex items-center gap-1 text-purple-600 text-sm font-medium"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Selected
                          </motion.div>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Enhanced Period Selection */}
              <div>
                <label className="text-base font-semibold text-gray-900 dark:text-white mb-4 block">
                  Select Time Period
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {periods.map((period) => {
                    const Icon = period.icon;
                    const isSelected = selectedPeriod === period.value;
                    
                    return (
                      <motion.button
                        key={period.value}
                        onClick={() => setSelectedPeriod(period.value)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`p-4 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                          isSelected
                            ? 'bg-gradient-to-r from-purple-500 to-blue-600 text-white shadow-lg'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {period.label}
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Enhanced Generate Button */}
              <div className="flex justify-center">
                <Button
                  onClick={handleGenerateReport}
                  disabled={isGenerating}
                  size="lg"
                  className="px-8 py-4 text-base font-semibold bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {isGenerating ? (
                    <>
                      <Clock className="w-5 h-5 mr-3 animate-spin" />
                      Generating AI Report...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-3" />
                      Generate Comprehensive Report
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Analytics Dashboard Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                Live Analytics Dashboard
              </CardTitle>
              <CardDescription className="text-base">
                Real-time insights and performance metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview" className="text-sm font-medium">Overview</TabsTrigger>
                  <TabsTrigger value="queries" className="text-sm font-medium">Top Queries</TabsTrigger>
                  <TabsTrigger value="devices" className="text-sm font-medium">Devices</TabsTrigger>
                  <TabsTrigger value="geography" className="text-sm font-medium">Geography</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Activity className="w-5 h-5 text-green-600" />
                          Performance Metrics
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {[
                          { label: 'Bounce Rate', value: mockAnalyticsData.overview.bounceRate, max: 100, color: 'bg-red-500' },
                          { label: 'Session Duration', value: mockAnalyticsData.overview.avgSessionDuration * 20, max: 100, color: 'bg-blue-500' },
                          { label: 'Returning Users', value: (mockAnalyticsData.overview.returningVisitors / mockAnalyticsData.overview.uniqueVisitors) * 100, max: 100, color: 'bg-green-500' }
                        ].map((metric) => (
                          <div key={metric.label} className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="font-medium">{metric.label}</span>
                              <span className="text-gray-600">{metric.value.toFixed(1)}%</span>
                            </div>
                            <Progress value={metric.value} className="h-2" />
                          </div>
                        ))}
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Users className="w-5 h-5 text-blue-600" />
                          User Engagement
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <div className="text-2xl font-bold text-blue-600">{mockAnalyticsData.overview.uniqueVisitors}</div>
                            <div className="text-sm text-gray-600">Unique Visitors</div>
                          </div>
                          <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                            <div className="text-2xl font-bold text-green-600">{mockAnalyticsData.overview.returningVisitors}</div>
                            <div className="text-sm text-gray-600">Returning Users</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="queries" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Search className="w-5 h-5 text-purple-600" />
                        Top Search Queries
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {mockAnalyticsData.topQueries.map((query, index) => (
                          <motion.div
                            key={query.query}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                                {index + 1}
                              </div>
                              <div>
                                <div className="font-semibold text-gray-900 dark:text-white">{query.query}</div>
                                <div className="text-sm text-gray-600">{query.count} searches</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {getTrendIcon(query.trend)}
                              <span className={`text-sm font-medium ${
                                query.change > 0 ? 'text-green-600' : 
                                query.change < 0 ? 'text-red-600' : 'text-gray-600'
                              }`}>
                                {query.change > 0 ? '+' : ''}{query.change}%
                              </span>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="devices" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Monitor className="w-5 h-5 text-orange-600" />
                        Device Breakdown
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {mockAnalyticsData.deviceBreakdown.map((device) => (
                          <div key={device.device} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                {getDeviceIcon(device.device)}
                                <span className="font-medium">{device.device}</span>
                              </div>
                              <span className="text-sm text-gray-600">{device.percentage}%</span>
                            </div>
                            <Progress value={device.percentage} className="h-3" />
                            <div className="text-xs text-gray-500">{device.searches} searches</div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="geography" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Globe className="w-5 h-5 text-green-600" />
                        Geographic Distribution
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {mockAnalyticsData.geographicData.map((country) => (
                          <div key={country.country} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                {country.country.charAt(0)}
                              </div>
                              <span className="font-medium">{country.country}</span>
                            </div>
                            <div className="text-right">
                              <div className="font-semibold">{country.searches} searches</div>
                              <div className="text-sm text-gray-600">{country.percentage}%</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>

        {/* Report Display */}
        <AnimatePresence>
          {currentReport && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Enhanced Report Header */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                        {currentReport.title}
                      </CardTitle>
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <span className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {new Date(currentReport.generatedAt).toLocaleString()}
                        </span>
                        <Badge variant="outline" className="px-3 py-1">
                          {currentReport.period}
                        </Badge>
                        <Badge variant="default" className="px-3 py-1 bg-gradient-to-r from-green-500 to-blue-600">
                          {Math.round(currentReport.confidence * 100)}% Confidence
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleExport('markdown')}
                        className="hover:bg-gray-50"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Markdown
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleExport('json')}
                        className="hover:bg-gray-50"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        JSON
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                    <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-3 flex items-center gap-2 text-lg">
                      <AlertCircle className="w-5 h-5" />
                      Executive Summary
                    </h3>
                    <p className="text-blue-800 dark:text-blue-300 leading-relaxed text-base">
                      {currentReport.summary}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Enhanced Report Sections */}
              <div className="space-y-4">
                {currentReport.sections.map((section, index) => (
                  <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                    <CardHeader
                      className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      onClick={() => toggleSection(index)}
                    >
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-3 text-lg">
                          <span className="text-2xl">{section.icon}</span>
                          {section.title}
                        </CardTitle>
                        {expandedSections.has(index) ? (
                          <ChevronUp className="w-5 h-5 text-gray-500" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-500" />
                        )}
                      </div>
                    </CardHeader>
                    <AnimatePresence>
                      {expandedSections.has(index) && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                        >
                          <CardContent>
                            <ul className="space-y-3">
                              {section.insights.map((insight, i) => (
                                <li key={i} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                  <span className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    {insight}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </CardContent>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Card>
                ))}
              </div>

              {/* Enhanced Recommendations */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="p-2 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg">
                      <Target className="w-5 h-5 text-white" />
                    </div>
                    AI Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {currentReport.recommendations.map((rec, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-start gap-4 p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl border border-purple-200 dark:border-purple-800 hover:shadow-md transition-shadow"
                      >
                        <span className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                          {i + 1}
                        </span>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{rec}</p>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Enhanced Action Items */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="p-2 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                    Prioritized Action Items
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {currentReport.actionItems.map((item, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="p-6 border rounded-xl hover:shadow-md transition-all bg-white dark:bg-gray-800"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <Badge className={`${getPriorityColor(item.priority)} px-3 py-1`}>
                              {item.priority.toUpperCase()}
                            </Badge>
                            <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                              {item.category}
                            </span>
                          </div>
                          <Badge variant="outline" className="text-xs px-2 py-1">
                            Effort: {item.effort}
                          </Badge>
                        </div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2 text-lg">
                          {item.action}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                          <strong>Impact:</strong> {item.impact}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AIReportGenerator;