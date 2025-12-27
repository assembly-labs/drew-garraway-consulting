// Mock data for CAP prototype

export type Sport = 'hockey' | 'football' | 'baseball' | 'soccer' | 'lacrosse' | 'basketball';

export type UserRole = 'parent' | 'coach' | 'photographer' | 'admin';

export interface Player {
  id: string;
  firstName: string;
  jerseyNumber: number;
  position: string;
  photoUrl?: string;
  enhancedPhotoUrl?: string;
  stats?: Record<string, any>;
  bio?: string;
}

export interface Team {
  id: string;
  name: string;
  sport: Sport;
  season: string;
  colors: string[];
  logoUrl?: string;
  players: Player[];
  ownerId: string;
  createdAt: Date;
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  teams?: string[];
}

export interface Order {
  id: string;
  teamId: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  items: number;
  total: number;
  createdAt: Date;
  trackingNumber?: string;
}

// Sport-specific player data
const POSITIONS_BY_SPORT: Record<Sport, string[]> = {
  hockey: ['Center', 'Right Wing', 'Left Wing', 'Defense', 'Goalie'],
  football: ['Quarterback', 'Running Back', 'Wide Receiver', 'Linebacker', 'Safety', 'Cornerback'],
  baseball: ['Pitcher', 'Catcher', 'First Base', 'Second Base', 'Shortstop', 'Third Base', 'Outfield'],
  soccer: ['Forward', 'Midfielder', 'Defender', 'Goalkeeper'],
  lacrosse: ['Attack', 'Midfield', 'Defense', 'Goalie'],
  basketball: ['Point Guard', 'Shooting Guard', 'Small Forward', 'Power Forward', 'Center'],
};

// Synthetic player names
const FIRST_NAMES = [
  'Alex', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Cameron', 'Avery', 'Quinn', 'Blake',
  'Mason', 'Logan', 'Ryan', 'Tyler', 'Dylan', 'Hunter', 'Connor', 'Ethan', 'Jackson', 'Lucas',
  'Emma', 'Olivia', 'Sophia', 'Isabella', 'Mia', 'Charlotte', 'Amelia', 'Harper', 'Evelyn', 'Abigail'
];

// Generate random player
function generatePlayer(sport: Sport, index: number): Player {
  const positions = POSITIONS_BY_SPORT[sport];
  const firstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];

  return {
    id: `player-${Date.now()}-${index}`,
    firstName,
    jerseyNumber: Math.floor(Math.random() * 99) + 1,
    position: positions[Math.floor(Math.random() * positions.length)],
    photoUrl: `https://picsum.photos/seed/${firstName}${index}/400/600`,
    enhancedPhotoUrl: `https://picsum.photos/seed/${firstName}${index}enhanced/400/600`,
    bio: `${firstName} is a dedicated player who brings energy and passion to every game. Known for their teamwork and positive attitude on and off the field.`,
    stats: generateStats(sport),
  };
}

// Generate sport-specific stats
function generateStats(sport: Sport): Record<string, any> {
  switch (sport) {
    case 'hockey':
      return {
        goals: Math.floor(Math.random() * 20),
        assists: Math.floor(Math.random() * 30),
        points: Math.floor(Math.random() * 50),
        penaltyMinutes: Math.floor(Math.random() * 40),
      };
    case 'football':
      return {
        touchdowns: Math.floor(Math.random() * 15),
        yards: Math.floor(Math.random() * 1000),
        tackles: Math.floor(Math.random() * 50),
        interceptions: Math.floor(Math.random() * 5),
      };
    case 'baseball':
      return {
        battingAverage: '.' + Math.floor(Math.random() * 400).toString().padStart(3, '0'),
        homeRuns: Math.floor(Math.random() * 20),
        rbi: Math.floor(Math.random() * 60),
        strikeouts: Math.floor(Math.random() * 100),
      };
    case 'soccer':
      return {
        goals: Math.floor(Math.random() * 25),
        assists: Math.floor(Math.random() * 20),
        saves: Math.floor(Math.random() * 50),
        yellowCards: Math.floor(Math.random() * 5),
      };
    case 'lacrosse':
      return {
        goals: Math.floor(Math.random() * 40),
        assists: Math.floor(Math.random() * 30),
        groundBalls: Math.floor(Math.random() * 50),
        faceoffWins: Math.floor(Math.random() * 100),
      };
    case 'basketball':
      return {
        pointsPerGame: (Math.random() * 20 + 5).toFixed(1),
        rebounds: Math.floor(Math.random() * 200),
        assists: Math.floor(Math.random() * 150),
        steals: Math.floor(Math.random() * 50),
      };
    default:
      return {};
  }
}

// Team names by sport
const TEAM_NAMES: Record<Sport, string[]> = {
  hockey: ['Thunder', 'Lightning', 'Ice Hawks', 'Blizzard', 'Wolves', 'Storm'],
  football: ['Eagles', 'Titans', 'Warriors', 'Panthers', 'Lions', 'Spartans'],
  baseball: ['Sluggers', 'Bombers', 'Aces', 'Rockets', 'All-Stars', 'Legends'],
  soccer: ['United', 'Strikers', 'Phoenix', 'Dynamo', 'Galaxy', 'Thunder'],
  lacrosse: ['Attackers', 'Warriors', 'Elite', 'Crusaders', 'Stallions', 'Raptors'],
  basketball: ['Hoops', 'Nets', 'Ballers', 'Thunder', 'Heat', 'Magic'],
};

