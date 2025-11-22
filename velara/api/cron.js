import { kv } from '@vercel/kv';

export const config = {
  runtime: 'edge',
};

const SYSTEM_PROMPT = `
You are Velara, an elite AI news curator for the year 2026.

CRITICAL: Use web search to find REAL AI news from the last 24 hours. Search for:
- Latest AI model releases and breakthroughs
- Significant AI research papers or announcements
- Major AI company news (OpenAI, Anthropic, Google, Meta, etc.)
- AI policy, regulation, or societal impact stories
- Philosophical shifts in AI discourse

Identify the 3 MOST SIGNIFICANT real AI events/shifts from your search results.
Prioritize: Philosophical shifts > Model breakthroughs > Societal impact.

For each story, include the source URL in the content analysis.

Return strict JSON format like this:
[
  {
    "id": 1,
    "headline": "Short Headline (based on real news)",
    "tag": "CAT.001",
    "sub": "Subheading (actual event context)",
    "readTime": "04:00",
    "summary": "Direct Impact: What does this mean for the user? (Max 2 sentences, grounded in facts)",
    "content": "Deep philosophical analysis of the real news event. Include source URL. (Max 150 words)",
    "visualColor": "bg-[#ccff00]"
  }
]

Use these colors for visualColor: bg-[#ccff00] (Acid Lime), bg-[#ff4d00] (Orange), bg-[#e0e0e0] (Silver).
Distribute colors across the 3 articles for visual variety.
`;

// Helper function to call OpenRouter with a specific model
async function callOpenRouter(model, systemPrompt, userMessage) {
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://velara.app",
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage }
      ],
      response_format: { type: "json_object" }
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenRouter API error (${model}): ${error}`);
  }

  return response.json();
}

export default async function handler(request) {
  // Security check: Only allow Vercel Cron to run this
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  // Models to try in order (best to fallback)
  const models = [
    "openai/o3-deep-research",      // Always-on web search, best reasoning
    "perplexity/sonar-pro-search"   // Purpose-built for search, 200K context
  ];

  let lastError = null;
  const userMessage = `Generate the Velara Deck for ${new Date().toDateString()}.`;

  // Try each model in sequence until one succeeds
  for (const model of models) {
    try {
      console.log(`Attempting to generate news with model: ${model}`);

      const data = await callOpenRouter(model, SYSTEM_PROMPT, userMessage);
      let newsContent = data.choices[0].message.content;

      // Parse the JSON string from the AI
      const newsJson = JSON.parse(newsContent);
      const articles = newsJson.news || newsJson; // Handle if AI wraps it in a key

      // Validate we got 3 articles
      if (!Array.isArray(articles) || articles.length !== 3) {
        throw new Error(`Invalid response: expected 3 articles, got ${articles?.length || 0}`);
      }

      // Save to Vercel KV (Redis)
      await kv.set('velara_daily_news', articles);

      console.log(`Successfully generated news with model: ${model}`);
      return new Response(JSON.stringify({
        success: true,
        articles,
        model // Include which model was used
      }), {
        headers: { 'content-type': 'application/json' },
      });

    } catch (error) {
      console.error(`Model ${model} failed:`, error.message);
      lastError = error;
      // Continue to next model
    }
  }

  // All models failed
  return new Response(JSON.stringify({
    error: 'All models failed to generate news',
    lastError: lastError?.message
  }), {
    status: 500,
    headers: { 'content-type': 'application/json' }
  });
}