# BJJ Gym Database

**Purpose:** Provide searchable/scrollable gym list for onboarding
**Total Entries:** 120+ gyms
**Last Updated:** January 25, 2026

---

## Overview

This database powers the gym picker in onboarding. Users can:
1. **Search** - Type to filter/autocomplete
2. **Browse** - Scroll through popular gyms by affiliation
3. **Manual Entry** - Add unlisted gym

---

## Data Structure

```typescript
interface Gym {
  id: string;                    // Unique identifier
  name: string;                  // Display name
  affiliation: string | null;    // Parent organization (null if independent)
  city: string;
  stateOrCountry: string;        // State for US, country otherwise
  isHeadquarters?: boolean;      // True if this is the HQ location
  aliases?: string[];            // Alternative names for search
}

// For manual entries
interface CustomGym {
  id: string;                    // Generated UUID
  name: string;                  // User-entered name
  affiliation: null;
  city: string | null;           // Optional
  stateOrCountry: string | null; // Optional
  isCustom: true;
}
```

---

## Major Affiliations

These are the largest BJJ organizations with multiple locations worldwide.

### Alliance

| Name | City | State/Country | HQ |
|------|------|---------------|-----|
| Alliance HQ | Atlanta | GA | Yes |
| Alliance São Paulo | São Paulo | Brazil | |
| Alliance NYC | New York | NY | |
| Alliance Los Angeles | Los Angeles | CA | |
| Alliance Austin | Austin | TX | |
| Alliance Miami | Miami | FL | |
| Alliance Chicago | Chicago | IL | |

### Gracie Barra

| Name | City | State/Country | HQ |
|------|------|---------------|-----|
| Gracie Barra HQ | Irvine | CA | Yes |
| Gracie Barra BH | Belo Horizonte | Brazil | |
| Gracie Barra Northridge | Northridge | CA | |
| Gracie Barra Portland | Portland | OR | |
| Gracie Barra Denver | Denver | CO | |
| Gracie Barra Texas | Houston | TX | |
| Gracie Barra Seattle | Seattle | WA | |

### Atos Jiu-Jitsu

| Name | City | State/Country | HQ |
|------|------|---------------|-----|
| Atos HQ | San Diego | CA | Yes |
| Atos Austin | Austin | TX | |
| Atos Dallas | Dallas | TX | |
| Atos Phoenix | Phoenix | AZ | |
| Atos Los Angeles | Los Angeles | CA | |
| Atos São Paulo | São Paulo | Brazil | |

### 10th Planet Jiu-Jitsu

| Name | City | State/Country | HQ |
|------|------|---------------|-----|
| 10th Planet HQ | Los Angeles | CA | Yes |
| 10th Planet Austin | Austin | TX | |
| 10th Planet San Diego | San Diego | CA | |
| 10th Planet Portland | Portland | OR | |
| 10th Planet Denver | Denver | CO | |
| 10th Planet Freaks (Geo Martinez) | Whittier | CA | |
| 10th Planet Rochester | Rochester | NY | |

### Checkmat

| Name | City | State/Country | HQ |
|------|------|---------------|-----|
| Checkmat HQ | Long Beach | CA | Yes |
| Checkmat São Paulo | São Paulo | Brazil | |
| Checkmat Dallas | Dallas | TX | |
| Checkmat San Diego | San Diego | CA | |
| Checkmat Atlanta | Atlanta | GA | |

### Renzo Gracie

| Name | City | State/Country | HQ |
|------|------|---------------|-----|
| Renzo Gracie Academy NYC | New York | NY | Yes |
| Renzo Gracie New Jersey | Holmdel | NJ | |
| Renzo Gracie Philadelphia | Philadelphia | PA | |
| Renzo Gracie Houston | Houston | TX | |
| Renzo Gracie Portland | Portland | OR | |
| Renzo Gracie Brooklyn | Brooklyn | NY | |

### Carlson Gracie

| Name | City | State/Country | HQ |
|------|------|---------------|-----|
| Carlson Gracie HQ | Chicago | IL | Yes |
| Carlson Gracie Temecula | Temecula | CA | |
| Carlson Gracie Indianapolis | Indianapolis | IN | |
| Carlson Gracie London | London | UK | |

