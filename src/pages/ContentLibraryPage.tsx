import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  FileText, 
  Image, 
  Video, 
  Download,
  Eye,
  Edit,
  Trash2,
  Plus,
  Calendar,
  Tag,
  User,
  TrendingUp
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Badge } from '../components/ui/badge';

const ContentLibraryPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedType, setSelectedType] = useState<string>('all');

  const contentTypes = [
    { value: 'all', label: 'All Content', icon: FileText, count: 156 },
    { value: 'articles', label: 'Articles', icon: FileText, count: 87 },
    { value: 'guides', label: 'Guides', icon: FileText, count: 34 },
    { value: 'tutorials', label: 'Tutorials', icon: Video, count: 23 },
    { value: 'images', label: 'Images', icon: Image, count: 12 }
  ];

  const mockContent = [
    {
      id: 1,
      title: 'Getting Started with Storyblok Headless CMS',
      type: 'tutorial',
      thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop',
      author: 'John Doe',
      date: '2024-03-15',
      views: 12450,
      status: 'published',
      tags: ['beginner', 'cms', 'tutorial'],
      engagement: 89
    },
    {
      id: 2,
      title: 'Advanced Content Modeling Strategies',
      type: 'guide',
      thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=200&fit=crop',
      author: 'Jane Smith',
      date: '2024-03-12',
      views: 8234,
      status: 'published',
      tags: ['advanced', 'modeling', 'architecture'],
      engagement: 76
    },
    {
      id: 3,
      title: 'API Integration Tutorial',
      type: 'tutorial',
      thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=200&fit=crop',
      author: 'Mike Johnson',
      date: '2024-03-10',
      views: 9876,
      status: 'published',
      tags: ['api', 'integration', 'developer'],
      engagement: 92
    },
    {
      id: 4,
      title: 'SEO Best Practices for Headless CMS',
      type: 'article',
      thumbnail: 'https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=400&h=200&fit=crop',
      author: 'Sarah Williams',
      date: '2024-03-08',
      views: 6543,
      status: 'draft',
      tags: ['seo', 'optimization', 'marketing'],
      engagement: 68
    },
    {
      id: 5,
      title: 'Performance Optimization Guide',
      type: 'guide',
      thumbnail: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=200&fit=crop',
      author: 'David Brown',
      date: '2024-03-05',
      views: 5432,
      status: 'published',
      tags: ['performance', 'optimization', 'speed'],
      engagement: 84
    },
    {
      id: 6,
      title: 'Multilingual Content Management',
      type: 'guide',
      thumbnail: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=400&h=200&fit=crop',
      author: 'Emma Davis',
      date: '2024-03-02',
      views: 4321,
      status: 'published',
      tags: ['i18n', 'multilingual', 'localization'],
      engagement: 72
    }
  ];

  const stats = [
    { label: 'Total Content', value: '156', icon: FileText, color: 'text-blue-600' },
    { label: 'Published', value: '134', icon: Eye, color: 'text-green-600' },
    { label: 'Drafts', value: '22', icon: Edit, color: 'text-yellow-600' },
    { label: 'Total Views', value: '45.2K', icon: TrendingUp, color: 'text-purple-600' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <FileText className="w-8 h-8 text-blue-600" />
              Content Library
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Browse, manage, and analyze your content collection
            </p>
          </div>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Create Content
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                      <p className="text-2xl font-bold mt-1">{stat.value}</p>
                    </div>
                    <Icon className={`w-8 h-8 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Filters and View Controls */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-4">
              {/* Content Type Filter */}
              <div className="flex items-center gap-2 flex-wrap">
                {contentTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.value}
                      onClick={() => setSelectedType(type.value)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                        selectedType === type.value
                          ? 'bg-primary text-white'
                          : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {type.label}
                      <Badge variant="secondary" className="ml-1">{type.count}</Badge>
                    </button>
                  );
                })}
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg ${
                    viewMode === 'grid' ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg ${
                    viewMode === 'list' ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content Grid/List */}
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
          {mockContent.map((content) => (
            <motion.div
              key={content.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: content.id * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                {viewMode === 'grid' ? (
                  <>
                    <img
                      src={content.thumbnail}
                      alt={content.title}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant={content.status === 'published' ? 'default' : 'secondary'}>
                          {content.status}
                        </Badge>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Eye className="w-4 h-4" />
                          {content.views.toLocaleString()}
                        </div>
                      </div>
                      <CardTitle className="text-lg">{content.title}</CardTitle>
                      <CardDescription>
                        <div className="flex items-center gap-2 mt-2">
                          <User className="w-4 h-4" />
                          {content.author}
                          <Calendar className="w-4 h-4 ml-2" />
                          {new Date(content.date).toLocaleDateString()}
                        </div>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {content.tags.map((tag, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="text-sm text-gray-600">Engagement: {content.engagement}%</div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </>
                ) : (
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={content.thumbnail}
                        alt={content.title}
                        className="w-32 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg">{content.title}</h3>
                          <Badge variant={content.status === 'published' ? 'default' : 'secondary'}>
                            {content.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            {content.author}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(content.date).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            {content.views.toLocaleString()} views
                          </span>
                          <span>Engagement: {content.engagement}%</span>
                        </div>
                        <div className="flex gap-2 mt-2">
                          {content.tags.map((tag, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContentLibraryPage;

