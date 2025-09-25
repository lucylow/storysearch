// Mock Algolia service for demonstration
// In production, replace with actual Algolia configuration

interface SearchResult {
  id: string;
  title: string;
  content: string;
  type: 'article' | 'documentation' | 'tutorial' | 'guide';
  url: string;
  thumbnail?: string;
  tags: string[];
  createdAt: string;
  relevanceScore: number;
}

// Enhanced mock data with more comprehensive content
const mockResults: SearchResult[] = [
  {
    id: '1',
    title: 'Getting Started with Storyblok Headless CMS',
    content: 'Learn how to set up your first Storyblok project and create dynamic content structures. This comprehensive guide covers everything from initial setup to advanced configuration, including API keys, content types, and component creation. Perfect for developers new to headless CMS architecture.',
    type: 'tutorial',
    url: '/tutorials/getting-started',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop',
    tags: ['setup', 'beginner', 'headless-cms', 'tutorial', 'guide'],
    createdAt: '2024-01-15',
    relevanceScore: 0.95
  },
  {
    id: '2',
    title: 'Advanced Content Modeling Strategies',
    content: 'Explore advanced techniques for structuring your content in Storyblok for maximum flexibility and scalability. Learn about nested components, field validation, content relationships, and best practices for complex content architectures.',
    type: 'guide',
    url: '/guides/content-modeling',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=200&fit=crop',
    tags: ['modeling', 'advanced', 'structure', 'architecture', 'components'],
    createdAt: '2024-01-20',
    relevanceScore: 0.88
  },
  {
    id: '3',
    title: 'Integrating Storyblok with Next.js',
    content: 'Step-by-step guide to connecting your Storyblok CMS with a Next.js frontend application. Includes SSR, SSG, and ISR strategies, performance optimization, and real-time preview capabilities.',
    type: 'documentation',
    url: '/docs/nextjs-integration',
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=200&fit=crop',
    tags: ['nextjs', 'integration', 'frontend', 'react', 'ssr', 'ssg'],
    createdAt: '2024-01-18',
    relevanceScore: 0.82
  },
  {
    id: '4',
    title: 'SEO Best Practices for Headless CMS',
    content: 'Optimize your headless CMS content for search engines with these proven strategies. Learn about meta tags, structured data, URL optimization, and performance considerations for better search rankings.',
    type: 'article',
    url: '/articles/seo-best-practices',
    thumbnail: 'https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=400&h=200&fit=crop',
    tags: ['seo', 'optimization', 'best-practices', 'search', 'ranking'],
    createdAt: '2024-01-22',
    relevanceScore: 0.76
  },
  {
    id: '5',
    title: 'API Management and Content Delivery',
    content: 'Learn how to efficiently manage your content APIs and optimize delivery performance. Covers caching strategies, CDN configuration, rate limiting, and monitoring best practices.',
    type: 'documentation',
    url: '/docs/api-management',
    thumbnail: 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=400&h=200&fit=crop',
    tags: ['api', 'performance', 'delivery', 'caching', 'cdn', 'monitoring'],
    createdAt: '2024-01-25',
    relevanceScore: 0.71
  },
  {
    id: '6',
    title: 'Building Dynamic Components',
    content: 'Create reusable, dynamic components in Storyblok for consistent content presentation. Learn about component libraries, field types, validation rules, and responsive design patterns.',
    type: 'tutorial',
    url: '/tutorials/dynamic-components',
    thumbnail: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=200&fit=crop',
    tags: ['components', 'dynamic', 'reusable', 'library', 'responsive'],
    createdAt: '2024-01-28',
    relevanceScore: 0.85
  },
  {
    id: '7',
    title: 'Headless CMS vs Traditional CMS: Complete Comparison',
    content: 'Comprehensive comparison between headless CMS and traditional CMS solutions. Analyze performance, flexibility, developer experience, and business impact to make informed decisions.',
    type: 'article',
    url: '/articles/headless-vs-traditional-cms',
    thumbnail: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=200&fit=crop',
    tags: ['comparison', 'headless', 'traditional', 'cms', 'analysis'],
    createdAt: '2024-02-01',
    relevanceScore: 0.92
  },
  {
    id: '8',
    title: 'Multilingual Content Management with Storyblok',
    content: 'Master multilingual content management using Storyblok\'s built-in internationalization features. Learn about language variants, translation workflows, and cultural considerations.',
    type: 'guide',
    url: '/guides/multilingual-content',
    thumbnail: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=400&h=200&fit=crop',
    tags: ['multilingual', 'i18n', 'translation', 'internationalization', 'languages'],
    createdAt: '2024-02-05',
    relevanceScore: 0.79
  },
  {
    id: '9',
    title: 'Performance Optimization Techniques',
    content: 'Advanced techniques for optimizing Storyblok performance including image optimization, lazy loading, caching strategies, and CDN configuration for lightning-fast content delivery.',
    type: 'documentation',
    url: '/docs/performance-optimization',
    thumbnail: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=200&fit=crop',
    tags: ['performance', 'optimization', 'speed', 'caching', 'images', 'cdn'],
    createdAt: '2024-02-08',
    relevanceScore: 0.87
  },
  {
    id: '10',
    title: 'Webhook Implementation and Real-time Updates',
    content: 'Implement webhooks in Storyblok for real-time content updates, automated workflows, and seamless integration with external services and applications.',
    type: 'tutorial',
    url: '/tutorials/webhook-implementation',
    thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=200&fit=crop',
    tags: ['webhooks', 'real-time', 'automation', 'integration', 'updates'],
    createdAt: '2024-02-12',
    relevanceScore: 0.83
  },
  {
    id: '11',
    title: 'Content Security and Access Control',
    content: 'Implement robust security measures for your Storyblok content including role-based access control, content encryption, and compliance with data protection regulations.',
    type: 'guide',
    url: '/guides/content-security',
    thumbnail: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=200&fit=crop',
    tags: ['security', 'access-control', 'rbac', 'encryption', 'compliance'],
    createdAt: '2024-02-15',
    relevanceScore: 0.74
  },
  {
    id: '12',
    title: 'AI-Powered Content Creation and Management',
    content: 'Leverage artificial intelligence to enhance content creation, automate tagging, generate summaries, and improve content discoverability using modern AI tools and techniques.',
    type: 'article',
    url: '/articles/ai-content-management',
    thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=200&fit=crop',
    tags: ['ai', 'artificial-intelligence', 'automation', 'content-creation', 'machine-learning'],
    createdAt: '2024-02-18',
    relevanceScore: 0.91
  }
];

