# Adding New Materials to the Library Catalog

This guide provides step-by-step instructions for adding new types of materials to the Library of Things system.

## Quick Start: Adding Items to Existing Categories

If you're adding items that fit existing categories (books, DVDs, games, equipment, comics, things), follow these steps:

### Step 1: Choose the Correct Item Type

Determine which category your item belongs to:
- `book`: Books, ebooks, audiobooks
- `dvd` or `audiovisual`: Movies, TV shows, documentaries
- `game`: Video games, gaming consoles, VR headsets
- `equipment`: Tools, 3D printers, cameras, musical instruments
- `comic`: Comics, manga, graphic novels
- `thing`: Board games, camping gear, kitchen appliances, anything else

### Step 2: Create the JSON Entry

Add your item to `public/data/catalog.json`:

#### Example: Adding a Telescope (Equipment)
```json
{
  "id": "equipment_telescope_001",
  "itemType": "equipment",
  "title": "Celestron NexStar 8SE Telescope",
  "category": "Astronomy",
  "manufacturer": "Celestron",
  "model": "NexStar 8SE",
  "cover": "https://example.com/telescope.jpg",
  "description": "Computerized telescope perfect for serious beginners and advanced users. Features 8-inch aperture and automated finding of over 40,000 celestial objects.",
  "formats": [
    {
      "type": "equipment",
      "status": "available",
      "booking_required": true,
      "slots_available": ["2025-10-28 18:00", "2025-10-29 18:00"],
      "checkout_duration_days": 7,
      "deposit_required": 100
    }
  ],
  "includes": [
    "Telescope",
    "Tripod",
    "Eyepiece kit",
    "Star charts",
    "Carrying case"
  ],
  "requirements": [
    "Attend orientation session",
    "Valid ID and credit card for deposit"
  ],
  "instructions_url": "https://library.org/telescope-guide",
  "replacement_cost": 1299,
  "rating": 4.8,
  "popular": true
}
```

#### Example: Adding a Board Game (Thing)
```json
{
  "id": "thing_boardgame_wingspan",
  "itemType": "thing",
  "title": "Wingspan Board Game",
  "category": "Board Games",
  "brand": "Stonemaier Games",
  "cover": "https://example.com/wingspan.jpg",
  "description": "Award-winning bird-themed strategy game for 1-5 players. Beautiful artwork and engaging gameplay about birds and their habitats.",
  "formats": [
    {
      "type": "thing",
      "status": "available",
      "copies_available": 2,
      "copies_total": 3,
      "checkout_duration_days": 14
    }
  ],
  "includes": [
    "Game board",
    "170 bird cards",
    "5 player mats",
    "75 egg tokens",
    "Dice tower",
    "Rule book"
  ],
  "condition": "Like new",
  "suitable_ages": "10+",
  "rating": 4.9
}
```

### Step 3: Required vs Optional Fields

#### Required for ALL items:
```json
{
  "id": "unique_identifier",
  "itemType": "book|dvd|game|equipment|comic|thing",
  "title": "Item Title",
  "cover": "https://url-to-image.jpg",
  "formats": [...],
  "description": "Description of the item"
}
```

#### Required by item type:

**Books:**
- isbn, author, subjects[], publication_year, pages

**Media (DVD/Audiovisual):**
- release_year
- Optional: director, actors[], runtime_minutes, rating_mpaa, episodes, season

**Games:**
- platform[], developer, release_year
- Optional: publisher, rating_esrb, players, online_multiplayer, includes[]

**Equipment:**
- category
- Optional: manufacturer, model, includes[], requirements[], instructions_url, replacement_cost

**Comics:**
- publisher, publication_year
- Optional: author, artist, series, issue_number, volume

**Things:**
- category
- Optional: brand, includes[], condition, suitable_ages

### Step 4: Format Configuration

Configure the availability and checkout rules in the `formats` array:

