import { CatalogItem } from './types';

/**
 * Lightweight format for semantic search and initial filtering
 * ~80% smaller than full catalog
 */
export interface MinimalCatalogItem {
  id: string;
  t: string;      // title
  c: string;      // creator (author/director/artist)
  s: string[];    // subjects (max 3)
  y?: number;     // year
  r?: number;     // rating
  av: number;     // availability (0=unavailable, 1=available, 2=waitlist)
}

/**
 * Optimized format for sending to Claude
 * Contains only essential information for recommendations
 */
export interface OptimizedCatalogItem {
  id: string;
  title: string;
  creator: string;
  subjects: string[];
  description: string;  // First 150 chars only
  formats: {
    type: string;
    available: boolean;
    waitTime?: string;
  }[];
  rating?: number;
  year?: number;
}

/**
 * Two-tier catalog optimization system
 * Tier 1: MinimalCatalogItem[] - For semantic search (client-side)
 * Tier 2: OptimizedCatalogItem[] - For sending to Claude (server-side)
 */
export class CatalogOptimizer {
  private fullCatalog: CatalogItem[];
  private minimalCatalog: MinimalCatalogItem[];
  private catalogIndex: Map<string, CatalogItem>;

  constructor(catalog: CatalogItem[]) {
    this.fullCatalog = catalog;
    this.catalogIndex = new Map(catalog.map(item => [item.id, item]));
    this.minimalCatalog = this.createMinimalCatalog(catalog);
  }

  /**
   * Create minimal catalog for semantic search
   * Reduces each item from ~500 tokens to ~20 tokens
   */
  private createMinimalCatalog(catalog: CatalogItem[]): MinimalCatalogItem[] {
    return catalog.map(item => ({
      id: item.id,
      t: item.title,
      c: this.getCreator(item),
      s: this.getSubjects(item).slice(0, 3), // Max 3 subjects
      y: this.getYear(item),
      r: item.rating,
      av: this.getAvailability(item)
    }));
  }

  /**
   * Get creator based on item type
   */
  private getCreator(item: CatalogItem): string {
    if ('author' in item) return item.author;
    if ('director' in item) return item.director;
    if ('artist' in item) return item.artist;
    if ('manufacturer' in item) return item.manufacturer;
    if ('brand' in item) return item.brand;
    if ('publisher' in item) return item.publisher;
    return 'Unknown';
  }

  /**
   * Get subjects or default based on item type
   */
  private getSubjects(item: CatalogItem): string[] {
    if ('subjects' in item && Array.isArray(item.subjects)) return item.subjects;
    if ('genres' in item && Array.isArray(item.genres)) return item.genres;
    if ('categories' in item && Array.isArray(item.categories)) return item.categories;
    if ('category' in item && typeof item.category === 'string') return [item.category];
    return [item.itemType];
  }

  /**
   * Get year from various fields
   */
  private getYear(item: CatalogItem): number | undefined {
    if ('publication_year' in item && typeof item.publication_year === 'number') return item.publication_year;
    if ('release_year' in item && typeof item.release_year === 'number') return item.release_year;
    if ('year' in item && typeof item.year === 'number') return item.year;
    return undefined;
  }

  /**
   * Convert availability to simple number
   * 0 = unavailable, 1 = available, 2 = waitlist
   */
  private getAvailability(item: CatalogItem): number {
    const firstFormat = item.formats[0];
    if (!firstFormat) return 0;

    if (firstFormat.status === 'available') return 1;
    if (firstFormat.status === 'waitlist') return 2;
    return 0;
  }

  /**
   * Get minimal catalog for semantic search
   */
  getMinimalCatalog(): MinimalCatalogItem[] {
    return this.minimalCatalog;
  }

  /**
   * Convert selected items to optimized format for Claude
   * @param itemIds - IDs of items to optimize (from semantic search)
   */
  getOptimizedItems(itemIds: string[]): OptimizedCatalogItem[] {
    return itemIds
      .map(id => this.catalogIndex.get(id))
      .filter((item): item is CatalogItem => item !== undefined)
      .map(item => this.optimizeForClaude(item));
  }

  /**
   * Optimize a single item for sending to Claude
   * Reduces from ~500 tokens to ~80 tokens while keeping essential info
   */
  private optimizeForClaude(item: CatalogItem): OptimizedCatalogItem {
    return {
      id: item.id,
      title: item.title,
      creator: this.getCreator(item),
      subjects: this.getSubjects(item).slice(0, 3),
      description: item.description.substring(0, 150) + '...',
      formats: item.formats.map(f => ({
        type: f.type,
        available: f.status === 'available',
        waitTime: f.wait_time
      })),
      rating: item.rating,
      year: this.getYear(item)
    };
  }

  /**
   * Calculate token savings
   */
  calculateSavings(selectedCount: number = 10): {
    before: number;
    after: number;
    savings: number;
    percentage: number;
  } {
    // Rough token estimates
    const tokensPerFullItem = 500;
    const tokensPerOptimizedItem = 80;

    const before = this.fullCatalog.length * tokensPerFullItem;
    const after = selectedCount * tokensPerOptimizedItem;
    const savings = before - after;
    const percentage = (savings / before) * 100;

    return {
      before,
      after,
      savings,
      percentage
    };
  }

  /**
   * Export minimal catalog as JSON string (for caching)
   */
  exportMinimalCatalog(): string {
    return JSON.stringify(this.minimalCatalog);
  }

  /**
   * Import minimal catalog from JSON string
   */
  static importMinimalCatalog(json: string): MinimalCatalogItem[] {
    return JSON.parse(json);
  }

  /**
   * Get statistics about the optimization
   */
  getStats() {
    const fullSize = JSON.stringify(this.fullCatalog).length;
    const minimalSize = JSON.stringify(this.minimalCatalog).length;
    const compressionRatio = ((fullSize - minimalSize) / fullSize * 100).toFixed(1);

    return {
      totalItems: this.fullCatalog.length,
      fullSizeBytes: fullSize,
      minimalSizeBytes: minimalSize,
      compressionRatio: `${compressionRatio}%`,
      avgFullItemSize: Math.round(fullSize / this.fullCatalog.length),
      avgMinimalItemSize: Math.round(minimalSize / this.minimalCatalog.length)
    };
  }
}

// Export helper function to create optimizer
export function createCatalogOptimizer(catalog: CatalogItem[]): CatalogOptimizer {
  return new CatalogOptimizer(catalog);
}