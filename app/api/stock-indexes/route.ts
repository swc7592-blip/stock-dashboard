import { NextResponse } from 'next/server';

// Fallback data when API fails
const FALLBACK_DATA = [
  { symbol: '^KS11', name: 'KOSPI', country: 'Korea', price: 0, change: 0, changePercent: 0, previousClose: 0, fallback: true },
  { symbol: '^KQ11', name: 'KOSDAQ', country: 'Korea', price: 0, change: 0, changePercent: 0, previousClose: 0, fallback: true },
  { symbol: '^IXIC', name: 'NASDAQ', country: 'USA', price: 0, change: 0, changePercent: 0, previousClose: 0, fallback: true },
  { symbol: '^GSPC', name: 'S&P 500', country: 'USA', price: 0, change: 0, changePercent: 0, previousClose: 0, fallback: true },
  { symbol: '^DJI', name: 'Dow Jones', country: 'USA', price: 0, change: 0, changePercent: 0, previousClose: 0, fallback: true },
];

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
          // Use public Yahoo Finance API
          const response = await fetch(
            `https://query1.finance.yahoo.com/v8/finance/chart/${item.symbol}?interval=1d&range=1d`,
            {
              headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
              },
              // Timeout after 10 seconds
              signal: AbortSignal.timeout(10000),
            }
          );

          if (!response.ok) {
            throw new Error(`Yahoo API failed: ${response.status}`);
          }

          const data = await response.json();
          const result = data.chart.result[0];
          const meta = result.meta;
          const quote = result.indicators.quote[0];

          const price = meta.regularMarketPrice || 0;
          const previousClose = meta.previousClose || 0;
          const change = price - previousClose;
          const changePercent = previousClose > 0 ? (change / previousClose) * 100 : 0;

          return {
            symbol: item.symbol,
            name: item.name,
            country: item.country,
            price,
            change,
            changePercent,
            previousClose,
          };
        } catch (error) {
          console.error(`Error fetching ${item.symbol}:`, error);
          // Return null to filter out failed requests
          return null;
        }
      })
    );

    // Filter out null values
    const filteredResults = results.filter((r): r is NonNullable<typeof r> => r !== null);

    // If all failed, return fallback data
    if (filteredResults.length === 0) {
      console.log('All stock APIs failed, using fallback data');
      return NextResponse.json(FALLBACK_DATA);
    }

    return NextResponse.json(filteredResults);
  } catch (error) {
    console.error('Stock indexes API error:', error);
    // Return fallback data on any error
    return NextResponse.json(FALLBACK_DATA);
  }
}
