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
import { fetchPriceData, calculateScenario, ASSET_NAMES } from './utils/api';
import quotes from './quotes.json';

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
      <p className="text-base font-semibold tracking-tight italic">"{text}"</p>
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
  const [ticker, setTicker] = useState('X:BTCUSD');
  const [amount, setAmount] = useState('10000');
  const [date, setDate] = useState('2020-01');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [scenario, setScenario] = useState(null);
  const [mode, setMode] = useState('base');

  const profitRef = useRef(null);
  const currentRef = useRef(null);

  // Set up date constraints
  const today = new Date();
  const maxDate = new Date(today.getFullYear(), today.getMonth() - 1, 1)
    .toISOString()
    .slice(0, 7);
  const minDate = '2010-01';

  async function handleCalculate(e) {
    e?.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validate inputs
      const amountNum = parseFloat(amount);
      if (isNaN(amountNum) || amountNum <= 0 || amountNum > 10000000) {
        throw new Error('Amount must be between $1 and $10,000,000');
      }

      if (!date || date < minDate || date > maxDate) {
        throw new Error('Please select a valid date');
      }

      // Fetch price data
      const fromDate = `${date}-01`;
      const priceData = await fetchPriceData(ticker, fromDate);

      if (!priceData.success) {
        throw new Error(priceData.error || 'Failed to fetch price data');
      }

      // Calculate scenario
      const result = calculateScenario(priceData, amountNum);

      // Get quote
      const quote = quoteEngine.pick(result.profitPct);

      // Set theme and scenario
      const newMode = result.mode;
      setMode(newMode);
      theme.setMode(newMode);
      setScenario({ ...result, quote: quote.text });
    } catch (err) {
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

    const stops = [];

    if (profitRef.current) {
      stops.push(
        animateNumber(profitRef.current, scenario.profit, {
          from: 0,
          duration: 0.6,
          formatter: (v) => formatCurrency(v),
        })
      );
    }

    if (currentRef.current) {
      stops.push(
        animateNumber(currentRef.current, scenario.currentValue, {
          from: scenario.initialAmount,
          duration: 0.6,
          formatter: (v) => formatCurrency(v),
        })
      );
    }

    return () => {
      stops.forEach((stop) => stop && stop());
    };
  }, [scenario]);

  function handleReset() {
    setTicker('X:BTCUSD');
    setAmount('10000');
    setDate('2020-01');
    setScenario(null);
    setMode('base');
    theme.setMode('base');
    setError('');
  }

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
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center gap-4">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="h-8 w-8 rounded-lg bg-accent theme-fade"
          />
          <h1 className="font-bold tracking-tight text-xl">NO FOMO</h1>
          <div className="ml-auto text-sm text-muted">
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
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    min="1"
                    max="10000000"
                    step="100"
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
                  </optgroup>
                  <optgroup label="Tech Giants">
                    <option value="AAPL">AAPL (Apple)</option>
                    <option value="GOOGL">GOOGL (Alphabet)</option>
                    <option value="AMZN">AMZN (Amazon)</option>
                    <option value="MSFT">MSFT (Microsoft)</option>
                    <option value="NVDA">NVDA (NVIDIA)</option>
                    <option value="TSLA">TSLA (Tesla)</option>
                    <option value="META">META (Meta)</option>
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
                  {loading ? 'Calculating...' : 'Regret It'}
                </motion.button>

                {scenario && (
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    type="button"
                    onClick={handleReset}
                    className="w-full rounded-xl border border-gray-200 py-2 text-sm hover:bg-gray-50 transition-colors"
                  >
                    Try Another
                  </motion.button>
                )}
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
                    value={<span ref={currentRef}>{formatCurrency(scenario.initialAmount)}</span>}
                    sub={`${scenario.shares.toFixed(4)} shares`}
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
                        $0.00
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

                {/* Action Buttons */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mt-6 flex gap-3"
                >
                  <button
                    onClick={handleReset}
                    className="rounded-xl border px-4 py-2 hover:bg-gray-50 transition-colors"
                  >
                    Try Again
                  </button>
                  <button
                    onClick={() => {
                      // Future: Implement share functionality
                      alert('Share feature coming soon!');
                    }}
                    className="rounded-xl border px-4 py-2 hover:bg-gray-50 transition-colors"
                  >
                    Share Result
                  </button>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-2xl border bg-white/70 backdrop-blur p-12 text-muted text-center theme-fade"
              >
                <p className="text-lg">Enter a scenario to see your alternate timeline.</p>
                <p className="text-sm mt-2">Choose a date, amount, and asset to begin.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </main>
    </div>
  );
}