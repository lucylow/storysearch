import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, 
  Sparkles, 
  Zap, 
  Brain, 
  ArrowRight, 
  Play, 
  Check,
  Settings,
  Workflow
} from 'lucide-react';
import { useAIAgent } from '../../hooks/useAIAgent';

const AgentStudio: React.FC = () => {
  const { messages, sendMessage, isProcessing, currentJourney } = useAIAgent();
  const [input, setInput] = useState('');
  const [selectedWorkflow, setSelectedWorkflow] = useState<string | null>(null);

  const workflows = [
    {
      id: 'content-discovery',
      name: 'Content Discovery Journey',
      description: 'Guide users through finding relevant online content',
      steps: 3,
      icon: Sparkles
    },
    {
      id: 'learning-path',
      name: 'Learning Path Creator',
      description: 'Create personalized learning journeys',
      steps: 4,
      icon: Brain
    },
    {
      id: 'comparison-agent',
      name: 'Comparison Agent',
      description: 'Compare options and provide recommendations',
      steps: 3,
      icon: Zap
    }
  ];

  const handleSend = async () => {
    if (!input.trim() || isProcessing) return;
    try {
      await sendMessage(input);
      setInput('');
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gradient-hero mb-2">Agent Studio</h2>
          <p className="text-muted-foreground">Create autonomous discovery workflows</p>
        </div>
        <div className="w-12 h-12 bg-ai-gradient rounded-xl flex items-center justify-center animate-glow">
          <Workflow className="w-6 h-6 text-white" />
        </div>
      </div>

      {/* Workflow Templates */}
      <div className="grid md:grid-cols-3 gap-4">
        {workflows.map((workflow, index) => (
          <motion.div
            key={workflow.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -4, scale: 1.02 }}
            onClick={() => setSelectedWorkflow(workflow.id)}
            className={`glass rounded-xl p-6 border cursor-pointer transition-all duration-300 ${
              selectedWorkflow === workflow.id 
                ? 'border-primary/50 shadow-[0_0_30px_hsl(var(--primary)/0.2)]' 
                : 'border-border/50 hover:border-primary/30'
            }`}
          >
            <div className={`w-10 h-10 bg-gradient-to-r ${
              selectedWorkflow === workflow.id ? 'from-primary to-secondary' : 'from-muted to-muted-foreground'
            } rounded-lg flex items-center justify-center mb-4`}>
              <workflow.icon className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">{workflow.name}</h3>
            <p className="text-sm text-muted-foreground mb-4">{workflow.description}</p>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{workflow.steps} steps</span>
              {selectedWorkflow === workflow.id && (
                <div className="flex items-center text-primary">
                  <Check className="w-3 h-3 mr-1" />
                  Selected
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Agent Interface */}
      <div className="glass rounded-2xl border border-border/50 overflow-hidden">
        {/* Messages */}
        <div className="h-96 overflow-y-auto p-6 custom-scrollbar">
          <AnimatePresence>
            {messages.length === 0 ? (
              <div className="h-full flex items-center justify-center text-center">
                <div>
                  <Bot className="w-12 h-12 mx-auto mb-4 text-primary animate-pulse-glow" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">AI Agent Ready</h3>
                  <p className="text-sm text-muted-foreground">Ask a question to start an intelligent discovery journey</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {msg.role === 'agent' && (
                      <div className="w-8 h-8 bg-ai-gradient rounded-full flex items-center justify-center">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                    )}
                    <div className={`max-w-[80%] rounded-2xl p-4 ${
                      msg.role === 'user' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'glass border border-border'
                    }`}>
                      <p className="text-sm leading-relaxed">{msg.content}</p>
                      {msg.actions && msg.actions.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-border/50 space-y-2">
                          {msg.actions.map(action => (
                            <button
                              key={action.id}
                              className="block w-full text-left p-2 text-xs bg-primary/5 hover:bg-primary/10 rounded-lg transition-colors"
                            >
                              {action.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
                {isProcessing && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex gap-3"
                  >
                    <div className="w-8 h-8 bg-ai-gradient rounded-full flex items-center justify-center">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="glass border border-border rounded-2xl p-4">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Input */}
        <div className="border-t border-border/50 p-4 bg-background/30">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask the AI agent anything..."
              className="flex-1 px-4 py-3 glass border border-border rounded-xl focus:outline-none focus:border-primary transition-all"
              disabled={isProcessing}
            />
            <button
              onClick={handleSend}
              disabled={isProcessing || !input.trim()}
              className="px-6 py-3 bg-ai-gradient text-white rounded-xl hover:shadow-[0_0_20px_hsl(var(--primary)/0.4)] disabled:opacity-50 transition-all"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentStudio;
