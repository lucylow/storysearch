import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ExternalLink, 
  Calendar, 
  Tag, 
  Star, 
  Clock, 
  Eye, 
  ThumbsUp, 
  Bookmark, 
  Share2, 
  TrendingUp,
  Zap,
  Award,
  Users,
  MessageCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import type { SearchResult } from '../../services/storyblokService';

interface ResultCardProps {
  result: SearchResult;
}

const ResultCard: React.FC<ResultCardProps> = ({ result }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [showFullContent, setShowFullContent] = useState(false);

  const typeColors = {
    story: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800',
    component: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800',
    folder: 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800',
    tutorial: 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-800',
    guide: 'bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-300 dark:border-indigo-800',
    documentation: 'bg-teal-100 text-teal-800 border-teal-200 dark:bg-teal-900/20 dark:text-teal-300 dark:border-teal-800',
    article: 'bg-pink-100 text-pink-800 border-pink-200 dark:bg-pink-900/20 dark:text-pink-300 dark:border-pink-800'
  };

  const typeIcons = {
    story: '📄',
    component: '🧩',
    folder: '📁',
    tutorial: '🎓',
    guide: '📖',
    documentation: '📚',
    article: '📰'
  };

  const getRelevanceColor = (score: number) => {
    if (score >= 90) return 'text-green-600 dark:text-green-400';
    if (score >= 75) return 'text-blue-600 dark:text-blue-400';
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-gray-600 dark:text-gray-400';
  };

  const getRelevanceBadge = (score: number) => {
    if (score >= 90) return { text: 'Excellent Match', color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' };
    if (score >= 75) return { text: 'Great Match', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300' };
    if (score >= 60) return { text: 'Good Match', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300' };
    return { text: 'Fair Match', color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300' };
  };

  const relevanceScore = Math.round(result.relevanceScore * 100);
  const relevanceBadge = getRelevanceBadge(relevanceScore);
  const estimatedReadTime = Math.ceil(result.content.split(' ').length / 200);
  const mockViews = Math.floor(Math.random() * 5000) + 100;
  const mockLikes = Math.floor(Math.random() * 200) + 10;

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      className="glass rounded-3xl overflow-hidden border border-border/50 hover:border-primary/40 hover:shadow-[0_20px_40px_hsl(var(--primary)/0.15)] transition-all duration-500 group cursor-pointer backdrop-blur-xl"
      onClick={() => window.open(result.url, '_blank')}
    >
      {/* Thumbnail */}
      {result.thumbnail && (
        <div className="relative h-56 overflow-hidden">
          <img
            src={result.thumbnail}
            alt={result.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent" />
          
          {/* Type Badge */}
          <motion.div 
            className="absolute top-4 left-4"
            whileHover={{ scale: 1.05 }}
          >
            <span className={`inline-flex items-center px-3 py-2 rounded-xl text-sm font-semibold border backdrop-blur-sm ${typeColors[result.type]}`}>
              <span className="mr-2 text-lg">{typeIcons[result.type]}</span>
              {result.type}
            </span>
          </motion.div>

          {/* Relevance Score */}
          <motion.div 
            className="absolute top-4 right-4 flex items-center space-x-2 bg-background/95 backdrop-blur-md px-3 py-2 rounded-xl border border-border/50"
            whileHover={{ scale: 1.05 }}
          >
            <Star className="w-4 h-4 text-accent fill-current animate-pulse-glow" />
            <span className="text-sm font-bold text-foreground">
              {Math.round(result.relevanceScore * 100)}%
            </span>
          </motion.div>
        </div>
      )}

      {/* Content */}
      <div className="p-8">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors leading-tight">
            {result.title}
          </h3>
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="flex-shrink-0 ml-3"
          >
            <ExternalLink className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </motion.div>
        </div>

        <p className="text-muted-foreground text-base leading-relaxed mb-6 line-clamp-3">
          {result.content}
        </p>

        {/* Tags */}
        {result.tags && result.tags.length > 0 && (
          <div className="flex flex-wrap gap-3 mb-6">
            {result.tags.slice(0, 3).map((tag, index) => (
              <motion.span
                key={index}
                whileHover={{ scale: 1.05 }}
                className="inline-flex items-center px-3 py-2 bg-primary/15 text-primary rounded-xl text-sm font-medium border border-primary/20 hover:bg-primary/25 transition-colors"
              >
                <Tag className="w-4 h-4 mr-2" />
                {tag}
              </motion.span>
            ))}
            {result.tags.length > 3 && (
              <span className="text-sm text-muted-foreground px-3 py-2">
                +{result.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between text-sm text-muted-foreground pt-4 border-t border-border/30">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4" />
            <span className="font-medium">
              {new Date(result.updatedAt || result.createdAt).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-accent fill-current" />
              <span className="font-semibold">
                {Math.round(result.relevanceScore * 100)}% match
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ResultCard;