import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Search,
  Code,
  Zap,
  Shield,
  Rocket,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  Star,
  Clock
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';

const DocumentationPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('getting-started');

  const categories = [
    { id: 'getting-started', label: 'Getting Started', icon: Rocket },
    { id: 'api', label: 'API Reference', icon: Code },
    { id: 'features', label: 'Features', icon: Zap },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'faq', label: 'FAQ', icon: HelpCircle }
  ];

  const docs = {
    'getting-started': [
      {
        title: 'Quick Start Guide',
        description: 'Get up and running with StorySearch AI in 5 minutes',
        time: '5 min read',
        popular: true
      },
      {
        title: 'Installation & Setup',
        description: 'Complete installation guide for all environments',
        time: '10 min read',
        popular: true
      },
      {
        title: 'Configuration',
        description: 'Learn how to configure StorySearch AI for your needs',
        time: '8 min read',
        popular: false
      },
      {
        title: 'First Search Query',
        description: 'Create your first AI-powered search query',
        time: '3 min read',
        popular: true
      }
    ],
    'api': [
      {
        title: 'Authentication',
        description: 'API authentication and security best practices',
        time: '6 min read',
        popular: true
      },
      {
        title: 'Search API',
        description: 'Complete reference for search endpoints',
        time: '12 min read',
        popular: true
      },
      {
        title: 'AI Features API',
        description: 'Access AI-powered features programmatically',
        time: '15 min read',
        popular: false
      },
      {
        title: 'Webhooks',
        description: 'Set up webhooks for real-time updates',
        time: '7 min read',
        popular: false
      }
    ],
    'features': [
      {
        title: 'AI-Powered Search',
        description: 'Understanding semantic search and intent classification',
        time: '10 min read',
        popular: true
      },
      {
        title: 'Content Recommendations',
        description: 'How our recommendation engine works',
        time: '8 min read',
        popular: true
      },
      {
        title: 'Analytics & Reports',
        description: 'Generate AI-powered insights and reports',
        time: '12 min read',
        popular: false
      },
      {
        title: 'Brand Customization',
        description: 'Customize the platform for your brand',
        time: '6 min read',
        popular: false
      }
    ],
    'security': [
      {
        title: 'Security Overview',
        description: 'Our approach to security and privacy',
        time: '8 min read',
        popular: true
      },
      {
        title: 'API Security',
        description: 'Best practices for securing your API keys',
        time: '6 min read',
        popular: true
      },
      {
        title: 'Data Privacy',
        description: 'How we handle and protect your data',
        time: '10 min read',
        popular: false
      },
      {
        title: 'Compliance',
        description: 'GDPR, CCPA, and other compliance standards',
        time: '12 min read',
        popular: false
      }
    ],
    'faq': [
      {
        title: 'General Questions',
        description: 'Most frequently asked questions',
        time: '5 min read',
        popular: true
      },
      {
        title: 'Troubleshooting',
        description: 'Common issues and solutions',
        time: '8 min read',
        popular: true
      },
      {
        title: 'Billing & Plans',
        description: 'Information about pricing and billing',
        time: '4 min read',
        popular: false
      },
      {
        title: 'Support',
        description: 'How to get help when you need it',
        time: '3 min read',
        popular: false
      }
    ]
  };

  const quickLinks = [
    { label: 'API Documentation', icon: Code, color: 'text-blue-600' },
    { label: 'Video Tutorials', icon: Rocket, color: 'text-green-600' },
    { label: 'Community Forum', icon: HelpCircle, color: 'text-purple-600' },
    { label: 'Status Page', icon: Zap, color: 'text-yellow-600' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-8 h-8 text-blue-600" />
              Documentation
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Everything you need to know about StorySearch AI
            </p>
          </div>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search documentation..."
                className="w-full pl-10 pr-4 py-3 border rounded-lg dark:bg-gray-800 focus:ring-2 focus:ring-primary"
              />
            </div>
          </CardContent>
        </Card>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {quickLinks.map((link, index) => {
            const Icon = link.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <Icon className={`w-8 h-8 ${link.color} mb-2`} />
                  <p className="font-semibold">{link.label}</p>
                  <ExternalLink className="w-4 h-4 text-gray-400 mt-2" />
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <Card className="h-fit">
            <CardContent className="p-4">
              <nav className="space-y-1">
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                        selectedCategory === category.id
                          ? 'bg-primary text-white'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {category.label}
                      <ChevronRight className="w-4 h-4 ml-auto" />
                    </button>
                  );
                })}
              </nav>
            </CardContent>
          </Card>

          {/* Documentation List */}
          <div className="lg:col-span-3 space-y-4">
            {docs[selectedCategory as keyof typeof docs].map((doc, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="flex items-center gap-2">
                          {doc.title}
                          {doc.popular && (
                            <Badge variant="secondary" className="gap-1">
                              <Star className="w-3 h-3" />
                              Popular
                            </Badge>
                          )}
                        </CardTitle>
                        <CardDescription className="mt-2">{doc.description}</CardDescription>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Clock className="w-4 h-4" />
                      {doc.time}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Help Card */}
        <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-2">Need More Help?</h3>
                <p className="text-blue-100 mb-4">
                  Our support team is here to help you succeed
                </p>
                <Button variant="secondary" size="lg" className="gap-2">
                  <HelpCircle className="w-5 h-5" />
                  Contact Support
                </Button>
              </div>
              <BookOpen className="w-32 h-32 opacity-20" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DocumentationPage;

