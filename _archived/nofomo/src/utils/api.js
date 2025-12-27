// Import configuration
import { API_CONFIG } from '../config';

// Polygon API configuration from config file
const POLY_API_KEY = API_CONFIG.POLYGON.API_KEY;
const POLY_BASE_URL = API_CONFIG.POLYGON.BASE_URL;

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

// Validate price data for anomalies and potential splits
function validatePriceData(results) {
  const warnings = [];
  const potentialSplits = [];

  for (let i = 1; i < results.length; i++) {
    const prev = results[i - 1];
    const curr = results[i];

    // Calculate price change percentage
    const priceChange = (curr.c - prev.c) / prev.c;
    const volumeChange = curr.v / prev.v;

    // Detect potential stock splits (price drops significantly but volume spikes)
    if (priceChange < -0.4 && volumeChange > 1.5) {
      // Likely a split event
      const splitRatio = Math.round(prev.c / curr.c);
      potentialSplits.push({
        date: new Date(curr.t).toISOString().slice(0, 10),
        priceChange: (priceChange * 100).toFixed(2) + '%',
        volumeChange: volumeChange.toFixed(2) + 'x',
        estimatedRatio: splitRatio,
        prevClose: prev.c,
        currClose: curr.c
      });
      warnings.push(`Potential ${splitRatio}-for-1 split detected on ${new Date(curr.t).toISOString().slice(0, 10)}`);
    }

    // Detect other anomalies
    if (Math.abs(priceChange) > 0.5) {
      warnings.push(`Large price change (${(priceChange * 100).toFixed(1)}%) on ${new Date(curr.t).toISOString().slice(0, 10)}`);
    }

    // Check for data gaps
    const timeDiff = curr.t - prev.t;
    const expectedDiff = 30 * 24 * 60 * 60 * 1000; // ~30 days in ms
    if (timeDiff > expectedDiff * 2) {
      warnings.push(`Data gap detected between ${new Date(prev.t).toISOString().slice(0, 10)} and ${new Date(curr.t).toISOString().slice(0, 10)}`);
    }
  }

  return {
    warnings,
    potentialSplits,
    isLikelyAdjusted: potentialSplits.length === 0, // If no splits detected, data might be pre-adjusted
    dataPoints: results.length
  };
}

