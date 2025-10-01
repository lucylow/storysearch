import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Sparkles, Brain, Zap, Search } from 'lucide-react';

interface EnhancedLoadingStateProps {
  message?: string;
  type?: 'search' | 'ai' | 'analysis' | 'default';
  showProgress?: boolean;
  progress?: number;
}

const EnhancedLoadingState: React.FC<EnhancedLoadingStateProps> = ({
  message = 'Loading...',
  type = 'default',
  showProgress = false,
  progress = 0
}) => {
  const getIcon = () => {
    switch (type) {
      case 'search':
        return Search;
      case 'ai':
        return Brain;
      case 'analysis':
        return Sparkles;
      default:
        return Loader2;
    }
  };

  const Icon = getIcon();

  const loadingMessages = {
    search: [
      'Searching the web...',
      'Analyzing content...',
      'Finding relevant results...',
      'Almost there...'
    ],
    ai: [
      'AI is thinking...',
      'Processing your request...',
      'Generating response...',
      'Finalizing answer...'
    ],
    analysis: [
      'Analyzing content...',
      'Extracting insights...',
      'Building recommendations...',
      'Preparing results...'
    ],
    default: [
      'Loading...',
      'Please wait...',
      'Processing...',
      'Almost ready...'
    ]
  };

  const [currentMessage, setCurrentMessage] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % loadingMessages[type].length);
    }, 2000);

    return () => clearInterval(interval);
  }, [type]);

  return (
    <div className="flex flex-col items-center justify-center py-12">
      {/* Animated Icon */}
      <motion.div
        className="relative mb-6"
        animate={{
          rotate: 360,
          scale: [1, 1.1, 1]
        }}
        transition={{
          rotate: { duration: 2, repeat: Infinity, ease: "linear" },
          scale: { duration: 1, repeat: Infinity }
        }}
      >
        <div className="w-16 h-16 bg-ai-gradient rounded-full flex items-center justify-center animate-glow">
          <Icon className="w-8 h-8 text-white" />
        </div>
        
        {/* Pulse rings */}
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute inset-0 border-2 border-primary rounded-full"
            animate={{
              scale: [1, 2, 2],
              opacity: [0.5, 0, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.6
            }}
          />
        ))}
      </motion.div>

      {/* Animated Messages */}
      <AnimatePresence mode="wait">
        <motion.p
          key={currentMessage}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="text-lg font-medium text-foreground mb-2"
        >
          {loadingMessages[type][currentMessage]}
        </motion.p>
      </AnimatePresence>

      <p className="text-sm text-muted-foreground">{message}</p>

      {/* Progress Bar */}
      {showProgress && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-64 mt-6"
        >
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-ai-gradient"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <p className="text-xs text-center text-muted-foreground mt-2">
            {Math.round(progress)}% complete
          </p>
        </motion.div>
      )}

      {/* Bouncing dots */}
      <div className="flex space-x-2 mt-6">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-3 h-3 bg-primary rounded-full"
            animate={{
              y: [0, -10, 0],
              opacity: [0.3, 1, 0.3]
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              delay: i * 0.2
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default EnhancedLoadingState;
