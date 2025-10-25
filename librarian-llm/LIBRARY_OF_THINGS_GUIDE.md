# Library of Things - System Architecture Guide

## Overview

This guide documents the technical implementation of the "Library of Things" system, which extends the original book-only catalog to support diverse materials including DVDs, video games, equipment, comics, and unique items that modern libraries lend to their communities.

## Type System Architecture

### Core Design Pattern: Discriminated Unions

The system uses TypeScript discriminated unions with a base interface pattern to achieve type safety while maintaining flexibility.

```typescript
// Base interface - all library items must have these fields
interface LibraryItem {
  id: string;
  itemType: MaterialType;  // Discriminator field
  title: string;
  cover: string;
  formats: ItemFormat[];
  description: string;
  rating?: number;
  popular?: boolean;
}

// Specific item types extend the base
interface Book extends LibraryItem {
  itemType: 'book';  // Literal type discriminator
  isbn: string;
  author: string;
  subjects: string[];
  publication_year: number;
  pages: number;
}

// Union type for all possible items
type CatalogItem = Book | MediaItem | GameItem | EquipmentItem | ComicItem | ThingItem;
```

### Material Types

The system supports these material categories:

1. **Books** (`book`): Traditional library books
   - Fields: isbn, author, subjects, publication_year, pages
   - Formats: physical, ebook, audiobook

2. **Media Items** (`dvd`, `audiovisual`): Movies, TV shows, documentaries
   - Fields: director, actors, runtime_minutes, release_year, rating_mpaa, episodes, season
   - Formats: dvd, bluray, cd, vinyl

3. **Games** (`game`): Video games and gaming hardware
   - Fields: platform, developer, publisher, release_year, rating_esrb, players, online_multiplayer, includes
   - Formats: ps5, xbox, switch, pc, retro

4. **Equipment** (`equipment`): Tools, devices, and specialized equipment
   - Fields: category, manufacturer, model, includes, requirements, instructions_url, replacement_cost
   - Formats: equipment, tool, device
   - Special features: booking_required, deposit_required, slots_available

5. **Comics** (`comic`): Graphic novels, manga, comic books
   - Fields: author, artist, series, issue_number, volume, publisher, publication_year
   - Formats: comic, manga, graphic-novel

6. **Things** (`thing`): General items (board games, camping gear, etc.)
   - Fields: category, brand, includes, condition, suitable_ages
   - Format: Based on specific item type

### Format System

Each material can have multiple formats with availability information:

```typescript
interface ItemFormat {
  type: ItemFormatType;
  status: 'available' | 'waitlist' | 'checked_out' | 'maintenance' | 'reserved';
  copies_available?: number;
  copies_total?: number;
  wait_time?: string;
  holds?: number;
  due_date?: string;

  // Special fields for equipment/things
  booking_required?: boolean;      // Must reserve a time slot
  slots_available?: string[];      // Available reservation times
  checkout_duration_days?: number; // How long patron can keep item
  deposit_required?: number;       // Security deposit in dollars
  age_restriction?: string;        // Age requirements
}
```

## Component Architecture

### Polymorphic Components

Components handle multiple item types using type guards:

```typescript
// BookCard.tsx - Works with any CatalogItem
const BookCard: React.FC<{ book: CatalogItem }> = ({ book }) => {
  // Use formatItemCreator for author/director/developer/etc.
  const creator = formatItemCreator(book);

  // Conditional rendering based on item type
  return (
    <div>
      <h3>{book.title}</h3>
      <p>by {creator}</p>

      {/* Only show subjects for books */}
      {'subjects' in book && book.subjects && (
        <div>{formatSubjects(book.subjects)}</div>
      )}

      {/* Show appropriate year field */}
      {'publication_year' in book && (
        <span>Published {book.publication_year}</span>
      )}
      {'release_year' in book && (
        <span>Released {book.release_year}</span>
      )}
    </div>
  );
};
```

### Helper Functions

The `formatters.ts` file provides type-aware helpers:

```typescript
// Polymorphic creator extraction
export const formatItemCreator = (item: CatalogItem): string => {
  if ('author' in item && item.author) return item.author;
  if ('director' in item && item.director) return item.director;
  if ('developer' in item && item.developer) return item.developer;
  if ('artist' in item && item.artist) return item.artist;
  if ('manufacturer' in item && item.manufacturer) return item.manufacturer;
  return 'Unknown';
};

// Material-specific icons
export const getMaterialIcon = (itemType: MaterialType): string => {
  switch (itemType) {
    case 'book': return '📚';
    case 'dvd': return '📀';
    case 'game': return '🎮';
    case 'equipment': return '🔧';
    case 'comic': return '📖';
    case 'audiovisual': return '🎬';
    case 'thing': return '📦';
    default: return '📋';
  }
};
```

## Data Storage

### Catalog JSON Structure

Items are stored in `public/data/catalog.json`:

