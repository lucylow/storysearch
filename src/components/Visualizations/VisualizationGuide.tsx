import React from 'react';
import { motion } from 'framer-motion';
import {
  Network,
  Layers,
  Brain,
  BarChart3,
  Eye,
  Target,
  Sparkles,
  TrendingUp,
  Filter,
  Search,
  Link2,
  GitBranch,
  Users,
  Calendar,
  Tag,
  Zap,
  Lightbulb,
  ArrowRight,
  CheckCircle,
  Star
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const VisualizationGuide: React.FC = () => {
  const features = [
    {
      icon: Network,
      title: 'Interactive Relationship Graph',
      description: 'Explore content connections through an interactive network visualization with zoom, pan, and filtering capabilities.',
      benefits: [
        'Visual content relationships',
        'Interactive node exploration',
        'Real-time filtering',
        'Zoom and pan controls'
      ],
      color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/20'
    },
    {
      icon: Layers,
      title: 'Content Cluster Mapping',
      description: 'Discover content groupings and themes through intelligent clustering algorithms with multiple view modes.',
      benefits: [
        'Semantic content clustering',
        'Multiple view modes',
        'Cluster analysis',
        'Theme identification'
      ],
      color: 'text-green-600 bg-green-100 dark:bg-green-900/20'
    },
    {
      icon: Brain,
      title: 'AI-Powered Insights',
      description: 'Get intelligent recommendations and pattern analysis powered by advanced AI algorithms.',
      benefits: [
        'Pattern detection',
        'Recommendation engine',
        'Trend analysis',
        'Optimization suggestions'
      ],
      color: 'text-purple-600 bg-purple-100 dark:bg-purple-900/20'
    },
    {
      icon: BarChart3,
      title: 'Split View Dashboard',
      description: 'Combine multiple visualizations in a comprehensive dashboard for complete content analysis.',
      benefits: [
        'Multi-view integration',
        'Comprehensive analysis',
        'Real-time updates',
        'Export capabilities'
      ],
      color: 'text-orange-600 bg-orange-100 dark:bg-orange-900/20'
    }
  ];

  const relationshipTypes = [
    {
      type: 'Semantic',
      description: 'Content connected by shared themes, topics, and concepts',
      icon: Link2,
      color: '#3B82F6',
      examples: ['Tutorials about similar topics', 'Documentation with shared concepts']
    },
    {
      type: 'Temporal',
      description: 'Content created or updated within similar timeframes',
      icon: Calendar,
      color: '#10B981',
      examples: ['Content created in the same week', 'Related updates and versions']
    },
    {
      type: 'Collaborative',
      description: 'Content created by the same authors or teams',
      icon: Users,
      color: '#F59E0B',
      examples: ['Team-authored documentation', 'Cross-referenced content']
    },
    {
      type: 'Hierarchical',
      description: 'Parent-child relationships and content structure',
      icon: GitBranch,
      color: '#8B5CF6',
      examples: ['Component relationships', 'Folder structures']
    }
  ];

  const insights = [
    {
      category: 'Pattern Detection',
      examples: [
        'Strong clustering in tutorial content around "getting started" themes',
        'Documentation gaps identified through relationship analysis',
        'Content type distribution optimization opportunities'
      ]
    },
    {
      category: 'Recommendations',
      examples: [
        'Add cross-references between related tutorials',
        'Create bridge content to connect isolated components',
        'Optimize content type distribution for better user experience'
      ]
    },
    {
      category: 'Trend Analysis',
      examples: [
        'Increasing collaborative content creation',
        'Growing semantic connections between content types',
        'Temporal clustering patterns in content updates'
      ]
    }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-3"
        >
          <div className="p-3 bg-primary/10 rounded-xl">
            <Eye className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Visual Content Relationships
          </h1>
        </motion.div>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl text-muted-foreground max-w-3xl mx-auto"
        >
          Discover hidden connections, patterns, and insights in your content through powerful AI-driven visualizations
        </motion.p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${feature.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{feature.description}</p>
                  <ul className="space-y-2">
                    {feature.benefits.map((benefit, benefitIndex) => (
                      <li key={benefitIndex} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Relationship Types */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Target className="w-6 h-6 text-primary" />
              Content Relationship Types
            </CardTitle>
            <p className="text-muted-foreground">
              Understanding how your content connects and relates to each other
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relationshipTypes.map((relType, index) => {
                const Icon = relType.icon;
                return (
                  <div key={relType.type} className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg" style={{ backgroundColor: `${relType.color}20` }}>
                        <Icon className="w-5 h-5" style={{ color: relType.color }} />
                      </div>
                      <div>
                        <h3 className="font-semibold">{relType.type}</h3>
                        <p className="text-sm text-muted-foreground">{relType.description}</p>
                      </div>
                    </div>
                    <div className="ml-11 space-y-1">
                      {relType.examples.map((example, exampleIndex) => (
                        <div key={exampleIndex} className="flex items-center gap-2 text-sm">
                          <ArrowRight className="w-3 h-3 text-muted-foreground" />
                          <span>{example}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* AI Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-primary" />
              AI-Powered Insights
            </CardTitle>
            <p className="text-muted-foreground">
              Intelligent analysis and recommendations based on content relationships
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {insights.map((insight, index) => (
                <div key={insight.category} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="p-1 rounded bg-primary/10">
                      <Lightbulb className="w-4 h-4 text-primary" />
                    </div>
                    <h3 className="font-semibold">{insight.category}</h3>
                  </div>
                  <ul className="space-y-2">
                    {insight.examples.map((example, exampleIndex) => (
                      <li key={exampleIndex} className="flex items-start gap-2 text-sm">
                        <Star className="w-3 h-3 text-yellow-500 mt-0.5 flex-shrink-0" />
                        <span>{example}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Getting Started */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Zap className="w-6 h-6 text-primary" />
              Getting Started
            </CardTitle>
            <p className="text-muted-foreground">
              Ready to explore your content relationships? Here's how to get started:
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-4 bg-background/50 rounded-lg">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-primary">1</span>
                </div>
                <div>
                  <h4 className="font-semibold">Search Content</h4>
                  <p className="text-sm text-muted-foreground">Use the search interface to find content</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-4 bg-background/50 rounded-lg">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-primary">2</span>
                </div>
                <div>
                  <h4 className="font-semibold">Click Visualize</h4>
                  <p className="text-sm text-muted-foreground">Click the "Visualize" button in results</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-4 bg-background/50 rounded-lg">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-primary">3</span>
                </div>
                <div>
                  <h4 className="font-semibold">Explore & Analyze</h4>
                  <p className="text-sm text-muted-foreground">Discover relationships and insights</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-primary" />
              Pro Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <Filter className="w-4 h-4 text-blue-600" />
                  Filtering & Navigation
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Use filters to focus on specific content types</li>
                  <li>• Zoom and pan to explore different areas of the graph</li>
                  <li>• Click nodes to see detailed content information</li>
                  <li>• Switch between different visualization modes</li>
                </ul>
              </div>
              
              <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <Brain className="w-4 h-4 text-purple-600" />
                  AI Insights
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Review AI recommendations for content optimization</li>
                  <li>• Apply insights to improve content relationships</li>
                  <li>• Monitor trends and patterns over time</li>
                  <li>• Use confidence scores to prioritize actions</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default VisualizationGuide;
