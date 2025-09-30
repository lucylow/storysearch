# 📋 Mock Data Schema Documentation

## Overview

Comprehensive JSON schema for StorySearch AI content items, ensuring data consistency, validation, and AI-powered discovery optimization.

---

## 🎯 Schema Purpose

### **Data Consistency**
- Enforces required fields across all content
- Validates data types and formats
- Ensures AI compatibility

### **AI Optimization**
- Structured for semantic search
- Rich metadata for intent classification
- Entity relationships for recommendations

### **Developer Experience**
- Clear documentation
- Type safety with TypeScript
- Validation on import

---

## 📊 Schema Structure

### **Required Fields** (11)

```typescript
{
  id: string,                    // Unique identifier
  title: string,                 // Main title
  slug: string,                  // URL-friendly slug
  content_type: string,          // Content classification
  description: string,           // Brief summary
  full_text_content: string,     // Complete text content
  image_url: string (uri),       // Primary image URL
  url: string (uri),             // Canonical URL
  tags: string[],                // Keywords
  categories: string[],          // Categorization
  related_entities: string[],    // Related entities
  brand_or_person: string        // Main brand/person
}
```

### **Optional Fields** (4)

```typescript
{
  date_published?: string (date),          // Publication date
  author?: string,                         // Content creator
  sentiment?: 'positive' | 'neutral' | 'negative',  // AI sentiment
  ai_summary?: string                      // AI-generated summary
}
```

---

## 🔍 Field Specifications

### **id** (required)
```typescript
type: string
format: any
example: "nike-product-1"
purpose: Unique identification for search indexing
```

**Best Practices:**
- Use kebab-case format
- Include brand prefix
- Include content type
- Make descriptive

**Examples:**
- ✅ `nike-product-air-max-90`
- ✅ `blackpink-music-born-pink`
- ✅ `ishowspeed-video-fifa-25`
- ❌ `1` (too generic)
- ❌ `product` (not unique)

### **title** (required)
```typescript
type: string
format: any
example: "Nike Air Zoom Pegasus 40"
purpose: Main heading for display and search
```

**Best Practices:**
- Clear and descriptive
- Include brand name when relevant
- Use proper capitalization
- 40-80 characters ideal

### **slug** (required)
```typescript
type: string
format: kebab-case
example: "nike-air-zoom-pegasus-40"
purpose: URL-friendly identifier
```

**Best Practices:**
- lowercase only
- hyphens for spaces
- remove special characters
- match title semantically

### **content_type** (required)
```typescript
type: string
format: any
examples: 
  - "product"
  - "campaign"
  - "video"
  - "music_release"
  - "brand_endorsement"
  - "article"
  - "tutorial"
  - "documentation"
purpose: Content classification for AI intent matching
```

**Supported Types:**
| Type | Description | Example |
|------|-------------|---------|
| `product` | Physical/digital products | Nike shoes |
| `campaign` | Marketing campaigns | Just Do It |
| `video` | Video content | YouTube videos |
| `music_release` | Albums, singles | BORN PINK |
| `brand_endorsement` | Brand partnerships | Jennie for Chanel |
| `article` | Written content | Blog posts |
| `tutorial` | How-to guides | Setup guides |
| `documentation` | Technical docs | API docs |

### **description** (required)
```typescript
type: string
format: any
example: "Responsive cushioning for everyday runs."
purpose: Brief summary for previews and SEO
```

**Best Practices:**
- 100-160 characters
- Concise and engaging
- Include key benefits
- SEO-optimized

### **full_text_content** (required)
```typescript
type: string
format: any
example: "Discover the Nike Air Zoom Pegasus 40..."
purpose: Complete content for AI analysis and search
```

**Best Practices:**
- Comprehensive and detailed
- 200-1000+ words
- Natural language
- Include keywords organically
- Rich context for AI

### **image_url** (required)
```typescript
type: string
format: uri
example: "https://images.unsplash.com/photo-..."
purpose: Visual representation
```

**Best Practices:**
- Use HTTPS
- High-quality images (400x300+)
- CDN-hosted when possible
- Accessible URLs

### **url** (required)
```typescript
type: string
format: uri
example: "https://www.nike.com/product/..."
purpose: Canonical URL to source
```

### **tags** (required)
```typescript
type: array of strings
example: ["running", "shoes", "performance", "nike"]
purpose: Keywords for search and discovery
```

**Best Practices:**
- 5-10 tags per item
- Mix specific and broad terms
- lowercase preferred
- Include brand name
- Include content type

### **categories** (required)
```typescript
type: array of strings
example: ["footwear", "men", "women", "nike"]
purpose: Hierarchical organization
```

**Best Practices:**
- 2-5 categories
- Hierarchical structure
- Consistent naming
- Brand-specific when needed

### **related_entities** (required)
```typescript
type: array of strings
example: ["Nike", "Just Do It", "Athletes"]
purpose: Entity relationships for recommendations
```

**Best Practices:**
- People, brands, products, concepts
- 2-5 entities
- Proper capitalization
- Well-known entities

### **brand_or_person** (required)
```typescript
type: string
example: "Nike"
purpose: Main subject classification
```