```json
[
  {
    "id": "book_001",
    "itemType": "book",
    "isbn": "9780140283334",
    "title": "On Writing",
    "author": "Stephen King",
    "subjects": ["writing", "memoir", "creativity"],
    "publication_year": 2000,
    "pages": 320,
    "cover": "https://covers.openlibrary.org/b/isbn/9780140283334-L.jpg",
    "description": "Part memoir, part masterclass...",
    "formats": [
      {
        "type": "physical",
        "status": "available",
        "copies_available": 3,
        "copies_total": 5
      }
    ],
    "rating": 4.7,
    "popular": true
  },
  {
    "id": "equipment_001",
    "itemType": "equipment",
    "title": "Creality Ender 3 3D Printer",
    "category": "3D Printing",
    "manufacturer": "Creality",
    "model": "Ender 3 V2",
    "cover": "https://example.com/3d-printer.jpg",
    "description": "Entry-level 3D printer perfect for beginners...",
    "formats": [
      {
        "type": "equipment",
        "status": "available",
        "booking_required": true,
        "slots_available": ["2025-10-26 10:00", "2025-10-26 14:00"],
        "checkout_duration_days": 3,
        "deposit_required": 50
      }
    ],
    "includes": ["3D Printer", "1kg PLA filament", "SD card with models"],
    "requirements": ["Complete safety training", "Age 16+ or adult supervision"],
    "instructions_url": "https://library.org/3d-printer-guide",
    "replacement_cost": 299,
    "rating": 4.5,
    "popular": true
  }
]
```

## AI Integration

### Claude Integration

The system prompt has been updated to handle diverse materials:

```typescript
export const buildSystemPrompt = (catalog: CatalogItem[]): string => {
  return `You are a friendly and knowledgeable library assistant.
  You can ONLY recommend items from the catalog provided below.
  Our library offers books, DVDs, games, equipment, comics, and more
  through our "Library of Things" program.

  When recommending items:
  - Consider the item type when making recommendations
  - Mention special requirements (deposits, age restrictions, booking)
  - Highlight unique offerings like museum passes or 3D printers

  Available items:
  ${JSON.stringify(catalogSummary)}`;
};
```

## Type Safety Benefits

1. **Compile-time checking**: TypeScript ensures all item types are handled
2. **IntelliSense support**: IDE knows exactly what fields are available
3. **Refactoring safety**: Changing types shows all affected code
4. **Self-documenting**: Types serve as documentation

## Performance Considerations

1. **Lazy loading**: Images use `loading="lazy"` attribute
2. **React Query caching**: Catalog data cached to minimize API calls
3. **Conditional rendering**: Only process fields that exist on items
4. **Fallback data**: Local catalog subset for offline/error states

## Accessibility Features

1. **ARIA labels**: Dynamic labels based on item type
2. **Screen reader support**: Proper semantic HTML
3. **Keyboard navigation**: All interactive elements accessible
4. **Status announcements**: Format availability clearly indicated

## Testing Approach

### Type Testing
```typescript
// Ensure discriminated union works
const processItem = (item: CatalogItem) => {
  switch (item.itemType) {
    case 'book':
      console.log(item.isbn); // TypeScript knows this exists
      break;
    case 'equipment':
      console.log(item.manufacturer); // TypeScript knows this exists
      break;
  }
};
```

### Component Testing
```typescript
// Test polymorphic rendering
describe('BookCard', () => {
  it('renders book with author', () => {
    const book: Book = { itemType: 'book', author: 'Test Author', ... };
    render(<BookCard book={book} />);
    expect(screen.getByText('by Test Author')).toBeInTheDocument();
  });

  it('renders equipment with manufacturer', () => {
    const equipment: EquipmentItem = { itemType: 'equipment', manufacturer: 'Test Co', ... };
    render(<BookCard book={equipment} />);
    expect(screen.getByText('by Test Co')).toBeInTheDocument();
  });
});
```

## Common Patterns

### Pattern 1: Type Guards for Conditional Logic
```typescript
if ('isbn' in item) {
  // TypeScript knows this is a Book
  displayISBN(item.isbn);
}
```

### Pattern 2: Exhaustive Switch Cases
```typescript
const getItemCategory = (item: CatalogItem): string => {
  switch (item.itemType) {
    case 'book': return 'Literature';
    case 'dvd':
    case 'audiovisual': return 'Media';
    case 'game': return 'Gaming';
    case 'equipment': return 'Tools & Equipment';
    case 'comic': return 'Comics & Graphic Novels';
    case 'thing': return 'Library of Things';
    // TypeScript ensures all cases are handled
  }
};
```

### Pattern 3: Polymorphic Props
```typescript
interface ItemListProps {
  items: CatalogItem[];  // Accepts any mix of item types
  onItemSelect: (item: CatalogItem) => void;
}
```

## Future Extensibility

The architecture supports easy addition of new material types:

1. Add new interface extending LibraryItem
2. Add to CatalogItem union type
3. Update formatters for new fields
4. Add items to catalog.json
5. TypeScript will guide you to update all affected code

This design ensures the system can grow to support any materials a modern library might offer while maintaining type safety and code quality.