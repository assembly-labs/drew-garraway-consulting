/**
 * BJJ Gym Database
 *
 * 120+ popular BJJ gyms organized by affiliation.
 * Used in onboarding for gym selection with search/browse/manual entry.
 */

export interface Gym {
  id: string;
  name: string;
  affiliation: string | null;
  city: string;
  stateOrCountry: string;
  isHeadquarters?: boolean;
  aliases?: string[];
}

export interface GymSelection {
  gymId: string;
  gymName: string;
  isCustom: boolean;
  city?: string;
  stateOrCountry?: string;
  affiliation?: string;
}

export const AFFILIATIONS = [
  'Alliance',
  'Gracie Barra',
  'Atos',
  '10th Planet',
  'Checkmat',
  'Renzo Gracie',
  'Carlson Gracie',
  'Ribeiro',
  'Nova Uniao',
  'GF Team',
  'Cicero Costha',
  'Gracie',
  'SBG',
] as const;

export type Affiliation = typeof AFFILIATIONS[number];

export const GYM_DATABASE: Gym[] = [
  // Alliance
  { id: 'alliance-hq', name: 'Alliance HQ', affiliation: 'Alliance', city: 'Atlanta', stateOrCountry: 'GA', isHeadquarters: true },
  { id: 'alliance-sp', name: 'Alliance Sao Paulo', affiliation: 'Alliance', city: 'Sao Paulo', stateOrCountry: 'Brazil' },
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
  { id: 'gb-philly', name: 'Gracie Barra Philadelphia', affiliation: 'Gracie Barra', city: 'Philadelphia', stateOrCountry: 'PA' },

  // Atos
  { id: 'atos-hq', name: 'Atos HQ', affiliation: 'Atos', city: 'San Diego', stateOrCountry: 'CA', isHeadquarters: true },
  { id: 'atos-atx', name: 'Atos Austin', affiliation: 'Atos', city: 'Austin', stateOrCountry: 'TX' },
  { id: 'atos-dal', name: 'Atos Dallas', affiliation: 'Atos', city: 'Dallas', stateOrCountry: 'TX' },
  { id: 'atos-phx', name: 'Atos Phoenix', affiliation: 'Atos', city: 'Phoenix', stateOrCountry: 'AZ' },
  { id: 'atos-la', name: 'Atos Los Angeles', affiliation: 'Atos', city: 'Los Angeles', stateOrCountry: 'CA' },
  { id: 'atos-sp', name: 'Atos Sao Paulo', affiliation: 'Atos', city: 'Sao Paulo', stateOrCountry: 'Brazil' },

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
  { id: 'checkmat-sp', name: 'Checkmat Sao Paulo', affiliation: 'Checkmat', city: 'Sao Paulo', stateOrCountry: 'Brazil' },
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

  // Nova Uniao
  { id: 'nu-hq', name: 'Nova Uniao HQ', affiliation: 'Nova Uniao', city: 'Rio de Janeiro', stateOrCountry: 'Brazil', isHeadquarters: true },
  { id: 'nu-nyc', name: 'Nova Uniao NYC', affiliation: 'Nova Uniao', city: 'New York', stateOrCountry: 'NY' },
  { id: 'nu-la', name: 'Nova Uniao Los Angeles', affiliation: 'Nova Uniao', city: 'Los Angeles', stateOrCountry: 'CA' },

  // GF Team
  { id: 'gf-hq', name: 'GF Team HQ', affiliation: 'GF Team', city: 'Rio de Janeiro', stateOrCountry: 'Brazil', isHeadquarters: true },
  { id: 'gf-nyc', name: 'GF Team NYC', affiliation: 'GF Team', city: 'New York', stateOrCountry: 'NY' },
  { id: 'gf-boston', name: 'GF Team Boston', affiliation: 'GF Team', city: 'Boston', stateOrCountry: 'MA' },

  // Cicero Costha
  { id: 'cicero-hq', name: 'Cicero Costha HQ', affiliation: 'Cicero Costha', city: 'Sao Paulo', stateOrCountry: 'Brazil', isHeadquarters: true },
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

  // Notable Regional Gyms
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

/**
 * Search gyms by query string
 * Matches against name, city, affiliation, and aliases
 */
export function searchGyms(query: string): Gym[] {
  if (!query.trim()) return [];

  const lowerQuery = query.toLowerCase();
  return GYM_DATABASE.filter(gym =>
    gym.name.toLowerCase().includes(lowerQuery) ||
    gym.city.toLowerCase().includes(lowerQuery) ||
    gym.affiliation?.toLowerCase().includes(lowerQuery) ||
    gym.aliases?.some(alias => alias.toLowerCase().includes(lowerQuery))
  ).slice(0, 10); // Limit to 10 results
}

/**
 * Get gyms grouped by affiliation for browse mode
 */
export function getGymsByAffiliation(): Record<string, Gym[]> {
  const grouped: Record<string, Gym[]> = {};

  // Add affiliated gyms
  for (const affiliation of AFFILIATIONS) {
    const gyms = GYM_DATABASE.filter(g => g.affiliation === affiliation);
    if (gyms.length > 0) {
      grouped[affiliation] = gyms;
    }
  }

  // Add independent gyms
  const independents = GYM_DATABASE.filter(g => g.affiliation === null);
  if (independents.length > 0) {
    grouped['Independent'] = independents;
  }

  return grouped;
}

/**
 * Get popular gyms (headquarters + famous independents)
 */
export function getPopularGyms(): Gym[] {
  const hqs = GYM_DATABASE.filter(g => g.isHeadquarters);
  const famous = GYM_DATABASE.filter(g =>
    g.affiliation === null &&
    ['aoj', 'unity', 'bteam', 'newwave', 'marcelo', 'cobrinha'].includes(g.id)
  );
  return [...hqs, ...famous];
}

/**
 * Create a custom gym selection from user input
 */
export function createCustomGym(
  name: string,
  city?: string,
  stateOrCountry?: string
): GymSelection {
  return {
    gymId: `custom-${Date.now()}`,
    gymName: name,
    isCustom: true,
    city: city || undefined,
    stateOrCountry: stateOrCountry || undefined,
    affiliation: undefined,
  };
}

/**
 * Create a gym selection from a database gym
 */
export function selectGym(gym: Gym): GymSelection {
  return {
    gymId: gym.id,
    gymName: gym.name,
    isCustom: false,
    city: gym.city,
    stateOrCountry: gym.stateOrCountry,
    affiliation: gym.affiliation || undefined,
  };
}
