import type { FilterState } from '../types';
import { TAG_CATEGORIES, COLOR_SWATCHES } from '../constants/tags';
import FilterGroup from './FilterGroup';
import TagPill from './TagPill';
import ColorSwatch from './ColorSwatch';

interface SidebarProps {
  filters: FilterState;
  setCollection: (collection: FilterState['collection']) => void;
  toggleTag: (tag: string) => void;
  toggleColor: (color: string) => void;
  setOrientation: (orientation: FilterState['orientation']) => void;
  clearFilters: () => void;
  activeFilterCount: number;
}

export default function Sidebar({
  filters,
  setCollection,
  toggleTag,
  toggleColor,
  setOrientation,
  clearFilters,
  activeFilterCount,
}: SidebarProps) {
  return (
    <aside className="w-72 flex-shrink-0 bg-surface border-r border-border overflow-y-auto h-[calc(100vh-65px)]">
      <div className="p-4">
        {/* Header with clear button */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-textPrimary uppercase tracking-wide">
            Filters
          </h2>
          {activeFilterCount > 0 && (
            <button
              onClick={clearFilters}
              className="text-xs text-accent hover:text-accentHover transition-colors"
            >
              Clear all ({activeFilterCount})
            </button>
          )}
        </div>

        {/* Collection filter */}
        <FilterGroup title="Collection" defaultOpen>
          <div className="flex flex-col gap-1">
            {(['all', 'photography', 'iconography'] as const).map((collection) => (
              <button
                key={collection}
                onClick={() => setCollection(collection)}
                className={`text-left px-3 py-2 rounded-md text-sm transition-colors ${
                  filters.collection === collection
                    ? 'bg-accent text-white'
                    : 'text-textSecondary hover:bg-surfaceHover hover:text-textPrimary'
                }`}
              >
                {collection.charAt(0).toUpperCase() + collection.slice(1)}
              </button>
            ))}
          </div>
        </FilterGroup>

        {/* Orientation filter */}
        <FilterGroup title="Orientation" defaultOpen>
          <div className="flex flex-col gap-1">
            {(['all', 'landscape', 'portrait', 'square'] as const).map((orientation) => (
              <button
                key={orientation}
                onClick={() => setOrientation(orientation)}
                className={`text-left px-3 py-2 rounded-md text-sm transition-colors ${
                  filters.orientation === orientation
                    ? 'bg-accent text-white'
                    : 'text-textSecondary hover:bg-surfaceHover hover:text-textPrimary'
                }`}
              >
                {orientation.charAt(0).toUpperCase() + orientation.slice(1)}
              </button>
            ))}
          </div>
        </FilterGroup>

        {/* Color filter */}
        <FilterGroup title="Colors" defaultOpen>
          <div className="flex flex-wrap gap-2">
            {Object.entries(COLOR_SWATCHES).map(([colorName, colorValue]) => (
              <ColorSwatch
                key={colorName}
                color={colorValue}
                name={colorName}
                isActive={filters.colors.includes(colorName)}
                onClick={() => toggleColor(colorName)}
              />
            ))}
          </div>
        </FilterGroup>

        {/* Use Case - NEW */}
        <FilterGroup title="Use Case" defaultOpen>
          <div className="flex flex-wrap gap-1.5">
            {TAG_CATEGORIES.useCase.map((tag) => (
              <TagPill
                key={tag}
                tag={tag}
                isActive={filters.tags.includes(tag)}
                onClick={() => toggleTag(tag)}
              />
            ))}
          </div>
        </FilterGroup>

        {/* UI Context - NEW */}
        <FilterGroup title="UI Context">
          <div className="flex flex-wrap gap-1.5">
            {TAG_CATEGORIES.uiContext.map((tag) => (
              <TagPill
                key={tag}
                tag={tag}
                isActive={filters.tags.includes(tag)}
                onClick={() => toggleTag(tag)}
              />
            ))}
          </div>
        </FilterGroup>

        {/* Photo type tags */}
        <FilterGroup title="Photo Type">
          <div className="flex flex-wrap gap-1.5">
            {TAG_CATEGORIES.photoType.map((tag) => (
              <TagPill
                key={tag}
                tag={tag}
                isActive={filters.tags.includes(tag)}
                onClick={() => toggleTag(tag)}
              />
            ))}
          </div>
        </FilterGroup>

        {/* Photo mood tags */}
        <FilterGroup title="Photo Mood">
          <div className="flex flex-wrap gap-1.5">
            {TAG_CATEGORIES.photoMood.map((tag) => (
              <TagPill
                key={tag}
                tag={tag}
                isActive={filters.tags.includes(tag)}
                onClick={() => toggleTag(tag)}
              />
            ))}
          </div>
        </FilterGroup>

        {/* Photo color tags */}
        <FilterGroup title="Color Tone">
          <div className="flex flex-wrap gap-1.5">
            {TAG_CATEGORIES.photoColor.map((tag) => (
              <TagPill
                key={tag}
                tag={tag}
                isActive={filters.tags.includes(tag)}
                onClick={() => toggleTag(tag)}
              />
            ))}
          </div>
        </FilterGroup>

        {/* Icon style tags */}
        <FilterGroup title="Icon Style">
          <div className="flex flex-wrap gap-1.5">
            {TAG_CATEGORIES.iconStyle.map((tag) => (
              <TagPill
                key={tag}
                tag={tag}
                isActive={filters.tags.includes(tag)}
                onClick={() => toggleTag(tag)}
              />
            ))}
          </div>
        </FilterGroup>

        {/* Icon shape tags */}
        <FilterGroup title="Icon Shape">
          <div className="flex flex-wrap gap-1.5">
            {TAG_CATEGORIES.iconShape.map((tag) => (
              <TagPill
                key={tag}
                tag={tag}
                isActive={filters.tags.includes(tag)}
                onClick={() => toggleTag(tag)}
              />
            ))}
          </div>
        </FilterGroup>

        {/* Icon mood tags */}
        <FilterGroup title="Icon Mood">
          <div className="flex flex-wrap gap-1.5">
            {TAG_CATEGORIES.iconMood.map((tag) => (
              <TagPill
                key={tag}
                tag={tag}
                isActive={filters.tags.includes(tag)}
                onClick={() => toggleTag(tag)}
              />
            ))}
          </div>
        </FilterGroup>
      </div>
    </aside>
  );
}
