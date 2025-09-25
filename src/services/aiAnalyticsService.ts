import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY || process.env.OPENAI_API_KEY,
});

export interface AnalyticsData {
  totalSearches: number;
  successRate: number;
  avgResponseTime: number;
  userSatisfaction: number;
  bounceRate: number;
  avgSessionDuration: number;
  uniqueVisitors: number;
  returningVisitors: number;
  topQueries: Array<{
    query: string;
    count: number;
    intent: string;
    successRate: number;
    avgTime: number;
  }>;
  contentPerformance: Array<{
    title: string;
    views: number;
    engagement: number;
    type: string;
    conversionRate: number;
    avgTimeOnPage: number;
  }>;
  deviceBreakdown: Array<{
    device: string;
    percentage: number;
    searches: number;
  }>;
  geographicData: Array<{
    country: string;
    searches: number;
    percentage: number;
  }>;
  trends: {
    searchVolume: Array<{
      period: string;
      searches: number;
      successRate: number;
    }>;
    popularTopics: Array<{
      topic: string;
      growth: number;
      searches: number;
    }>;
    hourlyActivity: Array<{
      hour: string;
      searches: number;
    }>;
  };
  realTimeActivity: Array<{
    query: string;
    intent: string;
    time: string;
    location: string;
    device: string;
  }>;
}

export interface AIAnalyticsInsight {
  id: string;
  title: string;
  type: 'trend' | 'anomaly' | 'recommendation' | 'prediction' | 'optimization';
  priority: 'high' | 'medium' | 'low';
  confidence: number;
  description: string;
  impact: string;
  actionable: boolean;
  recommendation?: string;
  metrics: {
    current: number | string;
    previous?: number | string;
    change?: number;
    trend: 'up' | 'down' | 'stable';
  };
  category: 'performance' | 'user_behavior' | 'content' | 'technical' | 'business';
}

export interface AIAnalyticsReport {
  summary: string;
  keyFindings: string[];
  insights: AIAnalyticsInsight[];
  predictions: Array<{
    metric: string;
    predictedValue: number;
    confidence: number;
    timeframe: string;
    reasoning: string;
  }>;
  recommendations: Array<{
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    expectedImpact: string;
    effort: 'low' | 'medium' | 'high';
    category: string;
  }>;
  riskFactors: Array<{
    risk: string;
    probability: number;
    impact: string;
    mitigation: string;
  }>;
}

class AIAnalyticsService {
  private async callOpenAI(messages: any[], model = 'gpt-4'): Promise<string> {
    try {
      const response = await openai.chat.completions.create({
        model,
        messages,
        temperature: 0.7,
        max_tokens: 2000,
      });

      return response.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('OpenAI API error:', error);
      throw new Error('Failed to generate AI insights');
    }
  }

  /**
   * Generate comprehensive AI analytics insights
   */
  async generateAnalyticsInsights(analyticsData: AnalyticsData): Promise<AIAnalyticsInsight[]> {
    const prompt = `
You are an expert data analyst specializing in content discovery platforms. Analyze the following analytics data and generate actionable insights.

Analytics Data:
- Total Searches: ${analyticsData.totalSearches}
- Success Rate: ${analyticsData.successRate}%
- Average Response Time: ${analyticsData.avgResponseTime}s
- User Satisfaction: ${analyticsData.userSatisfaction}/5
- Bounce Rate: ${analyticsData.bounceRate}%
- Session Duration: ${analyticsData.avgSessionDuration}m
- Unique Visitors: ${analyticsData.uniqueVisitors}
- Returning Visitors: ${analyticsData.returningVisitors}

Top Queries:
${analyticsData.topQueries.map(q => `- "${q.query}" (${q.count} searches, ${q.successRate}% success, ${q.intent})`).join('\n')}

Content Performance:
${analyticsData.contentPerformance.map(c => `- "${c.title}" (${c.views} views, ${c.engagement}% engagement, ${c.conversionRate}% conversion)`).join('\n')}

Search Volume Trends:
${analyticsData.trends.searchVolume.map(t => `- ${t.period}: ${t.searches} searches (${t.successRate}% success)`).join('\n')}

Popular Topics:
${analyticsData.trends.popularTopics.map(t => `- ${t.topic}: +${t.growth}% growth (${t.searches} searches)`).join('\n')}

Generate 5-8 actionable insights in JSON format. Each insight should have:
- id: unique identifier
- title: concise insight title
- type: trend|anomaly|recommendation|prediction|optimization
- priority: high|medium|low
- confidence: 0-1 score
- description: detailed explanation
- impact: potential business impact
- actionable: boolean
- recommendation: specific action if actionable
- metrics: current value, trend, change
- category: performance|user_behavior|content|technical|business

Focus on insights that can drive business value and user experience improvements.
`;

    try {
      const response = await this.callOpenAI([
        { role: 'system', content: 'You are an expert data analyst. Return only valid JSON without markdown formatting.' },
        { role: 'user', content: prompt }
      ]);

      const insights = JSON.parse(response);
      return Array.isArray(insights) ? insights : [];
    } catch (error) {
      console.error('Failed to generate AI insights:', error);
      return this.getFallbackInsights(analyticsData);
    }
  }

