import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Lightbulb, Brain, BookOpen, ArrowRight, Target, Zap, CheckCircle, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAIChat } from '../../hooks/useAIChat';
import { algoliaService, AskAIResponse } from '../../services/algoliaService';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const AIChatInterface: React.FC = () => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages, sendMessage, isLoading, error } = useAIChat();
  
  // Enhanced AI state
  const [askAIResponse, setAskAIResponse] = useState<AskAIResponse | null>(null);
  const [isAskAILoading, setIsAskAILoading] = useState(false);
  const [showAskAI, setShowAskAI] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState('');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userInput = input.trim();
    setInput('');
    
    // Check if this looks like a question for AskAI
    const isQuestion = userInput.includes('?') || 
                      userInput.toLowerCase().startsWith('what') ||
                      userInput.toLowerCase().startsWith('how') ||
                      userInput.toLowerCase().startsWith('why') ||
                      userInput.toLowerCase().startsWith('when') ||
                      userInput.toLowerCase().startsWith('where') ||
                      userInput.toLowerCase().startsWith('can') ||
                      userInput.toLowerCase().startsWith('should');

    if (isQuestion) {
      // Use AskAI for questions
      setCurrentQuestion(userInput);
      setIsAskAILoading(true);
      setShowAskAI(true);
      
      try {
        const response = await algoliaService.askAIAdvanced(userInput);
        setAskAIResponse(response);
      } catch (err) {
        console.error('AskAI error:', err);
        // Fallback to regular chat
        await sendMessage(userInput);
      } finally {
        setIsAskAILoading(false);
      }
    } else {
      // Use regular chat for non-questions
      try {
        await sendMessage(userInput);
      } catch (err) {
        // Error is handled in the hook
        console.error('Failed to send message:', err);
      }
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

      {/* AskAI Response Display */}
      <AnimatePresence>
        {(showAskAI || askAIResponse) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="px-4"
          >
            <Card className="border-2 border-blue-200 dark:border-blue-800 bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-900/10 dark:to-purple-900/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
                  <Brain className="w-5 h-5" />
                  AskAI Response
                  {askAIResponse && (
                    <Badge variant="outline" className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200">
                      {Math.round(askAIResponse.confidence * 100)}% confidence
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription className="text-blue-700 dark:text-blue-300">
                  {currentQuestion}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {isAskAILoading ? (
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm text-muted-foreground">Analyzing your question with AI...</span>
                  </div>
                ) : askAIResponse ? (
                  <>
                    {/* AI Answer */}
                    <div className="p-4 bg-white/50 dark:bg-gray-900/50 rounded-lg border border-blue-200 dark:border-blue-800">
                      <div className="flex items-start gap-2 mb-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm font-medium text-green-800 dark:text-green-200">Answer</span>
                      </div>
                      <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
                        {askAIResponse.answer}
                      </p>
                    </div>

                    {/* Sources */}
                    {askAIResponse.sources.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                          <BookOpen className="w-4 h-4" />
                          Sources ({askAIResponse.sources.length})
                        </h4>
                        <div className="space-y-2">
                          {askAIResponse.sources.map((source, index) => (
                            <motion.div
                              key={source.id}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="p-3 bg-white/30 dark:bg-gray-900/30 rounded-lg border border-border/50 hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h5 className="text-sm font-medium text-foreground mb-1">{source.title}</h5>
                                  <p className="text-xs text-muted-foreground mb-2">{source.excerpt}</p>
                                  <div className="flex items-center gap-2">
                                    <Badge variant="secondary" className="text-xs">
                                      {Math.round(source.relevanceScore * 100)}% match
                                    </Badge>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="text-xs h-6 px-2"
                                      onClick={() => window.open(source.url, '_blank')}
                                    >
                                      <ExternalLink className="w-3 h-3 mr-1" />
                                      View
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Related Questions */}
                    {askAIResponse.relatedQuestions.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                          <ArrowRight className="w-4 h-4" />
                          Related Questions
                        </h4>
                        <div className="space-y-1">
                          {askAIResponse.relatedQuestions.map((question, index) => (
                            <motion.button
                              key={index}
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                              onClick={() => {
                                setInput(question);
                                setShowAskAI(false);
                                setAskAIResponse(null);
                              }}
                              className="w-full text-left p-2 text-sm rounded-lg hover:bg-primary/5 transition-colors text-foreground hover:text-primary flex items-center gap-2"
                            >
                              <Target className="w-3 h-3 text-muted-foreground" />
                              {question}
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Suggested Actions */}
                    {askAIResponse.suggestedActions.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                          <Zap className="w-4 h-4" />
                          Suggested Actions
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {askAIResponse.suggestedActions.map((action, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: index * 0.1 }}
                            >
                              <Badge variant="outline" className="text-xs hover:bg-primary/10 transition-colors cursor-pointer">
                                {action}
                              </Badge>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                ) : null}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

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