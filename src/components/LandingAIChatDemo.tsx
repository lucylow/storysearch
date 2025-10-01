import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

const LandingAIChatDemo = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Hello! I can help you discover and compare content across brands, influencers, and topics. Try asking me to compare Nike and Adidas sustainability efforts!',
      timestamp: new Date(),
      suggestions: [
        'Compare Nike and Adidas sustainability efforts',
        'Tell me about Tesla\'s latest models',
        'What are the latest trends in K-pop fashion?'
      ]
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    let aiResponse = '';
    let suggestions: string[] = [];

    // Mock AI responses based on input
    if (content.toLowerCase().includes('nike') && content.toLowerCase().includes('adidas')) {
      aiResponse = `Based on recent data, here's a comprehensive comparison:

**Nike's Approach:**
• Move to Zero: Carbon neutral by 2025
• 75% renewable energy in manufacturing  
• Circular design with recycled materials

**Adidas's Approach:**
• Run for the Oceans program
• Parley partnership creating shoes from ocean plastic
• 90% sustainable cotton by 2025

**Key Difference:** Nike focuses on manufacturing emissions, while Adidas emphasizes ocean conservation. Would you like specific product examples?`;
      
      suggestions = [
        'Show me specific sustainable products from both brands',
        'How do their sustainability goals compare to other athletic brands?',
        'What about their carbon footprint reduction strategies?'
      ];
    } else if (content.toLowerCase().includes('tesla')) {
      aiResponse = `Here are Tesla's latest models with specifications:

**Model 3** - Starting at $38,990
• Range: 272-358 miles
• 0-60 mph: 3.1-5.8 seconds

**Model Y** - Starting at $47,740  
• Range: 244-330 miles
• 0-60 mph: 3.5-6.6 seconds

**Cybertruck** - Starting at $60,990
• Range: 250-340 miles
• 0-60 mph: 2.6-6.5 seconds

Would you like to know more about any specific model or compare them to competitors?`;
      
      suggestions = [
        'Compare Tesla Model Y to BMW iX',
        'What are the charging options for these models?',
        'Tell me about Tesla\'s autonomous driving features'
      ];
    } else {
      aiResponse = `I understand you're interested in "${content}". I can help you discover relevant content, compare different options, and provide detailed insights. What specific aspect would you like to explore?`;
      
      suggestions = [
        'Tell me more about this topic',
        'Compare with similar options',
        'Show me related trends'
      ];
    }

    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: 'ai',
      content: aiResponse,
      timestamp: new Date(),
      suggestions
    };

    setIsTyping(false);
    setMessages(prev => [...prev, aiMessage]);
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="h-[600px] flex flex-col">
        <div className="p-4 border-b bg-gradient-to-r from-primary/10 to-secondary/10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold">StorySearch AI Assistant</h3>
              <p className="text-sm text-muted-foreground">Intelligent content discovery</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start space-x-3 max-w-[80%] ${
                  message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    message.type === 'user' 
                      ? 'bg-secondary' 
                      : 'bg-primary'
                  }`}>
                    {message.type === 'user' ? (
                      <User className="w-4 h-4 text-white" />
                    ) : (
                      <Bot className="w-4 h-4 text-white" />
                    )}
                  </div>
                  
                  <div className={`rounded-lg p-3 ${
                    message.type === 'user'
                      ? 'bg-secondary text-secondary-foreground'
                      : 'bg-muted'
                  }`}>
                    <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                    
                    {/* Suggestions */}
                    {message.suggestions && message.suggestions.length > 0 && (
                      <div className="mt-3 space-y-2">
                        <p className="text-xs text-muted-foreground">Suggested follow-ups:</p>
                        {message.suggestions.map((suggestion, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="mr-2 mb-2 text-xs h-auto py-1 px-2"
                          >
                            {suggestion}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing Indicator */}
          <AnimatePresence>
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex items-start space-x-3"
              >
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-muted rounded-lg p-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t">
          <div className="flex space-x-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask me anything about brands, products, or trends..."
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(inputValue);
                }
              }}
              disabled={isTyping}
            />
            <Button
              onClick={() => handleSendMessage(inputValue)}
              disabled={!inputValue.trim() || isTyping}
              size="icon"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default LandingAIChatDemo;
