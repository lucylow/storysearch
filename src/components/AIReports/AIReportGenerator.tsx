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
  ExternalLink
} from 'lucide-react';
import { aiReportService, type AIReport } from '../../services/aiReportService';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';

const AIReportGenerator: React.FC = () => {
  const [selectedType, setSelectedType] = useState<AIReport['type']>('comprehensive');
  const [selectedPeriod, setSelectedPeriod] = useState('last-30-days');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentReport, setCurrentReport] = useState<AIReport | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set([0]));

  const reportTypes = [
    {
      type: 'comprehensive' as const,
      icon: Sparkles,
      title: 'Comprehensive Report',
      description: 'Complete intelligence across all metrics',
      color: 'text-purple-600'
    },
    {
      type: 'search-analytics' as const,
      icon: TrendingUp,
      title: 'Search Analytics',
      description: 'Query patterns and performance',
      color: 'text-blue-600'
    },
    {
      type: 'content-performance' as const,
      icon: FileSearch,
      title: 'Content Performance',
      description: 'Article engagement and gaps',
      color: 'text-green-600'
    },
    {
      type: 'user-insights' as const,
      icon: Users,
      title: 'User Insights',
      description: 'Behavior patterns and personas',
      color: 'text-orange-600'
    }
  ];

  const periods = [
    { value: 'last-7-days', label: 'Last 7 Days' },
    { value: 'last-30-days', label: 'Last 30 Days' },
    { value: 'last-90-days', label: 'Last 90 Days' },
    { value: 'last-year', label: 'Last Year' }
  ];

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    try {
      const report = await aiReportService.generateReport(selectedType, selectedPeriod);
      setCurrentReport(report);
      setExpandedSections(new Set([0])); // Expand first section by default
    } catch (error) {
      console.error('Failed to generate report:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExport = async (format: 'pdf' | 'json' | 'markdown' | 'csv') => {
    if (!currentReport) return;
    
    const exportedData = await aiReportService.exportReport(currentReport, format);
    
    // Create download
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
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-purple-600" />
            AI-Generated Reports
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Generate comprehensive intelligence reports powered by AI analysis
          </p>
        </div>
      </div>

      {/* Report Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Generate New Report
          </CardTitle>
          <CardDescription>
            Select report type and time period for AI analysis
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Report Type Selection */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 block">
              Report Type
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {reportTypes.map((type) => {
                const Icon = type.icon;
                const isSelected = selectedType === type.type;
                
                return (
                  <button
                    key={type.type}
                    onClick={() => setSelectedType(type.type)}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      isSelected
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Icon className={`w-6 h-6 mb-2 ${type.color}`} />
                    <h3 className="font-semibold text-sm mb-1">{type.title}</h3>
                    <p className="text-xs text-gray-500">{type.description}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Period Selection */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 block">
              Time Period
            </label>
            <div className="flex gap-2">
              {periods.map((period) => (
                <button
                  key={period.value}
                  onClick={() => setSelectedPeriod(period.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedPeriod === period.value
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {period.label}
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <Button
            onClick={handleGenerateReport}
            disabled={isGenerating}
            className="w-full sm:w-auto"
            size="lg"
          >
            {isGenerating ? (
              <>
                <Clock className="w-4 h-4 mr-2 animate-spin" />
                Generating AI Report...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Report
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Report Display */}
      <AnimatePresence>
        {currentReport && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Report Header */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl">{currentReport.title}</CardTitle>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(currentReport.generatedAt).toLocaleString()}
                      </span>
                      <Badge variant="outline">{currentReport.period}</Badge>
                      <Badge variant="default">
                        {Math.round(currentReport.confidence * 100)}% Confidence
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleExport('markdown')}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Markdown
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleExport('json')}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      JSON
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-2 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    Executive Summary
                  </h3>
                  <p className="text-blue-800 dark:text-blue-300 leading-relaxed">
                    {currentReport.summary}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Report Sections */}
            <div className="space-y-4">
              {currentReport.sections.map((section, index) => (
                <Card key={index}>
                  <CardHeader
                    className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    onClick={() => toggleSection(index)}
                  >
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
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
                          <ul className="space-y-2">
                            {section.insights.map((insight, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                <span className="text-gray-700 dark:text-gray-300">
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

            {/* Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-purple-600" />
                  AI Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2">
                  {currentReport.recommendations.map((rec, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800"
                    >
                      <span className="flex-shrink-0 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {i + 1}
                      </span>
                      <p className="text-gray-700 dark:text-gray-300">{rec}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Action Items */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  Prioritized Action Items
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {currentReport.actionItems.map((item, i) => (
                    <div
                      key={i}
                      className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge className={getPriorityColor(item.priority)}>
                            {item.priority.toUpperCase()}
                          </Badge>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {item.category}
                          </span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          Effort: {item.effort}
                        </Badge>
                      </div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                        {item.action}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        <strong>Impact:</strong> {item.impact}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AIReportGenerator;

