/**
 * Schema Validator for StorySearch AI Content
 * Validates mock data against the JSON schema
 */

import schema from './mockDataSchema.json';
import mockData from './mockData.json';

export interface ContentItemSchema {
  id: string;
  title: string;
  slug: string;
  content_type: string;
  description: string;
  full_text_content: string;
  image_url: string;
  url: string;
  tags: string[];
  categories: string[];
  related_entities: string[];
  brand_or_person: string;
  date_published?: string;
  author?: string;
  sentiment?: 'positive' | 'neutral' | 'negative';
  ai_summary?: string;
}

/**
 * Validates a single content item against required fields
 */
export function validateContentItem(item: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const required = schema.required || [];

  // Check required fields
  required.forEach(field => {
    if (!item[field]) {
      errors.push(`Missing required field: ${field}`);
    }
  });

  // Validate types
  if (item.tags && !Array.isArray(item.tags)) {
    errors.push('tags must be an array');
  }

  if (item.categories && !Array.isArray(item.categories)) {
    errors.push('categories must be an array');
  }

  if (item.related_entities && !Array.isArray(item.related_entities)) {
    errors.push('related_entities must be an array');
  }

  // Validate sentiment enum
  if (item.sentiment && !['positive', 'neutral', 'negative'].includes(item.sentiment)) {
    errors.push('sentiment must be one of: positive, neutral, negative');
  }

  // Validate URLs
  if (item.url && !isValidUrl(item.url)) {
    errors.push('url must be a valid URL');
  }

  if (item.image_url && !isValidUrl(item.image_url)) {
    errors.push('image_url must be a valid URL');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Validates all mock data items
 */
export function validateAllContent(data: any[]): {
  valid: boolean;
  totalItems: number;
  validItems: number;
  invalidItems: number;
  errors: Array<{ id: string; errors: string[] }>;
} {
  const results = data.map(item => ({
    id: item.id || 'unknown',
    validation: validateContentItem(item)
  }));

  const invalidItems = results.filter(r => !r.validation.valid);

  return {
    valid: invalidItems.length === 0,
    totalItems: data.length,
    validItems: results.filter(r => r.validation.valid).length,
    invalidItems: invalidItems.length,
    errors: invalidItems.map(item => ({
      id: item.id,
      errors: item.validation.errors
    }))
  };
}

/**
 * Helper function to validate URLs
 */
function isValidUrl(urlString: string): boolean {
  try {
    new URL(urlString);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Get content statistics
 */
export function getContentStats(data: any[]) {
  const byBrand: Record<string, number> = {};
  const byType: Record<string, number> = {};
  const bySentiment: Record<string, number> = {};

  data.forEach(item => {
    // Count by brand
    const brand = item.brand_or_person || 'Unknown';
    byBrand[brand] = (byBrand[brand] || 0) + 1;

    // Count by content type
    const type = item.content_type || 'Unknown';
    byType[type] = (byType[type] || 0) + 1;

    // Count by sentiment
    const sentiment = item.sentiment || 'neutral';
    bySentiment[sentiment] = (bySentiment[sentiment] || 0) + 1;
  });

  return {
    total: data.length,
    byBrand,
    byType,
    bySentiment
  };
}

// Validate mock data on import (development only)
if (import.meta.env.DEV) {
  const validation = validateAllContent(mockData);
  
  if (!validation.valid) {
    console.warn('⚠️ Mock data validation warnings:');
    validation.errors.forEach(error => {
      console.warn(`  - Item ${error.id}:`, error.errors);
    });
  } else {
    console.log('✅ All mock data validated successfully!');
    console.log('📊 Content stats:', getContentStats(mockData));
  }
}

export { schema };
export default validateContentItem;