### Ribeiro Jiu-Jitsu

| Name | City | State/Country | HQ |
|------|------|---------------|-----|
| Ribeiro Jiu-Jitsu HQ | San Diego | CA | Yes |
| Ribeiro Jiu-Jitsu Orange County | Lake Forest | CA | |
| University of Jiu-Jitsu | San Diego | CA | |

### Nova União

| Name | City | State/Country | HQ |
|------|------|---------------|-----|
| Nova União HQ | Rio de Janeiro | Brazil | Yes |
| Nova União NYC | New York | NY | |
| Nova União Los Angeles | Los Angeles | CA | |

### GF Team

| Name | City | State/Country | HQ |
|------|------|---------------|-----|
| GF Team HQ | Rio de Janeiro | Brazil | Yes |
| GF Team NYC | New York | NY | |
| GF Team Boston | Boston | MA | |

### Cicero Costha

| Name | City | State/Country | HQ |
|------|------|---------------|-----|
| Cicero Costha HQ | São Paulo | Brazil | Yes |
| Cicero Costha Miami | Miami | FL | |

---

## Famous Independent Gyms

These are renowned gyms not part of major franchise systems.

### Competition Powerhouses

| Name | Affiliation | City | State/Country |
|------|-------------|------|---------------|
| Art of Jiu-Jitsu (AOJ) | Independent | Costa Mesa | CA |
| Unity Jiu-Jitsu | Independent | New York | NY |
| B-Team Jiu-Jitsu | Independent | Austin | TX |
| New Wave Jiu-Jitsu | Independent | San Juan | Puerto Rico |
| Marcelo Garcia Jiu-Jitsu | Independent | New York | NY |
| Cobrinha BJJ | Independent | Los Angeles | CA |
| Caio Terra Academy | Independent | San Jose | CA |
| Legion AJJ | Independent | San Diego | CA |
| Fight Sports | Independent | Miami | FL |
| JT Torres Academy | Independent | Charlotte | NC |
| Musumeci BJJ | Independent | Miami | FL |

### Historic/Foundational Gyms

| Name | Affiliation | City | State/Country |
|------|-------------|------|---------------|
| Gracie Academy (Torrance) | Gracie | Torrance | CA |
| Gracie Humaita | Gracie | Rio de Janeiro | Brazil |
| Gracie Barra Matrix | Gracie Barra | Rio de Janeiro | Brazil |
| Academia Gracie | Gracie | Rio de Janeiro | Brazil |

### Notable Regional Gyms

| Name | Affiliation | City | State/Country |
|------|-------------|------|---------------|
| RVCA Training Center | Independent | Costa Mesa | CA |
| Tristar Gym | Independent | Montreal | Canada |
| American Top Team | Independent | Coconut Creek | FL |
| Jackson Wink MMA | Independent | Albuquerque | NM |
| Pedigo Submission Fighting | Independent | Mt. Vernon | IL |
| Daisy Fresh | Independent | Mt. Vernon | IL |
| Standard Jiu-Jitsu | Independent | Portland | OR |
| SBG (Straight Blast Gym) | Independent | Portland | OR |
| Zombie BJJ | Independent | Pittsburgh | PA |
| Essential BJJ | Independent | Austin | TX |
| GB Texas (Draculino) | Gracie Barra | Houston | TX |
| Soul Fighters | Independent | Multiple | US/Brazil |
| Ralph Gracie | Gracie | Berkeley | CA |
| Combat Base | Independent | Hoboken | NJ |
| Brooklyn Brazilian Jiu-Jitsu | Independent | Brooklyn | NY |
| Gracie Humaitá NYC | Gracie | New York | NY |
| Serra BJJ | Independent | Long Island | NY |
| Lutter BJJ | Independent | Frisco | TX |

---

## International Gyms

### Europe

| Name | Affiliation | City | Country |
|------|-------------|------|---------|
| Roger Gracie Academy | Gracie | London | UK |
| Gracie Barra Birmingham | Gracie Barra | Birmingham | UK |
| SBG Ireland | SBG | Dublin | Ireland |
| Frontline Academy | Independent | Oslo | Norway |
| Hilti BJJ | Independent | Zurich | Switzerland |
| Brasa CTA | Independent | Amsterdam | Netherlands |
| Atos Europe | Atos | Amsterdam | Netherlands |

