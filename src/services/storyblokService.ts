import { supabase } from '@/integrations/supabase/client';

export interface StoryblokStory {
  id: number;
  uuid: string;
  name: string;
  slug: string;
  full_slug: string;
  content: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  published_at?: string;
  first_published_at?: string;
  is_folder: boolean;
  parent_id?: number;
  group_id?: string;
  alternates: Array<Record<string, unknown>>;
  translated_slugs?: Array<Record<string, unknown>>;
  lang: string;
  content_type?: string;
  path?: string;
  real_path?: string;
  tag_list: string[];
}

export interface StoryblokSpace {
  id: number;
  name: string;
  domain: string;
  version: number;
  language_codes: string[];
  created_at: string;
  plan: string;
  plan_level: number;
}

export interface SearchResult {
  id: string;
  title: string;
  content: string;
  type: 'story' | 'component' | 'folder';
  url: string;
  thumbnail?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  relevanceScore: number;
  storyblokId?: number;
  fullSlug?: string;
}

class StoryblokService {
  private async callStoryblokAPI(action: string, params: Record<string, unknown> = {}) {
    const { data, error } = await supabase.functions.invoke('storyblok-api', {
      body: { action, params }
    });

    if (error) {
      console.error('Storyblok API error:', error);
      throw new Error(`Storyblok API error: ${error.message}`);
    }

    return data;
  }

  private async callAIFunction(functionName: string, params: Record<string, unknown> = {}) {
    try {
      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: { function: functionName, params }
      });

