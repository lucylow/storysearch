import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Sparkles, 
  Mic, 
  Eye, 
  ArrowRight, 
  X, 
  CheckCircle,
  Lightbulb,
  Zap,
  Target
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
  tips?: string[];
}

interface OnboardingProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ isOpen, onClose, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());

  const steps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to StorySearch AI!',
      description: 'Discover intelligent content search powered by AI. Let\'s get you started with the key features.',
      icon: <Sparkles className="w-8 h-8 text-primary" />,
      tips: [
        'AI-powered search understands context and intent',
        'Get instant suggestions as you type',
        'Voice search for hands-free searching'
      ]
    },
    {
      id: 'search',
      title: 'Smart Search',
      description: 'Type your query or use voice search. Our AI will understand what you\'re looking for and provide relevant results.',
      icon: <Search className="w-8 h-8 text-blue-600" />,
      action: {
        label: 'Try searching',
        onClick: () => {
          // Focus search input
          const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
          searchInput?.focus();
        }
      },
      tips: [
        'Press "/" to quickly focus the search',
        'Use natural language queries',
        'Try voice search with the mic button'
      ]
    },
    {
      id: 'filters',
      title: 'Advanced Filtering',
      description: 'Filter results by content type, tags, or date. Sort by relevance, popularity, or recency.',
      icon: <Filter className="w-8 h-8 text-green-600" />,
      action: {
        label: 'Explore filters',
        onClick: () => {
          // Open filters panel
          const filterButton = document.querySelector('[data-testid="filter-button"]') as HTMLButtonElement;
          filterButton?.click();
        }
      },
      tips: [
        'Use Ctrl+F to toggle filters quickly',
        'Combine multiple filters for precise results',
        'Save your favorite filter combinations'
      ]
    },
    {
      id: 'ai-features',
      title: 'AI-Powered Features',
      description: 'Get intelligent insights, content recommendations, and AI-generated summaries.',
      icon: <Brain className="w-8 h-8 text-purple-600" />,
      action: {
        label: 'Open AI Assistant',
        onClick: () => {
          // Open AI sidebar
          const aiButton = document.querySelector('[data-testid="ai-button"]') as HTMLButtonElement;
          aiButton?.click();
        }
      },
      tips: [
        'AI analyzes your search patterns',
        'Get personalized recommendations',
        'Ask questions about your content'
      ]
    },
    {
      id: 'keyboard',
      title: 'Keyboard Shortcuts',
      description: 'Speed up your workflow with these handy keyboard shortcuts.',
      icon: <Zap className="w-8 h-8 text-orange-600" />,
      tips: [
        'Press "?" anytime for help',
        'Use arrow keys to navigate suggestions',
        'Enter to select, Escape to cancel'
      ]
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    setCompletedSteps(new Set(steps.map(step => step.id)));
    onComplete();
    onClose();
  };

  const handleSkip = () => {
    onClose();
  };

  const currentStepData = steps[currentStep];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-background border border-border rounded-lg p-6 max-w-lg w-full mx-4"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            {currentStepData.icon}
            <div>
              <h2 className="text-xl font-semibold">{currentStepData.title}</h2>
              <p className="text-sm text-muted-foreground">
                Step {currentStep + 1} of {steps.length}
              </p>
            </div>
          </div>
          <button
            onClick={handleSkip}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index <= currentStep ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
          <div className="w-full bg-muted rounded-full h-1">
            <motion.div
              className="h-1 bg-primary rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="mb-6">
          <p className="text-muted-foreground mb-4">{currentStepData.description}</p>
          
          {currentStepData.tips && (
            <div className="space-y-2">
              <h4 className="font-medium text-sm flex items-center">
                <Lightbulb className="w-4 h-4 mr-2 text-yellow-500" />
                Pro Tips
              </h4>
              <ul className="space-y-1">
                {currentStepData.tips.map((tip, index) => (
                  <li key={index} className="text-sm text-muted-foreground flex items-start">
                    <CheckCircle className="w-3 h-3 mr-2 mt-0.5 text-green-500 flex-shrink-0" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {currentStep > 0 && (
              <Button variant="outline" onClick={handlePrevious}>
                Previous
              </Button>
            )}
            {currentStepData.action && (
              <Button variant="secondary" onClick={currentStepData.action.onClick}>
                {currentStepData.action.label}
              </Button>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="ghost" onClick={handleSkip}>
              Skip Tour
            </Button>
            <Button onClick={handleNext}>
              {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// Quick tips component for ongoing help
export const QuickTips: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const tips = [
    {
      icon: <Search className="w-5 h-5 text-blue-600" />,
      title: 'Smart Search',
      description: 'Try natural language queries like "How to set up Storyblok with React"'
    },
    {
      icon: <Filter className="w-5 h-5 text-green-600" />,
      title: 'Advanced Filters',
      description: 'Use filters to narrow down results by type, tags, or date range'
    },
    {
      icon: <Mic className="w-5 h-5 text-purple-600" />,
      title: 'Voice Search',
      description: 'Click the mic button for hands-free searching'
    },
    {
      icon: <Sparkles className="w-5 h-5 text-orange-600" />,
      title: 'AI Assistant',
      description: 'Get personalized recommendations and content insights'
    }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed top-4 right-4 z-50">
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 50 }}
        className="bg-background border border-border rounded-lg p-4 max-w-sm shadow-lg"
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">Quick Tips</h3>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-3">
          {tips.map((tip, index) => (
            <div key={index} className="flex items-start space-x-3">
              {tip.icon}
              <div>
                <h4 className="font-medium text-sm">{tip.title}</h4>
                <p className="text-xs text-muted-foreground">{tip.description}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Onboarding;
