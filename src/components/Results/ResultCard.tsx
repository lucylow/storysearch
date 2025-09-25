import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Calendar, Tag, Star } from 'lucide-react';
import type { SearchResult } from '../../services/storyblokService';

interface ResultCardProps {
  result: SearchResult;
}

const ResultCard: React.FC<ResultCardProps> = ({ result }) => {
  const typeColors = {
    story: 'bg-blue-100 text-blue-800 border-blue-200',
    component: 'bg-green-100 text-green-800 border-green-200',
    folder: 'bg-purple-100 text-purple-800 border-purple-200'
  };

  const typeIcons = {
    story: '📄',
    component: '🧩',
    folder: '📁'
  };

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      className="glass rounded-2xl overflow-hidden border border-border hover:border-primary/30 hover:shadow-[0_8px_30px_hsl(var(--primary)/0.12)] transition-all duration-300 group cursor-pointer"
      onClick={() => window.open(result.url, '_blank')}
    >
      {/* Thumbnail */}
      {result.thumbnail && (
        <div className="relative h-48 overflow-hidden">
          <img
            src={result.thumbnail}
            alt={result.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
          
          {/* Type Badge */}
          <div className="absolute top-3 left-3">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${typeColors[result.type]}`}>
              <span className="mr-1">{typeIcons[result.type]}</span>
              {result.type}
            </span>
          </div>

          {/* Relevance Score */}
          <div className="absolute top-3 right-3 flex items-center space-x-1 bg-background/90 backdrop-blur-sm px-2 py-1 rounded-full">
            <Star className="w-3 h-3 text-accent fill-current" />
            <span className="text-xs font-medium text-foreground">
              {Math.round(result.relevanceScore * 100)}%
            </span>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors leading-tight">
            {result.title}
          </h3>
          <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 ml-2" />
        </div>

        <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3">
          {result.content}
        </p>

        {/* Tags */}
        {result.tags && result.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {result.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium"
              >
                <Tag className="w-3 h-3 mr-1" />
                {tag}
              </span>
            ))}
            {result.tags.length > 3 && (
              <span className="text-xs text-muted-foreground">
                +{result.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center space-x-1">
            <Calendar className="w-3 h-3" />
            <span>{new Date(result.updatedAt || result.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>Relevance: {Math.round(result.relevanceScore * 100)}%</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ResultCard;