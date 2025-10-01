import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Globe,
  Plus,
  Play,
  Pause,
  Square,
  Settings,
  Eye,
  EyeOff,
  Trash2,
  Edit,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock,
  TrendingUp,
  BarChart3,
  Download,
  Upload,
  Filter,
  Search,
  ExternalLink,
  Link,
  FileText,
  Image,
  Calendar,
  Users,
  Target,
  Zap,
  Activity,
  Bot,
  Network,
  Database
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import CrawlerTargetCard from './CrawlerTargetCard';
import CrawlSessionList from './CrawlSessionList';
import CrawlResultsGrid from './CrawlResultsGrid';
import CrawlerAnalytics from './CrawlerAnalytics';
import { webCrawlerService, CrawlTarget, CrawlSession, CrawlResult, CrawlAnalytics } from '../../services/webCrawlerService';

interface CrawlerDashboardProps {
  onClose?: () => void;
}

const CrawlerDashboard: React.FC<CrawlerDashboardProps> = ({ onClose }) => {
  const [crawlTargets, setCrawlTargets] = useState<CrawlTarget[]>([]);
  const [crawlSessions, setCrawlSessions] = useState<CrawlSession[]>([]);
  const [crawlResults, setCrawlResults] = useState<CrawlResult[]>([]);
  const [analytics, setAnalytics] = useState<CrawlAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('targets');
  const [showCreateTarget, setShowCreateTarget] = useState(false);
  const [selectedTarget, setSelectedTarget] = useState<CrawlTarget | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'paused' | 'error'>('all');

  // Load initial data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [targets, sessions, results, analyticsData] = await Promise.all([
        webCrawlerService.getCrawlTargets(),
        webCrawlerService.getCrawlSessions(),
        webCrawlerService.getCrawlResults(),
        webCrawlerService.getCrawlAnalytics()
      ]);

      setCrawlTargets(targets);
      setCrawlSessions(sessions);
      setCrawlResults(results);
      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Failed to load crawler data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartCrawl = async (targetId: string) => {
    try {
      const session = await webCrawlerService.startCrawl(targetId);
      setCrawlSessions(prev => [session, ...prev]);
      await loadData(); // Refresh data
    } catch (error) {
      console.error('Failed to start crawl:', error);
    }
  };

  const handleStopCrawl = async (sessionId: string) => {
    try {
      await webCrawlerService.cancelCrawl(sessionId);
      await loadData(); // Refresh data
    } catch (error) {
      console.error('Failed to stop crawl:', error);
    }
  };

  const handleDeleteTarget = async (targetId: string) => {
    try {
      await webCrawlerService.deleteCrawlTarget(targetId);
      setCrawlTargets(prev => prev.filter(t => t.id !== targetId));
    } catch (error) {
      console.error('Failed to delete target:', error);
    }
  };

  const handleToggleTarget = async (targetId: string, enabled: boolean) => {
    try {
      await webCrawlerService.updateCrawlTarget(targetId, { enabled });
      setCrawlTargets(prev => 
        prev.map(t => t.id === targetId ? { ...t, enabled } : t)
      );
    } catch (error) {
      console.error('Failed to toggle target:', error);
    }
  };

  const handleIndexResults = async (targetId?: string) => {
    try {
      const indexed = await webCrawlerService.indexCrawlResults(targetId);
      console.log(`Indexed ${indexed} results`);
      // Show success notification
    } catch (error) {
      console.error('Failed to index results:', error);
    }
  };

  const filteredTargets = crawlTargets.filter(target => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'active') return target.enabled && target.status === 'active';
    if (filterStatus === 'paused') return !target.enabled || target.status === 'paused';
    if (filterStatus === 'error') return target.status === 'error';
    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      case 'paused': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
      case 'error': return 'text-red-600 bg-red-100 dark:bg-red-900/20';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4" />;
      case 'paused': return <Pause className="w-4 h-4" />;
      case 'error': return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading crawler dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-background/95 backdrop-blur-xl rounded-xl border border-border overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Globe className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-semibold">Web Crawler Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              Discover and index content from external websites
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={loadData}
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowCreateTarget(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Target
          </Button>
          
          {onClose && (
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
            >
              <EyeOff className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="p-4 border-b border-border">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Targets</p>
                  <p className="text-2xl font-bold">{analytics?.totalTargets || 0}</p>
                </div>
                <Target className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Targets</p>
                  <p className="text-2xl font-bold">{analytics?.activeTargets || 0}</p>
                </div>
                <Activity className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pages Crawled</p>
                  <p className="text-2xl font-bold">{analytics?.totalPagesCrawled || 0}</p>
                </div>
                <Network className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Content Indexed</p>
                  <p className="text-2xl font-bold">{analytics?.totalContentIndexed || 0}</p>
                </div>
                <Database className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
          <div className="flex h-full">
            {/* Sidebar */}
            <div className="w-64 border-r border-border bg-background/50 overflow-y-auto">
              <TabsList className="grid w-full grid-cols-1 m-4">
                <TabsTrigger value="targets" className="flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Targets
                </TabsTrigger>
                <TabsTrigger value="sessions" className="flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  Sessions
                </TabsTrigger>
                <TabsTrigger value="results" className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Results
                </TabsTrigger>
                <TabsTrigger value="analytics" className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Analytics
                </TabsTrigger>
                <TabsTrigger value="settings" className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Settings
                </TabsTrigger>
              </TabsList>

              {/* Filters for Targets */}
              {activeTab === 'targets' && (
                <div className="p-4 space-y-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Filter by Status</h3>
                    <div className="space-y-2">
                      {[
                        { value: 'all', label: 'All', count: crawlTargets.length },
                        { value: 'active', label: 'Active', count: crawlTargets.filter(t => t.enabled && t.status === 'active').length },
                        { value: 'paused', label: 'Paused', count: crawlTargets.filter(t => !t.enabled || t.status === 'paused').length },
                        { value: 'error', label: 'Error', count: crawlTargets.filter(t => t.status === 'error').length }
                      ].map(filter => (
                        <button
                          key={filter.value}
                          onClick={() => setFilterStatus(filter.value as any)}
                          className={`w-full flex items-center justify-between p-2 rounded-lg text-sm transition-colors ${
                            filterStatus === filter.value
                              ? 'bg-primary text-primary-foreground'
                              : 'hover:bg-accent'
                          }`}
                        >
                          <span>{filter.label}</span>
                          <Badge variant="outline" className="text-xs">
                            {filter.count}
                          </Badge>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto">
              <TabsContent value="targets" className="h-full p-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Crawl Targets</h2>
                    <Button onClick={() => setShowCreateTarget(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Target
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredTargets.map((target) => (
                      <CrawlerTargetCard
                        key={target.id}
                        target={target}
                        onStartCrawl={handleStartCrawl}
                        onStopCrawl={handleStopCrawl}
                        onDelete={handleDeleteTarget}
                        onToggle={handleToggleTarget}
                        onEdit={() => setSelectedTarget(target)}
                        onIndexResults={() => handleIndexResults(target.id)}
                      />
                    ))}
                  </div>

                  {filteredTargets.length === 0 && (
                    <div className="text-center py-12">
                      <Globe className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No crawl targets found</h3>
                      <p className="text-muted-foreground mb-4">
                        {filterStatus === 'all' 
                          ? 'Get started by adding your first crawl target'
                          : `No targets found with status: ${filterStatus}`
                        }
                      </p>
                      {filterStatus === 'all' && (
                        <Button onClick={() => setShowCreateTarget(true)}>
                          <Plus className="w-4 h-4 mr-2" />
                          Add Your First Target
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="sessions" className="h-full p-4">
                <CrawlSessionList
                  sessions={crawlSessions}
                  targets={crawlTargets}
                  onStopCrawl={handleStopCrawl}
                />
              </TabsContent>

              <TabsContent value="results" className="h-full p-4">
                <CrawlResultsGrid
                  results={crawlResults}
                  targets={crawlTargets}
                  onIndexResults={handleIndexResults}
                />
              </TabsContent>

              <TabsContent value="analytics" className="h-full p-4">
                <CrawlerAnalytics analytics={analytics} />
              </TabsContent>

              <TabsContent value="settings" className="h-full p-4">
                <div className="p-8 text-center text-muted-foreground">
                  Settings panel temporarily disabled
                </div>
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </div>

      {/* Create/Edit Target Modal */}
      <AnimatePresence>
        {showCreateTarget && (
          <CreateTargetModal
            target={selectedTarget}
            onClose={() => {
              setShowCreateTarget(false);
              setSelectedTarget(null);
            }}
            onSave={(target) => {
              setCrawlTargets(prev => [...prev, target]);
              setShowCreateTarget(false);
              setSelectedTarget(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// Placeholder components (to be implemented)
const CreateTargetModal: React.FC<{
  target?: CrawlTarget | null;
  onClose: () => void;
  onSave: (target: CrawlTarget) => void;
}> = ({ target, onClose, onSave }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-background rounded-xl border border-border p-6 w-full max-w-2xl mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">
            {target ? 'Edit Crawl Target' : 'Create New Crawl Target'}
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <EyeOff className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Target URL</label>
            <input
              type="url"
              placeholder="https://example.com"
              className="w-full p-3 border border-border rounded-lg bg-background"
              defaultValue={target?.url || ''}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Name</label>
            <input
              type="text"
              placeholder="My Website"
              className="w-full p-3 border border-border rounded-lg bg-background"
              defaultValue={target?.name || ''}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              placeholder="Brief description of what this target contains..."
              className="w-full p-3 border border-border rounded-lg bg-background h-20"
              defaultValue={target?.description || ''}
            />
          </div>
        </div>
        
        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={() => {
            // Create mock target for demo
            const newTarget: CrawlTarget = {
              id: `target-${Date.now()}`,
              name: 'New Target',
              url: 'https://example.com',
              description: 'New crawl target',
              enabled: true,
              crawlFrequency: 'daily',
              status: 'active',
              config: {
                maxDepth: 3,
                maxPages: 100,
                respectRobotsTxt: true,
                allowedDomains: [],
                blockedDomains: [],
                allowedPaths: [],
                blockedPaths: [],
                contentSelectors: {
                  title: 'h1, title',
                  content: 'article, .content',
                  description: 'meta[name="description"]',
                  author: '.author',
                  publishedDate: 'time[datetime]',
                  tags: '.tags'
                },
                extractImages: true,
                extractLinks: true,
                followExternalLinks: false,
                delayBetweenRequests: 1000,
                userAgent: 'StorySearch AI Crawler 1.0'
              },
              createdAt: new Date(),
              updatedAt: new Date()
            };
            onSave(newTarget);
          }}>
            {target ? 'Update' : 'Create'} Target
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CrawlerDashboard;