// Generate teams
export function generateTeam(sport: Sport, ownerId: string): Team {
  const teamNames = TEAM_NAMES[sport];
  const teamName = teamNames[Math.floor(Math.random() * teamNames.length)];
  const playerCount = 12 + Math.floor(Math.random() * 8); // 12-20 players

  return {
    id: `team-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name: `${teamName} ${sport.charAt(0).toUpperCase() + sport.slice(1)} Club`,
    sport,
    season: '2024 Spring',
    colors: ['#FFD700', '#0A1F44'],
    logoUrl: `https://via.placeholder.com/200x200/FFD700/0A1F44?text=${teamName[0]}`,
    players: Array.from({ length: playerCount }, (_, i) => generatePlayer(sport, i)),
    ownerId,
    createdAt: new Date(),
  };
}

// Mock users
export const MOCK_USERS: User[] = [
  {
    id: 'user-parent-1',
    email: 'parent@test.com',
    role: 'parent',
    name: 'Sarah Johnson',
    teams: [],
  },
  {
    id: 'user-coach-1',
    email: 'coach@test.com',
    role: 'coach',
    name: 'Mike Thompson',
    teams: [],
  },
  {
    id: 'user-photog-1',
    email: 'photographer@test.com',
    role: 'photographer',
    name: 'Alex Chen',
    teams: [],
  },
  {
    id: 'user-admin-1',
    email: 'admin@test.com',
    role: 'admin',
    name: 'CAP Administrator',
    teams: [],
  },
];

// Card templates
export const CARD_TEMPLATES = [
  {
    id: 'template-championship',
    name: 'Championship Gold',
    description: 'Premium gold foil design',
    preview: 'https://via.placeholder.com/300x420/FFD700/0A1F44?text=Championship',
  },
  {
    id: 'template-classic',
    name: 'Classic CAP',
    description: 'Traditional trading card style',
    preview: 'https://via.placeholder.com/300x420/FFFFFF/0A1F44?text=Classic',
  },
  {
    id: 'template-modern',
    name: 'Modern Champion',
    description: 'Clean, contemporary design',
    preview: 'https://via.placeholder.com/300x420/0A1F44/FFD700?text=Modern',
  },
  {
    id: 'template-rookie',
    name: 'Rising Rookie',
    description: 'Perfect for first-time players',
    preview: 'https://via.placeholder.com/300x420/DC143C/FFFFFF?text=Rookie',
  },
  {
    id: 'template-elite',
    name: 'Elite Athlete',
    description: 'For the MVP players',
    preview: 'https://via.placeholder.com/300x420/0066FF/FFFFFF?text=Elite',
  },
];

// Mock orders
export function generateOrder(teamId: string): Order {
  const statuses: Order['status'][] = ['pending', 'processing', 'shipped', 'delivered'];
  const status = statuses[Math.floor(Math.random() * statuses.length)];

  return {
    id: `CAP-2024-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    teamId,
    status,
    items: 120, // 15 players x 8 cards each
    total: 28.00,
    createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date in last 30 days
    trackingNumber: status === 'shipped' || status === 'delivered'
      ? `TRK${Math.random().toString(36).substr(2, 12).toUpperCase()}`
      : undefined,
  };
}

// Platform statistics for admin dashboard
export const PLATFORM_STATS = {
  totalUsers: 1247,
  totalTeams: 384,
  totalCards: 15798,
  totalRevenue: 42195.50,
  activeOrders: 23,
  monthlyGrowth: 18.5,
  topSport: 'baseball',
  averageTeamSize: 14.3,
  conversionRate: 34.2,
  customerSatisfaction: 4.8,
};

// Mock photo processing stages
export const PHOTO_PROCESSING_STAGES = [
  { stage: 'Uploading', duration: 2000 },
  { stage: 'Analyzing Quality', duration: 1500 },
  { stage: 'Removing Background', duration: 3000 },
  { stage: 'Enhancing Colors', duration: 2000 },
  { stage: 'Applying AI Magic', duration: 2500 },
  { stage: 'Complete', duration: 500 },
];

// Pricing tiers
export const PRICING_TIERS = {
  rookie: {
    name: 'Rookie Package',
    price: 28,
    cards: 8,
    features: [
      'DIY photo upload',
      'Basic templates',
      'AI background removal',
      'Standard shipping',
    ],
  },
  pro: {
    name: 'Pro Package',
    price: 75,
    cards: 25,
    features: [
      'Professional photographer',
      'Premium templates',
      'AI enhancement suite',
      'Express shipping',
      'Digital copies included',
    ],
  },
  championship: {
    name: 'Championship Package',
    price: 150,
    cards: 50,
    features: [
      'Full team coverage',
      'All premium templates',
      'Complete AI suite',
      'Priority production',
      'Free reprints',
      'Team poster included',
    ],
  },
};