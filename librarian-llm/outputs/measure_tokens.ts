import { encode } from '@anthropic-ai/tokenizer';
import * as fs from 'fs';
import * as path from 'path';

// Read the catalog
const catalogPath = path.join(__dirname, '../data/catalog.json');
const catalogData = JSON.parse(fs.readFileSync(catalogPath, 'utf-8'));

interface TokenAnalysis {
  totalBooks: number;
  currentFormat: {
    totalTokens: number;
    avgTokensPerBook: number;
    estimatedCostPerQuery: number;
    sampleBook: any;
    sampleTokenCount: number;
  };
  optimizedFormat: {
    totalTokens: number;
    avgTokensPerBook: number;
    estimatedCostPerQuery: number;
    sampleBook: any;
    sampleTokenCount: number;
  };
  savings: {
    tokenReduction: number;
    percentageSaved: number;
    costReduction: number;
    speedImprovement: string;
  };
}

// Token pricing (Claude 3.5 Sonnet)
const TOKENS_PER_DOLLAR = {
  input: 3_000_000 / 3,  // $3 per million tokens input
  output: 15_000_000 / 15 // $15 per million tokens output
};

function countTokens(text: string): number {
  try {
    // Using a simple approximation: ~4 characters per token
    // For production, use actual tokenizer library
    return Math.ceil(text.length / 4);
  } catch {
    // Fallback estimation
    return Math.ceil(text.length / 4);
  }
}

function analyzeCatalog(): TokenAnalysis {
  const totalBooks = catalogData.length;

  // Analyze current format (full catalog in system prompt)
  const currentCatalogString = JSON.stringify(catalogData, null, 2);
  const currentTotalTokens = countTokens(currentCatalogString);
  const currentAvgTokensPerBook = Math.round(currentTotalTokens / totalBooks);

  // Sample book for demonstration
  const sampleBook = catalogData[0];
  const sampleBookString = JSON.stringify(sampleBook, null, 2);
  const sampleBookTokens = countTokens(sampleBookString);

  // Create optimized format
  const optimizedCatalog = catalogData.map((book: any) => ({
    id: book.id,
    t: book.title, // shortened keys
    a: book.author || book.director || book.artist || 'Unknown',
    s: book.subjects ? book.subjects.slice(0, 2) : [], // only top 2 subjects
    av: book.formats[0]?.status === 'available' ? 1 : 0 // simple availability
  }));

  const optimizedSampleBook = optimizedCatalog[0];
  const optimizedCatalogString = JSON.stringify(optimizedCatalog);
  const optimizedTotalTokens = countTokens(optimizedCatalogString);
  const optimizedAvgTokensPerBook = Math.round(optimizedTotalTokens / totalBooks);
  const optimizedSampleTokens = countTokens(JSON.stringify(optimizedSampleBook));

  // Calculate costs (per query sending full catalog)
  const currentCostPerQuery = (currentTotalTokens / TOKENS_PER_DOLLAR.input);
  const optimizedCostPerQuery = (optimizedTotalTokens / TOKENS_PER_DOLLAR.input);

  // Calculate savings
  const tokenReduction = currentTotalTokens - optimizedTotalTokens;
  const percentageSaved = ((tokenReduction / currentTotalTokens) * 100);
  const costReduction = currentCostPerQuery - optimizedCostPerQuery;

  return {
    totalBooks,
    currentFormat: {
      totalTokens: currentTotalTokens,
      avgTokensPerBook: currentAvgTokensPerBook,
      estimatedCostPerQuery: currentCostPerQuery,
      sampleBook,
      sampleTokenCount: sampleBookTokens
    },
    optimizedFormat: {
      totalTokens: optimizedTotalTokens,
      avgTokensPerBook: optimizedAvgTokensPerBook,
      estimatedCostPerQuery: optimizedCostPerQuery,
      sampleBook: optimizedSampleBook,
      sampleTokenCount: optimizedSampleTokens
    },
    savings: {
      tokenReduction,
      percentageSaved,
      costReduction,
      speedImprovement: `${Math.round(currentTotalTokens / optimizedTotalTokens)}x faster`
    }
  };
}

// Run analysis
const analysis = analyzeCatalog();

console.log('📊 TOKEN ANALYSIS REPORT\n');
console.log('=' .repeat(60));

console.log('\n📚 CATALOG OVERVIEW');
console.log(`Total books in catalog: ${analysis.totalBooks}`);

console.log('\n⚠️  CURRENT FORMAT (Sending full catalog)');
console.log(`Total tokens: ${analysis.currentFormat.totalTokens.toLocaleString()}`);
console.log(`Average tokens per book: ${analysis.currentFormat.avgTokensPerBook}`);
console.log(`Cost per query: $${analysis.currentFormat.estimatedCostPerQuery.toFixed(4)}`);
console.log(`Sample book tokens: ${analysis.currentFormat.sampleTokenCount}`);

console.log('\n✅ OPTIMIZED FORMAT (Minimal data)');
console.log(`Total tokens: ${analysis.optimizedFormat.totalTokens.toLocaleString()}`);
console.log(`Average tokens per book: ${analysis.optimizedFormat.avgTokensPerBook}`);
console.log(`Cost per query: $${analysis.optimizedFormat.estimatedCostPerQuery.toFixed(4)}`);
console.log(`Sample book tokens: ${analysis.optimizedFormat.sampleTokenCount}`);

console.log('\n💰 SAVINGS');
console.log(`Token reduction: ${analysis.savings.tokenReduction.toLocaleString()} tokens`);
console.log(`Percentage saved: ${analysis.savings.percentageSaved.toFixed(1)}%`);
console.log(`Cost reduction: $${analysis.savings.costReduction.toFixed(4)} per query`);
console.log(`Speed improvement: ${analysis.savings.speedImprovement}`);

console.log('\n🚀 WITH SEMANTIC PRE-FILTERING');
console.log('If we filter 200 books → 10 relevant books:');
const filteredTokens = Math.round(analysis.optimizedFormat.avgTokensPerBook * 10);
const filteredCost = (filteredTokens / TOKENS_PER_DOLLAR.input);
console.log(`Tokens sent to Claude: ${filteredTokens} (vs ${analysis.currentFormat.totalTokens.toLocaleString()})`);
console.log(`Cost per query: $${filteredCost.toFixed(5)}`);
console.log(`Total reduction: ${((1 - filteredTokens/analysis.currentFormat.totalTokens) * 100).toFixed(1)}%`);

// Save analysis to file
const reportPath = path.join(__dirname, 'token_analysis.json');
fs.writeFileSync(reportPath, JSON.stringify(analysis, null, 2));
console.log(`\n📁 Full analysis saved to: ${reportPath}`);

export { analyzeCatalog, countTokens };