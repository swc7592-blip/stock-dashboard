/**
 * FRED API Integration for Economic Calendar
 *
 * This module fetches real economic data from the Federal Reserve Economic Data (FRED) API.
 * API Key required: https://fred.stlouisfed.org/docs/api/api_key.html
 *
 * Free tier: 120 requests per minute
 */

const FRED_API_BASE = 'https://api.stlouisfed.org/fred';
const FRED_API_KEY = process.env.FRED_API_KEY || '';

// Economic indicator series IDs on FRED
const SERIES_IDS: Record<string, string> = {
  // Employment
  'Non-Farm Payrolls': 'PAYEMS',
  'ADP Non-Farm Employment Change': 'CENCCV', // Alternative
  'Initial Jobless Claims': 'ICSA',

  // Price Indices
  'Consumer Price Index (CPI)': 'CPIAUCSL',
  'Producer Price Index (PPI)': 'PPIACO',

  // GDP
  'GDP': 'GDP',
  'GDP (YoY)': 'GDPC1',

  // Interest Rates
  'Fed Interest Rate Decision': 'FEDFUNDS',

  // Business Activity
  'ISM Manufacturing PMI': 'NAPM', // ISM Manufacturing PMI (old NAPM series)
  'ISM Services PMI': 'NAPM', // Note: Services PMI not directly available on FRED

  // Consumer Indicators
  'Consumer Confidence': 'UMCSENT', // University of Michigan Consumer Sentiment
  'Michigan Consumer Sentiment': 'UMCSENT',
  'Retail Sales': 'RSXFS', // Advance Retail Sales
  'Core Retail Sales': 'RSXFS', // Same as retail sales for FRED

  // Housing
  'Housing Starts': 'HOUST', // Housing Starts: Total
  'Building Permits': 'PERMIT', // Building Permits

  // Fed Balance Sheet
  'Federal Reserve Balance Sheet': 'WALCL', // Total Assets of the Federal Reserve
};

interface FREDObservation {
  date: string;
  value: string;
}

interface FREDSeriesResponse {
  seriess: Array<{
    id: string;
    title: string;
    observation_start: string;
    observation_end: string;
    frequency: string;
    units: string;
  }>;
}

interface FREDObservationsResponse {
  observations: FREDObservation[];
}

/**
 * Fetch observations from FRED API for a given series ID
 */
async function fetchObservations(
  seriesId: string,
  limit: number = 5
): Promise<FREDObservationsResponse> {
  if (!FRED_API_KEY) {
    throw new Error('FRED_API_KEY not set');
  }

  const url = `${FRED_API_BASE}/series/observations?series_id=${seriesId}&api_key=${FRED_API_KEY}&file_type=json&limit=${limit}&sort_order=desc`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`FRED API error: ${response.status}`);
  }

  return await response.json();
}

/**
 * Fetch series info from FRED API
 */
async function fetchSeriesInfo(seriesId: string): Promise<any> {
  if (!FRED_API_KEY) {
    throw new Error('FRED_API_KEY not set');
  }

  const url = `${FRED_API_BASE}/series?series_id=${seriesId}&api_key=${FRED_API_KEY}&file_type=json`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`FRED API error: ${response.status}`);
  }

  return await response.json();
}

/**
 * Get historical data for an economic indicator
 */
export async function getEconomicIndicatorHistory(
  indicatorName: string
): Promise<Array<{ date: string; actual: string; forecast: string }>> {
  try {
    const seriesId = SERIES_IDS[indicatorName];
    if (!seriesId) {
      console.warn(`No FRED series ID for indicator: ${indicatorName}`);
      return [];
    }

    const data = await fetchObservations(seriesId, 10);
    const seriesInfo = await fetchSeriesInfo(seriesId);

    // Get series metadata for formatting
    const series = seriesInfo?.seriess?.[0];
    const units = series?.units || '';
    const isPercent = units.toLowerCase().includes('percent') || units.toLowerCase().includes('%');
    const isThousands = units.toLowerCase().includes('thousands');
    const isMillions = units.toLowerCase().includes('millions');

    // Format values based on units
    const formatValue = (value: string): string => {
      const num = parseFloat(value);
      if (isNaN(num)) return value;

      if (isPercent) {
        return `${num.toFixed(1)}%`;
      }
      if (isThousands) {
        return `${(num / 1000).toFixed(0)}K`;
      }
      if (isMillions) {
        return `${num.toFixed(1)}M`;
      }
      // Default formatting
      return num.toLocaleString('en-US', { maximumFractionDigits: 1 });
    };

    return data.observations
      .filter((obs) => obs.value !== '.') // Filter out missing values
      .slice(0, 7) // Get up to 7 observations
      .map((obs) => ({
        date: obs.date,
        actual: formatValue(obs.value),
        forecast: '', // FRED doesn't provide forecasts
      }))
      .reverse(); // Return in chronological order
  } catch (error) {
    console.error(`Error fetching FRED data for ${indicatorName}:`, error);
    return [];
  }
}

/**
 * Get latest value for an economic indicator
 */
export async function getLatestIndicatorValue(
  indicatorName: string
): Promise<{ actual: string | null; date: string | null }> {
  try {
    const seriesId = SERIES_IDS[indicatorName];
    if (!seriesId) {
      return { actual: null, date: null };
    }

    const data = await fetchObservations(seriesId, 1);

    if (data.observations.length === 0 || data.observations[0].value === '.') {
      return { actual: null, date: null };
    }

    const obs = data.observations[0];
    const seriesInfo = await fetchSeriesInfo(seriesId);
    const series = seriesInfo?.seriess?.[0];
    const units = series?.units || '';

    const formatValue = (value: string): string => {
      const num = parseFloat(value);
      if (isNaN(num)) return value;

      const isPercent = units.toLowerCase().includes('percent') || units.toLowerCase().includes('%');
      const isThousands = units.toLowerCase().includes('thousands');
      const isMillions = units.toLowerCase().includes('millions');

      if (isPercent) {
        return `${num.toFixed(1)}%`;
      }
      if (isThousands) {
        return `${(num / 1000).toFixed(0)}K`;
      }
      if (isMillions) {
        return `${num.toFixed(1)}M`;
      }
      return num.toLocaleString('en-US', { maximumFractionDigits: 1 });
    };

    return {
      actual: formatValue(obs.value),
      date: obs.date,
    };
  } catch (error) {
    console.error(`Error fetching latest value for ${indicatorName}:`, error);
    return { actual: null, date: null };
  }
}

/**
 * Check if FRED API is available
 */
export function isFredApiAvailable(): boolean {
  return !!FRED_API_KEY;
}

/**
 * Get list of available indicators with their FRED series IDs
 */
export function getAvailableIndicators(): Record<string, string> {
  return SERIES_IDS;
}