      if (error) {
        console.error('AI Function error:', error);
        throw new Error(`AI Function error: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('AI Function call failed:', error);
      // Return empty response for fallback
      return {};
    }
  }

  async getSpaces(): Promise<StoryblokSpace[]> {
    const response = await this.callStoryblokAPI('getSpaces');
    return response.spaces || [];
  }

  async getSpace(spaceId: number): Promise<StoryblokSpace> {
    const response = await this.callStoryblokAPI('getSpace', { spaceId });
    return response.space;
  }

  async getStories(spaceId: number, page = 1, perPage = 25): Promise<StoryblokStory[]> {
    const response = await this.callStoryblokAPI('getStories', { 
      spaceId, 
      page, 
      per_page: perPage 
    });
    return response.stories || [];
  }

  async searchStories(spaceId: number, query: string, page = 1, perPage = 25): Promise<StoryblokStory[]> {
    const response = await this.callStoryblokAPI('searchStories', { 
      spaceId, 
      search: query,
      page, 
      per_page: perPage 
    });
    return response.stories || [];
  }

  async generateContextualResponse(message: string, context?: any) {
    try {
      const response = await this.callAIFunction('ai-contextual-response', {
        message,
        context: context || {}
      });
      
      return {
        response: response.response || 'I understand your request. How can I help you with your content?',
        suggestions: response.suggestions || [],
        relatedContent: response.relatedContent || [],
        confidence: response.confidence || 0.8
      };
    } catch (error) {
      console.error('Contextual response generation failed:', error);
      // Fallback response
      return {
        response: 'I understand your request. How can I help you with your content?',
        suggestions: [],
        relatedContent: [],
        confidence: 0.5
      };
    }
  }

  async search(query: string, spaceId?: number): Promise<SearchResult[]> {
    try {
      // If no spaceId provided, get the first available space
      if (!spaceId) {
        const spaces = await this.getSpaces();
        if (spaces.length === 0) {
          throw new Error('No Storyblok spaces found');
        }
        spaceId = spaces[0].id;
      }

      const stories = await this.searchStories(spaceId, query);
      
      return stories.map(story => this.transformStoryToSearchResult(story));
    } catch (error) {
      console.error('Search error:', error);
      throw error;
    }
  }

  private transformStoryToSearchResult(story: StoryblokStory): SearchResult {
    const content = story.content || {};
    const title = story.name || (content.title as string) || story.slug;
    const description = (content.description as string) || (content.intro as string) || (content.body as string) || '';
    
    // Extract text content for search
    const textContent = this.extractTextContent(content);
    
    return {
      id: story.uuid || story.id.toString(),
      title: title || 'Untitled',
      content: textContent.substring(0, 300) + (textContent.length > 300 ? '...' : ''),
      type: story.is_folder ? 'folder' : 'story',
      url: `/${story.full_slug}`,
      tags: story.tag_list || [],
      createdAt: story.created_at,
      updatedAt: story.updated_at,
      relevanceScore: 1.0, // Could implement proper relevance scoring
      storyblokId: story.id,
      fullSlug: story.full_slug,
      thumbnail: this.extractThumbnail(content)
    };
  }

  private extractTextContent(content: Record<string, unknown> | string | Array<unknown>): string {
    if (typeof content === 'string') {
      return content;
    }
    
    if (typeof content === 'object' && content !== null) {
      let text = '';
      for (const [key, value] of Object.entries(content)) {
        if (typeof value === 'string') {
          text += value + ' ';
        } else if (Array.isArray(value)) {
          text += value.map(item => this.extractTextContent(item)).join(' ') + ' ';
        } else if (typeof value === 'object' && value !== null) {
          text += this.extractTextContent(value as Record<string, unknown>) + ' ';
        }
      }
      return text.trim();
    }
    
    return '';
  }

  private extractThumbnail(content: Record<string, unknown>): string | undefined {
    // Look for common image field names
    const imageFields = ['image', 'thumbnail', 'hero_image', 'featured_image', 'cover'];
    
    for (const field of imageFields) {
      if (content[field]) {
        if (typeof content[field] === 'string') {
          return content[field] as string;
        } else if (typeof content[field] === 'object' && content[field] !== null) {
          const imageObj = content[field] as Record<string, unknown>;
          if (typeof imageObj.filename === 'string') {
            return imageObj.filename;
          }
        }
      }
    }
    
    return undefined;
  }

  async askAI(question: string, context?: Record<string, unknown>): Promise<string> {
    try {
      const messages = [
        { role: 'user', content: question }
      ];

      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: { messages, context }
      });

      if (error) {
        throw new Error(`AI Chat error: ${error.message}`);
      }

      return data.response;
    } catch (error) {
      console.error('AI Chat error:', error);
      throw error;
    }
  }

  async getSuggestions(query: string): Promise<string[]> {
    // Generate contextual suggestions based on Storyblok
    const suggestions = [
      'How do I create a new content type in Storyblok?',
      'What are the best practices for content modeling?',
      'How can I optimize my content for SEO?',
      'Show me examples of rich text content',
      'How do I set up multilingual content?',
      'What are Storyblok components and how do I use them?'
    ];

    if (!query.trim()) {
      return suggestions.slice(0, 4);
    }

    // Filter suggestions based on query
    return suggestions.filter(suggestion => 
      suggestion.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 4);
  }

  // AI Enhancement Methods

  /**
   * Analyze content and extract insights using AI
   */
  async analyzeContent(content: string, metadata?: Record<string, unknown>): Promise<ContentAnalysis> {
    try {
      const response = await this.callAIFunction('ai-content-analysis', {
        content,
        metadata
      });

      return {
        summary: response.summary || '',
        keyTopics: response.keyTopics || [],
        sentiment: response.sentiment || 'neutral',
        readabilityScore: response.readabilityScore || 0,
        seoScore: response.seoScore || 0,
        suggestedTags: response.suggestedTags || [],
        contentType: response.contentType || 'article',
        wordCount: response.wordCount || 0,
        estimatedReadTime: response.estimatedReadTime || 0
      };
    } catch (error) {
      console.error('Content analysis error:', error);
      // Return fallback analysis
      return {
        summary: content.substring(0, 200) + '...',
        keyTopics: [],
        sentiment: 'neutral',
        readabilityScore: 50,
        seoScore: 50,
        suggestedTags: [],
        contentType: 'article',
        wordCount: content.split(' ').length,
        estimatedReadTime: Math.ceil(content.split(' ').length / 200)
      };
    }
  }

  /**
   * Generate intelligent content recommendations
   */
  async getContentRecommendations(
    currentContent: StoryblokStory | SearchResult,
    userHistory?: string[],
    limit = 5
  ): Promise<ContentRecommendation[]> {
    try {
      const response = await this.callAIFunction('ai-recommendations', {
        currentContent,
        userHistory,
        limit
      });

      return response.recommendations || [];
    } catch (error) {
      console.error('Content recommendations error:', error);
      return [];
    }
  }

  /**
   * Enhance search queries with AI-powered suggestions
   */
  async enhanceSearchQuery(query: string, context?: Record<string, unknown>): Promise<SearchEnhancement> {
    try {
      const response = await this.callAIFunction('ai-search-enhancement', {
        query,
        context
      });

      return {
        originalQuery: query,
        enhancedQuery: response.enhancedQuery || query,
        intent: response.intent || 'search',
        suggestions: response.suggestions || [],
        relatedQueries: response.relatedQueries || [],
        filters: response.filters || []
      };
    } catch (error) {
      console.error('Search enhancement error:', error);
      return {
        originalQuery: query,
        enhancedQuery: query,
        intent: 'search',
        suggestions: [],
        relatedQueries: [],
        filters: []
      };
    }
  }

  /**
   * Generate content insights and analytics
   */
  async generateContentInsights(content: StoryblokStory[]): Promise<ContentInsight[]> {
    try {
      const response = await this.callAIFunction('ai-content-insights', {
        content
      });

      return response.insights || [];
    } catch (error) {
      console.error('Content insights error:', error);
      return [];
    }
  }

  /**
   * Auto-categorize and tag content
   */
  async categorizeContent(content: string, existingTags?: string[]): Promise<{
    category: string;
    tags: string[];
    confidence: number;
  }> {
    try {
      const response = await this.callAIFunction('ai-categorization', {
        content,
        existingTags
      });

      return {
        category: response.category || 'general',
        tags: response.tags || [],
        confidence: response.confidence || 0.5
      };
    } catch (error) {
      console.error('Content categorization error:', error);
      return {
        category: 'general',
        tags: [],
        confidence: 0.5
      };
    }
  }

  /**
   * Generate content suggestions for improvement
   */
  async generateContentSuggestions(content: string, type: string): Promise<{
    suggestions: Array<{
      type: 'seo' | 'readability' | 'engagement' | 'structure';
      title: string;
      description: string;
      priority: 'high' | 'medium' | 'low';
      actionable: boolean;
    }>;
    overallScore: number;
  }> {
    try {
      const response = await this.callAIFunction('ai-content-suggestions', {
        content,
        type
      });

      return {
        suggestions: response.suggestions || [],
        overallScore: response.overallScore || 50
      };
    } catch (error) {
      console.error('Content suggestions error:', error);
      return {
        suggestions: [],
        overallScore: 50
      };
    }
  }

  /**
   * Extract key information from content
   */
  async extractKeyInformation(content: string): Promise<{
    entities: Array<{
      name: string;
      type: 'person' | 'organization' | 'location' | 'date' | 'product';
      confidence: number;
    }>;
    keyPhrases: string[];
    summary: string;
    questions: string[];
  }> {
    try {
      const response = await this.callAIFunction('ai-extraction', {
        content
      });

      return {
        entities: response.entities || [],
        keyPhrases: response.keyPhrases || [],
        summary: response.summary || '',
        questions: response.questions || []
      };
    } catch (error) {
      console.error('Key information extraction error:', error);
      return {
        entities: [],
        keyPhrases: [],
        summary: '',
        questions: []
      };
    }
  }

  /**
   * Multi-modal search with AI-powered analysis
   */
  async multiModalSearch(searchData: {
    text?: string;
    image?: File;
    audio?: File;
    video?: File;
  }): Promise<{
    results: SearchResult[];
    analysis: {
      textAnalysis?: ContentAnalysis;
      imageAnalysis?: {
        description: string;
        tags: string[];
        objects: string[];
        colors: string[];
        confidence: number;
      };
      audioAnalysis?: {
        transcription: string;
        topics: string[];
        sentiment: string;
        confidence: number;
      };
      videoAnalysis?: {
        description: string;
        scenes: string[];
        tags: string[];
        duration: number;
        confidence: number;
      };
    };
    crossModalRecommendations: ContentRecommendation[];
  }> {
    try {
      const analysis: any = {};
      let searchQuery = searchData.text || '';

      // Process text if provided
      if (searchData.text) {
        analysis.textAnalysis = await this.analyzeContent(searchData.text);
        searchQuery = searchData.text;
      }

      // Process image if provided
      if (searchData.image) {
        analysis.imageAnalysis = await this.analyzeImage(searchData.image);
        searchQuery += ` ${analysis.imageAnalysis.description}`;
      }

      // Process audio if provided
      if (searchData.audio) {
        analysis.audioAnalysis = await this.analyzeAudio(searchData.audio);
        searchQuery += ` ${analysis.audioAnalysis.transcription}`;
      }

      // Process video if provided
      if (searchData.video) {
        analysis.videoAnalysis = await this.analyzeVideo(searchData.video);
        searchQuery += ` ${analysis.videoAnalysis.description}`;
      }

      // Perform enhanced search with combined query
      const results = await this.search(searchQuery);

      // Generate cross-modal recommendations
      const crossModalRecommendations = await this.getCrossModalRecommendations(analysis);

      return {
        results,
        analysis,
        crossModalRecommendations
      };
    } catch (error) {
      console.error('Multi-modal search error:', error);
      throw error;
    }
  }

  /**
   * Analyze image content with AI
   */
  private async analyzeImage(image: File): Promise<{
    description: string;
    tags: string[];
    objects: string[];
    colors: string[];
    confidence: number;
  }> {
    try {
      const response = await this.callAIFunction('ai-image-analysis', {
        image: image.name,
        type: image.type
      });

      return {
        description: response.description || 'An image containing various visual elements',
        tags: response.tags || ['image', 'visual'],
        objects: response.objects || [],
        colors: response.colors || [],
        confidence: response.confidence || 0.8
      };
    } catch (error) {
      console.error('Image analysis error:', error);
      return {
        description: 'An image containing various visual elements',
        tags: ['image', 'visual'],
        objects: [],
        colors: [],
        confidence: 0.5
      };
    }
  }

  /**
   * Analyze audio content with AI
   */
  private async analyzeAudio(audio: File): Promise<{
    transcription: string;
    topics: string[];
    sentiment: string;
    confidence: number;
  }> {
    try {
      const response = await this.callAIFunction('ai-audio-analysis', {
        audio: audio.name,
        type: audio.type
      });

      return {
        transcription: response.transcription || 'Audio content transcription',
        topics: response.topics || ['audio', 'speech'],
        sentiment: response.sentiment || 'neutral',
        confidence: response.confidence || 0.8
      };
    } catch (error) {
      console.error('Audio analysis error:', error);
      return {
        transcription: 'Audio content transcription',
        topics: ['audio', 'speech'],
        sentiment: 'neutral',
        confidence: 0.5
      };
    }
  }

  /**
   * Analyze video content with AI
   */
  private async analyzeVideo(video: File): Promise<{
    description: string;
    scenes: string[];
    tags: string[];
    duration: number;
    confidence: number;
  }> {
    try {
      const response = await this.callAIFunction('ai-video-analysis', {
        video: video.name,
        type: video.type
      });

      return {
        description: response.description || 'A video containing various visual and audio elements',
        scenes: response.scenes || [],
        tags: response.tags || ['video', 'multimedia'],
        duration: response.duration || 0,
        confidence: response.confidence || 0.8
      };
    } catch (error) {
      console.error('Video analysis error:', error);
      return {
        description: 'A video containing various visual and audio elements',
        scenes: [],
        tags: ['video', 'multimedia'],
        duration: 0,
        confidence: 0.5
      };
    }
  }

  /**
   * Generate cross-modal content recommendations
   */
  private async getCrossModalRecommendations(analysis: any): Promise<ContentRecommendation[]> {
    try {
      const response = await this.callAIFunction('ai-cross-modal-recommendations', {
        analysis
      });

      return response.recommendations || [];
    } catch (error) {
      console.error('Cross-modal recommendations error:', error);
      return [];
    }
  }

  /**
   * Visual similarity search
   */
  async visualSimilaritySearch(image: File, threshold = 0.7): Promise<SearchResult[]> {
    try {
      const analysis = await this.analyzeImage(image);
      const searchQuery = `${analysis.description} ${analysis.tags.join(' ')}`;
      
      const results = await this.search(searchQuery);
      
      // Filter results based on visual similarity threshold
      return results.filter(result => result.relevanceScore >= threshold);
    } catch (error) {
      console.error('Visual similarity search error:', error);
      return [];
    }
  }

  /**
   * Voice search with intent understanding
   */
  async voiceSearchWithIntent(audio: File): Promise<{
    transcription: string;
    intent: string;
    searchQuery: string;
    results: SearchResult[];
  }> {
    try {
      const audioAnalysis = await this.analyzeAudio(audio);
      
      // Determine intent from transcription
      const intent = this.determineSearchIntent(audioAnalysis.transcription);
      
      // Enhance search query based on intent
      const searchQuery = this.enhanceQueryForIntent(audioAnalysis.transcription, intent);
      
      // Perform search
      const results = await this.search(searchQuery);
      
      return {
        transcription: audioAnalysis.transcription,
        intent,
        searchQuery,
        results
      };
    } catch (error) {
      console.error('Voice search with intent error:', error);
      throw error;
    }
  }

  /**
   * Determine search intent from text
   */
  private determineSearchIntent(text: string): string {
    const intents = {
      'tutorial': ['how to', 'tutorial', 'guide', 'learn', 'teach'],
      'comparison': ['compare', 'vs', 'versus', 'difference', 'better'],
      'troubleshooting': ['problem', 'error', 'issue', 'fix', 'help'],
      'information': ['what is', 'explain', 'define', 'information'],
      'implementation': ['implement', 'setup', 'configure', 'install']
    };

    const textLower = text.toLowerCase();
    for (const [intent, keywords] of Object.entries(intents)) {
      if (keywords.some(keyword => textLower.includes(keyword))) {
        return intent;
      }
    }
    return 'general';
  }

  /**
   * Enhance query based on intent
   */
  private enhanceQueryForIntent(query: string, intent: string): string {
    const intentEnhancements = {
      'tutorial': 'tutorial guide step by step',
      'comparison': 'comparison differences pros cons',
      'troubleshooting': 'troubleshooting solution fix',
      'information': 'explanation definition overview',
      'implementation': 'implementation setup configuration'
    };

    const enhancement = intentEnhancements[intent as keyof typeof intentEnhancements] || '';
    return `${query} ${enhancement}`.trim();
  }
}

// AI Enhancement Interfaces
export interface ContentAnalysis {
  summary: string;
  keyTopics: string[];
  sentiment: 'positive' | 'neutral' | 'negative';
  readabilityScore: number;
  seoScore: number;
  suggestedTags: string[];
  contentType: string;
  wordCount: number;
  estimatedReadTime: number;
}

export interface ContentRecommendation {
  id: string;
  title: string;
  reason: string;
  confidence: number;
  type: 'related' | 'trending' | 'personalized' | 'complementary';
  url: string;
  thumbnail?: string;
}

export interface SearchEnhancement {
  originalQuery: string;
  enhancedQuery: string;
  intent: string;
  suggestions: string[];
  relatedQueries: string[];
  filters: Array<{
    field: string;
    value: string;
    type: 'content_type' | 'tag' | 'date' | 'author';
  }>;
}

export interface ContentInsight {
  metric: string;
  value: number | string;
  trend: 'up' | 'down' | 'stable';
  description: string;
  actionable: boolean;
  recommendation?: string;
}

export const storyblokService = new StoryblokService();