import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface AgentMessage {
  id: string;
  role: 'user' | 'agent';
  content: string;
  timestamp: Date;
  actions?: Array<{ id: string; label: string; description: string }>;
  sources?: any[];
}

export const useAIAgent = () => {
  const [messages, setMessages] = useState<AgentMessage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentJourney, setCurrentJourney] = useState<any>(null);

  const sendMessage = useCallback(async (content: string) => {
    const userMessage: AgentMessage = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsProcessing(true);

    try {
      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: { messages: [{ role: 'user', content }], context: {} }
      });

      if (error) throw error;

      const agentMessage: AgentMessage = {
        id: (Date.now() + 1).toString(),
        role: 'agent',
        content: data.response || 'I understand your question. Let me help you discover relevant content.',
        timestamp: new Date(),
        actions: [
          { id: 'action-1', label: 'Explore more', description: 'Find related content' },
          { id: 'action-2', label: 'Ask follow-up', description: 'Get more details' }
        ]
      };

      setMessages(prev => [...prev, agentMessage]);
      return agentMessage;
    } catch (err) {
      const errorMessage: AgentMessage = {
        id: (Date.now() + 1).toString(),
        role: 'agent',
        content: 'I\'m currently analyzing your request. Let me guide you through a discovery journey instead.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      throw err;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  return {
    messages,
    sendMessage,
    isProcessing,
    currentJourney
  };
};
