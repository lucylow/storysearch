import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Lightbulb } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAIChat } from '../../hooks/useAIChat';

const AIChatInterface: React.FC = () => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages, sendMessage, isLoading, error } = useAIChat();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    try {
      await sendMessage(input);
      setInput('');
    } catch (err) {
      // Error is handled in the hook
      console.error('Failed to send message:', err);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
  };

  const examplePrompts = [
    "Explain how content modeling works in Storyblok",
    "Show me examples of successful headless CMS implementations",
    "What are the benefits of using Algolia with Storyblok?",
    "Help me optimize my content structure for better search"
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl border border-border overflow-hidden shadow-2xl"
    >
      {/* Chat Header */}
      <div className="bg-ai-gradient p-6 text-white">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-full animate-glow">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">StorySearch AI Assistant</h3>
            <p className="text-white/80 text-sm">Ask me anything about your Storyblok content</p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="h-96 overflow-y-auto p-4 bg-background/50">
        <AnimatePresence>
          {messages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="h-full flex items-center justify-center"
            >
              <div className="text-center text-muted-foreground">
                <Sparkles className="w-12 h-12 mx-auto mb-4 text-primary animate-pulse-glow" />
                <p className="text-lg font-medium mb-2">How can I help you today?</p>
                <p className="text-sm">Try asking a question about your content</p>
                
                <div className="mt-6 space-y-2">
                  {examplePrompts.map((prompt, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(prompt)}
                      className="block w-full p-3 text-sm glass rounded-lg border border-border hover:border-primary/30 hover:bg-primary/5 transition-colors text-foreground"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.role === 'assistant' && (
                    <div className="w-8 h-8 bg-ai-gradient rounded-full flex items-center justify-center flex-shrink-0 animate-glow">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                  )}
                  
                  <div className={`max-w-[70%] rounded-2xl p-4 ${
                    message.role === 'user' 
                      ? 'bg-primary text-primary-foreground rounded-br-none' 
                      : 'glass border border-border rounded-bl-none'
                  }`}>
                    <p className="text-sm leading-relaxed">{message.content}</p>
                    
                    {/* Show retry button for error messages */}
                    {message.role === 'assistant' && message.content.includes('error') && (
                      <button
                        onClick={() => handleSend()}
                        className="mt-2 px-3 py-1 text-xs bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-colors"
                      >
                        Try Again
                      </button>
                    )}
                    
                    <span className={`text-xs mt-2 block ${
                      message.role === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                    }`}>
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                    
                    {/* AI Suggestions */}
                    {message.role === 'assistant' && message.suggestions && message.suggestions.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-border/50">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                          <Lightbulb className="w-3 h-3" />
                          Suggested follow-ups:
                        </div>
                        <div className="space-y-1">
                          {message.suggestions.slice(0, 2).map((suggestion, index) => (
                            <button
                              key={index}
                              onClick={() => handleSuggestionClick(suggestion)}
                              className="block w-full text-left p-2 text-xs bg-primary/5 hover:bg-primary/10 rounded-lg transition-colors text-foreground"
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {message.role === 'user' && (
                    <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-muted-foreground" />
                    </div>
                  )}
                </motion.div>
              ))}
              
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-3"
                >
                  <div className="w-8 h-8 bg-ai-gradient rounded-full flex items-center justify-center animate-glow">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="glass border border-border rounded-2xl rounded-bl-none p-4">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Input Area */}
      <div className="border-t border-border p-4 bg-background/30">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your question about Storyblok content..."
            className="flex-1 px-4 py-3 glass border border-border rounded-full focus:outline-none focus:border-primary focus:shadow-[0_0_20px_hsl(var(--primary)/0.2)] transition-all"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="px-6 py-3 bg-ai-gradient text-white rounded-full hover:shadow-[0_0_20px_hsl(var(--primary)/0.4)] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default AIChatInterface;