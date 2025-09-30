import { algoliaService } from './algoliaService';

export interface CrawlTarget {
  id: string;
  name: string;
  url: string;
  description: string;
  enabled: boolean;
  crawlFrequency: 'hourly' | 'daily' | 'weekly' | 'monthly';
  lastCrawled?: Date;
  status: 'active' | 'paused' | 'error';
  config: CrawlConfig;
  createdAt: Date;
  updatedAt: Date;
}

export interface CrawlConfig {
  maxDepth: number;
  maxPages: number;
  respectRobotsTxt: boolean;
  allowedDomains: string[];
  blockedDomains: string[];
  allowedPaths: string[];
  blockedPaths: string[];
  contentSelectors: {
    title: string;
    content: string;
    description: string;
    author: string;
    publishedDate: string;
    tags: string;
  };
  extractImages: boolean;
  extractLinks: boolean;
  followExternalLinks: boolean;
  delayBetweenRequests: number;
  userAgent: string;
}

export interface CrawlResult {
  id: string;
  url: string;
  title: string;
  content: string;
  description?: string;
  author?: string;
  publishedDate?: Date;
  lastModified?: Date;
  tags: string[];
  images: string[];
  links: string[];
  metadata: Record<string, string>;
  crawlTargetId: string;
  crawledAt: Date;
  status: 'success' | 'error' | 'blocked';
  errorMessage?: string;
  contentHash: string;
  wordCount: number;
  readingTime: number;
}

export interface CrawlSession {
  id: string;
  targetId: string;
  startTime: Date;
  endTime?: Date;
  status: 'running' | 'completed' | 'failed' | 'cancelled';
  pagesCrawled: number;
  pagesFound: number;
  errors: number;
  totalContentLength: number;
  averageContentLength: number;
  progress: number;
  currentUrl?: string;
  errorLog: CrawlError[];
}

export interface CrawlError {
  url: string;
  error: string;
  timestamp: Date;
  retryCount: number;
}

export interface CrawlAnalytics {
  totalTargets: number;
  activeTargets: number;
  totalPagesCrawled: number;
  totalContentIndexed: number;
  averageCrawlTime: number;
  successRate: number;
  errorRate: number;
  topDomains: Array<{ domain: string; count: number }>;
  contentTypes: Array<{ type: string; count: number }>;
  crawlHistory: Array<{
    date: Date;
    pagesCrawled: number;
    errors: number;
    successRate: number;
  }>;
}

class WebCrawlerService {
  private crawlTargets: Map<string, CrawlTarget> = new Map();
  private crawlSessions: Map<string, CrawlSession> = new Map();
  private crawlResults: Map<string, CrawlResult[]> = new Map();
  private isCrawling: boolean = false;
  private crawlQueue: string[] = [];
  private crawlHistory: CrawlResult[] = [];

  // Default configuration
  private defaultConfig: CrawlConfig = {
    maxDepth: 3,
    maxPages: 100,
    respectRobotsTxt: true,
    allowedDomains: [],
    blockedDomains: [],
    allowedPaths: [],
    blockedPaths: [],
    contentSelectors: {
      title: 'h1, title',
      content: 'article, .content, main, .post-content',
      description: 'meta[name="description"], .excerpt, .summary',
      author: '.author, [rel="author"], meta[name="author"]',
      publishedDate: 'time[datetime], .published, .date',
      tags: '.tags, .categories, meta[name="keywords"]'
    },
    extractImages: true,
    extractLinks: true,
    followExternalLinks: false,
    delayBetweenRequests: 1000,
    userAgent: 'StorySearch AI Crawler 1.0'
  };

  constructor() {
    this.loadMockData();
  }

  private loadMockData() {
    // Mock crawl targets
    const mockTargets: CrawlTarget[] = [
      {
        id: 'target-1',
        name: 'Tech Documentation',
        url: 'https://docs.example.com',
        description: 'Technical documentation and guides',
        enabled: true,
        crawlFrequency: 'daily',
        status: 'active',
        config: { ...this.defaultConfig, maxPages: 50 },
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        lastCrawled: new Date(Date.now() - 2 * 60 * 60 * 1000)
      },
      {
        id: 'target-2',
        name: 'Blog Articles',
        url: 'https://blog.example.com',
        description: 'Company blog and articles',
        enabled: true,
        crawlFrequency: 'weekly',
        status: 'active',
        config: { ...this.defaultConfig, maxPages: 200, extractImages: true },
        createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        lastCrawled: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
      },
      {
        id: 'target-3',
        name: 'Knowledge Base',
        url: 'https://kb.example.com',
        description: 'Knowledge base and FAQ',
        enabled: false,
        crawlFrequency: 'monthly',
        status: 'paused',
        config: { ...this.defaultConfig, maxDepth: 2, maxPages: 30 },
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      }
    ];

    mockTargets.forEach(target => {
      this.crawlTargets.set(target.id, target);
    });

    // Mock crawl results
    this.generateMockCrawlResults();
  }

