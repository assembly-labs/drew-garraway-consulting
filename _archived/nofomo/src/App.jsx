import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  CartesianGrid
} from 'recharts';
import { ThemeEngine } from './utils/themeEngine';
import { formatCurrency, formatPercent } from './utils/formatters';
import { animateNumber } from './utils/numberAnimator';
import { QuoteEngine } from './utils/quoteEngine';
import { fetchPriceData, calculateScenario, calculateScenarioWithSplits, ASSET_NAMES } from './utils/api';
import quotes from './quotes.json';

// Debug mode - set to false in production
const DEBUG_MODE = false;
const ENABLE_LOGGING = false; // Set to true for debugging

// Conditionally disable console methods in production
if (!ENABLE_LOGGING) {
  console.log = () => {};
  console.warn = () => {};
  // Keep console.error for critical errors
}

const theme = new ThemeEngine();
const quoteEngine = new QuoteEngine(quotes);

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: {
    transition: {
      staggerChildren: 0.06,
    },
  },
};

// Components
function QuoteBanner({ text, mode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`theme-fade mb-4 rounded-xl border px-4 py-3 ${
        mode === 'profit'
          ? 'border-success/30 bg-success/5'
          : mode === 'loss'
          ? 'border-danger/30 bg-danger/5'
          : 'border-primary/20 bg-primary/5'
      }`}
    >
      <p className="text-3xl font-bold tracking-tight italic">{text}</p>
    </motion.div>
  );
}

function KPI({ label, value, sub, delay = 0 }) {
  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      transition={{ delay, duration: 0.3 }}
      className="rounded-xl border border-gray-200 bg-white/70 backdrop-blur px-4 py-3 shadow-card theme-fade"
    >
      <div className="text-sm text-muted">{label}</div>
      <div className="mt-1 text-2xl font-bold tabular-nums">{value}</div>
      {sub && <div className="text-sm text-muted mt-1">{sub}</div>}
    </motion.div>
  );
}

function LoadingState() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="flex items-center gap-3">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="h-5 w-5 border-2 border-accent/20 border-t-accent rounded-full"
        />
        <span className="text-muted">Calculating your alternate timeline...</span>
      </div>
    </div>
  );
}

