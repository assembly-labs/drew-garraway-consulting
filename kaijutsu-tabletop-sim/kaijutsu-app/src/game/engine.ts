import type {
  GameState,
  GameAction,
  CentralCard,
  PowerCard,
  FeelingsCard,
} from './types';
import { isActionCard, isFeelingsCard } from './types';
import { canMatch } from './matching';
import { shuffle } from './shuffle';
import { HAND_SIZE } from './constants';
import cardData from '../assets/cards.json';

export function createInitialState(): GameState {
  return {
    phase: 'welcome',
    playerCount: 0,
    players: [],
    activePlayerIndex: 0,
    centralPile: [],
    powerDeck: [],
    activeEmpathy: [],
    completedPairs: [],
    currentDrawnCard: null,
    totalEmpathyCards: 0,
    favoritedPowerCardIds: new Set(),
    favoritedFeelingsCardIds: new Set(),
  };
}

/**
 * Weighted shuffle: favorited cards are placed in the top third of the deck,
 * non-favorited cards fill the rest. Both groups are shuffled internally.
 */
function weightedShuffle<T extends { id: string }>(cards: T[], favoritedIds: Set<string>): T[] {
  if (favoritedIds.size === 0) return shuffle(cards);

  const favorited = cards.filter(c => favoritedIds.has(c.id));
  const rest = cards.filter(c => !favoritedIds.has(c.id));

  const shuffledFavorited = shuffle(favorited);
  const shuffledRest = shuffle(rest);

  // Place favorited in the top third
  const topThirdSize = Math.ceil(cards.length / 3);
  const result: T[] = [];

  // Fill top third with favorited cards first, then rest
  let favIdx = 0;
  let restIdx = 0;
  for (let i = 0; i < cards.length; i++) {
    if (i < topThirdSize && favIdx < shuffledFavorited.length) {
      result.push(shuffledFavorited[favIdx++]);
    } else if (restIdx < shuffledRest.length) {
      result.push(shuffledRest[restIdx++]);
    } else {
      result.push(shuffledFavorited[favIdx++]);
    }
  }

  return result;
}

function setupGame(state: GameState): GameState {
  const powerCards = weightedShuffle(
    cardData.powerCards as PowerCard[],
    state.favoritedPowerCardIds
  );
  const feelingsCards = cardData.feelingsCards as FeelingsCard[];
  const actionCards = cardData.actionCards as CentralCard[];

  // Weight the feelings cards in the central pile
  const weightedFeelings = weightedShuffle(feelingsCards, state.favoritedFeelingsCardIds);
  const centralPile = shuffle([...weightedFeelings, ...actionCards]);

  const players = [];
  let deckIndex = 0;
  for (let i = 0; i < state.playerCount; i++) {
    const hand = powerCards.slice(deckIndex, deckIndex + HAND_SIZE);
    deckIndex += HAND_SIZE;
    players.push({ id: i + 1, hand });
  }

  const powerDeck = powerCards.slice(deckIndex);

  return {
    ...state,
    phase: 'playing',
    players,
    activePlayerIndex: 0,
    centralPile,
    powerDeck,
    activeEmpathy: [],
    completedPairs: [],
    currentDrawnCard: null,
    totalEmpathyCards: feelingsCards.length,
  };
}

function nextTurn(state: GameState): GameState {
  const nextIndex = (state.activePlayerIndex + 1) % state.playerCount;
  return { ...state, phase: 'playing', activePlayerIndex: nextIndex, currentDrawnCard: null };
}

function checkWinCondition(state: GameState): GameState {
  if (state.completedPairs.length >= state.totalEmpathyCards) {
    return { ...state, phase: 'game-won' };
  }

  if (state.centralPile.length === 0 && state.activeEmpathy.length > 0) {
    const anyMatchPossible = state.players.some(player =>
      state.activeEmpathy.some(fc =>
        player.hand.some(pc => canMatch(pc, fc))
      )
    );
    if (!anyMatchPossible) {
      return { ...state, phase: 'game-won' };
    }
  }

  return state;
}

