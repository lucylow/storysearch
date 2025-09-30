import { useState, useEffect, useCallback, useRef } from 'react';
import { SearchResult } from '../services/storyblokService';

interface UserBehavior {
  recentSearches: string[];
  viewedContent: string[];
  timeOnPage: Record<string, number>;
  clickPatterns: Array<{
    contentId: string;
    timestamp: number;
    context: string;
  }>;
  preferences: {
    contentTypes: string[];
    topics: string[];
    timeOfDay: string;
  };
}

interface PredictiveRecommendation {
  id: string;
  content: SearchResult;
  confidence: number;
  reason: string;
  source: 'behavior' | 'context' | 'trending' | 'similar' | 'personalized';
}

interface PredictiveSurfacingOptions {
  enableBehaviorTracking?: boolean;
  enableContextualAnalysis?: boolean;
  enableTrendingContent?: boolean;
  maxRecommendations?: number;
}

export const usePredictiveSurfacing = (options: PredictiveSurfacingOptions = {}) => {
  const {
    enableBehaviorTracking = true,
    enableContextualAnalysis = true,
    enableTrendingContent = true,
    maxRecommendations = 10
  } = options;

  const [userBehavior, setUserBehavior] = useState<UserBehavior>({
    recentSearches: [],
    viewedContent: [],
    timeOnPage: {},
    clickPatterns: [],
    preferences: {
      contentTypes: [],
      topics: [],
      timeOfDay: 'morning'
    }
  });

  const [predictions, setPredictions] = useState<PredictiveRecommendation[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const pageStartTime = useRef<number>(Date.now());
  const currentPageId = useRef<string>('');

  // Load user behavior from localStorage
  useEffect(() => {
    if (enableBehaviorTracking) {
      const savedBehavior = localStorage.getItem('storysearch_user_behavior');
      if (savedBehavior) {
        try {
          setUserBehavior(JSON.parse(savedBehavior));
        } catch (error) {
          console.error('Failed to load user behavior:', error);
        }
      }
    }
  }, [enableBehaviorTracking]);

  // Save user behavior to localStorage
  useEffect(() => {
    if (enableBehaviorTracking) {
      localStorage.setItem('storysearch_user_behavior', JSON.stringify(userBehavior));
    }
  }, [userBehavior, enableBehaviorTracking]);

  // Track search behavior
  const trackSearch = useCallback((query: string) => {
    setUserBehavior(prev => ({
      ...prev,
      recentSearches: [query, ...prev.recentSearches.slice(0, 19)] // Keep last 20 searches
    }));
  }, []);

  // Track content view
  const trackContentView = useCallback((contentId: string) => {
    currentPageId.current = contentId;
    pageStartTime.current = Date.now();

    setUserBehavior(prev => ({
      ...prev,
      viewedContent: [contentId, ...prev.viewedContent.slice(0, 49)] // Keep last 50 views
    }));
  }, []);

  // Track time on page
  const trackTimeOnPage = useCallback(() => {
    if (currentPageId.current) {
      const timeSpent = Date.now() - pageStartTime.current;
      setUserBehavior(prev => ({
        ...prev,
        timeOnPage: {
          ...prev.timeOnPage,
          [currentPageId.current]: (prev.timeOnPage[currentPageId.current] || 0) + timeSpent
        }
      }));
    }
  }, []);

  // Track click patterns
  const trackClick = useCallback((contentId: string, context: string) => {
    setUserBehavior(prev => ({
      ...prev,
      clickPatterns: [
        {
          contentId,
          timestamp: Date.now(),
          context
        },
        ...prev.clickPatterns.slice(0, 99) // Keep last 100 clicks
      ]
    }));
  }, []);

  // Analyze user behavior and generate predictions
  const analyzeBehavior = useCallback(async () => {
    setIsAnalyzing(true);

    try {
      const recommendations: PredictiveRecommendation[] = [];

      // 1. Behavior-based predictions
      if (enableBehaviorTracking && userBehavior.recentSearches.length > 0) {
        // Extract topics from recent searches
        const topics = extractTopics(userBehavior.recentSearches);
        
        // Generate recommendations based on search patterns
        const behaviorRecs = await generateBehaviorBasedRecommendations(topics, userBehavior);
        recommendations.push(...behaviorRecs);
      }

      // 2. Context-based predictions
      if (enableContextualAnalysis) {
        const currentTime = new Date().getHours();
        const timeContext = getTimeContext(currentTime);
        const contextRecs = await generateContextualRecommendations(timeContext, userBehavior);
        recommendations.push(...contextRecs);
      }

      // 3. Trending content predictions
      if (enableTrendingContent) {
        const trendingRecs = await generateTrendingRecommendations();
        recommendations.push(...trendingRecs);
      }

      // 4. Similar content based on viewing history
      if (userBehavior.viewedContent.length > 0) {
        const similarRecs = await generateSimilarContentRecommendations(userBehavior.viewedContent);
        recommendations.push(...similarRecs);
      }

      // Sort by confidence and limit results
      const sortedRecommendations = recommendations
        .sort((a, b) => b.confidence - a.confidence)
        .slice(0, maxRecommendations);

      setPredictions(sortedRecommendations);
    } catch (error) {
      console.error('Failed to analyze behavior:', error);
    } finally {
      setIsAnalyzing(false);
    }
  }, [userBehavior, enableBehaviorTracking, enableContextualAnalysis, enableTrendingContent, maxRecommendations]);

  // Run analysis when behavior changes
  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      analyzeBehavior();
    }, 1000);

    return () => clearTimeout(debounceTimeout);
  }, [userBehavior, analyzeBehavior]);

  // Track page visibility and time on page
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        trackTimeOnPage();
      } else {
        pageStartTime.current = Date.now();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      trackTimeOnPage();
    };
  }, [trackTimeOnPage]);

  // Clear user data
  const clearUserData = useCallback(() => {
    setUserBehavior({
      recentSearches: [],
      viewedContent: [],
      timeOnPage: {},
      clickPatterns: [],
      preferences: {
        contentTypes: [],
        topics: [],
        timeOfDay: 'morning'
      }
    });
    localStorage.removeItem('storysearch_user_behavior');
  }, []);

  return {
    predictions,
    userBehavior,
    isAnalyzing,
    trackSearch,
    trackContentView,
    trackClick,
    trackTimeOnPage,
    analyzeBehavior,
    clearUserData
  };
};