export default function App() {
  const [ticker, setTicker] = useState('AAPL');  // Default to stock instead of crypto
  const [amount, setAmount] = useState('10,000');
  const [date, setDate] = useState('2020-01');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [scenario, setScenario] = useState(null);
  const [mode, setMode] = useState('base');

  const profitRef = useRef(null);
  const currentRef = useRef(null);

  // Update date when switching between crypto and stocks
  useEffect(() => {
    const currentMinDate = getMinDate();
    const currentMaxDate = maxDate;

    // Ensure date is within valid range for selected asset type
    if (date < currentMinDate) {
      setDate(currentMinDate);
      console.log(`📅 Auto-adjusted date to ${currentMinDate} for ${ticker.startsWith('X:') ? 'crypto' : 'stock'} data availability`);
    } else if (date > currentMaxDate) {
      setDate(currentMaxDate);
      console.log(`📅 Auto-adjusted date to ${currentMaxDate} (max allowed)`);
    }
  }, [ticker]);

  // Helper functions for formatting/parsing amount
  const formatAmountWithCommas = (value) => {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, '');
    // Add commas
    return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const parseAmount = (value) => {
    // Remove commas and convert to number
    return parseFloat(value.replace(/,/g, ''));
  };

  const handleAmountChange = (e) => {
    const formatted = formatAmountWithCommas(e.target.value);
    setAmount(formatted);
  };

  // Set up date constraints based on asset type and API limitations
  const today = new Date();
  const maxDate = new Date(today.getFullYear(), today.getMonth() - 1, 1)
    .toISOString()
    .slice(0, 7);

  // Strict date limits based on Polygon free tier API limitations
  const DATE_LIMITS = {
    crypto: {
      min: '2023-10', // Crypto data starts Oct 2023
      max: maxDate
    },
    stocks: {
      min: '2020-01', // Conservative limit for stocks (last 5 years)
      max: maxDate
    }
  };

  // Get min date based on current ticker selection
  const getMinDate = () => {
    return ticker.startsWith('X:') ? DATE_LIMITS.crypto.min : DATE_LIMITS.stocks.min;
  };

  const minDate = getMinDate();

  async function handleCalculate(e) {
    e?.preventDefault();
    setError('');
    setLoading(true);

    console.log('🎯 Starting calculation:', {
      ticker,
      date,
      amount,
      parsedAmount: parseAmount(amount)
    });

    try {
      // Validate inputs
      const amountNum = parseAmount(amount);
      if (isNaN(amountNum) || amountNum <= 0 || amountNum > 10000000) {
        throw new Error('Amount must be between $1 and $10,000,000');
      }

      if (!date || date < minDate || date > maxDate) {
        throw new Error('Please select a valid date');
      }

      // Fetch price data
      console.log('📊 Fetching price data for:', ticker);
      const fromDate = `${date}-01`;
      const priceData = await fetchPriceData(ticker, fromDate);

      console.log('📈 Price data received:', {
        success: priceData.success,
        resultCount: priceData.results?.length
      });

      if (!priceData.success) {
        throw new Error(priceData.error || 'Failed to fetch price data');
      }

      // Calculate scenario with split adjustments
      console.log('💰 Calculating scenario with splits...');
      const result = await calculateScenarioWithSplits(priceData, amountNum, ticker);

      console.log('📊 Scenario calculated:', {
        profit: result.profit,
        profitPct: result.profitPct,
        mode: result.mode,
        splits: result.splits?.length || 0,
        validation: result.validation
      });

      // Get quote
      const quote = quoteEngine.pick(result.profitPct);
      console.log('💬 Quote selected:', quote.text);

      // Set theme and scenario
      const newMode = result.mode;
      console.log('🎨 Setting theme mode:', newMode);
      setMode(newMode);
      theme.setMode(newMode);
      setScenario({ ...result, quote: quote.text });

      console.log('✅ Calculation complete!');
    } catch (err) {
      console.error('❌ Calculation error:', err);
      setError(err.message || 'Something went wrong. Please try again.');
      setMode('base');
      theme.setMode('base');
    } finally {
      setLoading(false);
    }
  }

  // Animate numbers when scenario changes
  useEffect(() => {
    if (!scenario) return;

    console.log('🎬 Starting animations with scenario:', {
      profit: scenario.profit,
      currentValue: scenario.currentValue,
      initialAmount: scenario.initialAmount,
      profitRef: profitRef.current,
      currentRef: currentRef.current
    });

    // Use setTimeout to ensure refs are attached to DOM elements
    // This fixes the issue where animation doesn't run on first load
    const animationTimer = setTimeout(() => {
      const stops = [];

      if (profitRef.current) {
        console.log('💰 Animating profit element:', profitRef.current);
        console.log('💰 Animating profit value:', scenario.profit);

        // For profit, force full precision to avoid formatting issues during animation
        const profitFormatter = (v) => {
          const sign = v >= 0 ? '+' : '-';
          // Force full precision during animation to avoid $0.0K -> $25.2K jumps
          const formatted = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0,
            minimumFractionDigits: 0
          }).format(Math.abs(v));
          return sign + formatted;
        };

        stops.push(
          animateNumber(profitRef.current, scenario.profit, {
            from: 0,
            duration: 0.8,
            formatter: profitFormatter,
          })
        );
      } else {
        console.warn('⚠️ profitRef.current is null - animation skipped');
      }

      if (currentRef.current) {
        console.log('📈 Animating current value element:', currentRef.current);
        console.log('📈 Animating current value:', scenario.currentValue);

        // Use full precision for large values to avoid formatting jumps
        const valueFormatter = (v) => {
          return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0,
            minimumFractionDigits: 0
          }).format(v);
        };

        stops.push(
          animateNumber(currentRef.current, scenario.currentValue, {
            from: scenario.initialAmount,
            duration: 0.8,
            formatter: valueFormatter,
          })
        );
      } else {
        console.warn('⚠️ currentRef.current is null - animation skipped');
      }

      // Store stops in a ref or state if we need to clean them up later
      return () => {
        stops.forEach((stop) => stop && stop());
      };
    }, 0); // Delay by 0ms to push to next tick

    // Cleanup function
    return () => {
      clearTimeout(animationTimer);
    };
  }, [scenario]);

  // Custom tooltip for chart
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload[0]) {
      return (
        <div className="bg-white/90 backdrop-blur rounded-lg shadow-lg p-2 border">
          <p className="text-sm font-semibold">{payload[0].payload.date}</p>
          <p className="text-sm text-accent">
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen theme-fade" data-mode={mode}>
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/70 backdrop-blur border-b theme-fade">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center">
          <h1 className="font-bold tracking-tight text-5xl">NO FOMO</h1>
          <div className="flex-1 text-center text-sm text-muted">
            What if you'd bought it then?
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 grid grid-cols-1 lg:grid-cols-12 gap-6 py-8">
        {/* Input Panel */}
        <section className="lg:col-span-4">
          <motion.form
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onSubmit={handleCalculate}
            className="rounded-2xl border bg-white/80 backdrop-blur p-6 shadow-card theme-fade"
          >
            <h2 className="text-lg font-semibold mb-4">Enter Your What-If</h2>

            <div className="space-y-4">
              {/* Date Input */}
              <div>
                <label className="block text-sm text-muted mb-1">
                  Investment Date (Month)
                </label>
                <input
                  type="month"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  min={minDate}
                  max={maxDate}
                  className="w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent/40 theme-fade"
                  required
                />
                <small className="text-muted text-xs">
                  Range: {minDate} to {maxDate}
                  {ticker.startsWith('X:') && (
                    <span className="text-yellow-600 block">
                      ⚠️ Crypto data limited to Oct 2023+ on free API
                    </span>
                  )}
                </small>
              </div>

              {/* Amount Input */}
              <div>
                <label className="block text-sm text-muted mb-1">
                  Investment Amount (USD)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-muted">$</span>
                  <input
                    type="text"
                    value={amount}
                    onChange={handleAmountChange}
                    placeholder="10,000"
                    className="w-full rounded-xl border pl-8 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent/40 theme-fade"
                    required
                  />
                </div>
                <small className="text-muted text-xs">
                  Min $1, Max $10,000,000
                </small>
              </div>

              {/* Asset Selector */}
              <div>
                <label className="block text-sm text-muted mb-1">Asset</label>
                <select
                  value={ticker}
                  onChange={(e) => setTicker(e.target.value)}
                  className="w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent/40 theme-fade"
                >
                  <optgroup label="Cryptocurrency">
                    <option value="X:BTCUSD">BTC (Bitcoin)</option>
                    <option value="X:ETHUSD">ETH (Ethereum)</option>
                    <option value="X:DOGEUSD">DOGE (Dogecoin)</option>
                    <option value="X:SOLUSD">SOL (Solana)</option>
                    <option value="X:ADAUSD">ADA (Cardano)</option>
                    <option value="X:XRPUSD">XRP (Ripple)</option>
                    <option value="X:MATICUSD">MATIC (Polygon)</option>
                  </optgroup>
                  <optgroup label="Tech Giants">
                    <option value="AAPL">AAPL (Apple)</option>
                    <option value="GOOGL">GOOGL (Alphabet)</option>
                    <option value="AMZN">AMZN (Amazon)</option>
                    <option value="MSFT">MSFT (Microsoft)</option>
                    <option value="NVDA">NVDA (NVIDIA)</option>
                    <option value="TSLA">TSLA (Tesla)</option>
                    <option value="META">META (Meta)</option>
                    <option value="AMD">AMD (AMD)</option>
                    <option value="INTC">INTC (Intel)</option>
                    <option value="CRM">CRM (Salesforce)</option>
                    <option value="NFLX">NFLX (Netflix)</option>
                    <option value="ORCL">ORCL (Oracle)</option>
                    <option value="UBER">UBER (Uber)</option>
                    <option value="SNAP">SNAP (Snapchat)</option>
                    <option value="SQ">SQ (Square/Block)</option>
                  </optgroup>
                  <optgroup label="Traditional Blue Chips">
                    <option value="JPM">JPM (JPMorgan)</option>
                    <option value="BAC">BAC (Bank of America)</option>
                    <option value="WMT">WMT (Walmart)</option>
                    <option value="DIS">DIS (Disney)</option>
                    <option value="KO">KO (Coca-Cola)</option>
                    <option value="MCD">MCD (McDonald's)</option>
                    <option value="V">V (Visa)</option>
                    <option value="MA">MA (Mastercard)</option>
                  </optgroup>
                  <optgroup label="Meme Stocks">
                    <option value="GME">GME (GameStop)</option>
                    <option value="AMC">AMC (AMC Entertainment)</option>
                    <option value="BB">BB (BlackBerry)</option>
                  </optgroup>
                  <optgroup label="Index Funds">
                    <option value="SPY">SPY (S&P 500)</option>
                    <option value="QQQ">QQQ (Nasdaq-100)</option>
                  </optgroup>
                </select>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-accent text-white py-3 font-semibold shadow hover:shadow-hover transition-all theme-fade disabled:opacity-50"
                >
                  {loading ? 'Calculating...' : 'Regret It?'}
                </motion.button>
              </div>

              {/* Error Display */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="rounded-lg border border-danger/30 bg-danger/5 p-3"
                  >
                    <p className="text-sm text-danger">{error}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.form>
        </section>

        {/* Results Panel */}
        <section className="lg:col-span-8">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="rounded-2xl border bg-white/80 backdrop-blur p-6 shadow-card theme-fade"
              >
                <LoadingState />
              </motion.div>
            ) : scenario ? (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="rounded-2xl border bg-white/80 backdrop-blur p-6 shadow-card theme-fade"
              >
                {/* Quote Banner */}
                <QuoteBanner mode={mode} text={scenario.quote} />

                {/* KPI Cards */}
                <motion.div
                  variants={stagger}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6"
                >
                  <KPI
                    label="Initial Investment"
                    value={formatCurrency(scenario.initialAmount)}
                    sub={scenario.startDate}
                    delay={0}
                  />
                  <KPI
                    label="Current Value"
                    value={<span ref={currentRef}>{formatCurrency(scenario.currentValue, 'USD', true)}</span>}
                    sub={
                      <>
                        {scenario.shares.toFixed(4)} shares
                        {scenario.splits && scenario.splits.length > 0 && (
                          <span className="text-accent ml-1">
                            ({scenario.splits.length} split{scenario.splits.length > 1 ? 's' : ''})
                          </span>
                        )}
                      </>
                    }
                    delay={0.06}
                  />
                  <KPI
                    label="Total Change"
                    value={
                      <span
                        ref={profitRef}
                        className={`tabular-nums ${
                          scenario.profit >= 0 ? 'text-success' : 'text-danger'
                        }`}
                      >
                        {/* Show actual value immediately as fallback, animation will override */}
                        {scenario.profit >= 0 ? '+' : '-'}
                        {formatCurrency(Math.abs(scenario.profit), 'USD', true)}
                      </span>
                    }
                    sub={
                      <span
                        className={scenario.profit >= 0 ? 'text-success' : 'text-danger'}
                      >
                        {formatPercent(scenario.profitPct)}
                      </span>
                    }
                    delay={0.12}
                  />
                </motion.div>

                {/* Debug Info Panel (only in debug mode) */}
                {DEBUG_MODE && scenario.validation && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mb-4 p-3 bg-gray-100 rounded-lg text-xs font-mono"
                  >
                    <div className="font-semibold mb-2">Debug Info:</div>
                    <div>Data Points: {scenario.validation.dataPoints}</div>
                    <div>Adjusted Data: {scenario.validation.isLikelyAdjusted ? 'Yes' : 'No'}</div>
                    {scenario.splits && scenario.splits.length > 0 && (
                      <div className="mt-2">
                        <div className="font-semibold">Stock Splits Detected:</div>
                        {scenario.splits.map((split, i) => (
                          <div key={i}>
                            {split.date}: {split.to}:{split.from} (×{split.ratio.toFixed(2)})
                          </div>
                        ))}
                      </div>
                    )}
                    {scenario.validation.warnings && scenario.validation.warnings.length > 0 && (
                      <div className="mt-2">
                        <div className="font-semibold text-yellow-600">Warnings:</div>
                        {scenario.validation.warnings.slice(0, 3).map((warning, i) => (
                          <div key={i} className="text-yellow-600">{warning}</div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Chart */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="h-64 rounded-xl border p-3 bg-white/50"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={scenario.chartData}
                      margin={{ top: 5, right: 5, bottom: 5, left: 5 }}
                    >
                      <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                          <stop
                            offset="5%"
                            stopColor={`rgb(var(--accent))`}
                            stopOpacity={0.3}
                          />
                          <stop
                            offset="95%"
                            stopColor={`rgb(var(--accent))`}
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                      <XAxis
                        dataKey="date"
                        tick={{ fontSize: 11, fill: 'rgb(var(--muted))' }}
                        interval="preserveStartEnd"
                      />
                      <YAxis
                        domain={['auto', 'auto']}
                        tick={{ fontSize: 11, fill: 'rgb(var(--muted))' }}
                        tickFormatter={(v) => formatCurrency(v)}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke={`rgb(var(--accent))`}
                        strokeWidth={2.5}
                        fill="url(#colorValue)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </motion.div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t mt-12 py-6 text-center text-sm text-muted">
        Designed with frustration and annoyance. Built in partnership with{' '}
        <a
          href="https://assemblylabs.co/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent hover:underline theme-fade"
        >
          Assembly Labs
        </a>
      </footer>
    </div>
  );
}