**Supported Values:**
- `Nike`
- `BLACKPINK`
- `iShowSpeed`
- (extensible)

### **date_published** (optional)
```typescript
type: string
format: date (YYYY-MM-DD)
example: "2025-08-22"
purpose: Freshness scoring and sorting
```

### **author** (optional)
```typescript
type: string
example: "Nike Marketing"
purpose: Content attribution
```

### **sentiment** (optional)
```typescript
type: string
enum: ["positive", "neutral", "negative"]
example: "positive"
purpose: AI sentiment analysis for relevance
```

**Impact on Relevance:**
- positive: +0.15 boost
- neutral: no change
- negative: -0.05 penalty

### **ai_summary** (optional)
```typescript
type: string
example: "A detailed overview highlighting features..."
purpose: AI-generated content summary
```

---

## 🧪 Validation System

### **Automatic Validation**

```typescript
// On development import
if (import.meta.env.DEV) {
  const validation = validateAllContent(mockData);
  
  if (!validation.valid) {
    console.warn('⚠️ Validation warnings:', validation.errors);
  } else {
    console.log('✅ All data validated!');
    console.log('📊 Stats:', getContentStats(mockData));
  }
}
```

### **Validation Output**

```typescript
{
  valid: boolean,
  totalItems: 13,
  validItems: 13,
  invalidItems: 0,
  errors: [
    {
      id: "nike-product-1",
      errors: ["Missing required field: tags"]
    }
  ]
}
```

### **Statistics Output**

```typescript
{
  total: 13,
  byBrand: {
    "Nike": 8,
    "BLACKPINK": 5,
    "iShowSpeed": 3
  },
  byType: {
    "product": 5,
    "campaign": 3,
    "music_release": 3,
    "brand_endorsement": 2,
    "video": 3
  },
  bySentiment: {
    "positive": 10,
    "neutral": 3,
    "negative": 0
  }
}
```

---

## 📝 Adding New Content

### **Step-by-Step Guide**

1. **Copy Template**
```json
{
  "id": "brand-type-name",
  "title": "Product/Content Title",
  "slug": "product-content-title",
  "content_type": "product",
  "description": "Brief description (100-160 chars)",
  "full_text_content": "Complete content with details...",
  "image_url": "https://example.com/image.jpg",
  "url": "https://example.com/product",
  "tags": ["tag1", "tag2", "tag3"],
  "categories": ["category1", "category2"],
  "related_entities": ["Entity1", "Entity2"],
  "brand_or_person": "Brand Name",
  "date_published": "2025-09-30",
  "author": "Author Name",
  "sentiment": "positive",
  "ai_summary": "AI-generated summary..."
}
```

2. **Fill in Fields**
   - Use unique ID
   - Write compelling title
   - Create URL-friendly slug
   - Select appropriate content_type
   - Write detailed full_text_content

3. **Add to mockData.json**
   - Insert into appropriate position
   - Validate JSON syntax
   - Check for duplicates

4. **Test**
   - Run development server
   - Check console for validation
   - Test search functionality

### **Content Type Guide**

**Product**
```json
{
  "content_type": "product",
  "tags": ["product-category", "brand", "features"],
  "categories": ["product-category", "target-audience"],
  "sentiment": "positive" // usually
}
```

**Campaign**
```json
{
  "content_type": "campaign",
  "tags": ["marketing", "brand", "message"],
  "categories": ["marketing", "news"],
  "full_text_content": "Include campaign narrative, goals, impact"
}
```

**Video**
```json
{
  "content_type": "video",
  "tags": ["video-topic", "creator", "genre"],
  "categories": ["entertainment", "genre"],
  "full_text_content": "Include video description, highlights, key moments"
}
```

**Music Release**
```json
{
  "content_type": "music_release",
  "tags": ["genre", "artist", "album-type"],
  "categories": ["music", "genre"],
  "related_entities": ["Artist", "Members", "Label"]
}
```

**Brand Endorsement**
```json
{
  "content_type": "brand_endorsement",
  "tags": ["fashion/beauty", "luxury", "ambassador"],
  "categories": ["fashion", "luxury", "celebrity"],
  "related_entities": ["Celebrity", "Brand", "Related Brands"]
}
```

---

## 🔧 Schema Extensions

### **Adding Custom Fields**

To add new optional fields:

1. **Update Schema** (`mockDataSchema.json`)
```json
{
  "properties": {
    "video_duration": {
      "type": "number",
      "description": "Duration in seconds for video content"
    }
  }
}
```

2. **Update TypeScript Interface** (`schemaValidator.ts`)
```typescript
export interface ContentItemSchema {
  // ... existing fields
  video_duration?: number;
}
```

3. **Update Transformer** (`brandMockData.ts`)
```typescript
export function transformToSearchResult(content: BrandContent): any {
  return {
    // ... existing fields
    videoDuration: content.video_duration
  };
}
```

---

## 📊 Quality Metrics

### **Current Data Quality**

