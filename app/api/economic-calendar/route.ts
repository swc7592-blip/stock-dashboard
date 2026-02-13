import { NextResponse } from 'next/server';

interface EconomicEvent {
  id: string;
  name: string;
  date: string;
  time: string;
  timeKST: string; // 한국 시간
  importance: 'high' | 'medium' | 'low';
  currency: string;
  previous: string;
  forecast: string;
  actual: string | null;
}

// Expanded mock data with more indicators
const MOCK_EVENTS: EconomicEvent[] = [
  {
    id: '1',
    name: 'Non-Farm Payrolls',
    date: '2026-02-13',
    time: '14:30', // US Eastern Time
    timeKST: '2026-02-14 04:30', // Korean Standard Time
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
    timeKST: '2026-02-14 04:30',
    importance: 'high',
    currency: 'USD',
    previous: '0.3%',
    forecast: '0.4%',
    actual: null,
  },
  {
    id: '3',
    name: 'Producer Price Index (PPI)',
    date: '2026-02-14',
    time: '08:30',
    timeKST: '2026-02-14 22:30',
    importance: 'high',
    currency: 'USD',
    previous: '0.2%',
    forecast: '0.3%',
    actual: null,
  },
  {
    id: '4',
    name: 'GDP (QoQ)',
    date: '2026-02-14',
    time: '08:30',
    timeKST: '2026-02-14 22:30',
    importance: 'high',
    currency: 'USD',
    previous: '2.1%',
    forecast: '2.3%',
    actual: null,
  },
  {
    id: '5',
    name: 'Fed Interest Rate Decision',
    date: '2026-02-16',
    time: '19:00',
    timeKST: '2026-02-17 09:00',
    importance: 'high',
    currency: 'USD',
    previous: '5.25%',
    forecast: '5.25%',
    actual: null,
  },
  {
    id: '6',
    name: 'ISM Manufacturing PMI',
    date: '2026-02-15',
    time: '10:00',
    timeKST: '2026-02-15 23:00',
    importance: 'high',
    currency: 'USD',
    previous: '50.0',
    forecast: '50.5',
    actual: null,
  },
  {
    id: '7',
    name: 'ISM Services PMI',
    date: '2026-02-16',
    time: '10:00',
    timeKST: '2026-02-16 23:00',
    importance: 'high',
    currency: 'USD',
    previous: '52.5',
    forecast: '53.0',
    actual: null,
  },
  {
    id: '8',
    name: 'Core Retail Sales',
    date: '2026-02-15',
    time: '08:30',
    timeKST: '2026-02-15 21:30',
    importance: 'medium',
    currency: 'USD',
    previous: '0.4%',
    forecast: '0.5%',
    actual: null,
  },
  {
    id: '9',
    name: 'Michigan Consumer Sentiment',
    date: '2026-02-16',
    time: '10:00',
    timeKST: '2026-02-16 23:00',
    importance: 'medium',
    currency: 'USD',
    previous: '80.0',
    forecast: '81.0',
    actual: null,
  },
  {
    id: '10',
    name: 'Housing Starts',
    date: '2026-02-17',
    time: '08:30',
    timeKST: '2026-02-17 21:30',
    importance: 'medium',
    currency: 'USD',
    previous: '1.4M',
    forecast: '1.5M',
    actual: null,
  },
  {
    id: '11',
    name: 'Consumer Confidence Index',
    date: '2026-02-18',
    time: '10:00',
    timeKST: '2026-02-18 23:00',
    importance: 'high',
    currency: 'USD',
    previous: '104.0',
    forecast: '106.0',
    actual: null,
  },
  {
    id: '12',
    name: 'Initial Jobless Claims',
    date: '2026-02-14',
    time: '08:30',
    timeKST: '2026-02-14 21:30',
    importance: 'medium',
    currency: 'USD',
    previous: '210K',
    forecast: '205K',
    actual: null,
  },
  {
    id: '13',
    name: 'Existing Home Sales',
    date: '2026-02-16',
    time: '10:00',
    timeKST: '2026-02-16 23:00',
    importance: 'medium',
    currency: 'USD',
    previous: '4.0M',
    forecast: '4.1M',
    actual: null,
  },
  {
    id: '14',
    name: 'Building Permits',
    date: '2026-02-17',
    time: '08:30',
    timeKST: '2026-02-17 21:30',
    importance: 'medium',
    currency: 'USD',
    previous: '1.5M',
    forecast: '1.6M',
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
  'Producer Price Index (PPI)': [
    { date: '2026-01-14', actual: '0.2%', forecast: '0.3%' },
    { date: '2025-12-13', actual: '0.3%', forecast: '0.2%' },
    { date: '2025-11-14', actual: '0.1%', forecast: '0.2%' },
    { date: '2025-10-11', actual: '0.3%', forecast: '0.2%' },
    { date: '2025-09-09', actual: '0.2%', forecast: '0.2%' },
  ],
  'ISM Manufacturing PMI': [
    { date: '2026-01-02', actual: '50.0', forecast: '50.5' },
    { date: '2025-12-02', actual: '51.2', forecast: '50.0' },
    { date: '2025-11-03', actual: '49.8', forecast: '50.0' },
    { date: '2025-10-01', actual: '50.5', forecast: '50.0' },
    { date: '2025-09-03', actual: '49.5', forecast: '50.0' },
  ],
  'Fed Interest Rate Decision': [
    { date: '2025-12-18', actual: '5.25%', forecast: '5.25%' },
    { date: '2025-11-07', actual: '5.25%', forecast: '5.25%' },
    { date: '2025-10-28', actual: '5.00%', forecast: '5.00%' },
    { date: '2025-09-18', actual: '5.00%', forecast: '5.00%' },
    { date: '2025-08-01', actual: '5.25%', forecast: '5.25%' },
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