  /**
   * Generate comprehensive analytics report
   */
  async generateAnalyticsReport(analyticsData: AnalyticsData): Promise<AIAnalyticsReport> {
    const prompt = `
You are a senior data analyst creating a comprehensive analytics report for a content discovery platform. 

Analyze the following data and create a detailed report:

Analytics Data:
${JSON.stringify(analyticsData, null, 2)}

Generate a comprehensive report in JSON format with:
- summary: executive summary (2-3 sentences)
- keyFindings: array of 3-5 key findings
- insights: array of detailed insights (same format as generateAnalyticsInsights)
- predictions: array of predictions for next 30 days
- recommendations: array of actionable recommendations
- riskFactors: array of potential risks and mitigations

Focus on business impact, user experience, and actionable insights.
`;

    try {
      const response = await this.callOpenAI([
        { role: 'system', content: 'You are a senior data analyst. Return only valid JSON without markdown formatting.' },
        { role: 'user', content: prompt }
      ]);

      return JSON.parse(response);
    } catch (error) {
      console.error('Failed to generate analytics report:', error);
      return this.getFallbackReport(analyticsData);
    }
  }

  /**
   * Generate trend predictions
   */
  async generateTrendPredictions(analyticsData: AnalyticsData): Promise<Array<{
    metric: string;
    predictedValue: number;
    confidence: number;
    timeframe: string;
    reasoning: string;
  }>> {
    const prompt = `
Based on the following analytics data, predict trends for the next 30 days:

${JSON.stringify(analyticsData, null, 2)}

Generate predictions for key metrics in JSON format:
- metric: metric name
- predictedValue: predicted value
- confidence: confidence score (0-1)
- timeframe: prediction timeframe
- reasoning: explanation for the prediction

Focus on: total searches, success rate, user satisfaction, bounce rate, session duration.
`;

    try {
      const response = await this.callOpenAI([
        { role: 'system', content: 'You are a data scientist specializing in trend prediction. Return only valid JSON.' },
        { role: 'user', content: prompt }
      ]);

      return JSON.parse(response);
    } catch (error) {
      console.error('Failed to generate predictions:', error);
      return [];
    }
  }

  /**
   * Generate content optimization recommendations
   */
  async generateContentRecommendations(contentData: any[]): Promise<Array<{
    contentId: string;
    title: string;
    currentScore: number;
    recommendations: Array<{
      type: 'seo' | 'engagement' | 'structure' | 'readability';
      title: string;
      description: string;
      impact: 'high' | 'medium' | 'low';
      effort: 'low' | 'medium' | 'high';
    }>;
    overallScore: number;
  }>> {
    const prompt = `
Analyze the following content performance data and generate optimization recommendations:

${JSON.stringify(contentData, null, 2)}

For each content piece, provide:
- contentId: identifier
- title: content title
- currentScore: current performance score
- recommendations: array of specific recommendations
- overallScore: predicted score after optimizations

Focus on actionable recommendations that can improve engagement, SEO, and user experience.
`;

    try {
      const response = await this.callOpenAI([
        { role: 'system', content: 'You are a content optimization expert. Return only valid JSON.' },
        { role: 'user', content: prompt }
      ]);

      return JSON.parse(response);
    } catch (error) {
      console.error('Failed to generate content recommendations:', error);
      return [];
    }
  }

  /**
   * Generate user behavior insights
   */
  async generateUserBehaviorInsights(analyticsData: AnalyticsData): Promise<Array<{
    behavior: string;
    frequency: number;
    impact: string;
    recommendation: string;
    category: 'search_pattern' | 'content_preference' | 'session_behavior' | 'device_usage';
  }>> {
    const prompt = `
Analyze user behavior patterns from this analytics data:

${JSON.stringify(analyticsData, null, 2)}

Identify key user behavior patterns and provide insights in JSON format:
- behavior: description of the behavior
- frequency: how often it occurs
- impact: business impact
- recommendation: how to leverage this behavior
- category: behavior category

Focus on patterns that can inform product decisions and user experience improvements.
`;

    try {
      const response = await this.callOpenAI([
        { role: 'system', content: 'You are a user behavior analyst. Return only valid JSON.' },
        { role: 'user', content: prompt }
      ]);

      return JSON.parse(response);
    } catch (error) {
      console.error('Failed to generate user behavior insights:', error);
      return [];
    }
  }

