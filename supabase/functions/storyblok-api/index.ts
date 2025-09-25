import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, params } = await req.json();
    const storyblokToken = Deno.env.get('STORYBLOK_MANAGEMENT_TOKEN');

    if (!storyblokToken) {
      throw new Error('Storyblok Management Token not configured');
    }

    const baseUrl = 'https://mapi.storyblok.com/v1';
    let endpoint = '';
    let method = 'GET';
    let body = null;

    switch (action) {
      case 'getSpaces':
        endpoint = '/spaces';
        break;
      case 'getSpace':
        endpoint = `/spaces/${params.spaceId}`;
        break;
      case 'getStories':
        endpoint = `/spaces/${params.spaceId}/stories`;
        break;
      case 'getStory':
        endpoint = `/spaces/${params.spaceId}/stories/${params.storyId}`;
        break;
      case 'searchStories':
        const searchParams = new URLSearchParams();
        if (params.search) searchParams.append('search', params.search);
        if (params.per_page) searchParams.append('per_page', params.per_page);
        if (params.page) searchParams.append('page', params.page);
        endpoint = `/spaces/${params.spaceId}/stories?${searchParams.toString()}`;
        break;
      case 'getComponents':
        endpoint = `/spaces/${params.spaceId}/components`;
        break;
      default:
        throw new Error(`Unknown action: ${action}`);
    }

    console.log(`Making Storyblok API call: ${method} ${baseUrl}${endpoint}`);

    const response = await fetch(`${baseUrl}${endpoint}`, {
      method,
      headers: {
        'Authorization': storyblokToken,
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : null,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Storyblok API error: ${response.status} ${errorText}`);
      throw new Error(`Storyblok API error: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    console.log(`Storyblok API success:`, { endpoint, dataLength: JSON.stringify(data).length });

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Error in storyblok-api function:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Unknown error occurred',
      details: 'Check function logs for more information'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});