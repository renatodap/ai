import { kv } from '@vercel/kv';

export const config = {
  runtime: 'edge',
};

export default async function handler(_request) {
  try {
    // Fetch the cached news from Redis
    const news = await kv.get('velara_daily_news');
    
    // If no news exists (first run), return null
    if (!news) {
      return new Response(JSON.stringify([]), { status: 200 });
    }

    return new Response(JSON.stringify(news), {
      status: 200,
      headers: {
        'content-type': 'application/json',
        'Cache-Control': 's-maxage=60, stale-while-revalidate=300', // Cache at edge
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch news', message: error.message }), { status: 500 });
  }
}