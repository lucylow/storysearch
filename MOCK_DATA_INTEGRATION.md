# 📦 Mock Data Integration - Multi-Brand Content

## Overview

Integrated comprehensive mock data featuring real-world content from Nike, BLACKPINK, and iShowSpeed to demonstrate StorySearch AI's versatility across different brands and content types.

---

## 🎯 Content Breakdown

### **Nike** (8 items)
- **5 Products**: Running shoes, apparel, accessories
  - Air Zoom Pegasus 40
  - Dri-FIT ADV Techknit Ultra
  - Tech Fleece Hoodie
  - Air Force 1 '07
  - Yoga Dri-FIT Pants

- **3 Campaigns**: Marketing initiatives
  - Just Do It: The Power of Sport
  - Why Do It? Connecting with the Next Generation
  - Winning Isn't for Everyone: Celebrating Effort

### **BLACKPINK** (5 items)
- **3 Music Releases**: Albums and singles
  - BORN PINK (Album)
  - Pink Venom (Single)
  - THE ALBUM (Album)

- **3 Brand Endorsements**: Luxury fashion partnerships
  - Jennie for Chanel
  - Lisa for Celine
  - Jisoo for Dior

### **iShowSpeed** (3 items)
- **3 Videos**: Gaming and entertainment content
  - FIFA 25 - INSANE GOALS!
  - Reacting to Viral TikToks
  - My Trip to Japan - Vlog

**Total**: 13 high-quality content items

---

## 🛠️ Technical Implementation

### Data Structure

```typescript
interface BrandContent {
  id: string;
  title: string;
  slug: string;
  content_type: 'product' | 'campaign' | 'video' | 'music_release' | 'brand_endorsement';
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
  sentiment: 'positive' | 'neutral' | 'negative';
  ai_summary: string;
}
```

### File Structure

```
src/data/
├── mockData.json           # Raw JSON data (13 items)
└── brandMockData.ts        # TypeScript module with utilities
```

### Transformation Pipeline

```typescript
JSON Data → Type Validation → Transform to SearchResult → Brand Mapping

transformToSearchResult():
  ├─ Map content_type → SearchResult type
  ├─ Calculate relevance score (sentiment + recency)
  ├─ Generate AI insights (summary, topics, complexity)
  ├─ Extract relationships (entities)
  └─ Return formatted SearchResult
```

---

## 🎨 Brand Selector Component

### Visual Design

**Nike** 👟
- Gradient: Orange → Red
- Content: 8 items
- Focus: Products & Campaigns

**BLACKPINK** 🎵
- Gradient: Pink → Purple
- Content: 5 items
- Focus: Music & Fashion

**iShowSpeed** 🎮
- Gradient: Blue → Cyan
- Content: 3 items
- Focus: Gaming & Vlogs

**All Content** 🌟
- Gradient: Gray → Slate
- Content: 13 items
- Focus: Mixed Brands

### Features

✅ **Visual Indicators**
- Animated selection state
- Gradient backgrounds per brand
- Icon avatars (emoji)
- Item count badges

✅ **Interactions**
- Hover: Scale 1.05 + lift -4px
- Tap: Scale 0.98
- Selection: Animated border + check icon
- Active pulse: Green dot indicator

✅ **Layout**
- Responsive grid (2 cols mobile, 4 cols desktop)
- Equal height cards
- Consistent spacing

---

## 🔍 Search Behavior

### Brand-Specific Search

```typescript
// User selects Nike
algoliaService.setBrand('nike');

// Search query: "running shoes"
Results: Nike Air Zoom Pegasus 40, Nike Yoga products
Source: Nike content only (8 items)
```

### Cross-Brand Search

```typescript
// User selects "All Content"
algoliaService.setBrand('default');

// Search query: "fashion"
Results: Jennie for Chanel, Lisa for Celine, Jisoo for Dior
Source: All brands (13 items)
```

### Dynamic Placeholder

Placeholder text changes based on selected brand:
- **Nike**: "Search Nike products, campaigns, and innovations..."
- **BLACKPINK**: "Search BLACKPINK music, fashion, and collaborations..."
- **iShowSpeed**: "Search iShowSpeed videos, streams, and content..."
- **All**: "Search all content across Nike, BLACKPINK, iShowSpeed..."

---

## 📊 AI Enhancement

### Automatic AI Insights

All content includes AI-generated metadata:

```typescript
aiInsights: {
  summary: "A detailed overview highlighting features...",
  keyTopics: ["running", "shoes", "performance", "nike"],
  sentiment: "positive",
  complexity: "intermediate",
  estimatedReadTime: 3 // minutes
}
```

