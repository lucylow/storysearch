// Advanced TypeScript interfaces for complex search engine architecture
// types/search-engine.ts

export interface SearchEngineArchitecture {
  storyblok: {
    webhookHandlers: string[];
    managementAPI: string[];
    componentSchema: string[];
  };
  algolia: {
    indices: string[];
    aiFeatures: string[];
    personalization: string[];
  };
  backend: {
    serverlessFunctions: string[];
    realTimeProcessing: string[];
    cachingLayers: string[];
  };
  frontend: {
    searchComponents: string[];
    analytics: string[];
    performance: string[];
  };
}

export interface AlgoliaRecord {
  objectID: string;
  storyblok_id: number;
  slug: string;
  name: string;
  content: {
    text: string;
    html: string;
    structured_data: StructuredContent;
  };
  // AI-enhanced fields
  ai_metadata: AIMetadata;
  semantic_vector: number[];
  content_relationships: ContentRelationship[];
  
  // Search optimization
  search_priority: number;
  engagement_metrics: EngagementMetrics;
  freshness_score: number;
  
  // Multi-language support
  language: string;
  translations: TranslationData[];
  
  // Personalization data
  user_affinity_scores: UserAffinityScore[];
  
  // Analytics
  search_performance: SearchPerformanceMetrics;
  
  // Timestamps
  created_at: string;
  updated_at: string;
  published_at: string;
}

export interface AIMetadata {
  key_topics: string[];
  content_difficulty: 'beginner' | 'intermediate' | 'advanced';
  sentiment_analysis: SentimentAnalysis;
  recommended_queries: string[];
  content_summary: string;
  semantic_tags: SemanticTag[];
  readability_score: number;
  seo_recommendations: SEORecommendation[];
  entities: Entity[];
  concepts: Concept[];
  intent_classification: IntentClassification;
}

export interface SentimentAnalysis {
  sentiment: 'positive' | 'negative' | 'neutral';
  confidence: number;
  emotional_tone: string[];
  subjectivity_score: number;
}

export interface SemanticTag {
  tag: string;
  confidence: number;
  category: string;
  relevance_score: number;
}

export interface SEORecommendation {
  type: 'title' | 'meta' | 'content' | 'structure';
  recommendation: string;
  priority: 'high' | 'medium' | 'low';
  impact_score: number;
}

export interface Entity {
  name: string;
  type: 'person' | 'organization' | 'technology' | 'concept' | 'location';
  confidence: number;
  mentions: number;
}

export interface Concept {
  concept: string;
  definition: string;
  related_concepts: string[];
  complexity_level: number;
}

export interface IntentClassification {
  primary_intent: string;
  secondary_intents: string[];
  confidence: number;
  user_journey_stage: 'awareness' | 'consideration' | 'decision' | 'retention';
}

export interface ContentRelationship {
  related_content_id: string;
  relationship_type: 'similar' | 'prerequisite' | 'follow_up' | 'alternative' | 'complementary';
  strength: number;
  reasoning: string;
}

export interface EngagementMetrics {
  view_count: number;
  click_through_rate: number;
  time_on_page: number;
  bounce_rate: number;
  social_shares: number;
  conversion_rate: number;
  user_rating: number;
  last_updated: string;
}

export interface TranslationData {
  language: string;
  title: string;
  content: string;
  slug: string;
  last_updated: string;
  quality_score: number;
}

export interface UserAffinityScore {
  user_segment: string;
  affinity_score: number;
  interaction_count: number;
  last_interaction: string;
}

export interface SearchPerformanceMetrics {
  average_rank: number;
  click_through_rate: number;
  conversion_rate: number;
  search_volume: number;
  trend_direction: 'up' | 'down' | 'stable';
  seasonal_patterns: SeasonalPattern[];
}

export interface SeasonalPattern {
  period: string;
  search_volume_multiplier: number;
  conversion_rate_multiplier: number;
}

export interface StructuredContent {
  headings: Heading[];
  lists: List[];
  tables: Table[];
  media: Media[];
  links: Link[];
  code_blocks: CodeBlock[];
}

export interface Heading {
  level: number;
  text: string;
  anchor: string;
  position: number;
}

