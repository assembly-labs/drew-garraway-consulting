import type { SortOption } from '../types';
import SearchBar from './SearchBar';

interface HeaderProps {
  query: string;
  setQuery: (query: string) => void;
  clearSearch: () => void;
  filteredCount: number;
  totalCount: number;
  sortOption: SortOption;
  setSortOption: (sort: SortOption) => void;
}

export default function Header({
  query,
  setQuery,
  clearSearch,
  filteredCount,
  totalCount,
  sortOption,
  setSortOption,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold text-textPrimary">
            Abstract Image Library
          </h1>
          <span className="text-sm text-textSecondary">
            Showing {filteredCount.toLocaleString()} of {totalCount.toLocaleString()} images
          </span>
        </div>
        <div className="flex items-center gap-4">
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value as SortOption)}
            className="px-3 py-2 bg-surface border border-border rounded-lg text-sm text-textPrimary focus:outline-none focus:border-accent cursor-pointer"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="random">Random</option>
          </select>
          <SearchBar query={query} setQuery={setQuery} clearSearch={clearSearch} />
        </div>
      </div>
    </header>
  );
}
