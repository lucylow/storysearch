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
    "Tell me about Nike's latest products and sustainability efforts",
    "What are Tesla's recent innovations in electric vehicles?",
    "Compare Apple vs Samsung smartphones",
    "Find trending tech startups in AI"
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-xl"
    >
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-full">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">StorySearch AI Assistant</h3>
            <p className="text-white/90 text-sm">Ask me anything about companies, topics, or online content</p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="h-96 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-800/50">
        <AnimatePresence>
          {messages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="h-full flex items-center justify-center"
            >
              <div className="text-center text-gray-600 dark:text-gray-300">
                <Sparkles className="w-12 h-12 mx-auto mb-4 text-blue-500" />
                <p className="text-lg font-medium mb-2">How can I help you today?</p>
                <p className="text-sm mb-6">Try asking a question about your content</p>
                
                <div className="space-y-2 max-w-md">
                  {examplePrompts.map((prompt, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(prompt)}
                      className="block w-full p-3 text-sm bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors text-gray-700 dark:text-gray-200 text-left"
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
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                  )}
                  
                  <div className={`max-w-[70%] rounded-2xl p-4 ${
                    message.role === 'user' 
                      ? 'bg-blue-500 text-white rounded-br-none' 
                      : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-bl-none'
                  }`}>
                    <p className="text-sm leading-relaxed text-gray-800 dark:text-gray-200">{message.content}</p>
                    
                    {/* Show retry button for error messages */}
                    {message.role === 'assistant' && message.content.includes('error') && (
                      <button
                        onClick={() => handleSend()}
                        className="mt-2 px-3 py-1 text-xs bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"
                      >
                        Try Again
                      </button>
                    )}
                    
                    <span className={`text-xs mt-2 block ${
                      message.role === 'user' ? 'text-white/70' : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                    
                    {/* AI Suggestions */}
                    {message.role === 'assistant' && message.suggestions && message.suggestions.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                        <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mb-2">
                          <Lightbulb className="w-3 h-3" />
                          Suggested follow-ups:
                        </div>
                        <div className="space-y-1">
                          {message.suggestions.slice(0, 2).map((suggestion, index) => (
                            <button
                              key={index}
                              onClick={() => handleSuggestionClick(suggestion)}
                              className="block w-full text-left p-2 text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors text-gray-700 dark:text-gray-200"
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {message.role === 'user' && (
                    <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-gray-600 dark:text-gray-300" />
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
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-2xl rounded-bl-none p-4">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
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
            className="px-4 pb-4"
          >
            <Card className="border-2 border-blue-200 dark:border-blue-700 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
                  <Brain className="w-5 h-5" />
                  AskAI Response
                  {askAIResponse && (
                    <Badge variant="outline" className="text-xs bg-blue-100 dark:bg-blue-800/30 text-blue-800 dark:text-blue-200">
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
                    <span className="text-sm text-gray-600 dark:text-gray-300">Analyzing your question with AI...</span>
                  </div>
                ) : askAIResponse ? (
                  <>
                    {/* AI Answer */}
                    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-blue-200 dark:border-blue-700">
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
                        <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
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
                              className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-600 transition-colors"
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h5 className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">{source.title}</h5>
                                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">{source.excerpt}</p>
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
                        <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
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
                              className="w-full text-left p-2 text-sm rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-2"
                            >
                              <Target className="w-3 h-3 text-gray-500 dark:text-gray-400" />
                              {question}
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Suggested Actions */}
                    {askAIResponse.suggestedActions.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
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
                              <Badge variant="outline" className="text-xs hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors cursor-pointer">
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
      <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-900">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about Nike, Tesla, or any company/topic..."
            className="flex-1 px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-full focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-all text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 shadow-lg hover:shadow-xl"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default AIChatInterface;