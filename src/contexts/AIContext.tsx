import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AIMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  suggestions?: string[];
}

interface AIContextType {
  messages: AIMessage[];
  setMessages: (messages: AIMessage[] | ((prev: AIMessage[]) => AIMessage[])) => void;
  isAILoading: boolean;
  setIsAILoading: (loading: boolean) => void;
  aiError: string | null;
  setAIError: (error: string | null) => void;
  conversationId: string;
  setConversationId: (id: string) => void;
}

const AIContext = createContext<AIContextType | undefined>(undefined);

export const AIContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [isAILoading, setIsAILoading] = useState(false);
  const [aiError, setAIError] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState('');

  return (
    <AIContext.Provider value={{
      messages,
      setMessages,
      isAILoading,
      setIsAILoading,
      aiError,
      setAIError,
      conversationId,
      setConversationId
    }}>
      {children}
    </AIContext.Provider>
  );
};

export const useAIContext = () => {
  const context = useContext(AIContext);
  if (!context) {
    throw new Error('useAIContext must be used within AIContextProvider');
  }
  return context;
};