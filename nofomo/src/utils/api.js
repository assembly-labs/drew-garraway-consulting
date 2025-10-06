// Polygon API integration
const POLY_API_KEY = "z37IuRmsdR5bzP6L1Eg_u3SCSeW2vUaM";
const POLY_BASE_URL = "https://api.polygon.io/v2";

// Asset mappings
export const ASSET_NAMES = {
  "X:BTCUSD": "Bitcoin",
  "X:ETHUSD": "Ethereum",
  "AAPL": "Apple",
  "GOOGL": "Alphabet",
  "AMZN": "Amazon",
  "MSFT": "Microsoft",
  "NVDA": "NVIDIA",
  "TSLA": "Tesla",
  "META": "Meta",
  "SPY": "S&P 500",
  "QQQ": "Nasdaq-100",
};

// Helper to format dates for Polygon API
function toISODate(date) {
  const d = new Date(date);
  return d.toISOString().slice(0, 10);
}

// Fetch monthly price data from Polygon
export async function fetchPriceData(ticker, fromDate, toDate) {
  try {
    const from = toISODate(fromDate);
    const to = toDate ? toISODate(toDate) : toISODate(new Date());

    const url = `${POLY_BASE_URL}/aggs/ticker/${encodeURIComponent(ticker)}/range/1/month/${from}/${to}?apiKey=${POLY_API_KEY}&adjusted=true&sort=asc&limit=50000`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      throw new Error("No data available for this date range");
    }

    // Transform data for our app
    return {
      success: true,
      results: data.results.map(point => ({
        timestamp: point.t,
        date: new Date(point.t).toISOString().slice(0, 7), // YYYY-MM format
        open: point.o,
        high: point.h,
        low: point.l,
        close: point.c,
        volume: point.v,
      })),
      ticker: ticker,
      assetName: ASSET_NAMES[ticker] || ticker,
    };
  } catch (error) {
    console.error('API Error:', error);
    return {
      success: false,
      error: error.message,
      results: []
    };
  }
}

// Calculate investment scenario
export function calculateScenario(priceData, initialAmount) {
  if (!priceData.results || priceData.results.length === 0) {
    throw new Error("Invalid price data");
  }

  const startPrice = priceData.results[0].close;
  const endPrice = priceData.results[priceData.results.length - 1].close;

  if (startPrice <= 0 || endPrice <= 0) {
    throw new Error("Invalid pricing data");
  }

  const shares = initialAmount / startPrice;
  const currentValue = shares * endPrice;
  const profit = currentValue - initialAmount;
  const profitPct = (profit / initialAmount) * 100;

  // Calculate time period
  const startDate = new Date(priceData.results[0].timestamp);
  const endDate = new Date(priceData.results[priceData.results.length - 1].timestamp);
  const years = (endDate - startDate) / (365.25 * 24 * 60 * 60 * 1000);

  // Build chart data
  const chartData = priceData.results.map(point => ({
    date: point.date,
    value: shares * point.close,
    price: point.close,
  }));

  return {
    ticker: priceData.ticker,
    assetName: priceData.assetName,
    initialAmount,
    currentValue,
    profit,
    profitPct,
    shares,
    startPrice,
    endPrice,
    startDate: priceData.results[0].date,
    endDate: priceData.results[priceData.results.length - 1].date,
    years,
    chartData,
    mode: profit >= 0 ? 'profit' : 'loss'
  };
}