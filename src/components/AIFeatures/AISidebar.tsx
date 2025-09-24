import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingUp, Clock, Users, Zap, BarChart3, Lightbulb } from 'lucide-react';

interface AISidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const AISidebar: React.FC<AISidebarProps> = ({ isOpen, onClose }) => {
  const insights = [
    {
      icon: TrendingUp,
      title: 'Popular Searches',
      items: [
        'Storyblok setup guide',
        'Content modeling best practices',
        'API integration tutorials'
      ]
    },
    {
      icon: Clock,
      title: 'Recent Activity',
      items: [
        'Searched "headless CMS"',
        'Viewed Next.js tutorial',
        'Asked about SEO optimization'
      ]
    },
    {
      icon: Users,
      title: 'Team Insights',
      items: [
        '12 searches today',
        '85% accuracy rate',
        '3 new content pieces'
      ]
    }
  ];

  const quickActions = [
    { icon: Zap, label: 'Quick Search', action: () => {} },
    { icon: BarChart3, label: 'Analytics', action: () => {} },
    { icon: Lightbulb, label: 'AI Suggestions', action: () => {} }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-80 glass border-l border-border z-50 overflow-y-auto"
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-foreground">AI Assistant</h3>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              {/* Quick Actions */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-foreground mb-3">Quick Actions</h4>
                <div className="space-y-2">
                  {quickActions.map((action, index) => (
                    <button
                      key={index}
                      onClick={action.action}
                      className="w-full flex items-center space-x-3 p-3 glass rounded-lg hover:bg-primary/5 transition-colors"
                    >
                      <action.icon className="w-5 h-5 text-primary" />
                      <span className="text-sm text-foreground">{action.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* AI Insights */}
              <div className="space-y-6">
                {insights.map((section, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-center space-x-2 mb-3">
                      <section.icon className="w-4 h-4 text-primary" />
                      <h4 className="text-sm font-medium text-foreground">{section.title}</h4>
                    </div>
                    <div className="space-y-2">
                      {section.items.map((item, itemIndex) => (
                        <div
                          key={itemIndex}
                          className="p-3 glass rounded-lg border border-border/50"
                        >
                          <p className="text-sm text-muted-foreground">{item}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* AI Tip */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-6 p-4 bg-ai-gradient rounded-lg text-white"
              >
                <div className="flex items-start space-x-2">
                  <Lightbulb className="w-5 h-5 mt-0.5" />
                  <div>
                    <h5 className="font-medium mb-1">AI Tip</h5>
                    <p className="text-sm text-white/80">
                      Try asking specific questions about your content to get more targeted results.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AISidebar;