import { useCallback, useState, useEffect } from 'react';
import { useAIContext } from '../contexts/AIContext';
import { storyblokService } from '../services/storyblokService';

interface ChatMemory {
  userPreferences: Record<string, unknown>;
  conversationHistory: Array<{
    query: string;
    response: string;
    timestamp: Date;
    context: Record<string, unknown>;
  }>;
  currentContext: Record<string, unknown>;
  userProfile: {
    expertise: string[];
    interests: string[];
    role: string;
  };
}

export const useAIChat = () => {
  const {
    messages,
    setMessages,
    isAILoading,
    setIsAILoading,
    aiError,
    setAIError,
    conversationId,
    setConversationId
  } = useAIContext();

  const [memory, setMemory] = useState<ChatMemory>({
    userPreferences: {},
    conversationHistory: [],
    currentContext: {},
    userProfile: {
      expertise: [],
      interests: [],
      role: 'user'
    }
  });

  // Load memory from localStorage on mount
  useEffect(() => {
    const savedMemory = localStorage.getItem('ai-chat-memory');
    if (savedMemory) {
      try {
        setMemory(JSON.parse(savedMemory));
      } catch (error) {
        console.error('Failed to load chat memory:', error);
      }
    }
  }, []);

  // Save memory to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('ai-chat-memory', JSON.stringify(memory));
  }, [memory]);

  const updateUserProfile = useCallback((updates: Partial<ChatMemory['userProfile']>) => {
    setMemory(prev => ({
      ...prev,
      userProfile: { ...prev.userProfile, ...updates }
    }));
  }, []);

  const addToConversationHistory = useCallback((query: string, response: string, context: Record<string, unknown>) => {
    setMemory(prev => ({
      ...prev,
      conversationHistory: [
        ...prev.conversationHistory.slice(-9), // Keep last 10 conversations
        {
          query,
          response,
          timestamp: new Date(),
          context
        }
      ]
    }));
  }, []);

  const updateContext = useCallback((newContext: Record<string, unknown>) => {
    setMemory(prev => ({
      ...prev,
      currentContext: { ...prev.currentContext, ...newContext }
    }));
  }, []);

  const analyzeUserIntent = useCallback((message: string) => {
    // Simple intent analysis based on keywords
    const intents = {
      'content_creation': ['create', 'write', 'generate', 'make', 'build'],
      'content_analysis': ['analyze', 'review', 'check', 'evaluate', 'assess'],
      'search_help': ['find', 'search', 'look for', 'locate', 'discover'],
      'optimization': ['optimize', 'improve', 'enhance', 'better', 'upgrade'],
      'learning': ['learn', 'understand', 'explain', 'how', 'what', 'why'],
      'troubleshooting': ['problem', 'issue', 'error', 'fix', 'help', 'trouble']
    };

    const messageLower = message.toLowerCase();
    for (const [intent, keywords] of Object.entries(intents)) {
      if (keywords.some(keyword => messageLower.includes(keyword))) {
        return intent;
      }
    }
    return 'general';
  }, []);

  const generateContextualResponse = useCallback(async (message: string) => {
    const intent = analyzeUserIntent(message);
    const context = {
      ...memory.currentContext,
      userProfile: memory.userProfile,
      recentConversations: memory.conversationHistory.slice(-3),
      intent,
      timestamp: new Date().toISOString()
    };

    try {
      const response = await storyblokService.generateContextualResponse(message, {
        searchHistory: memory.conversationHistory.map(c => c.query),
        userPreferences: memory.userPreferences
      });

      // Update user profile based on conversation
      if (intent === 'learning' && message.includes('storyblok')) {
        updateUserProfile({
          expertise: [...memory.userProfile.expertise, 'storyblok']
        });
      }

      // Add to conversation history
      addToConversationHistory(message, response.response, context);

      return response;
    } catch (error) {
      console.error('Contextual response generation failed:', error);
      throw error;
    }
  }, [memory, analyzeUserIntent, updateUserProfile, addToConversationHistory]);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isAILoading) return;

    const userMessage = {
      id: Date.now().toString(),
      content,
      role: 'user' as const,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsAILoading(true);
    setAIError(null);

    try {
      // Use contextual response generation
      const response = await generateContextualResponse(content);
      
      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        content: response.response,
        role: 'assistant' as const,
        timestamp: new Date(),
        suggestions: response.suggestions,
        relatedContent: response.relatedContent,
        confidence: response.confidence
      };

      setMessages(prev => [...prev, assistantMessage]);
      
      // Generate conversation ID if not exists
      if (!conversationId) {
        setConversationId(`conv_${Date.now()}`);
      }

      return response.response;
    } catch (err) {
      let errorContent = 'Sorry, I encountered an error processing your request. Please try again.';
      
      if (err instanceof Error) {
        // Provide more specific error messages based on the error
        if (err.message.includes('busy') || err.message.includes('rate limit')) {
          errorContent = 'I\'m currently processing many requests. Please wait a moment and try again.';
        } else if (err.message.includes('quota') || err.message.includes('exceeded')) {
          errorContent = 'I\'ve reached my usage limit for today. Please try again tomorrow or contact support.';
        } else if (err.message.includes('authentication')) {
          errorContent = 'There\'s a configuration issue with my AI service. Please contact support.';
        } else if (err.message.includes('technical difficulties')) {
          errorContent = 'I\'m experiencing technical difficulties. Please try again in a few minutes.';
        }
      }
      
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        content: errorContent,
        role: 'assistant' as const,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
      setAIError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setIsAILoading(false);
    }
  }, [isAILoading, setMessages, setIsAILoading, setAIError, conversationId, setConversationId, generateContextualResponse]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setConversationId('');
    setAIError(null);
  }, [setMessages, setConversationId, setAIError]);

  const clearMemory = useCallback(() => {
    setMemory({
      userPreferences: {},
      conversationHistory: [],
      currentContext: {},
      userProfile: {
        expertise: [],
        interests: [],
        role: 'user'
      }
    });
    localStorage.removeItem('ai-chat-memory');
  }, []);

  return {
    messages,
    sendMessage,
    clearMessages,
    isLoading: isAILoading,
    error: aiError,
    memory,
    updateUserProfile,
    updateContext,
    clearMemory
  };
};