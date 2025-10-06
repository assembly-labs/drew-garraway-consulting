// Polygon API integration
const POLY_API_KEY = "z37IuRmsdR5bzP6L1Eg_u3SCSeW2vUaM";
const POLY_BASE_URL = "https://api.polygon.io/v2";

// Asset mappings
export const ASSET_NAMES = {
  // Cryptocurrencies
  "X:BTCUSD": "Bitcoin",
  "X:ETHUSD": "Ethereum",
  "X:DOGEUSD": "Dogecoin",
  "X:SOLUSD": "Solana",
  "X:ADAUSD": "Cardano",
  "X:XRPUSD": "XRP",
  "X:MATICUSD": "Polygon",

  // Tech Giants
  "AAPL": "Apple",
  "GOOGL": "Alphabet",
  "AMZN": "Amazon",
  "MSFT": "Microsoft",
  "NVDA": "NVIDIA",
  "TSLA": "Tesla",
  "META": "Meta",
  "AMD": "AMD",
  "INTC": "Intel",
  "CRM": "Salesforce",
  "NFLX": "Netflix",
  "ORCL": "Oracle",
  "UBER": "Uber",
  "SNAP": "Snapchat",
  "SQ": "Square/Block",

  // Traditional Blue Chips
  "JPM": "JPMorgan Chase",
  "BAC": "Bank of America",
  "WMT": "Walmart",
  "DIS": "Disney",
  "KO": "Coca-Cola",
  "MCD": "McDonald's",
  "V": "Visa",
  "MA": "Mastercard",

  // Meme Stocks
  "GME": "GameStop",
  "AMC": "AMC Entertainment",
  "BB": "BlackBerry",

  // Index Funds
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

    // Log the request details
    console.log('🔍 Fetching data:', {
      ticker,
      from,
      to,
      url: url.replace(POLY_API_KEY, 'API_KEY_HIDDEN')
    });

    const response = await fetch(url);

    // Log response status
    console.log('📡 Response status:', response.status, response.statusText);

    if (!response.ok) {
      console.error('❌ API Response Error:', {
        status: response.status,
        statusText: response.statusText,
        ticker,
        dateRange: `${from} to ${to}`
      });

      // Try to get error details
      try {
        const errorText = await response.text();
        console.error('Error response body:', errorText);
      } catch (e) {
        console.error('Could not read error response');
      }

      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    // Check content type
    const contentType = response.headers.get("content-type");
    console.log('📄 Content-Type:', contentType);

    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text();
      console.error('❌ Non-JSON response received:', text.substring(0, 500));
      throw new Error("API returned non-JSON response. Possible rate limit or invalid ticker.");
    }

    // Clone response to read it twice if needed
    const responseClone = response.clone();

    let data;
    try {
      data = await response.json();
      console.log('✅ JSON parsed successfully. Results count:', data.results?.length || 0);
    } catch (jsonError) {
      console.error('❌ JSON Parse Error:', jsonError);
      try {
        const text = await responseClone.text();
        console.error('Raw response (first 1000 chars):', text.substring(0, 1000));
      } catch (e) {
        console.error('Could not read response text');
      }
      throw new Error("Failed to parse API response - invalid JSON");
    }

    // Validate data structure
    if (!data.results || data.results.length === 0) {
      console.warn('⚠️ No results for:', {
        ticker,
        from,
        to,
        apiResponse: data
      });
      throw new Error(`No data available for ${ticker} from ${from} to ${to}`);
    }

    console.log('✅ Data fetched successfully:', {
      ticker,
      resultCount: data.results.length,
      firstDate: new Date(data.results[0].t).toISOString().slice(0, 10),
      lastDate: new Date(data.results[data.results.length - 1].t).toISOString().slice(0, 10)
    });

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
    console.error('🔥 fetchPriceData error:', error);
    return {
      success: false,
      error: error.message,
      results: []
    };
  }
}

// Calculate investment scenario
export function calculateScenario(priceData, initialAmount) {
  console.log('🧮 calculateScenario input:', {
    hasResults: !!priceData.results,
    resultCount: priceData.results?.length,
    initialAmount
  });

  if (!priceData.results || priceData.results.length === 0) {
    throw new Error("Invalid price data - no results");
  }

  const startPrice = priceData.results[0].close;
  const endPrice = priceData.results[priceData.results.length - 1].close;

  console.log('💵 Prices:', {
    startPrice,
    endPrice,
    priceChange: ((endPrice - startPrice) / startPrice * 100).toFixed(2) + '%'
  });

  if (startPrice <= 0 || endPrice <= 0) {
    console.error('❌ Invalid prices:', { startPrice, endPrice });
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