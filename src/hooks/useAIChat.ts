import { useCallback, useState, useEffect, useRef } from 'react';
import { useAIContext } from '../contexts/AIContext';
import { storyblokService } from '../services/storyblokService';

interface ConversationTurn {
  query: string;
  response: string;
  timestamp: Date;
  context: Record<string, unknown>;
  intent: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  topics: string[];
  entities: string[];
}

interface ChatMemory {
  userPreferences: Record<string, unknown>;
  conversationHistory: ConversationTurn[];
  currentContext: Record<string, unknown>;
  userProfile: {
    expertise: string[];
    interests: string[];
    role: string;
    learningStyle: 'visual' | 'textual' | 'interactive';
    preferredLanguage: string;
  };
  conversationSummary: string;
  topicFrequency: Record<string, number>;
  sentimentHistory: Array<'positive' | 'neutral' | 'negative'>;
}

interface AIResponse {
  response: string;
  confidence: number;
  intent: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  suggestions: string[];
  relatedContent: Array<{
    id: string;
    title: string;
    relevance: number;
  }>;
  followUpQuestions: string[];
  actionableInsights: string[];
  conversationState: 'exploring' | 'clarifying' | 'resolving' | 'complete';
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
      role: 'user',
      learningStyle: 'textual',
      preferredLanguage: 'en'
    },
    conversationSummary: '',
    topicFrequency: {},
    sentimentHistory: []
  });

  const conversationStateRef = useRef<'exploring' | 'clarifying' | 'resolving' | 'complete'>('exploring');

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
          context,
          intent: (context.intent as string) || 'general',
          sentiment: (context.sentiment as 'positive' | 'neutral' | 'negative') || 'neutral',
          topics: (context.topics as string[]) || [],
          entities: (context.entities as string[]) || []
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

  // Advanced intent analysis with confidence scoring
  const analyzeUserIntent = useCallback((message: string) => {
    const intents = {
      'content_creation': {
        keywords: ['create', 'write', 'generate', 'make', 'build', 'compose', 'draft', 'design'],
        weight: 1.2
      },
      'content_analysis': {
        keywords: ['analyze', 'review', 'check', 'evaluate', 'assess', 'examine', 'inspect', 'audit'],
        weight: 1.1
      },
      'search_help': {
        keywords: ['find', 'search', 'look for', 'locate', 'discover', 'show me', 'where is'],
        weight: 1.0
      },
      'optimization': {
        keywords: ['optimize', 'improve', 'enhance', 'better', 'upgrade', 'refine', 'perfect'],
        weight: 1.15
      },
      'learning': {
        keywords: ['learn', 'understand', 'explain', 'how', 'what', 'why', 'teach', 'tutorial'],
        weight: 1.3
      },
      'troubleshooting': {
        keywords: ['problem', 'issue', 'error', 'fix', 'help', 'trouble', 'bug', 'broken'],
        weight: 1.4
      },
      'comparison': {
        keywords: ['compare', 'versus', 'vs', 'difference', 'better than', 'which'],
        weight: 1.0
      },
      'recommendation': {
        keywords: ['recommend', 'suggest', 'advice', 'best', 'should i', 'what about'],
        weight: 1.1
      }
    };

    const messageLower = message.toLowerCase();
    let highestScore = 0;
    let detectedIntent = 'general';

    for (const [intent, config] of Object.entries(intents)) {
      const matches = config.keywords.filter(keyword => messageLower.includes(keyword)).length;
      const score = matches * config.weight;
      
      if (score > highestScore) {
        highestScore = score;
        detectedIntent = intent;
      }
    }

    return detectedIntent;
  }, []);

  // Sentiment analysis
  const analyzeSentiment = useCallback((message: string): 'positive' | 'neutral' | 'negative' => {
    const positiveWords = ['great', 'excellent', 'amazing', 'wonderful', 'perfect', 'love', 'thanks', 'awesome'];
    const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'worst', 'frustrated', 'confused', 'difficult'];
    
    const messageLower = message.toLowerCase();
    const positiveCount = positiveWords.filter(word => messageLower.includes(word)).length;
    const negativeCount = negativeWords.filter(word => messageLower.includes(word)).length;
    
    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  }, []);

  // Extract topics from message
  const extractTopics = useCallback((message: string): string[] => {
    const topicKeywords = {
      'storyblok': ['storyblok', 'cms', 'content management'],
      'api': ['api', 'endpoint', 'rest', 'graphql'],
      'react': ['react', 'component', 'jsx', 'hook'],
      'nextjs': ['nextjs', 'next.js', 'ssr', 'ssg'],
      'search': ['search', 'algolia', 'indexing'],
      'performance': ['performance', 'speed', 'optimization', 'fast'],
      'seo': ['seo', 'search engine', 'ranking', 'meta'],
      'deployment': ['deploy', 'deployment', 'hosting', 'production']
    };

    const messageLower = message.toLowerCase();
    const topics: string[] = [];

    for (const [topic, keywords] of Object.entries(topicKeywords)) {
      if (keywords.some(keyword => messageLower.includes(keyword))) {
        topics.push(topic);
      }
    }

    return topics;
  }, []);

  // Extract entities from message
  const extractEntities = useCallback((message: string): string[] => {
    const entities = ['Storyblok', 'React', 'Next.js', 'Algolia', 'Supabase', 'Vercel', 'API', 'CMS'];
    const messageLower = message.toLowerCase();
    return entities.filter(entity => messageLower.includes(entity.toLowerCase()));
  }, []);

  // Update conversation state based on conversation flow
  const updateConversationState = useCallback((intent: string, historyLength: number) => {
    if (intent === 'troubleshooting' || intent === 'search_help') {
      conversationStateRef.current = historyLength < 2 ? 'exploring' : 'clarifying';
    } else if (intent === 'recommendation' || intent === 'comparison') {
      conversationStateRef.current = 'clarifying';
    } else if (intent === 'content_creation') {
      conversationStateRef.current = historyLength > 3 ? 'resolving' : 'exploring';
    } else {
      conversationStateRef.current = historyLength > 5 ? 'complete' : 'exploring';
    }
  }, []);

  const generateContextualResponse = useCallback(async (message: string): Promise<AIResponse> => {
    const intent = analyzeUserIntent(message);
    const sentiment = analyzeSentiment(message);
    const topics = extractTopics(message);
    const entities = extractEntities(message);
    
    // Update conversation state
    updateConversationState(intent, memory.conversationHistory.length);
    
    // Build rich context
    const context = {
      ...memory.currentContext,
      userProfile: memory.userProfile,
      recentConversations: memory.conversationHistory.slice(-5),
      intent,
      sentiment,
      topics,
      entities,
      conversationState: conversationStateRef.current,
      topicFrequency: memory.topicFrequency,
      sentimentHistory: memory.sentimentHistory.slice(-10),
      timestamp: new Date().toISOString()
    };

    try {
      const response = await storyblokService.generateContextualResponse(message, {
        searchHistory: memory.conversationHistory.map(c => c.query),
        userPreferences: memory.userPreferences,
        context
      });

      // Update topic frequency
      const updatedTopicFrequency = { ...memory.topicFrequency };
      topics.forEach(topic => {
        updatedTopicFrequency[topic] = (updatedTopicFrequency[topic] || 0) + 1;
      });

      // Update memory
      setMemory(prev => ({
        ...prev,
        topicFrequency: updatedTopicFrequency,
        sentimentHistory: [...prev.sentimentHistory.slice(-9), sentiment]
      }));

      // Update user profile based on conversation
      if (intent === 'learning' && topics.length > 0) {
        const newExpertise = topics.filter(t => !memory.userProfile.expertise.includes(t));
        if (newExpertise.length > 0) {
          updateUserProfile({
            expertise: [...memory.userProfile.expertise, ...newExpertise]
          });
        }
      }

      // Generate follow-up questions based on intent and state
      const followUpQuestions = generateFollowUpQuestions(intent, conversationStateRef.current, topics);
      
      // Generate actionable insights
      const actionableInsights = generateActionableInsights(intent, topics, entities);

      // Add to conversation history with full context
      addToConversationHistory(message, response.response, {
        ...context,
        topics,
        entities,
        intent,
        sentiment
      });

      return {
        response: response.response,
        confidence: response.confidence || 0.85,
        intent,
        sentiment,
        suggestions: response.suggestions || [],
        relatedContent: response.relatedContent || [],
        followUpQuestions,
        actionableInsights,
        conversationState: conversationStateRef.current
      };
    } catch (error) {
      console.error('Contextual response generation failed:', error);
      throw error;
    }
  }, [
    memory, 
    analyzeUserIntent, 
    analyzeSentiment, 
    extractTopics, 
    extractEntities,
    updateConversationState,
    updateUserProfile, 
    addToConversationHistory
  ]);

  // Generate follow-up questions based on context
  const generateFollowUpQuestions = useCallback((
    intent: string, 
    state: string, 
    topics: string[]
  ): string[] => {
    const questionBank: Record<string, Record<string, string[]>> = {
      'learning': {
        'exploring': [
          'Would you like to see a practical example?',
          'Should I explain this in more detail?',
          'Would you like to know about related concepts?'
        ],
        'clarifying': [
          'Does this answer your question?',
          'Would you like me to elaborate on any specific part?',
          'Are there any edge cases you\'d like to discuss?'
        ]
      },
      'troubleshooting': {
        'exploring': [
          'Can you describe the issue in more detail?',
          'What steps have you already tried?',
          'When did this problem first occur?'
        ],
        'clarifying': [
          'Have you checked the error logs?',
          'Does this happen consistently?',
          'What\'s your current setup?'
        ]
      },
      'content_creation': {
        'exploring': [
          'What type of content are you creating?',
          'Who is your target audience?',
          'What\'s the main goal of this content?'
        ],
        'resolving': [
          'Would you like me to review the content?',
          'Should I suggest any improvements?',
          'Are you ready to finalize this?'
        ]
      }
    };

    const questions = questionBank[intent]?.[state] || [
      'Can I help you with anything else?',
      'Would you like to explore related topics?',
      'Is there anything else you\'d like to know?'
    ];

    return questions.slice(0, 2);
  }, []);

  // Generate actionable insights
  const generateActionableInsights = useCallback((
    intent: string,
    topics: string[],
    entities: string[]
  ): string[] => {
    const insights: string[] = [];

    if (intent === 'learning' && topics.includes('storyblok')) {
      insights.push('💡 Try exploring the Storyblok documentation for hands-on examples');
    }

    if (intent === 'optimization' && topics.includes('performance')) {
      insights.push('⚡ Consider implementing caching strategies for better performance');
    }

    if (intent === 'troubleshooting') {
      insights.push('🔍 Check the console logs for detailed error messages');
      insights.push('📝 Review the recent changes that might have caused the issue');
    }

    if (topics.includes('api') && entities.includes('Storyblok')) {
      insights.push('🔗 Make sure your API keys are properly configured');
    }

    return insights.slice(0, 3);
  }, []);

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
        confidence: response.confidence,
        intent: response.intent,
        sentiment: response.sentiment,
        followUpQuestions: response.followUpQuestions,
        actionableInsights: response.actionableInsights,
        conversationState: response.conversationState
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
        role: 'user',
        learningStyle: 'textual',
        preferredLanguage: 'en'
      },
      conversationSummary: '',
      topicFrequency: {},
      sentimentHistory: []
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