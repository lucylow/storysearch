import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingUp, Clock, Users, Zap, BarChart3, Lightbulb, Tag, FolderOpen, Brain, Sparkles, Target, CheckCircle, RefreshCw } from 'lucide-react';
import { storyblokService } from '../../services/storyblokService';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface AISidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const AISidebar: React.FC<AISidebarProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'insights' | 'categorization' | 'optimization'>('insights');
  const [categorizationResults, setCategorizationResults] = useState<{
    category: string;
    tags: string[];
    confidence: number;
  } | null>(null);
  const [isCategorizing, setIsCategorizing] = useState(false);
  const [sampleContent, setSampleContent] = useState('');

  const handleCategorizeContent = async () => {
    if (!sampleContent.trim()) return;
    
    setIsCategorizing(true);
    try {
      const result = await storyblokService.categorizeContent(sampleContent);
      setCategorizationResults(result);
    } catch (error) {
      console.error('Categorization failed:', error);
    } finally {
      setIsCategorizing(false);
    }
  };

  const insights = [
    {
      icon: TrendingUp,
      title: 'Popular Searches',
      items: [
        'Storyblok setup guide',
        'Content modeling best practices',
        'API integration tutorials'
      ]
    },
    {
      icon: Clock,
      title: 'Recent Activity',
      items: [
        'Searched "headless CMS"',
        'Viewed Next.js tutorial',
        'Asked about SEO optimization'
      ]
    },
    {
      icon: Users,
      title: 'Team Insights',
      items: [
        '12 searches today',
        '85% accuracy rate',
        '3 new content pieces'
      ]
    }
  ];

  const quickActions = [
    { icon: Zap, label: 'Quick Search', action: () => {} },
    { icon: BarChart3, label: 'Analytics', action: () => {} },
    { icon: Lightbulb, label: 'AI Suggestions', action: () => {} }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-80 glass border-l border-border z-50 overflow-y-auto"
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-foreground">AI Assistant</h3>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              {/* AI Feature Tabs */}
              <div className="flex gap-1 mb-6 p-1 glass rounded-lg">
                <button
                  onClick={() => setActiveTab('insights')}
                  className={`flex-1 px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                    activeTab === 'insights'
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Brain className="w-3 h-3 mx-auto mb-1" />
                  Insights
                </button>
                <button
                  onClick={() => setActiveTab('categorization')}
                  className={`flex-1 px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                    activeTab === 'categorization'
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Tag className="w-3 h-3 mx-auto mb-1" />
                  Categorize
                </button>
                <button
                  onClick={() => setActiveTab('optimization')}
                  className={`flex-1 px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                    activeTab === 'optimization'
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Zap className="w-3 h-3 mx-auto mb-1" />
                  Optimize
                </button>
              </div>

              {/* Tab Content */}
              <AnimatePresence mode="wait">
                {activeTab === 'insights' && (
                  <motion.div
                    key="insights"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-6"
                  >
                    {/* Quick Actions */}
                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-foreground mb-3">Quick Actions</h4>
                      <div className="space-y-2">
                        {quickActions.map((action, index) => (
                          <button
                            key={index}
                            onClick={action.action}
                            className="w-full flex items-center space-x-3 p-3 glass rounded-lg hover:bg-primary/5 transition-colors"
                          >
                            <action.icon className="w-5 h-5 text-primary" />
                            <span className="text-sm text-foreground">{action.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* AI Insights */}
                    <div className="space-y-6">
                      {insights.map((section, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <div className="flex items-center space-x-2 mb-3">
                            <section.icon className="w-4 h-4 text-primary" />
                            <h4 className="text-sm font-medium text-foreground">{section.title}</h4>
                          </div>
                          <div className="space-y-2">
                            {section.items.map((item, itemIndex) => (
                              <div
                                key={itemIndex}
                                className="p-3 glass rounded-lg border border-border/50"
                              >
                                <p className="text-sm text-muted-foreground">{item}</p>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeTab === 'categorization' && (
                  <motion.div
                    key="categorization"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <Tag className="w-5 h-5 text-purple-600" />
                      <h4 className="text-sm font-medium text-foreground">AI Content Categorization</h4>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">Content to categorize</label>
                        <textarea
                          value={sampleContent}
                          onChange={(e) => setSampleContent(e.target.value)}
                          placeholder="Paste your content here..."
                          className="w-full p-3 text-xs glass rounded-lg border border-border/50 resize-none h-24"
                        />
                      </div>

                      <Button
                        onClick={handleCategorizeContent}
                        disabled={!sampleContent.trim() || isCategorizing}
                        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-xs h-8"
                      >
                        {isCategorizing ? (
                          <>
                            <RefreshCw className="w-3 h-3 mr-2 animate-spin" />
                            Analyzing...
                          </>
                        ) : (
                          <>
                            <Brain className="w-3 h-3 mr-2" />
                            Categorize Content
                          </>
                        )}
                      </Button>

                      {categorizationResults && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="p-3 glass rounded-lg border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="text-xs font-medium text-green-800 dark:text-green-200">AI Analysis Results</span>
                          </div>
                          
                          <div className="space-y-2">
                            <div>
                              <span className="text-xs text-green-700 dark:text-green-300">Category: </span>
                              <Badge variant="outline" className="text-xs bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200">
                                {categorizationResults.category}
                              </Badge>
                            </div>
                            
                            <div>
                              <span className="text-xs text-green-700 dark:text-green-300">Suggested Tags:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {categorizationResults.tags.map((tag, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            
                            <div>
                              <span className="text-xs text-green-700 dark:text-green-300">Confidence: </span>
                              <span className="text-xs font-medium text-green-800 dark:text-green-200">
                                {Math.round(categorizationResults.confidence * 100)}%
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                )}

                {activeTab === 'optimization' && (
                  <motion.div
                    key="optimization"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <Zap className="w-5 h-5 text-yellow-600" />
                      <h4 className="text-sm font-medium text-foreground">AI Content Optimization</h4>
                    </div>

                    <div className="space-y-3">
                      <div className="p-3 glass rounded-lg border border-border/50">
                        <div className="flex items-center gap-2 mb-2">
                          <Target className="w-4 h-4 text-blue-600" />
                          <span className="text-xs font-medium text-foreground">SEO Optimization</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          AI analyzes your content for SEO improvements and suggests optimizations.
                        </p>
                      </div>

                      <div className="p-3 glass rounded-lg border border-border/50">
                        <div className="flex items-center gap-2 mb-2">
                          <Sparkles className="w-4 h-4 text-purple-600" />
                          <span className="text-xs font-medium text-foreground">Readability Enhancement</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Improve content readability and engagement with AI-powered suggestions.
                        </p>
                      </div>

                      <div className="p-3 glass rounded-lg border border-border/50">
                        <div className="flex items-center gap-2 mb-2">
                          <Users className="w-4 h-4 text-green-600" />
                          <span className="text-xs font-medium text-foreground">Audience Targeting</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Optimize content for your target audience with AI insights.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* AI Tip */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-6 p-4 bg-ai-gradient rounded-lg text-white"
              >
                <div className="flex items-start space-x-2">
                  <Lightbulb className="w-5 h-5 mt-0.5" />
                  <div>
                    <h5 className="font-medium mb-1">AI Tip</h5>
                    <p className="text-sm text-white/80">
                      Try asking specific questions about your content to get more targeted results.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AISidebar;