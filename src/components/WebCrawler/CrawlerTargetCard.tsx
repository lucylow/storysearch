import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Globe,
  Play,
  Pause,
  Square,
  Settings,
  Trash2,
  Edit,
  Eye,
  ExternalLink,
  Calendar,
  Clock,
  Target,
  Database,
  Zap,
  AlertCircle,
  CheckCircle,
  MoreVertical,
  Copy,
  Download
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import type { CrawlTarget } from '../../services/webCrawlerService';

interface CrawlerTargetCardProps {
  target: CrawlTarget;
  onStartCrawl: (targetId: string) => void;
  onStopCrawl: (sessionId: string) => void;
  onDelete: (targetId: string) => void;
  onToggle: (targetId: string, enabled: boolean) => void;
  onEdit: () => void;
  onIndexResults: () => void;
}

const CrawlerTargetCard: React.FC<CrawlerTargetCardProps> = ({
  target,
  onStartCrawl,
  onStopCrawl,
  onDelete,
  onToggle,
  onEdit,
  onIndexResults
}) => {
  const [showActions, setShowActions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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

  const getFrequencyColor = (frequency: string) => {
    switch (frequency) {
      case 'hourly': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      case 'daily': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'weekly': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'monthly': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const formatLastCrawled = (date?: Date) => {
    if (!date) return 'Never';
    
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return 'Recently';
  };

  const handleStartCrawl = async () => {
    setIsLoading(true);
    try {
      await onStartCrawl(target.id);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = () => {
    onToggle(target.id, !target.enabled);
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${target.name}"?`)) {
      onDelete(target.id);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="group"
    >
      <Card className="h-full hover:shadow-lg transition-all duration-200">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Globe className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <CardTitle className="text-base truncate">{target.name}</CardTitle>
                <p className="text-sm text-muted-foreground truncate">
                  {target.description}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-1">
              <Badge className={`text-xs ${getStatusColor(target.status)}`}>
                <div className="flex items-center gap-1">
                  {getStatusIcon(target.status)}
                  {target.status}
                </div>
              </Badge>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowActions(!showActions)}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* URL */}
          <div className="flex items-center gap-2">
            <ExternalLink className="w-4 h-4 text-muted-foreground" />
            <a
              href={target.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline truncate"
            >
              {target.url}
            </a>
          </div>

          {/* Status and Frequency */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${
                target.enabled ? 'bg-green-500' : 'bg-gray-400'
              }`} />
              <span className="text-sm text-muted-foreground">
                {target.enabled ? 'Enabled' : 'Disabled'}
              </span>
            </div>
            
            <Badge variant="outline" className={`text-xs ${getFrequencyColor(target.crawlFrequency)}`}>
              {target.crawlFrequency}
            </Badge>
          </div>

          {/* Last Crawled */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>Last crawled: {formatLastCrawled(target.lastCrawled)}</span>
          </div>

          {/* Configuration Summary */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-muted-foreground" />
              <span>Max {target.config.maxPages} pages</span>
            </div>
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-muted-foreground" />
              <span>Depth {target.config.maxDepth}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 pt-2 border-t border-border">
            <Button
              size="sm"
              onClick={handleStartCrawl}
              disabled={isLoading || !target.enabled}
              className="flex-1"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <Play className="w-4 h-4" />
              )}
              Start Crawl
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleToggle}
            >
              {target.enabled ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={onEdit}
            >
              <Edit className="w-4 h-4" />
            </Button>
          </div>

          {/* Quick Actions */}
          <AnimatePresence>
            {showActions && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2 pt-2 border-t border-border"
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onIndexResults}
                  className="w-full justify-start"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Index Results
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigator.clipboard.writeText(target.url)}
                  className="w-full justify-start"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy URL
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open(target.url, '_blank')}
                  className="w-full justify-start"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Preview Site
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDelete}
                  className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Target
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CrawlerTargetCard;