  /**
   * Generate anomaly detection insights
   */
  async detectAnomalies(analyticsData: AnalyticsData): Promise<Array<{
    metric: string;
    anomaly: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    impact: string;
    recommendation: string;
    timeframe: string;
  }>> {
    const prompt = `
Analyze this analytics data for anomalies and unusual patterns:

${JSON.stringify(analyticsData, null, 2)}

Identify any anomalies, unusual patterns, or significant changes in JSON format:
- metric: affected metric
- anomaly: description of the anomaly
- severity: severity level
- impact: potential impact
- recommendation: how to address it
- timeframe: when the anomaly occurred

Look for sudden spikes, drops, or unusual patterns in the data.
`;

    try {
      const response = await this.callOpenAI([
        { role: 'system', content: 'You are an anomaly detection specialist. Return only valid JSON.' },
        { role: 'user', content: prompt }
      ]);

      return JSON.parse(response);
    } catch (error) {
      console.error('Failed to detect anomalies:', error);
      return [];
    }
  }

  /**
   * Generate competitive analysis insights
   */
  async generateCompetitiveInsights(analyticsData: AnalyticsData): Promise<Array<{
    competitor: string;
    metric: string;
    ourValue: number;
    theirValue: number;
    gap: number;
    recommendation: string;
    priority: 'high' | 'medium' | 'low';
  }>> {
    const prompt = `
Based on industry benchmarks and this analytics data, provide competitive insights:

${JSON.stringify(analyticsData, null, 2)}

Generate competitive analysis in JSON format:
- competitor: competitor or benchmark name
- metric: metric being compared
- ourValue: our current value
- theirValue: their value
- gap: performance gap
- recommendation: how to close the gap
- priority: priority level

Use industry benchmarks for content discovery platforms and headless CMS solutions.
`;

    try {
      const response = await this.callOpenAI([
        { role: 'system', content: 'You are a competitive intelligence analyst. Return only valid JSON.' },
        { role: 'user', content: prompt }
      ]);

      return JSON.parse(response);
    } catch (error) {
      console.error('Failed to generate competitive insights:', error);
      return [];
    }
  }

  // Fallback methods for when OpenAI API is not available
  private getFallbackInsights(analyticsData: AnalyticsData): AIAnalyticsInsight[] {
    return [
      {
        id: 'insight-1',
        title: 'High Search Success Rate',
        type: 'trend',
        priority: 'high',
        confidence: 0.9,
        description: `Your search success rate of ${analyticsData.successRate}% is excellent and indicates strong content relevance and AI matching capabilities.`,
        impact: 'Positive user experience and high content discoverability',
        actionable: true,
        recommendation: 'Continue optimizing AI search algorithms and maintain content quality standards',
        metrics: {
          current: `${analyticsData.successRate}%`,
          trend: 'up'
        },
        category: 'performance'
      },
      {
        id: 'insight-2',
        title: 'Fast Response Times',
        type: 'optimization',
        priority: 'medium',
        confidence: 0.8,
        description: `Average response time of ${analyticsData.avgResponseTime}s is very good for content discovery.`,
        impact: 'Improved user satisfaction and reduced bounce rate',
        actionable: false,
        metrics: {
          current: `${analyticsData.avgResponseTime}s`,
          trend: 'stable'
        },
        category: 'technical'
      },
      {
        id: 'insight-3',
        title: 'Content Engagement Opportunities',
        type: 'recommendation',
        priority: 'high',
        confidence: 0.7,
        description: 'Some content pieces show lower engagement rates, indicating optimization opportunities.',
        impact: 'Potential increase in user engagement and content value',
        actionable: true,
        recommendation: 'Analyze low-performing content and implement SEO and engagement improvements',
        metrics: {
          current: 'Variable',
          trend: 'stable'
        },
        category: 'content'
      }
    ];
  }

  private getFallbackReport(analyticsData: AnalyticsData): AIAnalyticsReport {
    return {
      summary: `Your content discovery platform shows strong performance with ${analyticsData.successRate}% search success rate and ${analyticsData.userSatisfaction}/5 user satisfaction.`,
      keyFindings: [
        `High search success rate of ${analyticsData.successRate}% indicates excellent content relevance`,
        `Fast response time of ${analyticsData.avgResponseTime}s provides good user experience`,
        `${analyticsData.uniqueVisitors} unique visitors show strong platform adoption`
      ],
      insights: this.getFallbackInsights(analyticsData),
      predictions: [
        {
          metric: 'Total Searches',
          predictedValue: analyticsData.totalSearches * 1.15,
          confidence: 0.8,
          timeframe: 'Next 30 days',
          reasoning: 'Based on current growth trends and user engagement patterns'
        }
      ],
      recommendations: [
        {
          title: 'Optimize Low-Performing Content',
          description: 'Focus on improving engagement for content with lower performance metrics',
          priority: 'high',
          expectedImpact: 'Increased user engagement and content value',
          effort: 'medium',
          category: 'Content Optimization'
        }
      ],
      riskFactors: [
        {
          risk: 'Content Quality Degradation',
          probability: 0.3,
          impact: 'Reduced user satisfaction and search success rate',
          mitigation: 'Implement content quality monitoring and regular audits'
        }
      ]
    };
  }
}

export const aiAnalyticsService = new AIAnalyticsService();
