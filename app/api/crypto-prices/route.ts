import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd,krw&include_24hr_change=true',
      {
        next: { revalidate: 60 }, // Cache for 60 seconds
      }
    );

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch crypto prices' }, { status: 500 });
  }
}
