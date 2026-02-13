import { NextResponse } from 'next/server';

interface EconomicEvent {
  id: string;
  name: string;
  date: string;
  time: string; // US Eastern Time
  timeKST: string; // 한국 시간
  importance: 'high' | 'medium' | 'low';
  currency: string;
  previous: string;
  forecast: string;
  actual: string | null;
}

// Helper function to convert EST (UTC-5) to KST (UTC+9)
const convertESTToKST = (estTime: string, estDate: Date): string => {
  const [hours, minutes] = estTime.split(':').map(Number);
  const estDateUtc = Date.UTC(estDate.getUTCFullYear(), estDate.getUTCMonth(), estDate.getUTCDate(), hours - 5, minutes, 0, 0);
  const kstDate = new Date(estDateUtc.getTime() + 14 * 60 * 60 * 1000);
  const kstHours = kstDate.getUTCHours().toString().padStart(2, '0');
  const kstMinutes = kstDate.getUTCMinutes().toString().padStart(2, '0');
  const kstDay = kstDate.getUTCDate().toString().padStart(2, '0');
  const kstMonth = (kstDate.getUTCMonth() + 1).toString().padStart(2, '0');
  const kstYear = kstDate.getUTCFullYear();
  return `${kstYear}-${kstMonth}-${kstDay} ${kstHours}:${kstMinutes}`;
};

// Get today's date and calculate relative dates
const getToday = (): string => {
  const now = new Date();
  return now.toISOString().split('T')[0];
};

const addDays = (days: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
};

const addWeeks = (weeks: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + (weeks * 7));
  return date.toISOString().split('T')[0];
};

// Generate dynamic economic events
const generateEconomicEvents = (): EconomicEvent[] => {
  const today = getToday();
  const tomorrow = addDays(1);
  const todayDate = new Date(today);

  // Define indicator patterns with their release schedules
  const patterns = [
    {
      id: '1',
      name: 'Non-Farm Payrolls',
      dayOffset: 0, // 1st Friday of the month
      time: '08:30',
      currency: 'USD',
      previous: '185K',
      forecast: '170K',
      actual: null,
      importance: 'high',
    },
    {
      id: '2',
      name: 'Consumer Price Index (CPI)',
      dayOffset: 0, // Around 2nd week of the month
      time: '08:30',
      currency: 'USD',
      previous: '0.3%',
      forecast: '0.4%',
      actual: null,
      importance: 'high',
    },
    {
      id: '3',
      name: 'Producer Price Index (PPI)',
      dayOffset: -14, // Around 2nd week of previous month
      time: '08:30',
      currency: 'USD',
      previous: '0.2%',
      forecast: '0.3%',
      actual: '0.3%',
      actual: '0.3%',
      importance: 'high',
    },
    {
      id: '4',
      name: 'GDP',
      dayOffset: 0, // 1st release (advance)
      time: '08:30',
      currency: 'USD',
      previous: '2.1%',
      forecast: '2.3%',
      actual: null,
      importance: 'high',
    },
    {
      id: '5',
      name: 'ISM Manufacturing PMI',
      dayOffset: 1, // 1st business day of the month
      time: '10:00',
      currency: 'USD',
      previous: '50.0',
      forecast: '50.5',
      actual: null,
      importance: 'high',
    },
    {
      id: '6',
      name: 'ISM Services PMI',
      dayOffset: 3, // 3rd business day of the month
      time: '10:00',
      currency: 'USD',
      previous: '52.5',
      forecast: '53.0',
      actual: null,
      importance: 'high',
    },
    {
      id: '7',
      name: 'ADP Non-Farm Employment Change',
      dayOffset: 7, // 2nd Wednesday of the month
      time: '08:30',
      currency: 'USD',
      previous: '185K',
      forecast: '170K',
      actual: null,
      importance: 'high',
    },
    {
      id: '8',
      name: 'Retail Sales',
      dayOffset: 14, // Mid-month
      time: '08:30',
      currency: 'USD',
      previous: '4.0%',
      forecast: '4.1%',
      actual: null,
      importance: 'medium',
    },
    {
      id: '9',
      name: 'Consumer Confidence',
      dayOffset: 28, // Last business day of the month
      time: '10:00',
      currency: 'USD',
      previous: '104.0',
      forecast: '106.0',
      actual: null,
      importance: 'high',
    },
    {
      id: '10',
      name: 'Michigan Consumer Sentiment',
      dayOffset: 14, // Mid-month
      time: '10:00',
      currency: 'USD',
      previous: '80.0',
      forecast: '81.0',
      actual: null,
      importance: 'medium',
    },
    {
      id: '11',
      name: 'Housing Starts',
      dayOffset: 17, // Around mid-month
      time: '08:30',
      currency: 'USD',
      previous: '1.4M',
      forecast: '1.5M',
      actual: null,
      importance: 'medium',
    },
    {
      id: '12',
      name: 'Building Permits',
      dayOffset: 17, // Around mid-month
      time: '08:30',
      currency: 'USD',
      previous: '1.5M',
      forecast: '1.6M',
      actual: null,
      importance: 'medium',
    },
    {
      id: '13',
      name: 'Initial Jobless Claims',
      dayOffset: 6, // Thursday
      time: '08:30',
      currency: 'USD',
      previous: '210K',
      forecast: '205K',
      actual: null,
      importance: 'medium',
    },
    {
      id: '14',
      name: 'Existing Home Sales',
      dayOffset: 24, // Last business day of the month
      time: '10:00',
      currency: 'USD',
      previous: '4.0M',
      forecast: '4.1M',
      actual: null,
      importance: 'medium',
    },
  ];

  // Generate events with dynamic dates
  return patterns.map((pattern) => {
    const eventDate = addDays(pattern.dayOffset);
    const eventDateObj = new Date(eventDate);
    const eventTimeKST = convertESTToKST(pattern.time, eventDateObj);

    return {
      id: pattern.id,
      name: pattern.name,
      date: eventDate,
      time: pattern.time,
      timeKST: eventTimeKST,
      importance: pattern.importance as 'high' | 'medium' | 'low',
      currency: pattern.currency,
      previous: pattern.previous,
      forecast: pattern.forecast,
      actual: pattern.actual,
    };
  });
};

