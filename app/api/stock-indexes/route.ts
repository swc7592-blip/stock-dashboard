import { NextResponse } from 'next/server';
import yahooFinance from 'yahoo-finance2';

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
          const quote = await yahooFinance.quote(item.symbol);
          return {
            symbol: item.symbol,
            name: item.name,
            country: item.country,
            price: quote.regularMarketPrice,
            change: quote.regularMarketChange,
            changePercent: quote.regularMarketChangePercent,
            previousClose: quote.regularMarketPreviousClose,
          };
        } catch (error) {
          console.error(`Error fetching ${item.symbol}:`, error);
          return null;
        }
      })
    );

    const filteredResults = results.filter((r) => r !== null);

    return NextResponse.json(filteredResults);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch stock indexes' }, { status: 500 });
  }
}