  private generateMockCrawlResults() {
    const mockResults: CrawlResult[] = [
      {
        id: 'result-1',
        url: 'https://docs.example.com/getting-started',
        title: 'Getting Started with Our API',
        content: 'Learn how to get started with our API and make your first requests. This guide covers authentication, basic endpoints, and common use cases.',
        description: 'A comprehensive guide to getting started with our API',
        author: 'API Team',
        publishedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        lastModified: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        tags: ['api', 'getting-started', 'documentation', 'tutorial'],
        images: ['https://docs.example.com/images/api-overview.png'],
        links: ['https://docs.example.com/authentication', 'https://docs.example.com/endpoints'],
        metadata: { category: 'documentation', difficulty: 'beginner' },
        crawlTargetId: 'target-1',
        crawledAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        status: 'success',
        contentHash: 'abc123def456',
        wordCount: 245,
        readingTime: 2
      },
      {
        id: 'result-2',
        url: 'https://blog.example.com/ai-integration-guide',
        title: 'Integrating AI into Your Applications',
        content: 'Discover how to integrate AI capabilities into your applications using our latest SDK. This article covers setup, implementation, and best practices.',
        description: 'Learn how to integrate AI features into your applications',
        author: 'AI Team',
        publishedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        tags: ['ai', 'integration', 'sdk', 'tutorial', 'best-practices'],
        images: ['https://blog.example.com/images/ai-integration.png'],
        links: ['https://github.com/example/ai-sdk', 'https://docs.example.com/ai'],
        metadata: { category: 'tutorial', difficulty: 'intermediate' },
        crawlTargetId: 'target-2',
        crawledAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        status: 'success',
        contentHash: 'def456ghi789',
        wordCount: 890,
        readingTime: 5
      },
      {
        id: 'result-3',
        url: 'https://kb.example.com/troubleshooting',
        title: 'Common Troubleshooting Issues',
        content: 'Frequently asked questions and solutions for common issues users encounter. This knowledge base article covers the most common problems and their solutions.',
        description: 'Solutions for common issues and troubleshooting',
        author: 'Support Team',
        publishedDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        tags: ['troubleshooting', 'faq', 'support', 'help'],
        images: [],
        links: ['https://kb.example.com/contact-support'],
        metadata: { category: 'support', difficulty: 'beginner' },
        crawlTargetId: 'target-3',
        crawledAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        status: 'success',
        contentHash: 'ghi789jkl012',
        wordCount: 456,
        readingTime: 3
      }
    ];

    mockResults.forEach(result => {
      this.crawlHistory.push(result);
      if (!this.crawlResults.has(result.crawlTargetId)) {
        this.crawlResults.set(result.crawlTargetId, []);
      }
      this.crawlResults.get(result.crawlTargetId)!.push(result);
    });
  }

  // Crawl Target Management
  async getCrawlTargets(): Promise<CrawlTarget[]> {
    return Array.from(this.crawlTargets.values());
  }

  async getCrawlTarget(id: string): Promise<CrawlTarget | null> {
    return this.crawlTargets.get(id) || null;
  }

