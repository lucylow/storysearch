import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  TrendingUp,
  Clock,
  Eye,
  Target,
  Brain,
  Zap,
  Star,
  ArrowRight,
  X,
  RefreshCw,
  Lightbulb,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';
import { usePredictiveSurfacing } from '../../hooks/usePredictiveSurfacing';

interface PredictiveSurfacingProps {
  onContentClick?: (contentId: string) => void;
  onDismiss?: () => void;
  showInSidebar?: boolean;
}

const PredictiveSurfacing: React.FC<PredictiveSurfacingProps> = ({
  onContentClick,
  onDismiss,
  showInSidebar = false
}) => {
  const {
    predictions,
    isAnalyzing,
    trackClick,
    analyzeBehavior
  } = usePredictiveSurfacing({
    enableBehaviorTracking: true,
    enableContextualAnalysis: true,
    enableTrendingContent: true,
    maxRecommendations: 6
  });

  const [dismissedPredictions, setDismissedPredictions] = useState<Set<string>>(new Set());
  const [feedbackGiven, setFeedbackGiven] = useState<Map<string, 'positive' | 'negative'>>(new Map());

  const visiblePredictions = predictions.filter(p => !dismissedPredictions.has(p.id));

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'behavior':
        return Brain;
      case 'context':
        return Clock;
      case 'trending':
        return TrendingUp;
      case 'similar':
        return Eye;
      case 'personalized':
        return Target;
      default:
        return Sparkles;
    }
  };

  const getSourceColor = (source: string) => {
    switch (source) {
      case 'behavior':
        return 'from-purple-500 to-purple-700';
      case 'context':
        return 'from-blue-500 to-blue-700';
      case 'trending':
        return 'from-green-500 to-green-700';
      case 'similar':
        return 'from-orange-500 to-orange-700';
      case 'personalized':
        return 'from-pink-500 to-pink-700';
      default:
        return 'from-primary to-secondary';
    }
  };

  const handleContentClick = (predictionId: string, contentId: string) => {
    trackClick(contentId, 'predictive-surfacing');
    if (onContentClick) {
      onContentClick(contentId);
    }
  };

  const handleDismiss = (predictionId: string) => {
    setDismissedPredictions(prev => new Set(prev).add(predictionId));
  };

  const handleFeedback = (predictionId: string, type: 'positive' | 'negative') => {
    setFeedbackGiven(prev => new Map(prev).set(predictionId, type));
    // Here you would send feedback to analytics/ML system
    console.log(`Feedback for ${predictionId}: ${type}`);
  };

  const handleRefresh = () => {
    analyzeBehavior();
  };

  if (visiblePredictions.length === 0 && !isAnalyzing) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${showInSidebar ? 'w-full' : 'w-full max-w-7xl mx-auto'}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-ai-gradient rounded-xl flex items-center justify-center animate-glow">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground">Recommended for You</h3>
            <p className="text-sm text-muted-foreground">AI-powered content predictions</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <motion.button
            onClick={handleRefresh}
            whileHover={{ scale: 1.05, rotate: 180 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 glass rounded-lg border border-border hover:border-primary/30 transition-all"
            disabled={isAnalyzing}
          >
            <RefreshCw className={`w-4 h-4 text-muted-foreground ${isAnalyzing ? 'animate-spin' : ''}`} />
          </motion.button>

          {onDismiss && (
            <motion.button
              onClick={onDismiss}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 glass rounded-lg border border-border hover:border-destructive/30 transition-all"
            >
              <X className="w-4 h-4 text-muted-foreground hover:text-destructive" />
            </motion.button>
          )}
        </div>
      </div>

      {/* Loading State */}
      {isAnalyzing && visiblePredictions.length === 0 && (
        <div className="glass rounded-xl p-8 border border-border/50 text-center">
          <div className="flex items-center justify-center space-x-2 mb-3">
            <Brain className="w-5 h-5 text-primary animate-pulse" />
            <span className="text-sm text-muted-foreground">Analyzing your preferences...</span>
          </div>
          <div className="flex justify-center space-x-1">
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
          </div>
        </div>
      )}

      {/* Predictions Grid */}
      <AnimatePresence>
        {visiblePredictions.length > 0 && (
          <motion.div
            className={`grid ${showInSidebar ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'} gap-4`}
          >
            {visiblePredictions.map((prediction, index) => {
              const SourceIcon = getSourceIcon(prediction.source);
              const feedback = feedbackGiven.get(prediction.id);

              return (
                <motion.div
                  key={prediction.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  className="group relative glass rounded-xl border border-border/50 hover:border-primary/30 overflow-hidden transition-all duration-300 cursor-pointer"
                  onClick={() => handleContentClick(prediction.id, prediction.content.id)}
                >
                  {/* Confidence Bar */}
                  <div 
                    className="absolute top-0 left-0 h-1 bg-gradient-to-r from-primary to-secondary"
                    style={{ width: `${prediction.confidence * 100}%` }}
                  />

                  {/* Content */}
                  <div className="p-4">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className={`w-8 h-8 bg-gradient-to-r ${getSourceColor(prediction.source)} rounded-lg flex items-center justify-center flex-shrink-0`}>
                        <SourceIcon className="w-4 h-4 text-white" />
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDismiss(prediction.id);
                        }}
                        className="p-1 hover:bg-muted rounded transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <X className="w-3 h-3 text-muted-foreground" />
                      </button>
                    </div>

                    {/* Title & Content */}
                    <h4 className="text-sm font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {prediction.content.title}
                    </h4>

                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                      {prediction.content.content}
                    </p>

                    {/* Reason */}
                    <div className="flex items-center space-x-1 mb-3">
                      <Lightbulb className="w-3 h-3 text-accent" />
                      <span className="text-xs text-accent font-medium">{prediction.reason}</span>
                    </div>

                    {/* Tags */}
                    {prediction.content.tags && prediction.content.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {prediction.content.tags.slice(0, 3).map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-3 border-t border-border/30">
                      {/* Confidence */}
                      <div className="flex items-center space-x-1">
                        <Star className="w-3 h-3 text-accent fill-current" />
                        <span className="text-xs text-muted-foreground">
                          {Math.round(prediction.confidence * 100)}% match
                        </span>
                      </div>

                      {/* Feedback */}
                      {!feedback ? (
                        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleFeedback(prediction.id, 'positive');
                            }}
                            className="p-1 hover:bg-green-100 dark:hover:bg-green-900/20 rounded transition-colors"
                          >
                            <ThumbsUp className="w-3 h-3 text-green-600" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleFeedback(prediction.id, 'negative');
                            }}
                            className="p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded transition-colors"
                          >
                            <ThumbsDown className="w-3 h-3 text-red-600" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-1">
                          {feedback === 'positive' ? (
                            <>
                              <ThumbsUp className="w-3 h-3 text-green-600 fill-current" />
                              <span className="text-xs text-green-600">Thanks!</span>
                            </>
                          ) : (
                            <>
                              <ThumbsDown className="w-3 h-3 text-red-600 fill-current" />
                              <span className="text-xs text-red-600">Noted</span>
                            </>
                          )}
                        </div>
                      )}

                      {/* View Arrow */}
                      <div className="flex items-center text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-xs font-medium mr-1">View</span>
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Info Footer */}
      {visiblePredictions.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-4 text-center"
        >
          <p className="text-xs text-muted-foreground">
            Recommendations are based on your search history, viewing patterns, and current context.{' '}
            <span className="text-primary cursor-pointer hover:underline">Learn more</span>
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default PredictiveSurfacing;