// Fetch monthly price data from Polygon
export async function fetchPriceData(ticker, fromDate, toDate) {
  try {
    const from = toISODate(fromDate);
    const to = toDate ? toISODate(toDate) : toISODate(new Date());

    const url = `${POLY_BASE_URL}/aggs/ticker/${encodeURIComponent(ticker)}/range/1/month/${from}/${to}?apiKey=${POLY_API_KEY}&adjusted=true&sort=asc&limit=50000`;

    // Enhanced logging for debugging
    console.log('🔍 Fetching data:', {
      ticker,
      from,
      to,
      adjusted: true,
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

    // Check if the returned data matches requested date range
    const returnedStartDate = new Date(data.results[0].t).toISOString().slice(0, 10);
    const returnedEndDate = new Date(data.results[data.results.length - 1].t).toISOString().slice(0, 10);

    // Enhanced diagnostic logging
    console.log('✅ Data fetched successfully:', {
      ticker,
      resultCount: data.results.length,
      requestedStart: from,
      returnedStart: returnedStartDate,
      requestedEnd: to,
      returnedEnd: returnedEndDate,
      adjusted: data.adjusted || 'not specified',
      queryCount: data.queryCount,
      resultsCount: data.resultsCount
    });

    // CRITICAL: Check if API returned data from a different time period
    const requestedStartTime = new Date(from).getTime();
    const returnedStartTime = data.results[0].t;
    const daysDifference = Math.abs(returnedStartTime - requestedStartTime) / (1000 * 60 * 60 * 24);

    if (daysDifference > 365) {
      console.error('🚨 CRITICAL: API returned data from wrong time period!', {
        requested: from,
        received: returnedStartDate,
        daysDifference: Math.round(daysDifference),
        yearsDifference: (daysDifference / 365).toFixed(1)
      });

      // For crypto, Polygon free tier only has recent data (2023+)
      if (ticker.startsWith('X:')) {
        throw new Error(`Historical crypto data from ${from} is not available on this API plan. Data starts from October 2023. Please choose a more recent date.`);
      } else {
        throw new Error(`API returned data from ${returnedStartDate} instead of ${from}. This ticker may not have data for the requested date.`);
      }
    }

    // Log first and last few data points for verification
    console.log('📊 Sample data points:', {
      first3: data.results.slice(0, 3).map(p => ({
        date: new Date(p.t).toISOString().slice(0, 10),
        close: p.c,
        volume: p.v
      })),
      last3: data.results.slice(-3).map(p => ({
        date: new Date(p.t).toISOString().slice(0, 10),
        close: p.c,
        volume: p.v
      }))
    });

    // Validate data for potential issues
    const validation = validatePriceData(data.results);
    if (validation.warnings.length > 0) {
      console.warn('⚠️ Data validation warnings:', validation);
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
      validation: validation,
      apiMetadata: {
        adjusted: data.adjusted,
        queryCount: data.queryCount,
        resultsCount: data.resultsCount
      }
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

// Fetch stock splits from Polygon
export async function fetchStockSplits(ticker, fromDate, toDate) {
  try {
    const from = toISODate(fromDate);
    const to = toDate ? toISODate(toDate) : toISODate(new Date());

    // Remove the "X:" prefix for crypto tickers when fetching splits
    const splitTicker = ticker.startsWith('X:') ? ticker.substring(2) : ticker;

    const url = `https://api.polygon.io/v3/reference/splits?ticker=${encodeURIComponent(splitTicker)}&execution_date.gte=${from}&execution_date.lte=${to}&limit=100&apiKey=${POLY_API_KEY}`;

    console.log('🔄 Fetching stock splits:', {
      ticker: splitTicker,
      from,
      to
    });

    const response = await fetch(url);

    if (!response.ok) {
      console.warn('⚠️ Could not fetch splits:', response.status);
      return { success: true, splits: [] }; // Don't fail, just return empty
    }

    const data = await response.json();

    if (data.results && data.results.length > 0) {
      console.log('✂️ Splits found:', data.results.map(s => ({
        date: s.execution_date,
        ratio: `${s.split_to}:${s.split_from}`
      })));

      return {
        success: true,
        splits: data.results.map(split => ({
          date: split.execution_date,
          ratio: split.split_to / split.split_from, // Convert to multiplier
          from: split.split_from,
          to: split.split_to
        }))
      };
    }

    return { success: true, splits: [] };
  } catch (error) {
    console.error('Error fetching splits:', error);
    return { success: true, splits: [] }; // Don't fail the main flow
  }
}

// Calculate shares with split adjustments
export function calculateSharesWithSplits(initialAmount, priceData, splits) {
  console.log('💱 Calculating shares with splits:', {
    initialAmount,
    dataPoints: priceData.length,
    splits: splits.length
  });

  if (!priceData || priceData.length === 0) {
    throw new Error("No price data available");
  }

  const startPrice = priceData[0].close;
  let currentShares = initialAmount / startPrice;

  // Build enhanced data with split-adjusted shares
  const enhancedData = priceData.map((point, index) => {
    // Check if any splits occurred before this date
    const applicableSplits = splits.filter(s =>
      new Date(s.date) <= new Date(point.timestamp) &&
      new Date(s.date) > new Date(priceData[0].timestamp)
    );

    // Calculate cumulative split multiplier
    let splitMultiplier = 1;
    for (const split of applicableSplits) {
      splitMultiplier *= split.ratio;
    }

    const adjustedShares = currentShares * splitMultiplier;
    const value = adjustedShares * point.close;

    // Log significant split events
    if (index > 0 && splitMultiplier !== 1) {
      const prevPoint = priceData[index - 1];
      const prevSplits = splits.filter(s =>
        new Date(s.date) <= new Date(prevPoint.timestamp) &&
        new Date(s.date) > new Date(priceData[0].timestamp)
      );
      const prevMultiplier = prevSplits.reduce((acc, s) => acc * s.ratio, 1);

      if (splitMultiplier !== prevMultiplier) {
        console.log(`🔀 Split applied at ${point.date}: ${splitMultiplier}x total adjustment`);
      }
    }

    return {
      ...point,
      shares: adjustedShares,
      value: value,
      splitMultiplier: splitMultiplier,
      hasSplit: applicableSplits.length > 0
    };
  });

  return enhancedData;
}

// Calculate investment scenario with enhanced split handling
export async function calculateScenarioWithSplits(priceData, initialAmount, ticker) {
  console.log('🧮 calculateScenarioWithSplits input:', {
    hasResults: !!priceData.results,
    resultCount: priceData.results?.length,
    initialAmount,
    ticker
  });

  if (!priceData.results || priceData.results.length === 0) {
    throw new Error("Invalid price data - no results");
  }

  // Fetch stock splits for the date range
  const fromDate = new Date(priceData.results[0].timestamp).toISOString().slice(0, 10);
  const toDate = new Date(priceData.results[priceData.results.length - 1].timestamp).toISOString().slice(0, 10);

  const splitData = await fetchStockSplits(ticker, fromDate, toDate);
  console.log('📈 Split data fetched:', splitData);

  // Calculate shares with split adjustments
  const enhancedData = calculateSharesWithSplits(initialAmount, priceData.results, splitData.splits || []);

  const startPrice = enhancedData[0].close;
  const endData = enhancedData[enhancedData.length - 1];
  const endPrice = endData.close;
  const finalShares = endData.shares;
  const currentValue = endData.value;

  console.log('💵 Enhanced calculation:', {
    startPrice,
    endPrice,
    initialShares: initialAmount / startPrice,
    finalShares,
    totalSplitMultiplier: endData.splitMultiplier,
    priceChange: ((endPrice - startPrice) / startPrice * 100).toFixed(2) + '%'
  });

  if (startPrice <= 0 || endPrice <= 0) {
    console.error('❌ Invalid prices:', { startPrice, endPrice });
    throw new Error("Invalid pricing data");
  }

  const profit = currentValue - initialAmount;
  const profitPct = (profit / initialAmount) * 100;

  console.log('💸 Profit calculation:', {
    currentValue,
    initialAmount,
    profit,
    profitPct: profitPct.toFixed(2) + '%'
  });

  // Calculate time period
  const startDate = new Date(enhancedData[0].timestamp);
  const endDate = new Date(endData.timestamp);
  const years = (endDate - startDate) / (365.25 * 24 * 60 * 60 * 1000);

  // Build chart data using enhanced values
  const chartData = enhancedData.map(point => ({
    date: point.date,
    value: point.value,
    price: point.close,
    shares: point.shares,
    hasSplit: point.hasSplit
  }));

  return {
    ticker: priceData.ticker,
    assetName: priceData.assetName,
    initialAmount,
    currentValue,
    profit,
    profitPct,
    shares: finalShares,
    startPrice,
    endPrice,
    startDate: enhancedData[0].date,
    endDate: endData.date,
    years,
    chartData,
    mode: profit >= 0 ? 'profit' : 'loss',
    splits: splitData.splits || [],
    validation: priceData.validation
  };
}

// Keep original function for backward compatibility but mark as deprecated
export function calculateScenario(priceData, initialAmount) {
  console.warn('⚠️ Using deprecated calculateScenario - should use calculateScenarioWithSplits');

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