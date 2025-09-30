# 🎨 Brand Customization Demo Guide

## Overview

StorySearch AI now includes **real-time brand switching** to demonstrate how the platform adapts to different industries and audiences. Instead of showing generic Storyblok CMS content, you can now see industry-specific search results for 5 different brand personas.

## How to Use

### 1. Find the Brand Switcher
- Look for the **🎨 palette icon** in the top-right corner of the application
- Click it to open the brand selection dropdown

### 2. Select a Brand
Choose from 6 different demo brands:

#### 📚 **Default (Storyblok Demo)**
- Original Storyblok CMS content
- Tech-focused search results
- Perfect for CMS demonstrations

#### 🏥 **HealthTech Solutions**
- Healthcare & Medical industry
- Clinical guidelines, patient education
- **Example Search**: "diabetes management" → Shows medical protocols and treatment guidelines

#### 🎓 **EduLearn Academy**
- Education & E-learning platform
- Courses, tutorials, study guides
- **Example Search**: "learn python" → Shows beginner courses and interactive lessons

#### 🛍️ **FashionForward**
- Fashion & E-commerce
- Style guides, seasonal collections
- **Example Search**: "summer wedding" → Shows outfit lookbooks and styling advice

#### 💰 **FinanceFlow**
- Financial Services
- Tax planning, investment strategies
- **Example Search**: "401k limits" → Shows retirement planning and tax guidance

#### 🎮 **GamersHub**
- Gaming Community
- Game guides, strategies, reviews
- **Example Search**: "elden ring builds" → Shows gaming guides and community tips

### 3. Search and Explore
- Enter any search query
- See **industry-specific results** tailored to that brand
- Notice how the **AI responses adapt** to match each brand's personality

## What Changes When You Switch Brands?

### ✅ Search Results
- **Content**: Industry-relevant articles, guides, and documentation
- **Titles & Descriptions**: Match the industry terminology
- **Images**: Industry-appropriate visuals

### ✅ AI Personality
- **Tone**: Professional (healthcare) to Casual (gaming)
- **Language**: Technical medical terms vs. gaming slang
- **Response Style**: Detailed medical info vs. enthusiastic gaming tips

### ✅ Visual Identity (Future Enhancement)
- Colors adapt to brand palette
- Typography reflects brand personality
- UI elements match brand style

## Example Searches by Brand

### 🏥 HealthTech
```
"diabetes complications" → Clinical protocols, patient resources
"hypertension treatment" → Evidence-based guidelines
"hipaa compliance" → Security and regulatory docs
```

### 🎓 EduLearn
```
"python basics" → Beginner programming courses
"data structures" → Computer science tutorials
"study skills" → Learning strategies and tips
```

### 🛍️ FashionForward
```
"summer collection" → New arrivals and trends
"casual chic" → Styling guides
"sustainable fashion" → Eco-conscious content
```

### 💰 FinanceFlow
```
"tax planning" → 2024 tax strategies
"investment portfolio" → Wealth management guides
"estate planning" → Legal and financial docs
```

### 🎮 GamersHub
```
"elden ring" → Boss strategies and builds
"valorant agents" → Tier lists and meta analysis
"speedrun guide" → Advanced techniques
```

## Technical Implementation

### Files Created
1. **`src/data/brandMockData.ts`** - Industry-specific mock data (5 results per brand)
2. **`src/contexts/BrandContext.tsx`** - Brand state management
3. **`src/components/BrandSwitcher.tsx`** - UI component for switching brands
4. **`src/hooks/useBrandSearch.ts`** - Hook to sync brand with search service

### How It Works
```
User selects brand → BrandContext updates → 
algoliaService.setBrand() called → 
Search results now use brand-specific mock data →
AI responses adapt to brand personality
```

## For Hackathon Judges

This feature demonstrates:

### 🎯 **Versatility**
- StorySearch AI works across **any industry**
- Not limited to tech or CMS content

### 🧠 **Smart Adaptation**
- AI **understands context** and adapts tone
- Search results **match user expectations**

### 💼 **Business Value**
- Single platform serves **multiple clients**
- Easy white-labeling for agencies
- Industry-specific personalization

### 🚀 **Innovation**
- Real-time brand switching (no page reload)
- Content completely transforms based on audience
- Demonstrates multi-tenant capabilities

## Demo Script for Presentations

1. **Start with Default**
   - "Here's StorySearch AI with standard CMS content..."

2. **Switch to HealthTech**
   - "Now watch how it transforms for healthcare..."
   - Search: "diabetes management"
   - Show medical protocols and compliance focus

3. **Switch to GamersHub**
   - "Same platform, completely different personality!"
   - Search: "best builds"
   - Show casual tone, emojis, community language

4. **Highlight the Magic**
   - "This is the same AI, same codebase..."
   - "Just different data and personality configuration"
   - "Perfect for agencies serving multiple clients"

## Future Enhancements

- [ ] Dynamic color theming per brand
- [ ] Custom logo injection
- [ ] Saved brand preferences
- [ ] Brand-specific analytics
- [ ] Confidence thresholds per industry
- [ ] Industry-specific AI models

## Questions?

For more details on brand customization, see:
- `README.md` - Full brand configuration examples
- `src/data/brandMockData.ts` - Mock data structure
- `src/contexts/BrandContext.tsx` - Configuration options

---

**Pro Tip**: Try searching the same term across different brands to see how results and AI responses adapt! 🎭