class AlgoliaService {
  private mockDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
  private searchCache = new Map<string, { results: SearchResult[]; timestamp: number }>();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  async search(query: string, filters?: {
    type?: string[];
    dateRange?: string;
    tags?: string[];
    sortBy?: 'relevance' | 'date' | 'popularity';
    limit?: number;
  }): Promise<SearchResult[]> {
    // Simulate network delay
    await this.mockDelay(800);
    
    if (!query.trim()) {
      return [];
    }

    // Check cache first
    const cacheKey = this.generateCacheKey(query, filters);
    const cached = this.searchCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.results;
    }

    // Enhanced search with fuzzy matching and relevance scoring
    const lowercaseQuery = query.toLowerCase();
    const queryTerms = lowercaseQuery.split(' ').filter(term => term.length > 0);
    
    let results = mockResults.map(result => {
      const relevanceScore = this.calculateRelevanceScore(result, queryTerms, filters);
      return { ...result, relevanceScore };
    });

    // Apply filters
    if (filters?.type && filters.type.length > 0) {
      results = results.filter(result => filters.type!.includes(result.type));
    }

    if (filters?.tags && filters.tags.length > 0) {
      results = results.filter(result => 
        filters.tags!.some(tag => result.tags.includes(tag))
      );
    }

    if (filters?.dateRange && filters.dateRange !== 'all') {
      const now = new Date();
      const dateFilter = this.getDateFilter(filters.dateRange, now);
      results = results.filter(result => {
        const resultDate = new Date(result.createdAt);
        return resultDate >= dateFilter;
      });
    }

