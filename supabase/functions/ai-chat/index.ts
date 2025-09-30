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
    const { messages, context } = await req.json();
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Build system prompt for general web content
    const systemPrompt = `You are StorySearch AI, an intelligent assistant that helps users discover and understand information about companies, topics, and online content.

You can help with:
- Finding information about companies (e.g., Nike, Tesla, Apple)
- Explaining topics and concepts
- Comparing products, services, or companies
- Providing industry insights and trends
- Answering questions about any online content
- Discovering related information and resources

${context ? `Current search context:\n${JSON.stringify(context, null, 2)}` : ''}

Always provide helpful, accurate, and up-to-date information. When discussing companies or topics, provide comprehensive insights, key facts, and relevant details. Be conversational and helpful.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages
        ],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`OpenAI API error: ${response.status} ${errorText}`);
      
      let errorMessage = 'AI service temporarily unavailable';
      
      if (response.status === 429) {
        errorMessage = 'AI service is currently busy. Please try again in a few moments.';
      } else if (response.status === 401) {
        errorMessage = 'AI service authentication failed. Please contact support.';
      } else if (response.status === 402) {
        errorMessage = 'AI service quota exceeded. Please contact support.';
      } else if (response.status >= 500) {
        errorMessage = 'AI service is experiencing technical difficulties. Please try again later.';
      }
      
      throw new Error(errorMessage);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    console.log('AI Chat response generated successfully');

    return new Response(JSON.stringify({ 
      response: aiResponse,
      usage: data.usage 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: unknown) {
    console.error('Error in ai-chat function:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      details: 'Check function logs for more information'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});