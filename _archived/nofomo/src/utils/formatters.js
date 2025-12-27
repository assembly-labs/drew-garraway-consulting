// Currency and percentage formatters
export const formatCurrency = (n, currency = 'USD', forceFullPrecision = false) => {
  if (!isFinite(n)) return '$—';

  const abs = Math.abs(n);

  // Option to force full precision for debugging or specific displays
  if (forceFullPrecision) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      maximumFractionDigits: 2,
      minimumFractionDigits: 2
    }).format(n);
  }

  // Consistent thresholds for formatting transitions
  const BILLION_THRESHOLD = 999_999_999.995;  // Will round to 1.00B
  const MILLION_THRESHOLD = 999_999.995;       // Will round to 1.0M
  const THOUSAND_THRESHOLD = 9_999.95;         // Will round to 10.0K

  // For large numbers, use shorthand with proper formatting
  if (abs > BILLION_THRESHOLD) {
    const billions = n / 1_000_000_000;
    // Use consistent 2 decimal places for billions
    return `$${billions.toLocaleString('en-US', {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2
    })}B`;
  }

  if (abs > MILLION_THRESHOLD) {
    const millions = n / 1_000_000;
    // Use consistent 2 decimal places for millions
    return `$${millions.toLocaleString('en-US', {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2
    })}M`;
  }

  if (abs > THOUSAND_THRESHOLD) {
    const thousands = n / 1_000;
    // Use 1 decimal place for thousands
    return `$${thousands.toLocaleString('en-US', {
      maximumFractionDigits: 1,
      minimumFractionDigits: 1
    })}K`;
  }

  // For smaller numbers, always use full formatting with commas
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