// Historical data for detailed view (mock data)
const MOCK_HISTORY: Record<string, Array<{ date: string; actual: string; forecast: string }>> = {
  'Non-Farm Payrolls': [
    { date: '2025-12-05', actual: '185K', forecast: '170K' },
    { date: '2025-11-07', actual: '227K', forecast: '200K' },
    { date: '2025-10-03', actual: '12K', forecast: '180K' },
    { date: '2025-09-05', actual: '254K', forecast: '150K' },
    { date: '2025-08-01', actual: '142K', forecast: '165K' },
    { date: '2025-07-04', actual: '114K', forecast: '175K' },
  ],
  'Consumer Price Index (CPI)': [
    { date: '2025-12-12', actual: '0.3%', forecast: '0.4%' },
    { date: '2025-11-13', actual: '0.4%', forecast: '0.3%' },
    { date: '2025-10-14', actual: '0.2%', forecast: '0.3%' },
    { date: '2025-09-12', actual: '0.4%', forecast: '0.3%' },
    { date: '2025-08-12', actual: '0.3%', forecast: '0.3%' },
  ],
  'Producer Price Index (PPI)': [
    { date: '2026-01-14', actual: '0.2%', forecast: '0.3%' },
    { date: '2025-12-13', actual: '0.3%', forecast: '0.2%' },
    { date: '2025-11-14', actual: '0.1%', forecast: '0.2%' },
    { date: '2025-10-11', actual: '0.3%', forecast: '0.2%' },
    { date: '2025-09-09', actual: '0.2%', forecast: '0.2%' },
  ],
  'GDP': [
    { date: '2025-10-30', actual: '2.1%', forecast: '2.0%' },
    { date: '2025-07-27', actual: '2.5%', forecast: '2.4%' },
    { date: '2025-04-25', actual: '2.2%', forecast: '2.1%' },
    { date: '2025-01-27', actual: '2.6%', forecast: '2.5%' },
    { date: '2024-10-25', actual: '2.3%', forecast: '2.2%' },
  ],
  'ISM Manufacturing PMI': [
    { date: '2026-01-02', actual: '50.0', forecast: '50.5' },
    { date: '2025-12-02', actual: '51.2', forecast: '50.0' },
    { date: '2025-11-03', actual: '49.8', forecast: '50.0' },
    { date: '2025-10-01', actual: '50.5', forecast: '50.0' },
    { date: '2025-09-03', actual: '49.5', forecast: '50.0' },
  ],
  'ISM Services PMI': [
    { date: '2026-01-05', actual: '52.5', forecast: '53.0' },
    { date: '2025-12-05', actual: '52.0', forecast: '52.5' },
    { date: '2025-11-06', actual: '53.2', forecast: '53.0' },
    { date: '2025-10-05', actual: '52.8', forecast: '52.5' },
    { date: '2025-09-05', actual: '52.3', forecast: '52.5' },
  ],
  'ADP Non-Farm Employment Change': [
    { date: '2026-01-07', actual: '185K', forecast: '170K' },
    { date: '2025-12-08', actual: '227K', forecast: '200K' },
    { date: '2025-11-06', actual: '12K', forecast: '180K' },
    { date: '2025-10-07', actual: '254K', forecast: '150K' },
    { date: '2025-09-08', actual: '142K', forecast: '165K' },
  ],
  'Retail Sales': [
    { date: '2026-01-15', actual: '4.0%', forecast: '4.1%' },
    { date: '2025-12-15', actual: '4.2%', forecast: '4.0%' },
    { date: '2025-11-15', actual: '3.8%', forecast: '4.0%' },
    { date: '2025-10-15', actual: '4.1%', forecast: '4.0%' },
    { date: '2025-09-15', actual: '4.0%', forecast: '4.0%' },
  ],
  'Consumer Confidence': [
    { date: '2026-01-20', actual: '104.0', forecast: '106.0' },
    { date: '2025-12-22', actual: '102.0', forecast: '104.0' },
    { date: '2025-11-20', actual: '100.0', forecast: '102.0' },
    { date: '2025-10-22', actual: '105.0', forecast: '104.0' },
    { date: '2025-09-20', actual: '103.0', forecast: '104.0' },
  ],
  'Michigan Consumer Sentiment': [
    { date: '2026-01-15', actual: '80.0', forecast: '81.0' },
    { date: '2025-12-15', actual: '79.0', forecast: '80.0' },
    { date: '2025-11-15', actual: '82.0', forecast: '80.0' },
    { date: '2025-10-15', actual: '80.0', forecast: '80.0' },
    { date: '2025-09-15', actual: '78.0', forecast: '80.0' },
  ],
  'Housing Starts': [
    { date: '2026-01-17', actual: '1.4M', forecast: '1.5M' },
    { date: '2025-12-17', actual: '1.6M', forecast: '1.5M' },
    { date: '2025-11-17', actual: '1.5M', forecast: '1.4M' },
    { date: '2025-10-17', actual: '1.6M', forecast: '1.5M' },
    { date: '2025-09-17', actual: '1.7M', forecast: '1.6M' },
  ],
  'Building Permits': [
    { date: '2026-01-17', actual: '1.5M', forecast: '1.6M' },
    { date: '2025-12-17', actual: '1.7M', forecast: '1.5M' },
    { date: '2025-11-17', actual: '1.5M', forecast: '1.6M' },
    { date: '2025-10-17', actual: '1.6M', forecast: '1.5M' },
    { date: '2025-09-17', actual: '1.8M', forecast: '1.7M' },
  ],
  'Initial Jobless Claims': [
    { date: '2026-01-14', actual: '210K', forecast: '205K' },
    { date: '2025-12-15', actual: '220K', forecast: '215K' },
    { date: '2025-11-13', actual: '215K', forecast: '210K' },
    { date: '2025-10-14', actual: '225K', forecast: '220K' },
    { date: '2025-09-15', actual: '208K', forecast: '210K' },
  ],
  'Federal Reserve Balance Sheet': [
    { date: '2025-12-20', actual: '$7.4T', forecast: '$7.5T' },
    { date: '2025-11-20', actual: '$7.5T', forecast: '$7.4T' },
    { date: '2025-10-20', actual: '$7.3T', forecast: '$7.5T' },
    { date: '2025-09-20', actual: '$7.6T', forecast: '$7.4T' },
    { date: '2025-08-20', actual: '$7.5T', forecast: '$7.3T' },
  ],
  'Core Retail Sales': [
    { date: '2026-01-16', actual: '0.4%', forecast: '0.5%' },
    { date: '2025-12-16', actual: '0.5%', forecast: '0.4%' },
    { date: '2025-11-16', actual: '0.3%', forecast: '0.4%' },
    { date: '2025-10-16', actual: '0.4%', forecast: '0.4%' },
    { date: '2025-09-16', actual: '0.5%', forecast: '0.4%' },
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

  // Generate events dynamically
  const dynamicEvents = generateEconomicEvents();

  // Filter for high importance (3-star)
  const highImportanceEvents = dynamicEvents.filter(
    (event) => event.importance === 'high'
  );

  // Group by period
  const today = getToday();
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
    generatedAt: new Date().toISOString(),
  });
}
