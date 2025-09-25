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
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="group cursor-pointer"
      onClick={() => window.open(result.url, '_blank')}
    >
      <Card className="h-full overflow-hidden border-2 border-border/50 hover:border-primary/40 hover:shadow-[0_20px_40px_hsl(var(--primary)/0.15)] transition-all duration-500 backdrop-blur-xl bg-background/80">
        {/* Thumbnail Section */}
        {result.thumbnail && (
          <div className="relative h-64 overflow-hidden">
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
              <Badge className={`inline-flex items-center px-3 py-2 rounded-xl text-sm font-semibold border backdrop-blur-sm ${typeColors[result.type as keyof typeof typeColors] || typeColors.story}`}>
                <span className="mr-2 text-lg">{typeIcons[result.type as keyof typeof typeIcons] || typeIcons.story}</span>
                {result.type}
              </Badge>
            </motion.div>

            {/* Relevance Score */}
            <motion.div 
              className="absolute top-4 right-4 flex items-center space-x-2 bg-background/95 backdrop-blur-md px-3 py-2 rounded-xl border border-border/50"
              whileHover={{ scale: 1.05 }}
            >
              <Star className={`w-4 h-4 ${getRelevanceColor(relevanceScore)} fill-current animate-pulse-glow`} />
              <span className="text-sm font-bold text-foreground">
                {relevanceScore}%
              </span>
            </motion.div>

            {/* Action Buttons */}
            <div className="absolute bottom-4 right-4 flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Button
                variant="secondary"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsBookmarked(!isBookmarked);
                }}
                className="h-8 w-8 p-0 bg-background/90 backdrop-blur-sm hover:bg-background"
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current text-primary' : ''}`} />
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsLiked(!isLiked);
                }}
                className="h-8 w-8 p-0 bg-background/90 backdrop-blur-sm hover:bg-background"
              >
                <ThumbsUp className={`w-4 h-4 ${isLiked ? 'fill-current text-primary' : ''}`} />
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  navigator.share?.({ title: result.title, url: result.url });
                }}
                className="h-8 w-8 p-0 bg-background/90 backdrop-blur-sm hover:bg-background"
              >
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Content Section */}
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors leading-tight mb-2">
                {result.title}
              </h3>
              <div className="flex items-center space-x-3 mb-3">
                <Badge variant="outline" className={`text-xs ${relevanceBadge.color}`}>
                  {relevanceBadge.text}
                </Badge>
                <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  <span>{estimatedReadTime} min read</span>
                </div>
              </div>
            </div>
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="flex-shrink-0 ml-3"
            >
              <ExternalLink className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </motion.div>
          </div>

          {/* Content Preview */}
          <div className="mb-6">
            <p className="text-muted-foreground text-base leading-relaxed line-clamp-3">
              {showFullContent ? result.content : result.content.substring(0, 200) + (result.content.length > 200 ? '...' : '')}
            </p>
            {result.content.length > 200 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowFullContent(!showFullContent);
                }}
                className="mt-2 p-0 h-auto text-primary hover:text-primary/80"
              >
                {showFullContent ? 'Show less' : 'Read more'}
              </Button>
            )}
          </div>

          {/* Tags */}
          {result.tags && result.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {result.tags.slice(0, 4).map((tag, index) => (
                <motion.span
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  className="inline-flex items-center px-3 py-1 bg-primary/15 text-primary rounded-lg text-sm font-medium border border-primary/20 hover:bg-primary/25 transition-colors"
                >
                  <Tag className="w-3 h-3 mr-1" />
                  {tag}
                </motion.span>
              ))}
              {result.tags.length > 4 && (
                <span className="text-sm text-muted-foreground px-3 py-1">
                  +{result.tags.length - 4} more
                </span>
              )}
            </div>
          )}

          {/* Stats and Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-border/30">
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span className="font-medium">
                  {new Date(result.updatedAt || result.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <Eye className="w-4 h-4" />
                <span>{mockViews.toLocaleString()}</span>
              </div>
              <div className="flex items-center space-x-1">
                <ThumbsUp className="w-4 h-4" />
                <span>{mockLikes}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <Star className={`w-4 h-4 ${getRelevanceColor(relevanceScore)} fill-current`} />
                <span className={`font-semibold text-sm ${getRelevanceColor(relevanceScore)}`}>
                  {relevanceScore}% match
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ResultCard;