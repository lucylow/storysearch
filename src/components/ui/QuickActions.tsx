import React from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  TrendingUp,
  Bookmark,
  History,
  Settings,
  HelpCircle,
  Zap,
  Star
} from 'lucide-react';

interface QuickAction {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick: () => void;
  color: string;
  description?: string;
}

interface QuickActionsProps {
  onAction: (actionId: string) => void;
  actions?: QuickAction[];
}

const QuickActions: React.FC<QuickActionsProps> = ({ onAction, actions }) => {
  const defaultActions: QuickAction[] = [
    {
      id: 'trending',
      label: 'Trending',
      icon: TrendingUp,
      onClick: () => onAction('trending'),
      color: 'from-green-500 to-green-700',
      description: 'See what\'s popular now'
    },
    {
      id: 'ai-suggestions',
      label: 'AI Picks',
      icon: Sparkles,
      onClick: () => onAction('ai-suggestions'),
      color: 'from-purple-500 to-purple-700',
      description: 'Personalized for you'
    },
    {
      id: 'saved',
      label: 'Saved',
      icon: Bookmark,
      onClick: () => onAction('saved'),
      color: 'from-blue-500 to-blue-700',
      description: 'Your bookmarked content'
    },
    {
      id: 'history',
      label: 'History',
      icon: History,
      onClick: () => onAction('history'),
      color: 'from-orange-500 to-orange-700',
      description: 'Recent searches'
    }
  ];

  const displayActions = actions || defaultActions;

  return (
    <div className="flex flex-wrap gap-3 justify-center">
      {displayActions.map((action, index) => (
        <motion.button
          key={action.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={action.onClick}
          className="group relative"
          title={action.description}
        >
          <div className={`px-6 py-3 glass rounded-xl border border-border/50 hover:border-primary/30 transition-all duration-300 flex items-center space-x-2`}>
            <div className={`w-8 h-8 bg-gradient-to-r ${action.color} rounded-lg flex items-center justify-center`}>
              <action.icon className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
              {action.label}
            </span>
          </div>

          {/* Tooltip */}
          {action.description && (
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              <div className="bg-background border border-border rounded-lg px-3 py-2 shadow-lg whitespace-nowrap">
                <p className="text-xs text-muted-foreground">{action.description}</p>
              </div>
            </div>
          )}
        </motion.button>
      ))}
    </div>
  );
};

export default QuickActions;