export interface List {
  type: 'ordered' | 'unordered';
  items: string[];
  position: number;
}

export interface Table {
  headers: string[];
  rows: string[][];
  position: number;
}

export interface Media {
  type: 'image' | 'video' | 'audio';
  url: string;
  alt_text: string;
  caption: string;
  position: number;
}

export interface Link {
  url: string;
  text: string;
  is_external: boolean;
  position: number;
}

export interface CodeBlock {
  language: string;
  code: string;
  position: number;
}

export interface SearchState {
  results: SearchResponse | null;
  loading: boolean;
  error: Error | null;
  facets: FacetState;
  personalization: PersonalizationState;
  ai_suggestions: AISuggestionState;
  analytics: SearchAnalyticsData;
  query_history: QueryHistory[];
  user_context: UserContext;
}

export interface SearchResponse {
  hits: AlgoliaRecord[];
  nbHits: number;
  page: number;
  nbPages: number;
  hitsPerPage: number;
  facets: Record<string, Record<string, number>>;
  facets_stats: Record<string, FacetStats>;
  processing_time_ms: number;
  query: string;
  params: string;
  index: string;
  // AI-enhanced fields
  ai_insights: AIInsights;
  personalization: PersonalizationData;
  recommendations: RecommendationSet;
}

export interface AIInsights {
  query_intent: string;
  suggested_refinements: string[];
  content_gaps: string[];
  trending_topics: string[];
  user_behavior_insights: string[];
}

export interface PersonalizationData {
  user_segment: string;
  personalization_score: number;
  recommended_content: string[];
  user_preferences: UserPreferences;
}

export interface RecommendationSet {
  trending: AlgoliaRecord[];
  personalized: AlgoliaRecord[];
  similar: AlgoliaRecord[];
  ai_curated: AlgoliaRecord[];
  frequently_viewed_together: AlgoliaRecord[];
}

export interface FacetState {
  [facetName: string]: {
    values: string[];
    selected: string[];
    isRefined: boolean;
  };
}

export interface PersonalizationState {
  isEnabled: boolean;
  userToken: string | null;
  userProfile: UserProfile | null;
  personalizationScore: number;
  recommendations: RecommendationSet | null;
}

export interface AISuggestionState {
  suggestions: AISuggestion[];
  loading: boolean;
  query_intent: string | null;
  confidence: number;
}

export interface AISuggestion {
  suggestion: string;
  type: 'query' | 'filter' | 'refinement' | 'related';
  confidence: number;
  reasoning: string;
  expected_results: number;
}

export interface SearchAnalyticsData {
  query_performance: QueryPerformance[];
  user_behavior: UserBehaviorMetrics;
  content_performance: ContentPerformanceMetrics;
  system_performance: SystemPerformanceMetrics;
}

export interface QueryPerformance {
  query: string;
  frequency: number;
  avg_click_through_rate: number;
  avg_conversion_rate: number;
  avg_time_to_click: number;
  trend: 'up' | 'down' | 'stable';
}

export interface UserBehaviorMetrics {
  total_searches: number;
  unique_users: number;
  avg_session_duration: number;
  bounce_rate: number;
  return_visitor_rate: number;
  device_distribution: DeviceDistribution;
}

export interface DeviceDistribution {
  desktop: number;
  mobile: number;
  tablet: number;
}

export interface ContentPerformanceMetrics {
  top_performing_content: ContentPerformance[];
  content_gaps: string[];
  trending_content: string[];
  underperforming_content: string[];
}

export interface ContentPerformance {
  content_id: string;
  title: string;
  search_rank: number;
  click_through_rate: number;
  conversion_rate: number;
  engagement_score: number;
}

export interface SystemPerformanceMetrics {
  avg_search_time: number;
  cache_hit_rate: number;
  error_rate: number;
  throughput: number;
  latency_p95: number;
}

export interface QueryHistory {
  query: string;
  timestamp: string;
  results_count: number;
  clicked_results: string[];
  filters_used: Record<string, string[]>;
  session_id: string;
}

export interface UserContext {
  current_page: string;
  referrer: string;
  user_agent: string;
  screen_resolution: string;
  timezone: string;
  language: string;
  device_type: 'desktop' | 'mobile' | 'tablet';
  session_duration: number;
  previous_searches: string[];
}