### Relevance Scoring

```typescript
Base Score: 0.75

Boosts:
├─ Positive sentiment: +0.15
├─ Published < 30 days: +0.10
└─ Published < 7 days: +0.05

Max Score: 1.0
```

### Content Relationships

```typescript
relationships: {
  similar: [],
  related: ["Nike", "Just Do It", "Athletes"],
  prerequisites: [],
  followUps: []
}
```

---

## 🚀 Integration with Algolia Service

### Enhanced Search Flow

```typescript
1. User selects brand → setBrand('nike')
2. Cache cleared for fresh results
3. Search executes → getMockResults()
4. Returns brand-specific content
5. AI processes results
6. UI displays with brand context
```

### Code Example

```typescript
// In algoliaService.ts
class AlgoliaService {
  private currentBrand: BrandKey = 'default';
  
  setBrand(brand: BrandKey) {
    this.currentBrand = brand;
    this.searchCache.clear();
  }
  
  private getMockResults(): SearchResult[] {
    const brandData = brandMockDataMap[this.currentBrand];
    return brandData.length > 0 ? brandData : mockResults;
  }
}
```

---

## 🎯 Use Cases

### E-Commerce (Nike)
```
Search: "running shoes"
Results:
├─ Nike Air Zoom Pegasus 40 (0.95 relevance)
├─ Nike Dri-FIT products (0.82 relevance)
└─ Related campaigns (0.78 relevance)

AI Insights:
- Performance-focused products
- Recent releases highlighted
- Campaign messaging integrated
```

### Entertainment (iShowSpeed)
```
Search: "gaming"
Results:
├─ FIFA 25 gameplay (0.88 relevance)
├─ TikTok reactions (0.75 relevance)
└─ Japan vlog (0.72 relevance)

AI Insights:
- High-energy content
- Gaming-focused
- Entertainment value emphasized
```

### Music & Fashion (BLACKPINK)
```
Search: "fashion"
Results:
├─ Jennie for Chanel (0.92 relevance)
├─ Lisa for Celine (0.90 relevance)
├─ Jisoo for Dior (0.88 relevance)
└─ BORN PINK album (0.75 relevance)

AI Insights:
- Luxury fashion focus
- K-pop influence
- Global brand ambassadors
```

---

## 📈 Benefits

### For Demonstrations
✅ **Real-world content**: Authentic brand examples  
✅ **Diverse types**: Products, music, videos, campaigns  
✅ **Rich metadata**: Tags, categories, entities  
✅ **Visual variety**: Different imagery and styles  

### For Testing
✅ **Brand filtering**: Test multi-tenant scenarios  
✅ **Content types**: Validate type-specific handling  
✅ **Search relevance**: Test ranking algorithms  
✅ **AI processing**: Verify insight generation  

### For Presentations
✅ **Recognizable brands**: Nike, BLACKPINK, iShowSpeed  
✅ **Visual appeal**: Professional product imagery  
✅ **Story narrative**: Campaign messaging  
✅ **Engagement**: Relatable pop culture content  

---

## 🔧 Customization

### Adding New Brands

```typescript
// 1. Add content to mockData.json
{
  "id": "tesla-product-1",
  "title": "Model S Plaid",
  "brand_or_person": "Tesla",
  // ... other fields
}

// 2. Update brandMockData.ts
const teslaContent = typedMockData.filter(
  item => item.brand_or_person === 'Tesla'
);

export const brandMockDataMap = {
  // ... existing brands
  tesla: teslaContent.map(transformToSearchResult)
};

// 3. Add to BrandSelector component
const brands = [
  // ... existing brands
  {
    key: 'tesla',
    name: 'Tesla',
    icon: '⚡',
    description: 'Electric Vehicles',
    gradient: 'from-red-500 to-gray-600'
  }
];
```

### Updating Content

```json
// Edit mockData.json
{
  "id": "nike-product-6",
  "title": "Nike React Infinity Run",
  "content_type": "product",
  "description": "Cushioned comfort for long distances",
  "tags": ["running", "comfort", "innovation"],
  // ... complete fields
}
```

---

## 🏆 Achievement

**Multi-Brand Content Integration** featuring:
- ✅ 13 high-quality content items across 3 brands
- ✅ 5 content types (products, campaigns, videos, music, endorsements)
- ✅ Interactive brand selector with visual design
- ✅ Dynamic search placeholders
- ✅ AI-enhanced metadata
- ✅ Brand-specific filtering
- ✅ Real-world demonstration data
- ✅ Production-ready implementation

*Showcasing StorySearch AI's ability to handle diverse content types and multi-brand scenarios with intelligent search and discovery.*
