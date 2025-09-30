import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { aiAgentService, type AgentConfiguration, type AgentSession, type AgentResponse } from '@/services/aiAgentService';

interface AgentContextType {
  // Agent Management
  agents: AgentConfiguration[];
  selectedAgent: AgentConfiguration | null;
  setSelectedAgent: (agent: AgentConfiguration | null) => void;
  refreshAgents: () => Promise<void>;
  
  // Session Management
  currentSession: AgentSession | null;
  setCurrentSession: (session: AgentSession | null) => void;
  createSession: (agentId: string, context?: Record<string, unknown>) => Promise<AgentSession>;
  
  // Conversation State
  conversationHistory: Array<{
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: Date;
    metadata?: Record<string, unknown>;
  }>;
  setConversationHistory: (history: Array<{
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: Date;
    metadata?: Record<string, unknown>;
  }>) => void;
  
  // Agent Communication
  sendMessage: (message: string, agentId?: string) => Promise<AgentResponse>;
  isLoading: boolean;
  error: string | null;
  
  // Context Management
  context: Record<string, unknown>;
  updateContext: (updates: Record<string, unknown>) => void;
  clearContext: () => void;
  
  // Memory Management
  conversationMemory: Map<string, any>;
  addToMemory: (key: string, value: any) => void;
  getFromMemory: (key: string) => any;
  clearMemory: () => void;
}

const AgentContext = createContext<AgentContextType | undefined>(undefined);

export const AgentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [agents, setAgents] = useState<AgentConfiguration[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<AgentConfiguration | null>(null);
  const [currentSession, setCurrentSession] = useState<AgentSession | null>(null);
  const [conversationHistory, setConversationHistory] = useState<Array<{
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: Date;
    metadata?: Record<string, unknown>;
  }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [context, setContext] = useState<Record<string, unknown>>({});
  const [conversationMemory] = useState<Map<string, any>>(new Map());

  // Load agents on mount
  const refreshAgents = useCallback(async () => {
    try {
      const agentList = await aiAgentService.listAgents();
      setAgents(agentList);
      if (agentList.length > 0 && !selectedAgent) {
        setSelectedAgent(agentList[0]);
      }
    } catch (err) {
      console.error('Failed to load agents:', err);
      setError('Failed to load agents');
    }
  }, [selectedAgent]);

  // Create new session
  const createSession = useCallback(async (agentId: string, context?: Record<string, unknown>) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // This would typically create a session with the backend
      // For now, we'll create a local session representation
      const session: AgentSession = {
        id: `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        agentId,
        userId: undefined,
        context: context || {},
        conversationHistory: [],
        sessionState: 'active',
        createdAt: new Date(),
        lastActivity: new Date()
      };
      
      setCurrentSession(session);
      setConversationHistory([]);
      return session;
    } catch (err) {
      console.error('Failed to create session:', err);
      setError('Failed to create session');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Send message to agent
  const sendMessage = useCallback(async (message: string, agentId?: string) => {
    const targetAgentId = agentId || selectedAgent?.id;
    if (!targetAgentId) {
      throw new Error('No agent selected');
    }

    try {
      setIsLoading(true);
      setError(null);

      // Add user message to history
      const userMessage = {
        role: 'user' as const,
        content: message,
        timestamp: new Date()
      };
      
      setConversationHistory(prev => [...prev, userMessage]);

      // Send to agent service
      const response = await aiAgentService.askAI(message, targetAgentId, context);

      // Add assistant response to history
      const assistantMessage = {
        role: 'assistant' as const,
        content: response.content,
        timestamp: new Date(),
        metadata: {
          confidence: response.confidence,
          sources: response.sources.length,
          actions: response.actions.length
        }
      };
      
      setConversationHistory(prev => [...prev, assistantMessage]);

      // Update session if it exists
      if (currentSession) {
        setCurrentSession(prev => prev ? {
          ...prev,
          conversationHistory: [...prev.conversationHistory, userMessage, assistantMessage],
          lastActivity: new Date()
        } : null);
      }

      return response;
    } catch (err) {
      console.error('Failed to send message:', err);
      setError('Failed to send message');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [selectedAgent, context, currentSession]);

  // Update context
  const updateContext = useCallback((updates: Record<string, unknown>) => {
    setContext(prev => ({ ...prev, ...updates }));
  }, []);

  // Clear context
  const clearContext = useCallback(() => {
    setContext({});
  }, []);

  // Add to memory
  const addToMemory = useCallback((key: string, value: any) => {
    conversationMemory.set(key, value);
  }, [conversationMemory]);

  // Get from memory
  const getFromMemory = useCallback((key: string) => {
    return conversationMemory.get(key);
  }, [conversationMemory]);

  // Clear memory
  const clearMemory = useCallback(() => {
    conversationMemory.clear();
  }, [conversationMemory]);

  // Load agents on mount
  React.useEffect(() => {
    refreshAgents();
  }, [refreshAgents]);

  return (
    <AgentContext.Provider value={{
      agents,
      selectedAgent,
      setSelectedAgent,
      refreshAgents,
      currentSession,
      setCurrentSession,
      createSession,
      conversationHistory,
      setConversationHistory,
      sendMessage,
      isLoading,
      error,
      context,
      updateContext,
      clearContext,
      conversationMemory,
      addToMemory,
      getFromMemory,
      clearMemory
    }}>
      {children}
    </AgentContext.Provider>
  );
};

export const useAgent = () => {
  const context = useContext(AgentContext);
  if (!context) {
    throw new Error('useAgent must be used within AgentProvider');
  }
  return context;
};