function toggleInSet(set: Set<string>, id: string): Set<string> {
  const next = new Set(set);
  if (next.has(id)) {
    next.delete(id);
  } else {
    next.add(id);
  }
  return next;
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SET_PLAYER_COUNT': {
      return { ...state, phase: 'setup', playerCount: action.count };
    }

    case 'START_GAME': {
      if (state.playerCount < 2 || state.playerCount > 4) return state;
      return setupGame(state);
    }

    case 'DRAW_CARD': {
      if (state.phase !== 'playing' || state.centralPile.length === 0) return state;
      const [drawnCard, ...remainingPile] = state.centralPile;
      const newPhase = isActionCard(drawnCard) ? 'action-prompt' : 'empathy-drawn';
      return {
        ...state,
        phase: newPhase,
        centralPile: remainingPile,
        currentDrawnCard: drawnCard,
      };
    }

    case 'DISMISS_ACTION': {
      if (state.phase !== 'action-prompt') return state;
      return checkWinCondition(nextTurn(state));
    }

    case 'ATTEMPT_MATCH': {
      if (state.phase !== 'empathy-drawn' || !state.currentDrawnCard) return state;
      const feelingsCard = state.currentDrawnCard;
      if (!isFeelingsCard(feelingsCard)) return state;

      const player = state.players[state.activePlayerIndex];
      const powerCard = player.hand.find(pc => pc.id === action.powerCardId);
      if (!powerCard || !canMatch(powerCard, feelingsCard)) {
        return { ...state, phase: 'match-fail' };
      }

      const newHand = player.hand.filter(pc => pc.id !== action.powerCardId);
      const newPowerDeck = [...state.powerDeck];
      if (newPowerDeck.length > 0) {
        newHand.push(newPowerDeck.shift()!);
      }

      const newPlayers = state.players.map((p, i) =>
        i === state.activePlayerIndex ? { ...p, hand: newHand } : p
      );

      const newState: GameState = {
        ...state,
        phase: 'match-success',
        players: newPlayers,
        powerDeck: newPowerDeck,
        completedPairs: [...state.completedPairs, { feelingsCard, powerCard }],
      };

      return checkWinCondition(newState);
    }

    case 'ATTEMPT_MATCH_ACTIVE': {
      if (state.phase !== 'playing') return state;
      const activeFeelings = state.activeEmpathy.find(fc => fc.id === action.feelingsCardId);
      if (!activeFeelings) return state;

      const player = state.players[state.activePlayerIndex];
      const powerCard = player.hand.find(pc => pc.id === action.powerCardId);
      if (!powerCard || !canMatch(powerCard, activeFeelings)) return state;

      const newHand = player.hand.filter(pc => pc.id !== action.powerCardId);
      const newPowerDeck = [...state.powerDeck];
      if (newPowerDeck.length > 0) {
        newHand.push(newPowerDeck.shift()!);
      }

      const newPlayers = state.players.map((p, i) =>
        i === state.activePlayerIndex ? { ...p, hand: newHand } : p
      );

      const newActiveEmpathy = state.activeEmpathy.filter(fc => fc.id !== action.feelingsCardId);

      const newState: GameState = {
        ...state,
        phase: 'match-success',
        players: newPlayers,
        powerDeck: newPowerDeck,
        activeEmpathy: newActiveEmpathy,
        completedPairs: [...state.completedPairs, { feelingsCard: activeFeelings, powerCard }],
        currentDrawnCard: activeFeelings,
      };

      return checkWinCondition(newState);
    }

    case 'SEND_TO_ACTIVE': {
      if ((state.phase !== 'empathy-drawn' && state.phase !== 'match-fail') || !state.currentDrawnCard) return state;
      const fc = state.currentDrawnCard;
      if (!isFeelingsCard(fc)) return state;

      return checkWinCondition(nextTurn({
        ...state,
        activeEmpathy: [...state.activeEmpathy, fc],
      }));
    }

    case 'ACKNOWLEDGE_MATCH': {
      if (state.phase !== 'match-success') return state;
      if (state.completedPairs.length >= state.totalEmpathyCards) {
        return { ...state, phase: 'game-won' };
      }
      return nextTurn(state);
    }

    case 'NEXT_TURN': {
      return nextTurn(state);
    }

    case 'NEW_GAME': {
      return createInitialState();
    }

    case 'ENTER_FACILITATOR_SETUP': {
      return { ...state, phase: 'facilitator-setup' };
    }

    case 'EXIT_FACILITATOR_SETUP': {
      return { ...state, phase: 'welcome' };
    }

    case 'TOGGLE_FAVORITE_POWER': {
      return { ...state, favoritedPowerCardIds: toggleInSet(state.favoritedPowerCardIds, action.cardId) };
    }

    case 'TOGGLE_FAVORITE_FEELINGS': {
      return { ...state, favoritedFeelingsCardIds: toggleInSet(state.favoritedFeelingsCardIds, action.cardId) };
    }

    default:
      return state;
  }
}
