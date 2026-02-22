// === Card Types ===

export type Emotion = 'happy' | 'angry' | 'sad' | 'surprised' | 'confused';

export type Character = 'Hiro' | 'Tatami' | 'Lumi' | 'Stella' | 'Rocky';

export interface PowerCard {
  id: string;
  character: Character;
  cardNumber: string;
  techniqueName: string;
  techniqueDescription: string;
  emotionTypes: Emotion[];
}

export interface ActionCard {
  id: string;
  promptText: string;
  groupAction: boolean;
}

export interface FeelingsCard {
  id: string;
  emotion: Emotion;
  event: string;
}

export type CentralCard = ActionCard | FeelingsCard;

// Type guard to distinguish card types
export function isActionCard(card: CentralCard): card is ActionCard {
  return 'promptText' in card;
}

export function isFeelingsCard(card: CentralCard): card is FeelingsCard {
  return 'emotion' in card;
}

// === Game State ===

export type GamePhase =
  | 'welcome'
  | 'facilitator-setup'
  | 'setup'
  | 'playing'
  | 'action-prompt'
  | 'empathy-drawn'
  | 'match-success'
  | 'match-fail'
  | 'game-won';

export interface PlayerState {
  id: number;
  hand: PowerCard[];
}

export interface CompletedPair {
  feelingsCard: FeelingsCard;
  powerCard: PowerCard;
}

export interface GameState {
  phase: GamePhase;
  playerCount: number;
  players: PlayerState[];
  activePlayerIndex: number;
  centralPile: CentralCard[];
  powerDeck: PowerCard[];
  activeEmpathy: FeelingsCard[];
  completedPairs: CompletedPair[];
  currentDrawnCard: CentralCard | null;
  totalEmpathyCards: number;
  favoritedPowerCardIds: Set<string>;
  favoritedFeelingsCardIds: Set<string>;
}

// === Actions (Reducer) ===

export type GameAction =
  | { type: 'SET_PLAYER_COUNT'; count: number }
  | { type: 'START_GAME' }
  | { type: 'DRAW_CARD' }
  | { type: 'DISMISS_ACTION' }
  | { type: 'ATTEMPT_MATCH'; powerCardId: string }
  | { type: 'ATTEMPT_MATCH_ACTIVE'; feelingsCardId: string; powerCardId: string }
  | { type: 'SEND_TO_ACTIVE' }
  | { type: 'ACKNOWLEDGE_MATCH' }
  | { type: 'NEXT_TURN' }
  | { type: 'NEW_GAME' }
  | { type: 'ENTER_FACILITATOR_SETUP' }
  | { type: 'EXIT_FACILITATOR_SETUP' }
  | { type: 'TOGGLE_FAVORITE_POWER'; cardId: string }
  | { type: 'TOGGLE_FAVORITE_FEELINGS'; cardId: string };
