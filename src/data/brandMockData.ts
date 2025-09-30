// Brand-specific mock data for enhanced content discovery
import mockDataJson from './mockData.json';

export interface BrandContent {
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
  date_published: string;
  author: string;
  sentiment: string;
  ai_summary: string;
}

export type BrandKey = 'nike' | 'blackpink' | 'ishowspeed' | 'default';

const typedMockData: BrandContent[] = mockDataJson as BrandContent[];

export function transformToSearchResult(content: BrandContent): any {
  const type = content.content_type === 'tutorial' ? 'tutorial' : 
               content.content_type === 'guide' ? 'guide' :
               content.content_type === 'documentation' ? 'documentation' : 'article';

  const daysSince = (Date.now() - new Date(content.date_published).getTime()) / (1000 * 60 * 60 * 24);
  let score = 0.75;
  if (content.sentiment === 'positive') score += 0.15;
  if (daysSince < 30) score += 0.1;

  return {
    id: content.id,
    title: content.title,
    content: content.full_text_content,
    type,
    url: content.url,
    thumbnail: content.image_url,
    tags: content.tags,
    createdAt: content.date_published,
    relevanceScore: Math.min(score, 1.0)
  };
}

const nikeContent = typedMockData.filter(item => item.brand_or_person === 'Nike');
const blackpinkContent = typedMockData.filter(item => item.brand_or_person === 'BLACKPINK');
const ishowspeedContent = typedMockData.filter(item => item.brand_or_person === 'iShowSpeed');

export const brandMockDataMap = {
  nike: nikeContent.map(transformToSearchResult),
  blackpink: blackpinkContent.map(transformToSearchResult),
  ishowspeed: ishowspeedContent.map(transformToSearchResult),
  default: typedMockData.map(transformToSearchResult)
};

export default brandMockDataMap;
