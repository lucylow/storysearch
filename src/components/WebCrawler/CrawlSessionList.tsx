import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity,
  Play,
  Pause,
  Square,
  Clock,
  CheckCircle,
  AlertCircle,
  X,
  Eye,
  Download,
  RefreshCw,
  Calendar,
  Timer,
  TrendingUp,
  Target,
  FileText
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import type { CrawlSession, CrawlTarget } from '../../services/webCrawlerService';

interface CrawlSessionListProps {
  sessions: CrawlSession[];
  targets: CrawlTarget[];
  onStopCrawl: (sessionId: string) => void;
}

const CrawlSessionList: React.FC<CrawlSessionListProps> = ({
  sessions,
  targets,
  onStopCrawl
}) => {
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'running' | 'completed' | 'failed' | 'cancelled'>('all');

  const getTargetName = (targetId: string) => {
    const target = targets.find(t => t.id === targetId);
    return target?.name || 'Unknown Target';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20';
      case 'completed': return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      case 'failed': return 'text-red-600 bg-red-100 dark:bg-red-900/20';
      case 'cancelled': return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running': return <Activity className="w-4 h-4 animate-pulse" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'failed': return <AlertCircle className="w-4 h-4" />;
      case 'cancelled': return <X className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const formatDuration = (startTime: Date, endTime?: Date) => {
    const end = endTime || new Date();
    const duration = end.getTime() - startTime.getTime();
    const seconds = Math.floor(duration / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const filteredSessions = sessions.filter(session => {
    if (filterStatus === 'all') return true;
    return session.status === filterStatus;
  });

  const getSuccessRate = (session: CrawlSession) => {
    if (session.pagesCrawled === 0) return 0;
    return ((session.pagesCrawled - session.errors) / session.pagesCrawled) * 100;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Crawl Sessions</h2>
          <p className="text-sm text-muted-foreground">
            Monitor and manage your crawling activities
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2">
        {[
          { value: 'all', label: 'All', count: sessions.length },
          { value: 'running', label: 'Running', count: sessions.filter(s => s.status === 'running').length },
          { value: 'completed', label: 'Completed', count: sessions.filter(s => s.status === 'completed').length },
          { value: 'failed', label: 'Failed', count: sessions.filter(s => s.status === 'failed').length },
          { value: 'cancelled', label: 'Cancelled', count: sessions.filter(s => s.status === 'cancelled').length }
        ].map(filter => (
          <Button
            key={filter.value}
            variant={filterStatus === filter.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterStatus(filter.value as any)}
            className="flex items-center gap-2"
          >
            {filter.label}
            <Badge variant="outline" className="text-xs">
              {filter.count}
            </Badge>
          </Button>
        ))}
      </div>

      {/* Sessions List */}
      <div className="space-y-4">
        {filteredSessions.map((session) => (
          <motion.div
            key={session.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -2 }}
          >
            <Card className={`cursor-pointer transition-all duration-200 ${
              selectedSession === session.id ? 'ring-2 ring-primary' : ''
            }`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Activity className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-base">
                        {getTargetName(session.targetId)}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Started {formatDate(session.startTime)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge className={`text-xs ${getStatusColor(session.status)}`}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(session.status)}
                        {session.status}
                      </div>
                    </Badge>
                    
                    {session.status === 'running' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onStopCrawl(session.id);
                        }}
                      >
                        <Square className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{session.pagesCrawled}</div>
                    <div className="text-sm text-muted-foreground">Pages Crawled</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{session.pagesFound}</div>
                    <div className="text-sm text-muted-foreground">Pages Found</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{session.errors}</div>
                    <div className="text-sm text-muted-foreground">Errors</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {Math.round(getSuccessRate(session))}%
                    </div>
                    <div className="text-sm text-muted-foreground">Success Rate</div>
                  </div>
                </div>

                {/* Progress Bar */}
                {session.status === 'running' && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Progress</span>
                      <span>{Math.round(session.progress)}%</span>
                    </div>
                    <Progress value={session.progress} className="h-2" />
                    {session.currentUrl && (
                      <p className="text-xs text-muted-foreground truncate">
                        Currently crawling: {session.currentUrl}
                      </p>
                    )}
                  </div>
                )}

                {/* Session Details */}
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Timer className="w-4 h-4" />
                      {formatDuration(session.startTime, session.endTime)}
                    </div>
                    
                    {session.endTime && (
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Ended {formatDate(session.endTime)}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedSession(selectedSession === session.id ? null : session.id);
                      }}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Expanded Details */}
                <AnimatePresence>
                  {selectedSession === session.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="pt-4 border-t border-border mt-4"
                    >
                      <div className="space-y-4">
                        {/* Error Log */}
                        {session.errorLog.length > 0 && (
                          <div>
                            <h4 className="text-sm font-medium mb-2">Recent Errors</h4>
                            <div className="space-y-2 max-h-32 overflow-y-auto">
                              {session.errorLog.slice(-5).map((error, index) => (
                                <div key={index} className="p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-red-800 dark:text-red-200">
                                      {error.url}
                                    </span>
                                    <span className="text-xs text-red-600 dark:text-red-400">
                                      {formatDate(error.timestamp)}
                                    </span>
                                  </div>
                                  <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                                    {error.error}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Statistics */}
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-sm font-medium mb-2">Content Statistics</h4>
                            <div className="space-y-1 text-sm text-muted-foreground">
                              <div>Total Content Length: {session.totalContentLength.toLocaleString()} chars</div>
                              <div>Average Content Length: {Math.round(session.averageContentLength)} chars</div>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium mb-2">Performance</h4>
                            <div className="space-y-1 text-sm text-muted-foreground">
                              <div>Success Rate: {Math.round(getSuccessRate(session))}%</div>
                              <div>Error Rate: {Math.round((session.errors / session.pagesCrawled) * 100)}%</div>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 pt-2">
                          <Button variant="outline" size="sm">
                            <FileText className="w-4 h-4 mr-2" />
                            View Results
                          </Button>
                          
                          <Button variant="outline" size="sm">
                            <Download className="w-4 h-4 mr-2" />
                            Export Log
                          </Button>
                          
                          {session.status === 'completed' && (
                            <Button variant="outline" size="sm">
                              <RefreshCw className="w-4 h-4 mr-2" />
                              Re-run
                            </Button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {filteredSessions.length === 0 && (
        <div className="text-center py-12">
          <Activity className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No crawl sessions found</h3>
          <p className="text-muted-foreground mb-4">
            {filterStatus === 'all' 
              ? 'Start your first crawl to see sessions here'
              : `No sessions found with status: ${filterStatus}`
            }
          </p>
          {filterStatus === 'all' && (
            <Button>
              <Play className="w-4 h-4 mr-2" />
              Start Crawling
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default CrawlSessionList;
