import React from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Sparkles, 
  TrendingUp, 
  Lightbulb, 
  ArrowRight,
  Zap,
  Target
} from 'lucide-react';

interface ImprovedEmptyStateProps {
  type?: 'no-search' | 'no-results' | 'error';
  onSuggestionClick?: (suggestion: string) => void;
  onActionClick?: (action: string) => void;
}

const ImprovedEmptyState: React.FC<ImprovedEmptyStateProps> = ({
  type = 'no-search',
  onSuggestionClick,
  onActionClick
}) => {
  const suggestions = {
    'no-search': [
      'Nike sustainability initiatives',
      'Tesla latest models 2025',
      'Apple vs Samsung comparison',
      'Top AI companies'
    ],
    'no-results': [
      'Try broader terms',
      'Check spelling',
      'Use different keywords',
      'Ask our AI assistant'
    ],
    error: [
      'Refresh the page',
      'Try again',
      'Contact support',
      'Check your connection'
    ]
  };

  const content = {
    'no-search': {
      icon: Search,
      title: 'Ready to Discover',
      description: 'Search for any company, topic, or content online',
      action: 'Start exploring with AI-powered search',
      color: 'from-primary to-secondary'
    },
    'no-results': {
      icon: Target,
      title: 'No Results Found',
      description: 'We couldn\'t find anything matching your search',
      action: 'Try these suggestions or ask our AI assistant',
      color: 'from-orange-500 to-orange-700'
    },
    error: {
      icon: Zap,
      title: 'Something Went Wrong',
      description: 'We encountered an error while searching',
      action: 'Here are some things you can try',
      color: 'from-red-500 to-red-700'
    }
  };

  const current = content[type];
  const Icon = current.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-4"
    >
      {/* Animated Icon */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 5, -5, 0]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="relative mb-8"
      >
        <div className={`w-24 h-24 bg-gradient-to-r ${current.color} rounded-3xl flex items-center justify-center shadow-2xl`}>
          <Icon className="w-12 h-12 text-white" />
        </div>
        
        {/* Floating particles */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-primary rounded-full"
            animate={{
              x: [0, 20 * (i + 1), 0],
              y: [0, -20 * (i + 1), 0],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.3
            }}
          />
        ))}
      </motion.div>

      {/* Content */}
      <h3 className="text-3xl font-bold text-foreground mb-3 text-center">
        {current.title}
      </h3>
      <p className="text-lg text-muted-foreground mb-8 text-center max-w-md">
        {current.description}
      </p>

      {/* Action Text */}
      <div className="flex items-center space-x-2 mb-6 text-primary">
        <Lightbulb className="w-5 h-5" />
        <span className="text-sm font-medium">{current.action}</span>
      </div>

      {/* Suggestions */}
      <div className="w-full max-w-md space-y-3">
        {suggestions[type].map((suggestion, index) => (
          <motion.button
            key={suggestion}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ x: 5, scale: 1.02 }}
            onClick={() => onSuggestionClick?.(suggestion)}
            className="w-full flex items-center justify-between p-4 glass rounded-xl border border-border hover:border-primary/30 hover:shadow-[0_0_20px_hsl(var(--primary)/0.1)] transition-all duration-300 group"
          >
            <span className="text-sm text-foreground group-hover:text-primary transition-colors">
              {suggestion}
            </span>
            <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
          </motion.button>
        ))}
      </div>

      {/* Quick Actions */}
      {type === 'no-search' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 flex flex-wrap gap-3 justify-center"
        >
          <button
            onClick={() => onActionClick?.('ai-chat')}
            className="px-6 py-3 bg-ai-gradient text-white rounded-xl hover:shadow-[0_0_20px_hsl(var(--primary)/0.4)] transition-all flex items-center space-x-2"
          >
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Ask AI Assistant</span>
          </button>
          
          <button
            onClick={() => onActionClick?.('voice-search')}
            className="px-6 py-3 glass rounded-xl border border-border hover:border-primary/30 transition-all flex items-center space-x-2"
          >
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">Try Voice Search</span>
          </button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ImprovedEmptyState;
