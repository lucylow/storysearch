// AI Content Analysis Function for Storyblok-Algolia Integration
// This function analyzes content using AI to extract insights, topics, and metadata

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

interface ContentAnalysisRequest {
  content: string;
  title: string;
  metadata?: Record<string, unknown>;
}

interface ContentAnalysisResponse {
  summary: string;
  keyTopics: string[];
  sentiment: string;
  complexity: string;
  entities: string[];
  tags: string[];
  readabilityScore: number;
  seoScore: number;
  estimatedReadTime: number;
  wordCount: number;
}

// Analyze content sentiment
function analyzeSentiment(content: string): string {
  const positiveWords = [
    'excellent', 'great', 'amazing', 'wonderful', 'fantastic', 'best', 'perfect',
    'outstanding', 'superb', 'brilliant', 'exceptional', 'incredible', 'awesome'
  ];
  
  const negativeWords = [
    'difficult', 'problem', 'issue', 'error', 'challenge', 'complex', 'hard',
    'terrible', 'awful', 'horrible', 'disappointing', 'frustrating', 'confusing'
  ];
  
  const contentLower = content.toLowerCase();
  const words = contentLower.split(/\s+/);
  
  let positiveCount = 0;
  let negativeCount = 0;
  
  words.forEach(word => {
    if (positiveWords.includes(word)) positiveCount++;
    if (negativeWords.includes(word)) negativeCount++;
  });
  
  if (positiveCount > negativeCount) return 'positive';
  if (negativeCount > positiveCount) return 'negative';
  return 'neutral';
}

// Determine content complexity
function determineComplexity(content: string, title: string): string {
  const beginnerWords = [
    'simple', 'easy', 'basic', 'introduction', 'getting started', 'beginner',
    'first steps', 'quick start', 'tutorial', 'guide', 'how to'
  ];
  
  const advancedWords = [
    'advanced', 'complex', 'sophisticated', 'expert', 'enterprise', 'professional',
    'optimization', 'performance', 'scalability', 'architecture', 'implementation'
  ];
  
  const allText = `${title} ${content}`.toLowerCase();
  
  const beginnerCount = beginnerWords.filter(word => allText.includes(word)).length;
  const advancedCount = advancedWords.filter(word => allText.includes(word)).length;
  
  if (beginnerCount > advancedCount) return 'beginner';
  if (advancedCount > beginnerCount) return 'advanced';
  return 'intermediate';
}

// Extract key topics from content
function extractKeyTopics(content: string, title: string): string[] {
  const topicKeywords = {
    'setup': ['setup', 'install', 'configuration', 'initialization', 'getting started'],
    'integration': ['integration', 'connect', 'api', 'webhook', 'sync'],
    'performance': ['performance', 'speed', 'optimization', 'fast', 'efficient'],
    'seo': ['seo', 'search engine', 'meta', 'optimization', 'ranking'],
    'security': ['security', 'authentication', 'authorization', 'secure', 'protection'],
    'multilingual': ['multilingual', 'i18n', 'internationalization', 'translation', 'language'],
    'components': ['component', 'module', 'widget', 'block', 'element'],
    'api': ['api', 'endpoint', 'rest', 'graphql', 'webhook'],
    'cms': ['cms', 'content management', 'headless', 'storyblok'],
    'react': ['react', 'jsx', 'component', 'hook', 'state'],
    'nextjs': ['nextjs', 'next.js', 'ssr', 'ssg', 'isr'],
    'javascript': ['javascript', 'js', 'es6', 'typescript', 'ts'],
    'tutorial': ['tutorial', 'guide', 'how to', 'step by step', 'walkthrough'],
    'best-practices': ['best practice', 'recommendation', 'tip', 'advice', 'guideline']
  };
  
  const allText = `${title} ${content}`.toLowerCase();
  const topics: string[] = [];
  
  Object.entries(topicKeywords).forEach(([topic, keywords]) => {
    if (keywords.some(keyword => allText.includes(keyword))) {
      topics.push(topic);
    }
  });
  
  return topics;
}

// Extract entities from content
function extractEntities(content: string, title: string): string[] {
  const entities = [
    'Storyblok', 'React', 'Next.js', 'API', 'CMS', 'JavaScript', 'TypeScript',
    'Node.js', 'Algolia', 'Supabase', 'Vercel', 'AWS', 'Google', 'Microsoft',
    'GitHub', 'GitLab', 'Docker', 'Kubernetes', 'GraphQL', 'REST', 'JSON',
    'HTML', 'CSS', 'SASS', 'SCSS', 'Webpack', 'Babel', 'ESLint', 'Prettier'
  ];
  
  const allText = `${title} ${content}`.toLowerCase();
  return entities.filter(entity => allText.includes(entity.toLowerCase()));
}

