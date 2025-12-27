// Quote engine with severity weighting and memory
export class QuoteEngine {
  constructor(quotes = [], memory = 5) {
    this.quotes = quotes;
    this.memory = memory;
    this.recent = [];
  }

  pick(deltaPct) {
    const eligible = this.quotes.filter(q =>
      deltaPct >= q.min_delta_pct && deltaPct <= q.max_delta_pct
    );

    if (eligible.length === 0) {
      // Fallback quote
      return {
        text: deltaPct >= 0
          ? "Numbers go up. Life is good."
          : "Numbers go down. Life goes on."
      };
    }

    // Weight by severity (higher severity -> more weight)
    const weighted = eligible.flatMap(q =>
      Array(Math.max(1, q.severity || 1)).fill(q)
    );

    // Avoid last N quotes
    const filtered = weighted.filter(q => !this.recent.includes(q.id));
    const pool = filtered.length ? filtered : weighted;

    const choice = pool[Math.floor(Math.random() * pool.length)];

    // Update memory
    this.recent.push(choice.id);
    if (this.recent.length > this.memory) this.recent.shift();

    return choice;
  }

  reset() {
    this.recent = [];
  }
}