  async createCrawlTarget(target: Omit<CrawlTarget, 'id' | 'createdAt' | 'updatedAt'>): Promise<CrawlTarget> {
    const newTarget: CrawlTarget = {
      ...target,
      id: `target-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.crawlTargets.set(newTarget.id, newTarget);
    return newTarget;
  }

  async updateCrawlTarget(id: string, updates: Partial<CrawlTarget>): Promise<CrawlTarget | null> {
    const target = this.crawlTargets.get(id);
    if (!target) return null;

    const updatedTarget = {
      ...target,
      ...updates,
      updatedAt: new Date()
    };

    this.crawlTargets.set(id, updatedTarget);
    return updatedTarget;
  }

  async deleteCrawlTarget(id: string): Promise<boolean> {
    return this.crawlTargets.delete(id);
  }

  // Crawl Operations
  async startCrawl(targetId: string): Promise<CrawlSession> {
    const target = this.crawlTargets.get(targetId);
    if (!target || !target.enabled) {
      throw new Error('Crawl target not found or disabled');
    }

    if (this.isCrawling) {
      throw new Error('A crawl is already in progress');
    }

    const session: CrawlSession = {
      id: `session-${Date.now()}`,
      targetId,
      startTime: new Date(),
      status: 'running',
      pagesCrawled: 0,
      pagesFound: 0,
      errors: 0,
      totalContentLength: 0,
      averageContentLength: 0,
      progress: 0,
      errorLog: []
    };

    this.crawlSessions.set(session.id, session);
    this.isCrawling = true;

    // Simulate crawl process
    this.simulateCrawlProcess(session, target);

    return session;
  }

  private async simulateCrawlProcess(session: CrawlSession, target: CrawlTarget) {
    const maxPages = Math.min(target.config.maxPages, 10); // Limit for demo
    
    for (let i = 0; i < maxPages; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay
      
      session.pagesCrawled++;
      session.pagesFound++;
      session.progress = (session.pagesCrawled / maxPages) * 100;
      session.currentUrl = `https://example.com/page-${i + 1}`;

      // Simulate occasional errors
      if (Math.random() < 0.1) {
        session.errors++;
        session.errorLog.push({
          url: session.currentUrl,
          error: 'Timeout or connection error',
          timestamp: new Date(),
          retryCount: 0
        });
      }

      // Update session
      this.crawlSessions.set(session.id, { ...session });
    }

    // Complete the crawl
    session.status = 'completed';
    session.endTime = new Date();
    session.progress = 100;
    this.crawlSessions.set(session.id, session);
    this.isCrawling = false;

    // Update target last crawled time
    await this.updateCrawlTarget(target.id, { lastCrawled: new Date() });
  }

  async getCrawlSessions(targetId?: string): Promise<CrawlSession[]> {
    const sessions = Array.from(this.crawlSessions.values());
    return targetId ? sessions.filter(s => s.targetId === targetId) : sessions;
  }

  async getCrawlSession(id: string): Promise<CrawlSession | null> {
    return this.crawlSessions.get(id) || null;
  }

  async cancelCrawl(sessionId: string): Promise<boolean> {
    const session = this.crawlSessions.get(sessionId);
    if (!session || session.status !== 'running') {
      return false;
    }

    session.status = 'cancelled';
    session.endTime = new Date();
    this.crawlSessions.set(sessionId, session);
    this.isCrawling = false;
    return true;
  }

  // Crawl Results
  async getCrawlResults(targetId?: string, limit?: number): Promise<CrawlResult[]> {
    let results = this.crawlHistory;
    
    if (targetId) {
      results = results.filter(r => r.crawlTargetId === targetId);
    }
    
    if (limit) {
      results = results.slice(0, limit);
    }
    
    return results;
  }

  async getCrawlResult(id: string): Promise<CrawlResult | null> {
    return this.crawlHistory.find(r => r.id === id) || null;
  }

  async deleteCrawlResult(id: string): Promise<boolean> {
    const index = this.crawlHistory.findIndex(r => r.id === id);
    if (index === -1) return false;
    
    this.crawlHistory.splice(index, 1);
    return true;
  }

