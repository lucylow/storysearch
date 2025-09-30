import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, 
  Bot, 
  X, 
  Minimize2, 
  Maximize2, 
  Send, 
  Sparkles,
  Lightbulb,
  User
} from 'lucide-react';
import { useAIChat } from '../../hooks/useAIChat';

const FloatingAIChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
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
      console.error('Failed to send message:', err);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
  };

  const quickSuggestions = [
    "How do I search for content?",
    "What is Storyblok?",
    "Show me AI features",
    "Help with content modeling"
  ];

  return (
    <>
      {/* Floating Chat Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 2, type: "spring", stiffness: 200 }}
      >
        <AnimatePresence>
          {!isOpen && (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsOpen(true)}
              className="group relative w-16 h-16 bg-ai-gradient rounded-full shadow-2xl hover:shadow-[0_0_40px_hsl(var(--primary)/0.5)] transition-all duration-300 flex items-center justify-center"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Bot className="w-8 h-8 text-white" />
              </motion.div>
              
              {/* Pulse Animation */}
              <motion.div
                className="absolute inset-0 bg-primary rounded-full opacity-30"
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              
              {/* Notification Badge */}
              <motion.div
                className="absolute -top-2 -right-2 w-6 h-6 bg-accent rounded-full flex items-center justify-center"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Sparkles className="w-3 h-3 text-white" />
              </motion.div>
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Chat Popup */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-6 right-6 z-50 w-96 h-[500px] glass rounded-2xl border border-border/50 shadow-2xl backdrop-blur-xl overflow-hidden"
          >
            {/* Header */}
            <div className="bg-ai-gradient p-4 text-white relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20" />
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center"
                  >
                    <Bot className="w-5 h-5" />
                  </motion.div>
                  <div>
                    <h3 className="font-bold text-lg">AI Assistant</h3>
                    <p className="text-white/80 text-xs">Always here to help</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsMinimized(!isMinimized)}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    {isMinimized ? (
                      <Maximize2 className="w-4 h-4" />
                    ) : (
                      <Minimize2 className="w-4 h-4" />
                    )}
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Chat Content */}
            <AnimatePresence>
              {!isMinimized && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: "auto" }}
                  exit={{ height: 0 }}
                  className="flex flex-col h-[420px]"
                >
                  {/* Messages Area */}
                  <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                    <AnimatePresence>
                      {messages.length === 0 ? (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="h-full flex items-center justify-center"
                        >
                          <div className="text-center text-muted-foreground">
                            <Sparkles className="w-8 h-8 mx-auto mb-3 text-primary animate-pulse-glow" />
                            <p className="text-sm font-medium mb-2">Hi! I'm your AI assistant</p>
                            <p className="text-xs">Ask me anything about Storyblok</p>
                            
                            <div className="mt-4 space-y-2">
                              {quickSuggestions.map((suggestion, index) => (
                                <button
                                  key={index}
                                  onClick={() => handleSuggestionClick(suggestion)}
                                  className="block w-full p-2 text-xs glass rounded-lg border border-border hover:border-primary/30 hover:bg-primary/5 transition-colors text-foreground"
                                >
                                  {suggestion}
                                </button>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      ) : (
                        <div className="space-y-3">
                          {messages.map((message) => (
                            <motion.div
                              key={message.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className={`flex gap-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                              {message.role === 'assistant' && (
                                <div className="w-6 h-6 bg-ai-gradient rounded-full flex items-center justify-center flex-shrink-0">
                                  <Bot className="w-3 h-3 text-white" />
                                </div>
                              )}
                              
                              <div className={`max-w-[80%] rounded-xl p-3 ${
                                message.role === 'user' 
                                  ? 'bg-primary text-primary-foreground rounded-br-sm' 
                                  : 'glass border border-border rounded-bl-sm'
                              }`}>
                                <p className="text-sm leading-relaxed">{message.content}</p>
                                
                                {/* Show retry button for error messages */}
                                {message.role === 'assistant' && message.content.includes('error') && (
                                  <button
                                    onClick={() => handleSend()}
                                    className="mt-2 px-2 py-1 text-xs bg-primary/10 hover:bg-primary/20 text-primary rounded transition-colors"
                                  >
                                    Try Again
                                  </button>
                                )}
                                
                                <span className={`text-xs mt-1 block ${
                                  message.role === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                                }`}>
                                  {message.timestamp.toLocaleTimeString()}
                                </span>
                                
                                {/* AI Suggestions */}
                                {message.role === 'assistant' && message.suggestions && message.suggestions.length > 0 && (
                                  <div className="mt-2 pt-2 border-t border-border/50">
                                    <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                                      <Lightbulb className="w-3 h-3" />
                                      Suggestions:
                                    </div>
                                    <div className="space-y-1">
                                      {message.suggestions.slice(0, 2).map((suggestion, index) => (
                                        <button
                                          key={index}
                                          onClick={() => handleSuggestionClick(suggestion)}
                                          className="block w-full text-left p-1 text-xs bg-primary/5 hover:bg-primary/10 rounded transition-colors text-foreground"
                                        >
                                          {suggestion}
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                              
                              {message.role === 'user' && (
                                <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                                  <User className="w-3 h-3 text-muted-foreground" />
                                </div>
                              )}
                            </motion.div>
                          ))}
                          
                          {isLoading && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="flex gap-2"
                            >
                              <div className="w-6 h-6 bg-ai-gradient rounded-full flex items-center justify-center">
                                <Bot className="w-3 h-3 text-white" />
                              </div>
                              <div className="glass border border-border rounded-xl rounded-bl-sm p-3">
                                <div className="flex gap-1">
                                  <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" />
                                  <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                                  <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
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
                  <div className="border-t border-border/50 p-3 bg-background/30">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Type your question..."
                        className="flex-1 px-3 py-2 glass border border-border rounded-lg focus:outline-none focus:border-primary focus:shadow-[0_0_15px_hsl(var(--primary)/0.2)] transition-all text-sm"
                        disabled={isLoading}
                      />
                      <motion.button
                        onClick={handleSend}
                        disabled={isLoading || !input.trim()}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-2 bg-ai-gradient text-white rounded-lg hover:shadow-[0_0_15px_hsl(var(--primary)/0.3)] disabled:opacity-50 transition-all"
                      >
                        {isLoading ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Send className="w-4 h-4" />
                        )}
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingAIChatbot;

