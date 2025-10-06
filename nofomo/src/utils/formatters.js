// Currency and percentage formatters
export const formatCurrency = (n, currency = 'USD') => {
  if (!isFinite(n)) return '$—';

  const abs = Math.abs(n);

  // For large numbers, use shorthand
  if (abs >= 1_000_000_000) {
    return `$${(n / 1_000_000_000).toFixed(2)}B`;
  }
  if (abs >= 1_000_000) {
    return `$${(n / 1_000_000).toFixed(2)}M`;
  }
  if (abs >= 10_000) {
    return `$${(n / 1_000).toFixed(1)}K`;
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
    minimumFractionDigits: 2
  }).format(n);
};

export const formatPercent = (n) => {
  if (!isFinite(n)) return '—%';

  const sign = n >= 0 ? '+' : '';
  return `${sign}${n.toFixed(2)}%`;
};

export const formatCompactNumber = (n) => {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1
  }).format(n);
};