// Helper functions
function extractTopics(searches: string[]): string[] {
  const topics = new Set<string>();
  
  searches.forEach(search => {
    // Extract keywords (simple implementation)
    const words = search.toLowerCase().split(/\s+/);
    words.forEach(word => {
      if (word.length > 3) { // Filter out short words
        topics.add(word);
      }
    });
  });

  return Array.from(topics);
}

function getTimeContext(hour: number): string {
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'night';
}

async function generateBehaviorBasedRecommendations(
  topics: string[],
  behavior: UserBehavior
): Promise<PredictiveRecommendation[]> {
  // Mock implementation - replace with actual API call
  return topics.slice(0, 3).map((topic, index) => ({
    id: `behavior-${index}`,
    content: {
      id: `content-${index}`,
      title: `Recommended: ${topic}`,
      content: `Based on your recent searches, you might be interested in this content about ${topic}`,
      type: 'story' as const,
      url: `/content/${topic}`,
      tags: [topic],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      relevanceScore: 0.9 - index * 0.1
    },
    confidence: 0.9 - index * 0.1,
    reason: `Matches your search history for "${topic}"`,
    source: 'behavior' as const
  }));
}

async function generateContextualRecommendations(
  timeContext: string,
  behavior: UserBehavior
): Promise<PredictiveRecommendation[]> {
  // Mock implementation - replace with actual API call
  return [{
    id: 'context-1',
    content: {
      id: 'context-content-1',
      title: `${timeContext} Reading Recommendations`,
      content: `Content optimized for ${timeContext} browsing`,
      type: 'story' as const,
      url: `/context/${timeContext}`,
      tags: [timeContext, 'contextual'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      relevanceScore: 0.85
    },
    confidence: 0.85,
    reason: `Optimized for ${timeContext} reading`,
    source: 'context' as const
  }];
}

async function generateTrendingRecommendations(): Promise<PredictiveRecommendation[]> {
  // Mock implementation - replace with actual API call
  return [{
    id: 'trending-1',
    content: {
      id: 'trending-content-1',
      title: 'Trending: Popular Content',
      content: 'Most viewed content this week',
      type: 'story' as const,
      url: '/trending',
      tags: ['trending', 'popular'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      relevanceScore: 0.8
    },
    confidence: 0.8,
    reason: 'Trending content in your area of interest',
    source: 'trending' as const
  }];
}

async function generateSimilarContentRecommendations(
  viewedContent: string[]
): Promise<PredictiveRecommendation[]> {
  // Mock implementation - replace with actual API call
  return [{
    id: 'similar-1',
    content: {
      id: 'similar-content-1',
      title: 'Similar to what you viewed',
      content: 'Content related to your recent views',
      type: 'story' as const,
      url: '/similar',
      tags: ['similar', 'recommended'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      relevanceScore: 0.75
    },
    confidence: 0.75,
    reason: 'Similar to content you recently viewed',
    source: 'similar' as const
  }];
}
