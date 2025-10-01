import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle,
  Send,
  Sparkles,
  ExternalLink,
  ThumbsUp,
  ThumbsDown,
  BookOpen,
  ArrowRight,
  Check,
  Lightbulb
} from 'lucide-react';
import { useAIAgent } from '../../hooks/useAIAgent';

const AskAI: React.FC = () => {
  const { messages, sendMessage, isProcessing } = useAIAgent();
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState<Map<string, 'positive' | 'negative'>>(new Map());

  const exampleQuestions = [
    "What are the benefits of headless CMS?",
    "What are Nike's most popular shoe models?",
    "What are best practices for content modeling?",
    "How can I optimize my content for SEO?"
  ];

  const handleSend = async () => {
    if (!input.trim() || isProcessing) return;
    try {
      await sendMessage(input);
      setInput('');
    } catch (err) {
      console.error('Failed to send:', err);
    }
  };

  const handleFeedback = (messageId: string, type: 'positive' | 'negative') => {
    setFeedback(prev => new Map(prev).set(messageId, type));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gradient-hero mb-2">AskAI</h2>
          <p className="text-muted-foreground">Get precise answers about any online content</p>
        </div>
        <div className="w-12 h-12 bg-ai-gradient rounded-xl flex items-center justify-center animate-glow">
          <MessageCircle className="w-6 h-6 text-white" />
        </div>
      </div>

      {/* Chat Interface */}
      <div className="glass rounded-2xl border border-border/50 overflow-hidden">
        {/* Messages */}
        <div className="h-[500px] overflow-y-auto p-6 custom-scrollbar bg-background/30">
          <AnimatePresence>
            {messages.length === 0 ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center max-w-md">
                  <Sparkles className="w-16 h-16 mx-auto mb-4 text-primary animate-pulse-glow" />
                  <h3 className="text-xl font-semibold text-foreground mb-3">Ask Me Anything</h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    I can answer questions about companies, topics, and online content,
                    and guide you through complex topics.
                  </p>
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground font-medium mb-2">Try asking:</p>
                    {exampleQuestions.map((question, index) => (
                      <button
                        key={index}
                        onClick={() => setInput(question)}
                        className="block w-full text-left p-3 text-sm glass rounded-lg border border-border hover:border-primary/30 hover:bg-primary/5 transition-all"
                      >
                        <Lightbulb className="w-4 h-4 inline mr-2 text-accent" />
                        {question}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((msg) => {
                  const msgFeedback = feedback.get(msg.id);
                  return (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-2"
                    >
                      <div className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.role === 'agent' && (
                          <div className="w-8 h-8 bg-ai-gradient rounded-full flex items-center justify-center animate-glow">
                            <MessageCircle className="w-4 h-4 text-white" />
                          </div>
                        )}
                        <div className={`max-w-[75%] rounded-2xl p-4 ${
                          msg.role === 'user' 
                            ? 'bg-primary text-primary-foreground' 
                            : 'glass border border-border'
                        }`}>
                          <p className="text-sm leading-relaxed whitespace-pre-line">{msg.content}</p>
                          
                          {/* Sources */}
                          {msg.sources && msg.sources.length > 0 && (
                            <div className="mt-3 pt-3 border-t border-border/50">
                              <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                                <BookOpen className="w-3 h-3" />
                                Sources ({msg.sources.length}):
                              </div>
                              <div className="space-y-1">
                                {msg.sources.slice(0, 3).map((source: any, i: number) => (
                                  <button
                                    key={i}
                                    className="block w-full text-left p-2 text-xs bg-primary/5 hover:bg-primary/10 rounded transition-colors"
                                  >
                                    <ExternalLink className="w-3 h-3 inline mr-1" />
                                    {source.title || 'View source'}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Actions */}
                          {msg.actions && msg.actions.length > 0 && (
                            <div className="mt-3 pt-3 border-t border-border/50 space-y-1">
                              {msg.actions.map((action: any) => (
                                <button
                                  key={action.id}
                                  className="block w-full text-left p-2 text-xs bg-secondary/5 hover:bg-secondary/10 rounded transition-colors text-foreground"
                                >
                                  <ArrowRight className="w-3 h-3 inline mr-1" />
                                  {action.label}
                                </button>
                              ))}
                            </div>
                          )}

                          {/* Feedback */}
                          {msg.role === 'agent' && !msgFeedback && (
                            <div className="mt-3 pt-3 border-t border-border/50 flex items-center gap-2">
                              <span className="text-xs text-muted-foreground">Was this helpful?</span>
                              <button
                                onClick={() => handleFeedback(msg.id, 'positive')}
                                className="p-1 hover:bg-green-100 dark:hover:bg-green-900/20 rounded transition-colors"
                              >
                                <ThumbsUp className="w-3 h-3 text-green-600" />
                              </button>
                              <button
                                onClick={() => handleFeedback(msg.id, 'negative')}
                                className="p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded transition-colors"
                              >
                                <ThumbsDown className="w-3 h-3 text-red-600" />
                              </button>
                            </div>
                          )}
                          {msgFeedback && (
                            <div className="mt-2 text-xs text-green-600 flex items-center gap-1">
                              <Check className="w-3 h-3" />
                              Thanks for your feedback!
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
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
              placeholder="Ask a question..."
              className="flex-1 px-4 py-3 glass border border-border rounded-xl focus:outline-none focus:border-primary transition-all"
              disabled={isProcessing}
            />
            <button
              onClick={handleSend}
              disabled={isProcessing || !input.trim()}
              className="px-6 py-3 bg-ai-gradient text-white rounded-xl hover:shadow-[0_0_20px_hsl(var(--primary)/0.4)] disabled:opacity-50 transition-all flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              Ask
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AskAI;
