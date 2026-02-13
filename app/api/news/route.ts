import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Fetch crypto news from CoinGecko
    const response = await fetch('https://api.coingecko.com/api/v3/news', {
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!response.ok) {
      throw new Error(`CoinGecko News API failed: ${response.status}`);
    }

    const data = await response.json();

    // Filter for relevant news (MicroStrategy, Bitcoin, Ethereum, Mining)
    const filteredNews = data.data
      ? data.data
          .filter((item: any) => {
            const title = item.title.toLowerCase();
            const description = item.description?.toLowerCase() || '';
            const keywords = [
              'microstrategy',
              'bitmine',
              'bitcoin',
              'ethereum',
              'mining',
              'crypto',
              'mstr',
              'btc',
              'eth',
            ];
            return keywords.some((keyword) =>
              title.includes(keyword) || description.includes(keyword)
            );
          })
          .slice(0, 10) // Get only top 10 news
          .map((item: any) => ({
            title: item.title,
            description: (item.description?.slice(0, 200) || '') + '...',
            url: item.url,
            published_at: item.published_at,
            thumbnail: item.thumb || null,
          }))
      : [];

    return NextResponse.json(filteredNews);
  } catch (error) {
    console.error('News API error:', error);
    return NextResponse.json([], { status: 200 });
  }
}