  // Analytics
  async getCrawlAnalytics(): Promise<CrawlAnalytics> {
    const targets = Array.from(this.crawlTargets.values());
    const sessions = Array.from(this.crawlSessions.values());
    const results = this.crawlHistory;

    const totalPagesCrawled = sessions.reduce((sum, s) => sum + s.pagesCrawled, 0);
    const totalErrors = sessions.reduce((sum, s) => sum + s.errors, 0);
    const totalSessions = sessions.length;
    const successRate = totalSessions > 0 ? ((totalSessions - sessions.filter(s => s.status === 'failed').length) / totalSessions) * 100 : 0;

    // Domain analysis
    const domainCounts = new Map<string, number>();
    results.forEach(result => {
      try {
        const domain = new URL(result.url).hostname;
        domainCounts.set(domain, (domainCounts.get(domain) || 0) + 1);
      } catch (e) {
        // Invalid URL, skip
      }
    });

    const topDomains = Array.from(domainCounts.entries())
      .map(([domain, count]) => ({ domain, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Content type analysis
    const contentTypeCounts = new Map<string, number>();
    results.forEach(result => {
      const type = result.metadata.category || 'unknown';
      contentTypeCounts.set(type, (contentTypeCounts.get(type) || 0) + 1);
    });

    const contentTypes = Array.from(contentTypeCounts.entries())
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count);

    // Crawl history (last 30 days)
    const crawlHistory = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);

      const daySessions = sessions.filter(s => {
        const sessionDate = new Date(s.startTime);
        sessionDate.setHours(0, 0, 0, 0);
        return sessionDate.getTime() === date.getTime();
      });

      const pagesCrawled = daySessions.reduce((sum, s) => sum + s.pagesCrawled, 0);
      const errors = daySessions.reduce((sum, s) => sum + s.errors, 0);
      const daySuccessRate = daySessions.length > 0 ? 
        ((daySessions.length - daySessions.filter(s => s.status === 'failed').length) / daySessions.length) * 100 : 0;

      crawlHistory.push({
        date,
        pagesCrawled,
        errors,
        successRate: daySuccessRate
      });
    }

    return {
      totalTargets: targets.length,
      activeTargets: targets.filter(t => t.enabled && t.status === 'active').length,
      totalPagesCrawled,
      totalContentIndexed: results.length,
      averageCrawlTime: sessions.length > 0 ? 
        sessions.reduce((sum, s) => sum + (s.endTime ? s.endTime.getTime() - s.startTime.getTime() : 0), 0) / sessions.length : 0,
      successRate,
      errorRate: 100 - successRate,
      topDomains,
      contentTypes,
      crawlHistory
    };
  }

  // Integration with search system
  async indexCrawlResults(targetId?: string): Promise<number> {
    let results = this.crawlHistory;
    
    if (targetId) {
      results = results.filter(r => r.crawlTargetId === targetId);
    }

    // Convert crawl results to search results and index them
    const searchResults = results.map(result => ({
      id: result.id,
      title: result.title,
      content: result.content,
      type: result.metadata.category || 'web-content',
      tags: result.tags,
      url: result.url,
      thumbnail: result.images[0] || '',
      createdAt: result.publishedDate || result.crawledAt,
      updatedAt: result.lastModified || result.crawledAt,
      relevanceScore: Math.random() * 0.5 + 0.5 // Mock relevance score
    }));

    // In a real implementation, this would integrate with the search index
    console.log(`Indexed ${searchResults.length} crawl results`);
    
    return searchResults.length;
  }

  // Utility methods
  async validateUrl(url: string): Promise<boolean> {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  async testCrawlTarget(target: Partial<CrawlTarget>): Promise<{ success: boolean; message: string; sampleContent?: any }> {
    if (!target.url) {
      return { success: false, message: 'URL is required' };
    }

    try {
      // Simulate URL validation and basic crawl test
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      return {
        success: true,
        message: 'Crawl target test successful',
        sampleContent: {
          title: 'Sample Page Title',
          content: 'Sample page content extracted successfully',
          links: ['https://example.com/page1', 'https://example.com/page2'],
          images: ['https://example.com/image1.jpg']
        }
      };
    } catch (error) {
      return {
        success: false,
        message: `Test failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  // Schedule management
  async getScheduledCrawls(): Promise<Array<{ targetId: string; nextRun: Date; frequency: string }>> {
    const targets = Array.from(this.crawlTargets.values()).filter(t => t.enabled);
    
    return targets.map(target => {
      const now = new Date();
      let nextRun = new Date(target.lastCrawled || target.createdAt);
      
      switch (target.crawlFrequency) {
        case 'hourly':
          nextRun.setHours(nextRun.getHours() + 1);
          break;
        case 'daily':
          nextRun.setDate(nextRun.getDate() + 1);
          break;
        case 'weekly':
          nextRun.setDate(nextRun.getDate() + 7);
          break;
        case 'monthly':
          nextRun.setMonth(nextRun.getMonth() + 1);
          break;
      }
      
      return {
        targetId: target.id,
        nextRun,
        frequency: target.crawlFrequency
      };
    });
  }
}

export const webCrawlerService = new WebCrawlerService();