#### Standard Format (Books, Media, Comics)
```json
"formats": [
  {
    "type": "physical|ebook|audiobook|dvd|bluray",
    "status": "available|waitlist|checked_out",
    "copies_available": 3,
    "copies_total": 5,
    "wait_time": "2 weeks",
    "holds": 4
  }
]
```

#### Equipment/Special Items Format
```json
"formats": [
  {
    "type": "equipment",
    "status": "available",
    "booking_required": true,
    "slots_available": [
      "2025-10-28 10:00",
      "2025-10-28 14:00"
    ],
    "checkout_duration_days": 7,
    "deposit_required": 50,
    "age_restriction": "18+"
  }
]
```

## Creating a New Material Category

If existing categories don't fit your needs, here's how to add a completely new type:

### Step 1: Update Type Definitions

Edit `src/types/index.ts`:

```typescript
// 1. Add to MaterialType
export type MaterialType = 'book' | 'dvd' | 'game' | 'equipment' |
  'comic' | 'audiovisual' | 'thing' | 'instrument'; // <- Added 'instrument'

// 2. Add format types if needed
export type ItemFormatType =
  | 'physical' | 'ebook' | 'audiobook'
  | 'dvd' | 'bluray' | 'cd' | 'vinyl'
  | 'ps5' | 'xbox' | 'switch' | 'pc' | 'retro'
  | 'equipment' | 'tool' | 'device'
  | 'comic' | 'manga' | 'graphic-novel'
  | 'acoustic' | 'electric' | 'digital'; // <- Added instrument formats

// 3. Create the new interface
export interface InstrumentItem extends LibraryItem {
  itemType: 'instrument';
  instrument_type: 'string' | 'wind' | 'percussion' | 'keyboard' | 'brass';
  brand: string;
  model?: string;
  skill_level: 'beginner' | 'intermediate' | 'advanced' | 'all';
  includes: string[];
  requires_amplifier?: boolean;
  maintenance_schedule?: string;
}

// 4. Add to CatalogItem union
export type CatalogItem = Book | MediaItem | GameItem | EquipmentItem |
  ComicItem | ThingItem | InstrumentItem; // <- Added InstrumentItem
```

### Step 2: Update Formatters

Edit `src/utils/formatters.ts`:

```typescript
// Add icon for new type
export const getMaterialIcon = (itemType: MaterialType): string => {
  switch (itemType) {
    case 'book': return '📚';
    case 'dvd': return '📀';
    case 'game': return '🎮';
    case 'equipment': return '🔧';
    case 'comic': return '📖';
    case 'audiovisual': return '🎬';
    case 'thing': return '📦';
    case 'instrument': return '🎸'; // <- Added
    default: return '📋';
  }
};

// Update formatItemCreator if needed
export const formatItemCreator = (item: CatalogItem): string => {
  if ('author' in item && item.author) return item.author;
  if ('director' in item && item.director) return item.director;
  if ('developer' in item && item.developer) return item.developer;
  if ('artist' in item && item.artist) return item.artist;
  if ('manufacturer' in item && item.manufacturer) return item.manufacturer;
  if ('brand' in item && item.brand) return item.brand; // <- Added for instruments
  return 'Unknown';
};
```

### Step 3: Add Items to Catalog

Add instrument items to `public/data/catalog.json`:

```json
{
  "id": "instrument_guitar_001",
  "itemType": "instrument",
  "title": "Yamaha FG830 Acoustic Guitar",
  "instrument_type": "string",
  "brand": "Yamaha",
  "model": "FG830",
  "skill_level": "all",
  "cover": "https://example.com/guitar.jpg",
  "description": "Quality acoustic guitar perfect for beginners to advanced players. Solid spruce top provides excellent tone.",
  "formats": [
    {
      "type": "acoustic",
      "status": "available",
      "checkout_duration_days": 30,
      "deposit_required": 50
    }
  ],
  "includes": [
    "Guitar",
    "Gig bag",
    "Strap",
    "Picks",
    "Spare strings",
    "Tuner"
  ],
  "maintenance_schedule": "Strings replaced monthly",
  "rating": 4.6,
  "popular": true
}
```