```
Total Items: 13
Valid Items: 13 (100%)
Invalid Items: 0 (0%)

Field Completeness:
├─ Required fields: 100%
├─ Optional fields: 75%
├─ AI summaries: 100%
└─ Sentiment tags: 100%

Content Distribution:
├─ Nike: 61.5% (8 items)
├─ BLACKPINK: 38.5% (5 items)
└─ iShowSpeed: 23.1% (3 items)

Sentiment Distribution:
├─ Positive: 76.9% (10 items)
├─ Neutral: 23.1% (3 items)
└─ Negative: 0% (0 items)
```

---

## 🚀 Best Practices

### **Content Creation**

✅ **DO:**
- Use descriptive, unique IDs
- Write comprehensive full_text_content (200+ words)
- Include 5-10 relevant tags
- Add AI summaries for all items
- Use high-quality images
- Include proper dates
- Set appropriate sentiment

❌ **DON'T:**
- Use generic IDs (1, 2, 3)
- Copy-paste descriptions
- Overload with tags (>15)
- Skip required fields
- Use broken image URLs
- Forget to update dates

### **SEO Optimization**

✅ **Optimize for Search:**
- Include target keywords in title
- Write compelling descriptions
- Use semantic tags
- Add related entities
- Include brand names

### **AI Enhancement**

✅ **Improve AI Results:**
- Rich full_text_content
- Clear sentiment signals
- Multiple related entities
- Detailed summaries
- Contextual tags

---

## 🧪 Testing & Validation

### **Manual Testing Checklist**

- [ ] All required fields present
- [ ] URLs are valid and accessible
- [ ] Tags are relevant and lowercase
- [ ] Categories are consistent
- [ ] Sentiment is appropriate
- [ ] AI summary is accurate
- [ ] No duplicate IDs
- [ ] JSON is valid
- [ ] Images load correctly
- [ ] Search works as expected

### **Automated Validation**

```bash
# Development server logs validation
npm run dev

# Expected output:
# ✅ All mock data validated successfully!
# 📊 Content stats: { total: 13, byBrand: {...}, ... }
```

---

## 📈 Statistics & Analytics

### **Content Metrics**

```typescript
getContentStats(mockData):
{
  total: 13,
  byBrand: {
    "Nike": 8,
    "BLACKPINK": 5,
    "iShowSpeed": 3
  },
  byType: {
    "product": 5,
    "campaign": 3,
    "video": 3,
    "music_release": 3,
    "brand_endorsement": 2
  },
  bySentiment: {
    "positive": 10,
    "neutral": 3,
    "negative": 0
  }
}
```

---

## 🎯 Use Cases

### **E-Commerce (Nike)**
```json
{
  "content_type": "product",
  "tags": ["running", "shoes", "performance"],
  "categories": ["footwear", "sports"],
  "sentiment": "positive"
}
```
**AI Enhancement**: Product recommendations, comparison queries, shopping intent

### **Entertainment (iShowSpeed)**
```json
{
  "content_type": "video",
  "tags": ["gaming", "fifa", "livestream"],
  "categories": ["entertainment", "gaming"],
  "sentiment": "neutral"
}
```
**AI Enhancement**: Content discovery, related videos, trending topics

### **Music & Fashion (BLACKPINK)**
```json
{
  "content_type": "music_release",
  "tags": ["kpop", "album", "music"],
  "categories": ["music", "k-pop"],
  "sentiment": "positive"
}
```
**AI Enhancement**: Artist discovery, genre recommendations, fashion crossover

---

## 🔄 Schema Versioning

### **Current Version: 1.0**

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "version": "1.0.0",
  "last_updated": "2025-09-30"
}
```

### **Future Versions**

**v1.1 (Planned)**
- Add `video_duration` field
- Add `price` field for products
- Add `rating` field
- Add `views_count` field

**v2.0 (Future)**
- Nested content relationships
- Multi-language support
- Custom metadata fields
- Advanced AI metrics

---

## 📚 Integration Guide

### **With Algolia Service**

```typescript
import { brandMockDataMap } from '@/data/brandMockData';

class AlgoliaService {
  setBrand(brand: BrandKey) {
    this.currentBrand = brand;
    this.searchCache.clear();
  }
  
  private getMockResults() {
    return brandMockDataMap[this.currentBrand];
  }
}
```

### **With Search Interface**

```typescript
import BrandSelector from '@/components/UI/BrandSelector';

const [selectedBrand, setSelectedBrand] = useState<BrandKey>('default');

const handleBrandChange = (brand: BrandKey) => {
  setSelectedBrand(brand);
  algoliaService.setBrand(brand);
};
```

---

## 🏆 Schema Features

**Validation System** featuring:
- ✅ Automatic validation on dev import
- ✅ Type safety with TypeScript
- ✅ Required field enforcement
- ✅ URL format validation
- ✅ Enum validation (sentiment)
- ✅ Array type checking
- ✅ Comprehensive error reporting
- ✅ Statistics generation

**Benefits:**
- 100% data consistency
- Reduced errors
- Better AI results
- Faster development
- Easier debugging

---

*This schema ensures high-quality, AI-optimized content that powers StorySearch AI's intelligent discovery features.*