// Generate tags based on content analysis
function generateTags(content: string, title: string, topics: string[]): string[] {
  const allText = `${title} ${content}`.toLowerCase();
  const tags = [...topics];
  
  // Add content type tags
  if (allText.includes('tutorial') || allText.includes('how to')) {
    tags.push('tutorial');
  }
  if (allText.includes('guide') || allText.includes('walkthrough')) {
    tags.push('guide');
  }
  if (allText.includes('api') || allText.includes('endpoint')) {
    tags.push('api');
  }
  if (allText.includes('best practice') || allText.includes('recommendation')) {
    tags.push('best-practices');
  }
  
  // Add technology tags
  if (allText.includes('react')) tags.push('react');
  if (allText.includes('nextjs') || allText.includes('next.js')) tags.push('nextjs');
  if (allText.includes('javascript')) tags.push('javascript');
  if (allText.includes('typescript')) tags.push('typescript');
  if (allText.includes('storyblok')) tags.push('storyblok');
  
  // Add complexity tags
  const complexity = determineComplexity(content, title);
  tags.push(complexity);
  
  return [...new Set(tags)]; // Remove duplicates
}

// Calculate readability score (simplified Flesch Reading Ease)
function calculateReadabilityScore(content: string): number {
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const words = content.split(/\s+/).filter(w => w.length > 0);
  const syllables = words.reduce((total, word) => {
    return total + countSyllables(word);
  }, 0);
  
  if (sentences.length === 0 || words.length === 0) return 50;
  
  const avgWordsPerSentence = words.length / sentences.length;
  const avgSyllablesPerWord = syllables / words.length;
  
  // Simplified Flesch Reading Ease formula
  const score = 206.835 - (1.015 * avgWordsPerSentence) - (84.6 * avgSyllablesPerWord);
  
  return Math.max(0, Math.min(100, Math.round(score)));
}

// Count syllables in a word (simplified)
function countSyllables(word: string): number {
  const vowels = 'aeiouy';
  let count = 0;
  let previousWasVowel = false;
  
  for (let i = 0; i < word.length; i++) {
    const isVowel = vowels.includes(word[i].toLowerCase());
    if (isVowel && !previousWasVowel) {
      count++;
    }
    previousWasVowel = isVowel;
  }
  
  // Handle silent 'e'
  if (word.toLowerCase().endsWith('e') && count > 1) {
    count--;
  }
  
  return Math.max(1, count);
}

// Calculate SEO score
function calculateSEOScore(content: string, title: string): number {
  let score = 0;
  
  // Title length check (50-60 characters is optimal)
  if (title.length >= 50 && title.length <= 60) score += 20;
  else if (title.length >= 30 && title.length <= 70) score += 15;
  else score += 10;
  
  // Content length check (300+ words is good)
  const wordCount = content.split(/\s+/).length;
  if (wordCount >= 300) score += 20;
  else if (wordCount >= 150) score += 15;
  else score += 10;
  
  // Keyword density check
  const titleWords = title.toLowerCase().split(/\s+/);
  const contentWords = content.toLowerCase().split(/\s+/);
  const titleKeywordDensity = titleWords.filter(word => 
    contentWords.includes(word) && word.length > 3
  ).length / titleWords.length;
  
  if (titleKeywordDensity > 0.3) score += 15;
  else if (titleKeywordDensity > 0.2) score += 10;
  else score += 5;
  
  // Structure check (headings, lists, etc.)
  if (content.includes('#') || content.includes('*') || content.includes('-')) {
    score += 15;
  }
  
  // Meta information check
  if (content.toLowerCase().includes('meta') || content.toLowerCase().includes('description')) {
    score += 10;
  }
  
  return Math.min(100, score);
}

// Estimate reading time
function estimateReadTime(content: string): number {
  const wordsPerMinute = 200; // Average reading speed
  const wordCount = content.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

// Generate content summary
function generateSummary(content: string, maxLength: number = 200): string {
  // Simple extractive summarization - take the first few sentences
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
  let summary = '';
  
  for (const sentence of sentences) {
    if (summary.length + sentence.length > maxLength) break;
    summary += sentence.trim() + '. ';
  }
  
  return summary.trim() || content.substring(0, maxLength) + '...';
}

serve(async (req) => {
  try {
    // Handle CORS
    if (req.method === 'OPTIONS') {
      return new Response(null, {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
      });
    }

    if (req.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    const { content, title, metadata }: ContentAnalysisRequest = await req.json();

    if (!content || !title) {
      return new Response(JSON.stringify({
        error: 'Content and title are required'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Perform AI analysis
    const startTime = Date.now();
    
    const keyTopics = extractKeyTopics(content, title);
    const entities = extractEntities(content, title);
    const sentiment = analyzeSentiment(content);
    const complexity = determineComplexity(content, title);
    const tags = generateTags(content, title, keyTopics);
    const readabilityScore = calculateReadabilityScore(content);
    const seoScore = calculateSEOScore(content, title);
    const estimatedReadTime = estimateReadTime(content);
    const wordCount = content.split(/\s+/).length;
    const summary = generateSummary(content);

    const processingTime = Date.now() - startTime;

    const response: ContentAnalysisResponse = {
      summary,
      keyTopics,
      sentiment,
      complexity,
      entities,
      tags,
      readabilityScore,
      seoScore,
      estimatedReadTime,
      wordCount
    };

    // Log analysis results
    console.log(`Content analysis completed in ${processingTime}ms:`, {
      title: title.substring(0, 50) + '...',
      topics: keyTopics.length,
      entities: entities.length,
      sentiment,
      complexity,
      readabilityScore,
      seoScore
    });

    return new Response(JSON.stringify({
      success: true,
      analysis: response,
      processingTime,
      metadata: {
        timestamp: new Date().toISOString(),
        version: '1.0.0'
      }
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });

  } catch (error) {
    console.error('Content analysis error:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
});
