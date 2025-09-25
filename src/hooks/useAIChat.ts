import { useCallback } from 'react';
import { useAIContext } from '../contexts/AIContext';
import { storyblokService } from '../services/storyblokService';

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
      const response = await storyblokService.askAI(content);
      
      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        content: response,
        role: 'assistant' as const,
        timestamp: new Date(),
        suggestions: await storyblokService.getSuggestions(content)
      };

      setMessages(prev => [...prev, assistantMessage]);
      
      // Generate conversation ID if not exists
      if (!conversationId) {
        setConversationId(`conv_${Date.now()}`);
      }

      return response;
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
  }, [isAILoading, setMessages, setIsAILoading, setAIError, conversationId, setConversationId]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setConversationId('');
    setAIError(null);
  }, [setMessages, setConversationId, setAIError]);

  return {
    messages,
    sendMessage,
    clearMessages,
    isLoading: isAILoading,
    error: aiError
  };
};