### Step 4: Test Your Changes

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Check for TypeScript errors:**
   ```bash
   npm run type-check
   ```

3. **Test in development:**
   ```bash
   npm run dev
   ```

4. **Verify the item appears and displays correctly**

## Best Practices

### 1. ID Naming Convention
Use descriptive IDs that include the type and a unique identifier:
- ✅ `equipment_3dprinter_001`
- ✅ `thing_boardgame_wingspan`
- ❌ `item1`
- ❌ `001`

### 2. Image URLs
- Use high-quality images (minimum 300x400px)
- For books: Use OpenLibrary covers: `https://covers.openlibrary.org/b/isbn/[ISBN]-L.jpg`
- For other items: Host images on a CDN or use stable URLs
- Always provide a cover image for better UX

### 3. Descriptions
- Keep descriptions between 50-200 characters
- Highlight unique features or included accessories
- Mention any special requirements upfront
- Use active, engaging language

### 4. Checkout Duration
Typical checkout periods:
- Books: 21 days
- DVDs: 7 days
- Games: 14 days
- Equipment: 3-7 days (with booking)
- Special items (museum passes): 1-3 days
- Seeds: 365 days (full growing season)

### 5. Safety and Appropriateness
Before adding an item, ensure it:
- ✅ Is safe for library patrons to use
- ✅ Doesn't pose liability risks
- ✅ Has clear age restrictions if needed
- ✅ Includes necessary safety equipment/instructions
- ✅ Can be reasonably maintained by library staff

### 6. Special Requirements
For items requiring special handling:

```json
{
  "requirements": [
    "Complete safety training",
    "Sign liability waiver",
    "Age 18+ or adult supervision",
    "Valid driver's license"
  ],
  "booking_required": true,
  "deposit_required": 100,
  "age_restriction": "18+"
}
```

## Validation Checklist

Before committing new items:

- [ ] Unique ID that follows naming convention
- [ ] Correct itemType from allowed values
- [ ] All required fields for that itemType
- [ ] Valid cover image URL
- [ ] At least one format with valid status
- [ ] Description between 50-200 characters
- [ ] No trailing commas in JSON
- [ ] Build passes (`npm run build`)
- [ ] Item appears correctly in dev server

## Common Errors and Solutions

### Error: "Property 'itemType' is missing"
**Solution:** Ensure every item has `"itemType": "book|dvd|game|equipment|comic|thing"`

### Error: "Type 'string' is not assignable to type 'MaterialType'"
**Solution:** The itemType value must exactly match one of the defined types (case-sensitive)

### Error: JSON Parse Error
**Solution:** Check for:
- Missing commas between items
- Trailing commas after last item
- Unclosed brackets or braces
- Invalid escape characters in strings

### Error: Image not loading
**Solution:**
- Verify URL is accessible
- Check for CORS issues
- Ensure HTTPS (not HTTP) for production
- Provide fallback image handling

## Examples of Real Library Items

Here are actual items that libraries lend:

### Unique but Real
- 🌱 Seed library (365-day checkout!)
- 🎫 Museum and zoo passes
- 🔬 Microscopes
- 🎂 Cake pans (various shapes)
- 🔍 Metal detectors
- 🏕️ Camping equipment
- 🧶 Knitting needles and looms
- 🔨 Power tools
- 🎸 Musical instruments
- 🖼️ Artwork for home
- 📷 Cameras and lenses
- 🎮 Gaming consoles
- 💡 Light therapy lamps
- 🌡️ Home energy audit kits
- 🎣 Fishing rods
- 🔭 Telescopes and binoculars
- 🎨 Art supplies and easels
- 🏃 Fitness trackers
- 🧩 Jigsaw puzzles
- 🎪 Party supplies

Remember: Modern libraries are community resource centers, not just book repositories!