    // Sort results
    results = this.sortResults(results, filters?.sortBy || 'relevance');

    // Apply limit
    const limit = filters?.limit || 50;
    const finalResults = results.slice(0, limit);

    // Cache results
    this.searchCache.set(cacheKey, {
      results: finalResults,
      timestamp: Date.now()
    });

    return finalResults;
  }

  private calculateRelevanceScore(result: SearchResult, queryTerms: string[], filters?: any): number {
    let score = 0;
    const title = result.title.toLowerCase();
    const content = result.content.toLowerCase();
    const tags = result.tags.map(tag => tag.toLowerCase());
    const originalQuery = queryTerms.join(' ').toLowerCase();

    // Intent-based scoring
    const intent = this.detectSearchIntent(originalQuery);
    const intentBonus = this.getIntentBonus(result, intent);

    // Title matching with enhanced scoring
    queryTerms.forEach(term => {
      if (title.includes(term)) {
        score += 15; // Increased base score
        // Exact match bonus
        if (title.includes(term + ' ') || title.includes(' ' + term)) {
          score += 8;
        }
        // Beginning of title bonus
        if (title.startsWith(term)) {
          score += 5;
        }
      }
    });

    // Enhanced content matching
    queryTerms.forEach(term => {
      const contentMatches = (content.match(new RegExp(term, 'g')) || []).length;
      score += contentMatches * 3; // Increased weight
      
      // Proximity bonus - terms close together
      const proximityBonus = this.calculateProximityBonus(content, queryTerms);
      score += proximityBonus;
    });

    // Enhanced tag matching
    queryTerms.forEach(term => {
      if (tags.some(tag => tag.includes(term))) {
        score += 12; // Increased weight
      }
      // Partial tag matching
      if (tags.some(tag => tag.includes(term.substring(0, 3)))) {
        score += 4;
      }
    });

    // Semantic similarity (simplified)
    const semanticScore = this.calculateSemanticSimilarity(originalQuery, title + ' ' + content);
    score += semanticScore * 5;

    // Fuzzy matching for typos with better scoring
    queryTerms.forEach(term => {
      if (this.fuzzyMatch(term, title)) {
        score += 6; // Increased fuzzy match score
      }
      if (this.fuzzyMatch(term, content)) {
        score += 2;
      }
    });

    // Content type bonus with intent consideration
    const typeBonus = this.getTypeBonus(result.type, intent);
    score *= typeBonus;

    // Freshness bonus with decay curve
    const daysSinceCreation = (Date.now() - new Date(result.createdAt).getTime()) / (1000 * 60 * 60 * 24);
    const freshnessMultiplier = this.calculateFreshnessMultiplier(daysSinceCreation);
    score *= freshnessMultiplier;

    // Popularity simulation (based on relevance score and tags)
    const popularityMultiplier = this.calculatePopularityMultiplier(result);
    score *= popularityMultiplier;

    // Apply intent bonus
    score += intentBonus;

    return Math.min(score, 100); // Cap at 100
  }

  private detectSearchIntent(query: string): string {
    const queryLower = query.toLowerCase();
    
    if (queryLower.includes('how to') || queryLower.includes('tutorial') || queryLower.includes('guide') || queryLower.includes('step')) {
      return 'tutorial';
    }
    if (queryLower.includes('what is') || queryLower.includes('definition') || queryLower.includes('explain')) {
      return 'definition';
    }
    if (queryLower.includes('vs') || queryLower.includes('compare') || queryLower.includes('difference')) {
      return 'comparison';
    }
    if (queryLower.includes('best') || queryLower.includes('top') || queryLower.includes('recommend')) {
      return 'recommendation';
    }
    if (queryLower.includes('api') || queryLower.includes('integration') || queryLower.includes('setup')) {
      return 'technical';
    }
    if (queryLower.includes('seo') || queryLower.includes('optimization') || queryLower.includes('performance')) {
      return 'optimization';
    }
    
    return 'general';
  }

  private getIntentBonus(result: SearchResult, intent: string): number {
    const intentBonuses = {
      'tutorial': result.type === 'tutorial' ? 10 : result.type === 'guide' ? 8 : 0,
      'definition': result.type === 'article' ? 8 : result.type === 'documentation' ? 6 : 0,
      'comparison': result.title.toLowerCase().includes('vs') || result.title.toLowerCase().includes('compare') ? 12 : 0,
      'recommendation': result.title.toLowerCase().includes('best') || result.title.toLowerCase().includes('top') ? 10 : 0,
      'technical': result.type === 'documentation' ? 10 : result.tags.some(tag => ['api', 'integration', 'setup'].includes(tag)) ? 8 : 0,
      'optimization': result.tags.some(tag => ['seo', 'optimization', 'performance'].includes(tag)) ? 10 : 0,
      'general': 0
    };
    
    return intentBonuses[intent as keyof typeof intentBonuses] || 0;
  }

  private getTypeBonus(type: string, intent: string): number {
    const baseBonuses = {
      'tutorial': 1.3,
      'guide': 1.25,
      'documentation': 1.2,
      'article': 1.1
    };
    
    const intentMultipliers = {
      'tutorial': { 'tutorial': 1.2, 'guide': 1.1, 'documentation': 1.0, 'article': 0.9 },
      'definition': { 'tutorial': 0.9, 'guide': 1.0, 'documentation': 1.1, 'article': 1.2 },
      'comparison': { 'tutorial': 0.8, 'guide': 1.0, 'documentation': 1.0, 'article': 1.3 },
      'recommendation': { 'tutorial': 1.0, 'guide': 1.2, 'documentation': 1.0, 'article': 1.1 },
      'technical': { 'tutorial': 1.0, 'guide': 1.0, 'documentation': 1.3, 'article': 0.9 },
      'optimization': { 'tutorial': 1.0, 'guide': 1.1, 'documentation': 1.2, 'article': 1.1 },
      'general': { 'tutorial': 1.0, 'guide': 1.0, 'documentation': 1.0, 'article': 1.0 }
    };
    
    const baseBonus = baseBonuses[type as keyof typeof baseBonuses] || 1.0;
    const intentMultiplier = intentMultipliers[intent as keyof typeof intentMultipliers]?.[type as keyof typeof intentMultipliers['general']] || 1.0;
    
    return baseBonus * intentMultiplier;
  }

  private calculateProximityBonus(content: string, queryTerms: string[]): number {
    if (queryTerms.length < 2) return 0;
    
    let maxProximity = 0;
    for (let i = 0; i < queryTerms.length - 1; i++) {
      const term1 = queryTerms[i];
      const term2 = queryTerms[i + 1];
      const index1 = content.indexOf(term1);
      const index2 = content.indexOf(term2);
      
      if (index1 !== -1 && index2 !== -1) {
        const distance = Math.abs(index2 - index1);
        const proximity = Math.max(0, 10 - distance / 10); // Closer terms get higher bonus
        maxProximity = Math.max(maxProximity, proximity);
      }
    }
    
    return maxProximity;
  }

  private calculateSemanticSimilarity(query: string, content: string): number {
    // Simplified semantic similarity using keyword overlap and synonyms
    const queryWords = query.split(' ').filter(word => word.length > 2);
    const contentWords = content.split(' ').filter(word => word.length > 2);
    
    const synonyms: Record<string, string[]> = {
      'cms': ['content', 'management', 'system'],
      'headless': ['api', 'frontend', 'backend'],
      'setup': ['install', 'configure', 'initialize'],
      'integration': ['connect', 'link', 'combine'],
      'optimization': ['improve', 'enhance', 'boost'],
      'performance': ['speed', 'fast', 'efficient'],
      'security': ['safe', 'secure', 'protected'],
      'multilingual': ['international', 'i18n', 'translation']
    };
    
    let similarity = 0;
    queryWords.forEach(queryWord => {
      // Direct match
      if (contentWords.includes(queryWord)) {
        similarity += 1;
      }
      // Synonym match
      const wordSynonyms = synonyms[queryWord] || [];
      wordSynonyms.forEach(synonym => {
        if (contentWords.includes(synonym)) {
          similarity += 0.5;
        }
      });
    });
    
    return Math.min(similarity / queryWords.length, 1);
  }

  private calculateFreshnessMultiplier(daysSinceCreation: number): number {
    // Exponential decay for freshness
    if (daysSinceCreation < 7) return 1.2;
    if (daysSinceCreation < 30) return 1.1;
    if (daysSinceCreation < 90) return 1.05;
    if (daysSinceCreation < 365) return 1.0;
    return 0.95;
  }

  private calculatePopularityMultiplier(result: SearchResult): number {
    // Simulate popularity based on content characteristics
    let multiplier = 1.0;
    
    // Popular tags boost
    const popularTags = ['tutorial', 'guide', 'best-practices', 'api', 'integration'];
    const popularTagCount = result.tags.filter(tag => popularTags.includes(tag)).length;
    multiplier += popularTagCount * 0.05;
    
    // Content length bonus (longer content often more comprehensive)
    if (result.content.length > 200) multiplier += 0.1;
    if (result.content.length > 400) multiplier += 0.1;
    
    // Title quality bonus
    if (result.title.length > 30 && result.title.length < 80) multiplier += 0.05;
    
    return Math.min(multiplier, 1.3); // Cap at 1.3
  }

  private fuzzyMatch(term: string, text: string): boolean {
    if (term.length < 3) return false;
    
    // Simple Levenshtein distance check
    const threshold = Math.max(1, Math.floor(term.length * 0.3));
    return this.levenshteinDistance(term, text) <= threshold;
  }

  private levenshteinDistance(str1: string, str2: string): number {
    const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));
    
    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;
    
    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,     // deletion
          matrix[j - 1][i] + 1,     // insertion
          matrix[j - 1][i - 1] + cost // substitution
        );
      }
    }
    
    return matrix[str2.length][str1.length];
  }

  private getDateFilter(dateRange: string, now: Date): Date {
    const filters = {
      'today': new Date(now.getFullYear(), now.getMonth(), now.getDate()),
      'week': new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
      'month': new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
      'year': new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
    };
    return filters[dateRange as keyof typeof filters] || new Date(0);
  }

  private sortResults(results: SearchResult[], sortBy: string): SearchResult[] {
    switch (sortBy) {
      case 'date':
        return results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      case 'popularity':
        return results.sort((a, b) => b.relevanceScore - a.relevanceScore);
      case 'relevance':
      default:
        return results.sort((a, b) => b.relevanceScore - a.relevanceScore);
    }
  }

  private generateCacheKey(query: string, filters?: any): string {
    return `${query.toLowerCase()}-${JSON.stringify(filters || {})}`;
  }

  async askAI(question: string): Promise<string> {
    // Simulate AI processing delay
    await this.mockDelay(1200);
    
    // Mock AI responses based on common questions
    const responses: Record<string, string> = {
      'storyblok setup': 'To set up Storyblok, first create an account at storyblok.com, then create a new space. Install the Storyblok CLI and configure your API tokens. You can then start creating content types and components.',
      
      'content modeling': 'Effective content modeling in Storyblok involves creating reusable components, defining clear field types, and planning your content hierarchy. Start with your most common content patterns and build modular, flexible structures.',
      
      'nextjs integration': 'To integrate Storyblok with Next.js, install the @storyblok/react package, configure your API token, and use the StoryblokProvider. You can then fetch content using the Storyblok API in your pages and components.',
      
      'seo optimization': 'For SEO with headless CMS, ensure you have proper meta tags, structured data, fast loading times, and clean URLs. Use Storyblok\'s SEO plugin and implement server-side rendering for better crawlability.',
      
      'api management': 'Storyblok provides a comprehensive Content Delivery API and Management API. Use CDN for faster content delivery, implement proper caching strategies, and consider using webhooks for real-time updates.'
    };

    // Find the most relevant response
    const lowercaseQuestion = question.toLowerCase();
    for (const [key, response] of Object.entries(responses)) {
      if (lowercaseQuestion.includes(key)) {
        return response;
      }
    }

    // Default response for unrecognized questions
    return `I understand you're asking about "${question}". Based on your Storyblok content, here are some relevant insights: This is a complex topic that involves understanding your content structure, API integration, and best practices. I'd recommend checking our documentation or specific tutorials for more detailed information.`;
  }

  async getSuggestions(query: string): Promise<{
    suggestions: string[];
    popular: string[];
    trending: string[];
    categories: Array<{ name: string; count: number }>;
  }> {
    await this.mockDelay(300);
    
    const allSuggestions = [
      'How to set up Storyblok with React?',
      'Best practices for content modeling',
      'Optimizing API performance',
      'Creating dynamic components',
      'SEO strategies for headless CMS',
      'Managing multilingual content',
      'Headless CMS vs traditional CMS',
      'API rate limiting best practices',
      'Content versioning strategies',
      'Building responsive layouts',
      'Image optimization techniques',
      'Content delivery networks',
      'Webhook implementation guide',
      'Performance monitoring tools'
    ];

    const popular = [
      'Storyblok setup tutorial',
      'Content modeling guide',
      'API integration',
      'SEO optimization'
    ];

    const trending = [
      'Headless CMS trends 2024',
      'AI-powered content creation',
      'Edge computing for CMS',
      'Microservices architecture'
    ];

    const categories = [
      { name: 'Tutorials', count: 45 },
      { name: 'Best Practices', count: 32 },
      { name: 'API Guides', count: 28 },
      { name: 'Performance', count: 22 },
      { name: 'SEO', count: 18 }
    ];

    let suggestions = allSuggestions;
    if (query.trim()) {
      const lowercaseQuery = query.toLowerCase();
      suggestions = allSuggestions.filter(suggestion => 
        suggestion.toLowerCase().includes(lowercaseQuery)
      ).slice(0, 6);
    } else {
      suggestions = suggestions.slice(0, 6);
    }

    return {
      suggestions,
      popular: popular.slice(0, 4),
      trending: trending.slice(0, 4),
      categories
    };
  }

  async getSearchHistory(userId?: string): Promise<string[]> {
    // Mock search history - in real app, this would come from user's stored history
    await this.mockDelay(200);
    
    const mockHistory = [
      'Storyblok setup tutorial',
      'Content modeling best practices',
      'API performance optimization',
      'Headless CMS comparison',
      'SEO strategies for CMS'
    ];

    return mockHistory;
  }

  async saveSearchQuery(query: string, userId?: string): Promise<void> {
    // Mock saving search query - in real app, this would save to user's history
    await this.mockDelay(100);
    console.log(`Saved search query: ${query} for user: ${userId || 'anonymous'}`);
  }

  async getPopularSearches(): Promise<Array<{ query: string; count: number }>> {
    await this.mockDelay(200);
    
    return [
      { query: 'Storyblok tutorial', count: 1247 },
      { query: 'Content modeling', count: 892 },
      { query: 'API integration', count: 734 },
      { query: 'SEO optimization', count: 623 },
      { query: 'Performance tips', count: 567 },
      { query: 'Headless CMS', count: 512 },
      { query: 'React integration', count: 489 },
      { query: 'Best practices', count: 445 }
    ];
  }
}

export const algoliaService = new AlgoliaService();