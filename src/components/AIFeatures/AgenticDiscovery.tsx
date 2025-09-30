import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Compass,
  Bot,
  CheckCircle2,
  Circle,
  ArrowRight,
  Sparkles,
  Target,
  Zap,
  Brain,
  Play
} from 'lucide-react';
import { useAIAgent } from '../../hooks/useAIAgent';

interface JourneyStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'active' | 'completed';
  icon: React.ComponentType<{ className?: string }>;
}

const AgenticDiscovery: React.FC = () => {
  const { currentJourney, isProcessing } = useAIAgent();
  const [steps, setSteps] = useState<JourneyStep[]>([
    {
      id: 'step-1',
      title: 'Understanding Your Needs',
      description: 'Analyzing query intent and context',
      status: 'active',
      icon: Brain
    },
    {
      id: 'step-2',
      title: 'Content Discovery',
      description: 'Finding relevant Storyblok content',
      status: 'pending',
      icon: Compass
    },
    {
      id: 'step-3',
      title: 'Intelligent Recommendations',
      description: 'Curating personalized suggestions',
      status: 'pending',
      icon: Target
    },
    {
      id: 'step-4',
      title: 'Guided Journey',
      description: 'Creating your discovery path',
      status: 'pending',
      icon: Sparkles
    }
  ]);

  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    if (isProcessing) {
      // Simulate journey progression
      const interval = setInterval(() => {
        setCurrentStepIndex(prev => {
          if (prev < steps.length - 1) {
            const newSteps = [...steps];
            newSteps[prev].status = 'completed';
            newSteps[prev + 1].status = 'active';
            setSteps(newSteps);
            return prev + 1;
          }
          return prev;
        });
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [isProcessing]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gradient-hero mb-2">Agentic Discovery</h2>
        <p className="text-muted-foreground">Autonomous AI-guided content discovery journeys</p>
      </div>

      {/* Journey Visualization */}
      <div className="glass rounded-2xl border border-border/50 p-8">
        <div className="space-y-6">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = step.status === 'active';
            const isCompleted = step.status === 'completed';

            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <div className={`flex items-start gap-4 p-4 rounded-xl transition-all duration-300 ${
                  isActive ? 'bg-primary/10 border-2 border-primary/30' : 
                  isCompleted ? 'bg-green-50 dark:bg-green-900/10 border border-green-500/30' :
                  'bg-muted/20 border border-border/30'
                }`}>
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    isActive ? 'bg-ai-gradient animate-glow' :
                    isCompleted ? 'bg-green-500' :
                    'bg-muted'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle2 className="w-6 h-6 text-white" />
                    ) : isActive ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                      >
                        <Icon className="w-6 h-6 text-white" />
                      </motion.div>
                    ) : (
                      <Circle className="w-6 h-6 text-white" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className={`text-lg font-semibold ${
                        isActive ? 'text-primary' :
                        isCompleted ? 'text-green-600' :
                        'text-muted-foreground'
                      }`}>
                        {step.title}
                      </h3>
                      {isActive && (
                        <div className="flex gap-1">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" />
                          <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                          <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>

                  {/* Step Number */}
                  <div className={`text-2xl font-bold ${
                    isActive ? 'text-primary' :
                    isCompleted ? 'text-green-600' :
                    'text-muted-foreground/30'
                  }`}>
                    {index + 1}
                  </div>
                </div>

                {/* Connector */}
                {index < steps.length - 1 && (
                  <div className={`ml-6 w-0.5 h-6 ${
                    isCompleted ? 'bg-green-500' : 'bg-border'
                  }`} />
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Journey Progress */}
        <div className="mt-8 pt-6 border-t border-border/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Journey Progress</span>
            <span className="text-sm font-semibold text-primary">
              {Math.round((currentStepIndex / steps.length) * 100)}%
            </span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-ai-gradient"
              initial={{ width: 0 }}
              animate={{ width: `${(currentStepIndex / steps.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>

      {/* Discovery Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Content Found', value: '24', icon: Compass },
          { label: 'Insights Generated', value: '12', icon: Brain },
          { label: 'Recommendations', value: '8', icon: Target }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass rounded-xl p-4 border border-border/50 text-center"
          >
            <div className="w-8 h-8 bg-ai-gradient rounded-lg flex items-center justify-center mx-auto mb-2">
              <stat.icon className="w-4 h-4 text-white" />
            </div>
            <div className="text-2xl font-bold text-gradient mb-1">{stat.value}</div>
            <div className="text-xs text-muted-foreground">{stat.label}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AgenticDiscovery;
