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

// Mock data for demonstration
const mockResults: SearchResult[] = [
  {
    id: '1',
    title: 'Getting Started with Storyblok Headless CMS',
    content: 'Learn how to set up your first Storyblok project and create dynamic content structures...',
    type: 'tutorial',
    url: '/tutorials/getting-started',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop',
    tags: ['setup', 'beginner', 'headless-cms'],
    createdAt: '2024-01-15',
    relevanceScore: 0.95
  },
  {
    id: '2',
    title: 'Advanced Content Modeling Strategies',
    content: 'Explore advanced techniques for structuring your content in Storyblok for maximum flexibility...',
    type: 'guide',
    url: '/guides/content-modeling',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=200&fit=crop',
    tags: ['modeling', 'advanced', 'structure'],
    createdAt: '2024-01-20',
    relevanceScore: 0.88
  },
  {
    id: '3',
    title: 'Integrating Storyblok with Next.js',
    content: 'Step-by-step guide to connecting your Storyblok CMS with a Next.js frontend application...',
    type: 'documentation',
    url: '/docs/nextjs-integration',
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=200&fit=crop',
    tags: ['nextjs', 'integration', 'frontend'],
    createdAt: '2024-01-18',
    relevanceScore: 0.82
  },
  {
    id: '4',
    title: 'SEO Best Practices for Headless CMS',
    content: 'Optimize your headless CMS content for search engines with these proven strategies...',
    type: 'article',
    url: '/articles/seo-best-practices',
    thumbnail: 'https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=400&h=200&fit=crop',
    tags: ['seo', 'optimization', 'best-practices'],
    createdAt: '2024-01-22',
    relevanceScore: 0.76
  },
  {
    id: '5',
    title: 'API Management and Content Delivery',
    content: 'Learn how to efficiently manage your content APIs and optimize delivery performance...',
    type: 'documentation',
    url: '/docs/api-management',
    thumbnail: 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=400&h=200&fit=crop',
    tags: ['api', 'performance', 'delivery'],
    createdAt: '2024-01-25',
    relevanceScore: 0.71
  },
  {
    id: '6',
    title: 'Building Dynamic Components',
    content: 'Create reusable, dynamic components in Storyblok for consistent content presentation...',
    type: 'tutorial',
    url: '/tutorials/dynamic-components',
    thumbnail: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=200&fit=crop',
    tags: ['components', 'dynamic', 'reusable'],
    createdAt: '2024-01-28',
    relevanceScore: 0.85
  }
];

class AlgoliaService {
  private mockDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  async search(query: string, filters?: any): Promise<SearchResult[]> {
    // Simulate network delay
    await this.mockDelay(800);
    
    if (!query.trim()) {
      return [];
    }

    // Simple mock search logic
    const lowercaseQuery = query.toLowerCase();
    const filtered = mockResults.filter(result => 
      result.title.toLowerCase().includes(lowercaseQuery) ||
      result.content.toLowerCase().includes(lowercaseQuery) ||
      result.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );

    // Sort by relevance score
    return filtered.sort((a, b) => b.relevanceScore - a.relevanceScore);
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

  async getSuggestions(query: string): Promise<string[]> {
    await this.mockDelay(300);
    
    const suggestions = [
      'How to set up Storyblok with React?',
      'Best practices for content modeling',
      'Optimizing API performance',
      'Creating dynamic components',
      'SEO strategies for headless CMS',
      'Managing multilingual content'
    ];

    if (!query.trim()) {
      return suggestions.slice(0, 4);
    }

    return suggestions.filter(suggestion => 
      suggestion.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 4);
  }
}

export const algoliaService = new AlgoliaService();