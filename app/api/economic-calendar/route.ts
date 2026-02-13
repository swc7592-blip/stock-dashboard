import { NextResponse } from 'next/server';

interface EconomicEvent {
  id: string;
  name: string;
  date: string;
  time: string;
  importance: 'high' | 'medium' | 'low';
  currency: string;
  previous: string;
  forecast: string;
  actual: string | null;
}

// Mock data for demonstration (replace with real API call)
const MOCK_EVENTS: EconomicEvent[] = [
  {
    id: '1',
    name: 'Non-Farm Payrolls',
    date: '2026-02-13',
    time: '14:30',
    importance: 'high',
    currency: 'USD',
    previous: '185K',
    forecast: '170K',
    actual: null,
  },
  {
    id: '2',
    name: 'Consumer Price Index (CPI)',
    date: '2026-02-13',
    time: '14:30',
    importance: 'high',
    currency: 'USD',
    previous: '0.3%',
    forecast: '0.4%',
    actual: null,
  },
  {
    id: '3',
    name: 'GDP (QoQ)',
    date: '2026-02-14',
    time: '08:30',
    importance: 'high',
    currency: 'USD',
    previous: '2.1%',
    forecast: '2.3%',
    actual: null,
  },
  {
    id: '4',
    name: 'Fed Interest Rate Decision',
    date: '2026-02-16',
    time: '19:00',
    importance: 'high',
    currency: 'USD',
    previous: '5.25%',
    forecast: '5.25%',
    actual: null,
  },
];

// Historical data for detailed view
const MOCK_HISTORY: Record<string, Array<{ date: string; actual: string; forecast: string }>> = {
  'Non-Farm Payrolls': [
    { date: '2026-01-10', actual: '185K', forecast: '170K' },
    { date: '2025-12-06', actual: '227K', forecast: '200K' },
    { date: '2025-11-01', actual: '12K', forecast: '180K' },
    { date: '2025-10-04', actual: '254K', forecast: '150K' },
    { date: '2025-09-06', actual: '142K', forecast: '165K' },
    { date: '2025-08-02', actual: '114K', forecast: '175K' },
  ],
  'Consumer Price Index (CPI)': [
    { date: '2026-01-15', actual: '0.3%', forecast: '0.4%' },
    { date: '2025-12-12', actual: '0.4%', forecast: '0.3%' },
    { date: '2025-11-13', actual: '0.2%', forecast: '0.3%' },
    { date: '2025-10-10', actual: '0.4%', forecast: '0.3%' },
    { date: '2025-09-12', actual: '0.3%', forecast: '0.3%' },
  ],
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const period = (searchParams.get('period') as string) || 'daily';
  const indicator = searchParams.get('indicator');

  // If specific indicator is requested, return its history
  if (indicator) {
    const history = MOCK_HISTORY[indicator] || [];
    return NextResponse.json({
      indicator,
      history,
    });
  }

  // Filter events based on importance (3-star = high)
  const highImportanceEvents = MOCK_EVENTS.filter(
    (event) => event.importance === 'high'
  );

  // Group by period
  const today = new Date().toISOString().split('T')[0];
  let events: EconomicEvent[] = [];

  switch (period) {
    case 'daily':
      // Events for today
      events = highImportanceEvents.filter((e) => e.date === today);
      break;
    case 'weekly':
      // Events for the next 7 days
      const weekFromNow = new Date();
      weekFromNow.setDate(weekFromNow.getDate() + 7);
      events = highImportanceEvents.filter(
        (e) => e.date >= today && e.date <= weekFromNow.toISOString().split('T')[0]
      );
      break;
    case 'monthly':
      // Events for the next 30 days
      const monthFromNow = new Date();
      monthFromNow.setDate(monthFromNow.getDate() + 30);
      events = highImportanceEvents.filter(
        (e) => e.date >= today && e.date <= monthFromNow.toISOString().split('T')[0]
      );
      break;
    default:
      events = highImportanceEvents;
  }

  return NextResponse.json({
    period,
    events,
    count: events.length,
  });
}