export interface UserProfile {
  user_id: string;
  preferences: UserPreferences;
  behavior_patterns: BehaviorPattern[];
  content_affinities: ContentAffinity[];
  search_history: SearchHistory[];
  personalization_score: number;
  last_updated: string;
}

export interface UserPreferences {
  content_types: string[];
  difficulty_levels: string[];
  topics: string[];
  languages: string[];
  layout_preference: 'grid' | 'list' | 'card';
  results_per_page: number;
}

export interface BehaviorPattern {
  pattern_type: 'search' | 'browse' | 'filter' | 'click';
  frequency: number;
  time_of_day: string;
  day_of_week: string;
  confidence: number;
}

export interface ContentAffinity {
  content_id: string;
  affinity_score: number;
  interaction_count: number;
  last_interaction: string;
  interaction_types: string[];
}

export interface SearchHistory {
  query: string;
  timestamp: string;
  results_clicked: string[];
  filters_applied: Record<string, string[]>;
  session_context: string;
}

// Advanced generic types for reusable components
export type Searchable<T> = T & {
  searchableFields: (keyof T)[];
  rankingWeights: Partial<Record<keyof T, number>>;
  facetConfig: FacetConfiguration<T>;
};

export type Personalizable<T> = T & {
  personalizationAttributes: (keyof T)[];
  affinityScoring: AffinityScoringConfig<T>;
};

export type FacetConfiguration<T> = {
  [K in keyof T]?: {
    type: 'string' | 'number' | 'boolean' | 'date';
    searchable: boolean;
    filterable: boolean;
    sortable: boolean;
    facetable: boolean;
    ranking: number;
  };
};

export type AffinityScoringConfig<T> = {
  [K in keyof T]?: {
    weight: number;
    decay_factor: number;
    interaction_types: string[];
  };
};

export interface FacetStats {
  min: number;
  max: number;
  avg: number;
  sum: number;
}

// Event types for user behavior tracking
export interface UserEvent {
  event_type: 'search' | 'click' | 'view' | 'filter' | 'scroll' | 'exit';
  timestamp: string;
  user_id: string;
  session_id: string;
  data: Record<string, unknown>;
  context: UserContext;
}

export interface ProcessedEvent extends UserEvent {
  ml_insights: {
    intent_prediction: string;
    content_affinity: number;
    engagement_level: 'low' | 'medium' | 'high';
    temporal_pattern: TemporalPattern;
  };
}

export interface TemporalPattern {
  time_of_day_preference: string;
  day_of_week_preference: string;
  seasonal_patterns: string[];
  session_duration_pattern: string;
}

// Search options and configuration
export interface SearchOptions {
  query: string;
  filters?: Record<string, string[]>;
  facets?: string[];
  hitsPerPage?: number;
  page?: number;
  personalization?: UserProfile;
  aiFeatures?: boolean;
  semanticSearch?: SemanticSearchOptions;
  reRanking?: ReRankingOptions;
}

export interface SemanticSearchOptions {
  query: string;
  attributes: string[];
  neighbors?: number;
  threshold?: number;
}

export interface ReRankingOptions {
  model: string;
  attributes: string[];
  weights?: Record<string, number>;
}

// Performance monitoring types
export interface PerformanceMetrics {
  query: string;
  duration: number;
  resultCount: number;
  cacheStatus: 'hit' | 'miss' | 'stale';
  optionsUsed: SearchOptions;
  timestamp: string;
}

export interface CacheConfiguration {
  ttl: number;
  maxSize: number;
  evictionPolicy: 'lru' | 'lfu' | 'ttl';
  compression: boolean;
  encryption: boolean;
}

// Error handling types
export interface SearchError extends Error {
  code: string;
  context: Record<string, unknown>;
  retryable: boolean;
  fallbackStrategy?: string;
}

export interface ErrorRecoveryStrategy {
  errorType: string;
  strategy: 'retry' | 'fallback' | 'degrade' | 'fail';
  maxRetries: number;
  retryDelay: number;
  fallbackOptions: SearchOptions;
}
