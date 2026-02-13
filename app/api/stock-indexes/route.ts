import { NextResponse } from 'next/server';
import yahooFinance from 'yahoo-finance2';

// @ts-ignore - yahoo-finance2 types are not fully compatible with strict mode
type Quote = {
  regularMarketPrice: number;
  regularMarketChange: number;
  regularMarketChangePercent: number;
  regularMarketPreviousClose: number;
};

export async function GET() {
  try {
    const symbols = [
      { symbol: '^KS11', name: 'KOSPI', country: 'Korea' },
      { symbol: '^KQ11', name: 'KOSDAQ', country: 'Korea' },
      { symbol: '^IXIC', name: 'NASDAQ', country: 'USA' },
      { symbol: '^GSPC', name: 'S&P 500', country: 'USA' },
      { symbol: '^DJI', name: 'Dow Jones', country: 'USA' },
    ];

    const results = await Promise.all(
      symbols.map(async (item) => {
        try {
          const quote = await yahooFinance.quote(item.symbol) as Quote;
          return {
            symbol: item.symbol,
            name: item.name,
            country: item.country,
            price: quote.regularMarketPrice || 0,
            change: quote.regularMarketChange || 0,
            changePercent: quote.regularMarketChangePercent || 0,
            previousClose: quote.regularMarketPreviousClose || 0,
          };
        } catch (error) {
          console.error(`Error fetching ${item.symbol}:`, error);
          // Return null but don't fail the entire request
          return null;
        }
      })
    );

    // Filter out null values
    const filteredResults = results.filter((r): r is NonNullable<typeof r> => r !== null);

    // If all failed, return error message
    if (filteredResults.length === 0) {
      return NextResponse.json({
        error: 'Unable to fetch stock data at this time',
        data: symbols.map((item) => ({
          symbol: item.symbol,
          name: item.name,
          country: item.country,
          price: 0,
          change: 0,
          changePercent: 0,
          previousClose: 0,
          error: true,
        }))
      }, { status: 200 });
    }

    return NextResponse.json(filteredResults);
  } catch (error) {
    console.error('Stock indexes API error:', error);
    return NextResponse.json({ error: 'Failed to fetch stock indexes', details: String(error) }, { status: 500 });
  }
}
