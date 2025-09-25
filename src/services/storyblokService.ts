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
    const title = story.name || content.title || story.slug;
    const description = content.description || content.intro || content.body || '';
    
    // Extract text content for search
    const textContent = this.extractTextContent(content);
    
    return {
      id: story.uuid || story.id.toString(),
      title,
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
        } else if (typeof value === 'object') {
          text += this.extractTextContent(value) + ' ';
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
          return content[field];
        } else if (content[field]?.filename) {
          return content[field].filename;
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
}

export const storyblokService = new StoryblokService();