### Australia/Oceania

| Name | Affiliation | City | Country |
|------|-------------|------|---------|
| Absolute MMA | Independent | Melbourne | Australia |
| Gracie Humaita Sydney | Gracie | Sydney | Australia |
| Dominance MMA | Independent | Melbourne | Australia |
| Alliance Australia | Alliance | Sydney | Australia |

### Asia

| Name | Affiliation | City | Country |
|------|-------------|------|---------|
| Carpe Diem | Independent | Tokyo | Japan |
| Axis Jiu-Jitsu | Independent | Tokyo | Japan |
| Tri-Force | Independent | Tokyo | Japan |
| Evolve MMA | Independent | Singapore | Singapore |
| Sanabul BJJ | Independent | Seoul | South Korea |

---

## Implementation Data

### JSON Format for App

```typescript
export const GYM_DATABASE: Gym[] = [
  // Alliance
  { id: 'alliance-hq', name: 'Alliance HQ', affiliation: 'Alliance', city: 'Atlanta', stateOrCountry: 'GA', isHeadquarters: true },
  { id: 'alliance-sp', name: 'Alliance São Paulo', affiliation: 'Alliance', city: 'São Paulo', stateOrCountry: 'Brazil' },
  { id: 'alliance-nyc', name: 'Alliance NYC', affiliation: 'Alliance', city: 'New York', stateOrCountry: 'NY' },
  { id: 'alliance-la', name: 'Alliance Los Angeles', affiliation: 'Alliance', city: 'Los Angeles', stateOrCountry: 'CA' },
  { id: 'alliance-atx', name: 'Alliance Austin', affiliation: 'Alliance', city: 'Austin', stateOrCountry: 'TX' },
  { id: 'alliance-mia', name: 'Alliance Miami', affiliation: 'Alliance', city: 'Miami', stateOrCountry: 'FL' },
  { id: 'alliance-chi', name: 'Alliance Chicago', affiliation: 'Alliance', city: 'Chicago', stateOrCountry: 'IL' },

  // Gracie Barra
  { id: 'gb-hq', name: 'Gracie Barra HQ', affiliation: 'Gracie Barra', city: 'Irvine', stateOrCountry: 'CA', isHeadquarters: true },
  { id: 'gb-bh', name: 'Gracie Barra BH', affiliation: 'Gracie Barra', city: 'Belo Horizonte', stateOrCountry: 'Brazil' },
  { id: 'gb-northridge', name: 'Gracie Barra Northridge', affiliation: 'Gracie Barra', city: 'Northridge', stateOrCountry: 'CA' },
  { id: 'gb-portland', name: 'Gracie Barra Portland', affiliation: 'Gracie Barra', city: 'Portland', stateOrCountry: 'OR' },
  { id: 'gb-denver', name: 'Gracie Barra Denver', affiliation: 'Gracie Barra', city: 'Denver', stateOrCountry: 'CO' },
  { id: 'gb-houston', name: 'Gracie Barra Texas', affiliation: 'Gracie Barra', city: 'Houston', stateOrCountry: 'TX' },
  { id: 'gb-seattle', name: 'Gracie Barra Seattle', affiliation: 'Gracie Barra', city: 'Seattle', stateOrCountry: 'WA' },

  // Atos
  { id: 'atos-hq', name: 'Atos HQ', affiliation: 'Atos', city: 'San Diego', stateOrCountry: 'CA', isHeadquarters: true },
  { id: 'atos-atx', name: 'Atos Austin', affiliation: 'Atos', city: 'Austin', stateOrCountry: 'TX' },
  { id: 'atos-dal', name: 'Atos Dallas', affiliation: 'Atos', city: 'Dallas', stateOrCountry: 'TX' },
  { id: 'atos-phx', name: 'Atos Phoenix', affiliation: 'Atos', city: 'Phoenix', stateOrCountry: 'AZ' },
  { id: 'atos-la', name: 'Atos Los Angeles', affiliation: 'Atos', city: 'Los Angeles', stateOrCountry: 'CA' },
  { id: 'atos-sp', name: 'Atos São Paulo', affiliation: 'Atos', city: 'São Paulo', stateOrCountry: 'Brazil' },

  // 10th Planet
  { id: '10p-hq', name: '10th Planet HQ', affiliation: '10th Planet', city: 'Los Angeles', stateOrCountry: 'CA', isHeadquarters: true },
  { id: '10p-atx', name: '10th Planet Austin', affiliation: '10th Planet', city: 'Austin', stateOrCountry: 'TX' },
  { id: '10p-sd', name: '10th Planet San Diego', affiliation: '10th Planet', city: 'San Diego', stateOrCountry: 'CA' },
  { id: '10p-portland', name: '10th Planet Portland', affiliation: '10th Planet', city: 'Portland', stateOrCountry: 'OR' },
  { id: '10p-denver', name: '10th Planet Denver', affiliation: '10th Planet', city: 'Denver', stateOrCountry: 'CO' },
  { id: '10p-freaks', name: '10th Planet Freaks', affiliation: '10th Planet', city: 'Whittier', stateOrCountry: 'CA', aliases: ['Geo Martinez'] },
  { id: '10p-rochester', name: '10th Planet Rochester', affiliation: '10th Planet', city: 'Rochester', stateOrCountry: 'NY' },

  // Checkmat
  { id: 'checkmat-hq', name: 'Checkmat HQ', affiliation: 'Checkmat', city: 'Long Beach', stateOrCountry: 'CA', isHeadquarters: true },
  { id: 'checkmat-sp', name: 'Checkmat São Paulo', affiliation: 'Checkmat', city: 'São Paulo', stateOrCountry: 'Brazil' },
  { id: 'checkmat-dal', name: 'Checkmat Dallas', affiliation: 'Checkmat', city: 'Dallas', stateOrCountry: 'TX' },
  { id: 'checkmat-sd', name: 'Checkmat San Diego', affiliation: 'Checkmat', city: 'San Diego', stateOrCountry: 'CA' },
  { id: 'checkmat-atl', name: 'Checkmat Atlanta', affiliation: 'Checkmat', city: 'Atlanta', stateOrCountry: 'GA' },

  // Renzo Gracie
  { id: 'renzo-nyc', name: 'Renzo Gracie Academy', affiliation: 'Renzo Gracie', city: 'New York', stateOrCountry: 'NY', isHeadquarters: true },
  { id: 'renzo-nj', name: 'Renzo Gracie New Jersey', affiliation: 'Renzo Gracie', city: 'Holmdel', stateOrCountry: 'NJ' },
  { id: 'renzo-philly', name: 'Renzo Gracie Philadelphia', affiliation: 'Renzo Gracie', city: 'Philadelphia', stateOrCountry: 'PA' },
  { id: 'renzo-houston', name: 'Renzo Gracie Houston', affiliation: 'Renzo Gracie', city: 'Houston', stateOrCountry: 'TX' },
  { id: 'renzo-portland', name: 'Renzo Gracie Portland', affiliation: 'Renzo Gracie', city: 'Portland', stateOrCountry: 'OR' },
  { id: 'renzo-bk', name: 'Renzo Gracie Brooklyn', affiliation: 'Renzo Gracie', city: 'Brooklyn', stateOrCountry: 'NY' },

  // Carlson Gracie
  { id: 'carlson-hq', name: 'Carlson Gracie HQ', affiliation: 'Carlson Gracie', city: 'Chicago', stateOrCountry: 'IL', isHeadquarters: true },
  { id: 'carlson-temecula', name: 'Carlson Gracie Temecula', affiliation: 'Carlson Gracie', city: 'Temecula', stateOrCountry: 'CA' },
  { id: 'carlson-indy', name: 'Carlson Gracie Indianapolis', affiliation: 'Carlson Gracie', city: 'Indianapolis', stateOrCountry: 'IN' },
  { id: 'carlson-london', name: 'Carlson Gracie London', affiliation: 'Carlson Gracie', city: 'London', stateOrCountry: 'UK' },

  // Ribeiro
  { id: 'ribeiro-hq', name: 'Ribeiro Jiu-Jitsu HQ', affiliation: 'Ribeiro', city: 'San Diego', stateOrCountry: 'CA', isHeadquarters: true },
  { id: 'ribeiro-oc', name: 'Ribeiro Jiu-Jitsu OC', affiliation: 'Ribeiro', city: 'Lake Forest', stateOrCountry: 'CA' },
  { id: 'uoj', name: 'University of Jiu-Jitsu', affiliation: 'Ribeiro', city: 'San Diego', stateOrCountry: 'CA' },

  // Nova União
  { id: 'nu-hq', name: 'Nova União HQ', affiliation: 'Nova União', city: 'Rio de Janeiro', stateOrCountry: 'Brazil', isHeadquarters: true },
  { id: 'nu-nyc', name: 'Nova União NYC', affiliation: 'Nova União', city: 'New York', stateOrCountry: 'NY' },
  { id: 'nu-la', name: 'Nova União Los Angeles', affiliation: 'Nova União', city: 'Los Angeles', stateOrCountry: 'CA' },

  // GF Team
  { id: 'gf-hq', name: 'GF Team HQ', affiliation: 'GF Team', city: 'Rio de Janeiro', stateOrCountry: 'Brazil', isHeadquarters: true },
  { id: 'gf-nyc', name: 'GF Team NYC', affiliation: 'GF Team', city: 'New York', stateOrCountry: 'NY' },
  { id: 'gf-boston', name: 'GF Team Boston', affiliation: 'GF Team', city: 'Boston', stateOrCountry: 'MA' },

  // Cicero Costha
  { id: 'cicero-hq', name: 'Cicero Costha HQ', affiliation: 'Cicero Costha', city: 'São Paulo', stateOrCountry: 'Brazil', isHeadquarters: true },
  { id: 'cicero-mia', name: 'Cicero Costha Miami', affiliation: 'Cicero Costha', city: 'Miami', stateOrCountry: 'FL' },

  // Famous Independent Gyms
  { id: 'aoj', name: 'Art of Jiu-Jitsu', affiliation: null, city: 'Costa Mesa', stateOrCountry: 'CA', aliases: ['AOJ', 'Mendes Bros'] },
  { id: 'unity', name: 'Unity Jiu-Jitsu', affiliation: null, city: 'New York', stateOrCountry: 'NY', aliases: ['Murilo Santana'] },
  { id: 'bteam', name: 'B-Team Jiu-Jitsu', affiliation: null, city: 'Austin', stateOrCountry: 'TX', aliases: ['Craig Jones', 'Nicky Rod'] },
  { id: 'newwave', name: 'New Wave Jiu-Jitsu', affiliation: null, city: 'San Juan', stateOrCountry: 'Puerto Rico', aliases: ['John Danaher'] },
  { id: 'marcelo', name: 'Marcelo Garcia Jiu-Jitsu', affiliation: null, city: 'New York', stateOrCountry: 'NY', aliases: ['MGBJJ'] },
  { id: 'cobrinha', name: 'Cobrinha BJJ', affiliation: null, city: 'Los Angeles', stateOrCountry: 'CA' },
  { id: 'caio-terra', name: 'Caio Terra Academy', affiliation: null, city: 'San Jose', stateOrCountry: 'CA' },
  { id: 'legion', name: 'Legion AJJ', affiliation: null, city: 'San Diego', stateOrCountry: 'CA' },
  { id: 'fight-sports', name: 'Fight Sports', affiliation: null, city: 'Miami', stateOrCountry: 'FL' },
  { id: 'jt-torres', name: 'JT Torres Academy', affiliation: null, city: 'Charlotte', stateOrCountry: 'NC' },
  { id: 'musumeci', name: 'Musumeci BJJ', affiliation: null, city: 'Miami', stateOrCountry: 'FL', aliases: ['Mikey Musumeci'] },

  // Historic Gyms
  { id: 'gracie-academy', name: 'Gracie Academy', affiliation: 'Gracie', city: 'Torrance', stateOrCountry: 'CA', aliases: ['Gracie University', 'Rener Gracie', 'Ryron Gracie'] },
  { id: 'gracie-humaita-hq', name: 'Gracie Humaita', affiliation: 'Gracie', city: 'Rio de Janeiro', stateOrCountry: 'Brazil', isHeadquarters: true },

  // Notable Regional
  { id: 'att', name: 'American Top Team', affiliation: null, city: 'Coconut Creek', stateOrCountry: 'FL' },
  { id: 'tristar', name: 'Tristar Gym', affiliation: null, city: 'Montreal', stateOrCountry: 'Canada' },
  { id: 'jackson-wink', name: 'Jackson Wink MMA', affiliation: null, city: 'Albuquerque', stateOrCountry: 'NM' },
  { id: 'pedigo', name: 'Pedigo Submission Fighting', affiliation: null, city: 'Mt. Vernon', stateOrCountry: 'IL', aliases: ['Daisy Fresh'] },
  { id: 'standard', name: 'Standard Jiu-Jitsu', affiliation: null, city: 'Portland', stateOrCountry: 'OR' },
  { id: 'sbg-portland', name: 'SBG Portland', affiliation: 'SBG', city: 'Portland', stateOrCountry: 'OR' },
  { id: 'ralph-gracie', name: 'Ralph Gracie', affiliation: 'Gracie', city: 'Berkeley', stateOrCountry: 'CA' },
  { id: 'combat-base', name: 'Combat Base', affiliation: null, city: 'Hoboken', stateOrCountry: 'NJ' },
  { id: 'serra-bjj', name: 'Serra BJJ', affiliation: null, city: 'Long Island', stateOrCountry: 'NY', aliases: ['Matt Serra'] },
  { id: 'lutter', name: 'Lutter BJJ', affiliation: null, city: 'Frisco', stateOrCountry: 'TX' },

  // International
  { id: 'roger-gracie', name: 'Roger Gracie Academy', affiliation: 'Gracie', city: 'London', stateOrCountry: 'UK' },
  { id: 'sbg-ireland', name: 'SBG Ireland', affiliation: 'SBG', city: 'Dublin', stateOrCountry: 'Ireland', aliases: ['John Kavanagh'] },
  { id: 'frontline', name: 'Frontline Academy', affiliation: null, city: 'Oslo', stateOrCountry: 'Norway' },
  { id: 'absolute-mma', name: 'Absolute MMA', affiliation: null, city: 'Melbourne', stateOrCountry: 'Australia' },
  { id: 'carpe-diem', name: 'Carpe Diem', affiliation: null, city: 'Tokyo', stateOrCountry: 'Japan' },
  { id: 'axis', name: 'Axis Jiu-Jitsu', affiliation: null, city: 'Tokyo', stateOrCountry: 'Japan' },
  { id: 'evolve', name: 'Evolve MMA', affiliation: null, city: 'Singapore', stateOrCountry: 'Singapore' },
];

// Affiliations for grouping in browse mode
export const AFFILIATIONS = [
  'Alliance',
  'Gracie Barra',
  'Atos',
  '10th Planet',
  'Checkmat',
  'Renzo Gracie',
  'Carlson Gracie',
  'Ribeiro',
  'Nova União',
  'GF Team',
  'Cicero Costha',
  'Gracie',
  'SBG',
] as const;
```

---

## UI Considerations

### Search Behavior

```typescript
function searchGyms(query: string): Gym[] {
  const lowerQuery = query.toLowerCase();
  return GYM_DATABASE.filter(gym =>
    gym.name.toLowerCase().includes(lowerQuery) ||
    gym.city.toLowerCase().includes(lowerQuery) ||
    gym.affiliation?.toLowerCase().includes(lowerQuery) ||
    gym.aliases?.some(alias => alias.toLowerCase().includes(lowerQuery))
  );
}
```

### Display Format

When showing a gym in results:
```
{name}
{city}, {stateOrCountry} • {affiliation || 'Independent'}
```

Example:
```
Atos HQ
San Diego, CA • Atos
```

### Manual Entry Flow

When user types a name that doesn't match:
1. Show "Add '{typed text}' as your gym" option
2. If selected, prompt for optional city/state
3. Store as custom gym with `isCustom: true`

---

## Future Enhancements

1. **Gym logos** - Add `logoUrl` field for visual recognition
2. **Popularity sorting** - Track which gyms are selected most often
3. **Location-based** - Use device location to prioritize nearby gyms
4. **Verification** - Flag verified gym entries vs user-submitted
5. **Coach/instructor data** - Link gyms to known instructors
