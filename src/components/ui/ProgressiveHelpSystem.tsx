import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HelpCircle,
  X,
  Lightbulb,
  Keyboard,
  Sparkles,
  MessageCircle,
  Book,
  Video,
  ExternalLink,
  ArrowRight
} from 'lucide-react';

interface HelpTip {
  id: string;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  icon: React.ComponentType<{ className?: string }>;
  priority: number;
}

const ProgressiveHelpSystem: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentTip, setCurrentTip] = useState(0);
  const [dismissedTips, setDismissedTips] = useState<Set<string>>(new Set());

  const helpTips: HelpTip[] = [
    {
      id: 'voice-search',
      title: 'Try Voice Search',
      description: 'Click the microphone icon to search using your voice. Just say "Nike" or any company name!',
      icon: Sparkles,
      priority: 1,
      action: {
        label: 'Try it now',
        onClick: () => {
          const voiceButton = document.querySelector('[data-testid="voice-button"]') as HTMLButtonElement;
          voiceButton?.click();
          setIsOpen(false);
        }
      }
    },
    {
      id: 'ai-assistant',
      title: 'Chat with AI',
      description: 'Our AI assistant can answer questions about any company or topic. Try asking about Nike, Tesla, or Apple!',
      icon: MessageCircle,
      priority: 2,
      action: {
        label: 'Open AI Chat',
        onClick: () => {
          window.location.href = '/ai-agents';
          setIsOpen(false);
        }
      }
    },
    {
      id: 'keyboard-shortcuts',
      title: 'Keyboard Shortcuts',
      description: 'Press / to focus search, Ctrl+K for quick actions, and Esc to clear.',
      icon: Keyboard,
      priority: 3
    },
    {
      id: 'predictive-surfacing',
      title: 'Personalized Recommendations',
      description: 'The more you search, the better our AI gets at recommending relevant content.',
      icon: Lightbulb,
      priority: 4
    }
  ];

  const activeTips = helpTips.filter(tip => !dismissedTips.has(tip.id));

  const dismissTip = (tipId: string) => {
    const newDismissed = new Set(dismissedTips).add(tipId);
    setDismissedTips(newDismissed);
    localStorage.setItem('dismissed_tips', JSON.stringify(Array.from(newDismissed)));
  };

  useEffect(() => {
    const dismissed = localStorage.getItem('dismissed_tips');
    if (dismissed) {
      try {
        setDismissedTips(new Set(JSON.parse(dismissed)));
      } catch (e) {
        console.error('Failed to load dismissed tips');
      }
    }
  }, []);

  if (activeTips.length === 0) return null;

  const currentHelpTip = activeTips[currentTip % activeTips.length];
  const TipIcon = currentHelpTip.icon;

  return (
    <>
      {/* Help Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 3 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-6 z-40 w-14 h-14 bg-gradient-to-r from-accent to-purple-600 rounded-full shadow-2xl flex items-center justify-center group"
      >
        <HelpCircle className="w-6 h-6 text-white" />
        <motion.div
          className="absolute inset-0 bg-accent rounded-full opacity-40"
          animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.button>

      {/* Help Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-24 right-6 z-50 w-96 glass rounded-2xl border border-border/50 shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-accent to-purple-600 p-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Lightbulb className="w-5 h-5" />
                  <h3 className="font-bold">Quick Tips</h3>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-white/20 rounded transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Tip Content */}
            <div className="p-6">
              <div className="flex items-start space-x-3 mb-4">
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <TipIcon className="w-5 h-5 text-accent" />
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-foreground mb-2">
                    {currentHelpTip.title}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {currentHelpTip.description}
                  </p>
                </div>
              </div>

              {currentHelpTip.action && (
                <button
                  onClick={currentHelpTip.action.onClick}
                  className="w-full px-4 py-3 bg-accent/10 hover:bg-accent/20 text-accent rounded-xl transition-colors flex items-center justify-center space-x-2 mb-4"
                >
                  <span className="text-sm font-medium">{currentHelpTip.action.label}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}

              {/* Navigation */}
              <div className="flex items-center justify-between pt-4 border-t border-border/30">
                <div className="flex space-x-1">
                  {activeTips.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentTip(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentTip ? 'bg-accent w-6' : 'bg-muted'
                      }`}
                    />
                  ))}
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => dismissTip(currentHelpTip.id)}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Dismiss
                  </button>
                  <button
                    onClick={() => setCurrentTip((currentTip + 1) % activeTips.length)}
                    className="text-xs text-primary hover:text-primary/80 transition-colors font-medium"
                  >
                    Next tip →
                  </button>
                </div>
              </div>
            </div>

            {/* Resources */}
            <div className="border-t border-border/30 p-4 bg-background/30">
              <p className="text-xs text-muted-foreground mb-3">Need more help?</p>
              <div className="space-y-2">
                <button className="w-full text-left p-2 text-xs glass rounded-lg hover:bg-primary/5 transition-colors flex items-center space-x-2">
                  <Book className="w-3 h-3 text-muted-foreground" />
                  <span className="text-foreground">View Documentation</span>
                </button>
                <button className="w-full text-left p-2 text-xs glass rounded-lg hover:bg-primary/5 transition-colors flex items-center space-x-2">
                  <Video className="w-3 h-3 text-muted-foreground" />
                  <span className="text-foreground">Watch Tutorial</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ProgressiveHelpSystem;
