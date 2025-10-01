import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot,
  MessageCircle,
  Workflow,
  Compass,
  Sparkles,
  Brain,
  Zap,
  TrendingUp,
  Settings,
  Target
} from 'lucide-react';
import AskAI from './AskAI';
import AgentStudio from './AgentStudio';
import AgenticDiscovery from './AgenticDiscovery';

type AgentMode = 'ask-ai' | 'agent-studio' | 'agentic-discovery';

const AIAgentsDashboard: React.FC = () => {
  const [activeMode, setActiveMode] = useState<AgentMode>('ask-ai');

  const modes = [
    {
      id: 'ask-ai' as AgentMode,
      name: 'AskAI',
      description: 'Natural language Q&A with exact answers',
      icon: MessageCircle,
      color: 'from-blue-500 to-blue-700'
    },
    {
      id: 'agent-studio' as AgentMode,
      name: 'Agent Studio',
      description: 'Build autonomous agent workflows',
      icon: Workflow,
      color: 'from-purple-500 to-purple-700'
    },
    {
      id: 'agentic-discovery' as AgentMode,
      name: 'Agentic Discovery',
      description: 'Multi-step guided content journeys',
      icon: Compass,
      color: 'from-green-500 to-green-700'
    }
  ];

  return (
    <div className="min-h-screen bg-hero-gradient py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Dashboard Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center space-x-3 mb-6">
            <div className="w-16 h-16 bg-ai-gradient rounded-2xl flex items-center justify-center animate-glow">
              <Bot className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gradient-hero mb-4">
            AI Agents Dashboard
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Harness the power of autonomous AI agents for intelligent content discovery
          </p>
        </motion.div>

        {/* Mode Selector */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {modes.map((mode, index) => (
              <motion.button
                key={mode.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveMode(mode.id)}
                className={`p-6 rounded-2xl border-2 transition-all duration-300 text-left ${
                  activeMode === mode.id 
                    ? 'glass border-primary/50 shadow-[0_0_30px_hsl(var(--primary)/0.2)]' 
                    : 'glass border-border/50 hover:border-primary/30'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-r ${mode.color} rounded-xl flex items-center justify-center ${
                    activeMode === mode.id ? 'animate-glow' : ''
                  }`}>
                    <mode.icon className="w-6 h-6 text-white" />
                  </div>
                  {activeMode === mode.id && (
                    <div className="w-3 h-3 bg-primary rounded-full animate-pulse-glow" />
                  )}
                </div>
                <h3 className={`text-xl font-bold mb-2 ${
                  activeMode === mode.id ? 'text-primary' : 'text-foreground'
                }`}>
                  {mode.name}
                </h3>
                <p className="text-sm text-muted-foreground">{mode.description}</p>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Active Mode Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeMode}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeMode === 'ask-ai' && <AskAI />}
            {activeMode === 'agent-studio' && <AgentStudio />}
            {activeMode === 'agentic-discovery' && <AgenticDiscovery />}
          </motion.div>
        </AnimatePresence>

        {/* Features Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 glass rounded-2xl p-8 border border-border/50"
        >
          <h3 className="text-2xl font-bold text-foreground mb-6 text-center">
            Powered by Advanced AI Capabilities
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: 'Natural Language Understanding', icon: Brain, value: '95%' },
              { label: 'Multi-Step Reasoning', icon: Zap, value: '90%' },
              { label: 'Context Awareness', icon: Compass, value: '92%' },
              { label: 'Content Discovery', icon: Target, value: '88%' }
            ].map((capability, index) => (
              <motion.div
                key={capability.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="text-center"
              >
                <div className="w-12 h-12 bg-ai-gradient rounded-xl flex items-center justify-center mx-auto mb-3 animate-glow">
                  <capability.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-gradient mb-1">{capability.value}</div>
                <div className="text-xs text-muted-foreground">{capability.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AIAgentsDashboard;
