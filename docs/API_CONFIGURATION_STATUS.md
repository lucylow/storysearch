# API Configuration Status & Setup Guide

## Current API Status

### ✅ Storyblok API - WORKING
- **Status**: ✅ **ACTIVE AND WORKING**
- **Endpoint**: `https://pmffcmztmijonvnbzctu.supabase.co/functions/v1/storyblok-api`
- **Test Result**: Successfully retrieved spaces from Storyblok
- **Configuration**: Uses `STORYBLOK_MANAGEMENT_TOKEN` environment variable
- **Features Working**:
  - ✅ Get spaces
  - ✅ Get stories
  - ✅ Search stories
  - ✅ Get components

### ⚠️ ChatGPT/OpenAI API - NEEDS CONFIGURATION
- **Status**: ⚠️ **RATE LIMITED (429 Error)**
- **Endpoint**: `https://pmffcmztmijonvnbzctu.supabase.co/functions/v1/ai-chat`
- **Issue**: OpenAI API key quota exceeded or rate limited
- **Configuration**: Uses `OPENAI_API_KEY` environment variable

### 📝 Algolia Service - MOCK IMPLEMENTATION
- **Status**: 📝 **MOCK DATA ONLY**
- **File**: `src/services/algoliaService.ts`
- **Note**: Currently using mock data instead of real Algolia API

## Required API Keys Setup

### 1. Storyblok API Key (✅ Already Working)
The Storyblok API is already configured and working. The management token is properly set in the Supabase environment.

### 2. OpenAI API Key (⚠️ Needs Setup)
To fix the ChatGPT integration, you need to:

1. **Get OpenAI API Key**:
   - Go to [OpenAI Platform](https://platform.openai.com/api-keys)
   - Create a new API key
   - Copy the key

2. **Set Environment Variable in Supabase**:
   ```bash
   # Via Supabase CLI (requires login)
   npx supabase login
   npx supabase secrets set OPENAI_API_KEY=your_openai_api_key_here --project-ref pmffcmztmijonvnbzctu
   ```

   **OR via Supabase Dashboard**:
   - Go to [Supabase Dashboard](https://supabase.com/dashboard/project/pmffcmztmijonvnbzctu/settings/functions)
   - Navigate to Settings → Environment Variables
   - Add `OPENAI_API_KEY` with your OpenAI API key

### 3. Algolia API Keys (📝 Optional - Currently Mock)
If you want to use real Algolia search instead of mock data:

1. **Get Algolia Credentials**:
   - Go to [Algolia Dashboard](https://www.algolia.com/dashboard)
   - Create a new application
   - Get your Application ID and Search API Key

2. **Update Algolia Service**:
   Replace the mock implementation in `src/services/algoliaService.ts` with real Algolia integration.

## How APIs Are Currently Being Used

### Storyblok API Integration
```typescript
// Used in: src/services/storyblokService.ts
class StoryblokService {
  private async callStoryblokAPI(action: string, params: any = {}) {
    const { data, error } = await supabase.functions.invoke('storyblok-api', {
      body: { action, params }
    });
    // ... handles Storyblok API calls
  }
}
```

**Functions Available**:
- `getSpaces()` - Get all Storyblok spaces
- `getSpace(spaceId)` - Get specific space details
- `getStories(spaceId)` - Get stories from a space
- `searchStories(spaceId, query)` - Search stories
- `getComponents(spaceId)` - Get space components

### ChatGPT/OpenAI Integration
```typescript
// Used in: src/services/storyblokService.ts
async askAI(question: string, context?: any): Promise<string> {
  const { data, error } = await supabase.functions.invoke('ai-chat', {
    body: { messages, context }
  });
  // ... handles AI chat requests
}
```

**Features**:
- Natural language questions about Storyblok content
- Context-aware responses
- Follow-up suggestions

### Algolia Integration (Mock)
```typescript
// Used in: src/services/algoliaService.ts
class AlgoliaService {
  async search(query: string, filters?: any): Promise<SearchResult[]> {
    // Currently returns mock data
  }
}
```

## Testing API Integrations

### Test Storyblok API
```bash
curl -X POST "https://pmffcmztmijonvnbzctu.supabase.co/functions/v1/storyblok-api" \
  -H "Authorization: Bearer YOUR_SUPABASE_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"action": "getSpaces", "params": {}}'
```

### Test ChatGPT API
```bash
curl -X POST "https://pmffcmztmijonvnbzctu.supabase.co/functions/v1/ai-chat" \
  -H "Authorization: Bearer YOUR_SUPABASE_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"messages": [{"role": "user", "content": "Hello"}], "context": null}'
```

## Next Steps

1. **Fix OpenAI API** (Priority 1):
   - Set up OpenAI API key in Supabase environment variables
   - Test the AI chat functionality

2. **Optional - Real Algolia Integration** (Priority 2):
   - Replace mock Algolia service with real implementation
   - Set up Algolia API keys

3. **Monitor API Usage**:
   - Set up monitoring for API rate limits
   - Implement proper error handling and retry logic

## Current Application Flow

1. **Search**: Uses Storyblok API to search content
2. **AI Chat**: Uses OpenAI API for intelligent responses
3. **Suggestions**: Uses mock Algolia service for search suggestions

Both Storyblok and ChatGPT APIs are properly integrated into the application architecture and are being used as intended. The only issue is the OpenAI API key configuration.
