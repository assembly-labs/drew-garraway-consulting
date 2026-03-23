import { describe, it, expect } from 'vitest';
import { gameReducer, createInitialState } from '../engine';
import { shuffle } from '../shuffle';
import { canMatch, getMatchablePowerCards } from '../matching';
import { HAND_SIZE } from '../constants';
import type { GameState, PowerCard, FeelingsCard } from '../types';

// Helper: create a deterministic game state for testing
function startGame(playerCount: number): GameState {
  let state = createInitialState();
  state = gameReducer(state, { type: 'SET_PLAYER_COUNT', count: playerCount });
  state = gameReducer(state, { type: 'START_GAME' });
  return state;
}

describe('shuffle', () => {
  it('returns array of same length', () => {
    const arr = [1, 2, 3, 4, 5];
    expect(shuffle(arr)).toHaveLength(5);
  });

  it('contains same elements', () => {
    const arr = [1, 2, 3, 4, 5];
    expect(shuffle(arr).sort()).toEqual([1, 2, 3, 4, 5]);
  });

  it('does not mutate original array', () => {
    const arr = [1, 2, 3, 4, 5];
    shuffle(arr);
    expect(arr).toEqual([1, 2, 3, 4, 5]);
  });

  it('produces different order (probabilistic)', () => {
    const arr = Array.from({ length: 20 }, (_, i) => i);
    const results = new Set<string>();
    for (let i = 0; i < 10; i++) {
      results.add(JSON.stringify(shuffle(arr)));
    }
    // Very unlikely all 10 shuffles produce the same order
    expect(results.size).toBeGreaterThan(1);
  });
});

describe('matching', () => {
  const rockyCard: PowerCard = {
    id: 'PWR-001',
    character: 'Rocky',
    cardNumber: '01/24',
    techniqueName: 'Canyon Calm',
    techniqueDescription: 'test',
    emotionTypes: ['confused', 'angry', 'sad'],
  };

  const tatamiCard: PowerCard = {
    id: 'PWR-002',
    character: 'Tatami',
    cardNumber: '02/24',
    techniqueName: 'Bubbles Buddies',
    techniqueDescription: 'test',
    emotionTypes: ['happy', 'surprised'],
  };

  const sadFeelings: FeelingsCard = {
    id: 'FLG-001',
    emotion: 'sad',
    event: 'A friend is not able to go to your birthday party.',
  };

  const happyFeelings: FeelingsCard = {
    id: 'FLG-041',
    emotion: 'happy',
    event: 'An extra recess day!',
  };

  it('valid match: Rocky matches sad', () => {
    expect(canMatch(rockyCard, sadFeelings)).toBe(true);
  });

  it('invalid match: Tatami does not match sad', () => {
    expect(canMatch(tatamiCard, sadFeelings)).toBe(false);
  });

  it('valid match: Tatami matches happy', () => {
    expect(canMatch(tatamiCard, happyFeelings)).toBe(true);
  });

  it('getMatchablePowerCards returns correct cards', () => {
    const hand = [rockyCard, tatamiCard];
    expect(getMatchablePowerCards(hand, sadFeelings)).toEqual([rockyCard]);
    expect(getMatchablePowerCards(hand, happyFeelings)).toEqual([tatamiCard]);
  });
});

describe('game setup', () => {
  it('creates initial state in welcome phase', () => {
    const state = createInitialState();
    expect(state.phase).toBe('welcome');
  });

  it('sets player count and moves to setup', () => {
    let state = createInitialState();
    state = gameReducer(state, { type: 'SET_PLAYER_COUNT', count: 3 });
    expect(state.phase).toBe('setup');
    expect(state.playerCount).toBe(3);
  });

  it('deals correct number of cards for 2 players', () => {
    const state = startGame(2);
    expect(state.phase).toBe('playing');
    expect(state.players).toHaveLength(2);
    state.players.forEach(p => {
      expect(p.hand).toHaveLength(HAND_SIZE);
    });
    // Power deck should have remaining cards
    expect(state.powerDeck.length).toBe(24 - 2 * HAND_SIZE);
  });

  it('deals correct number of cards for 4 players', () => {
    const state = startGame(4);
    expect(state.players).toHaveLength(4);
    state.players.forEach(p => {
      expect(p.hand).toHaveLength(HAND_SIZE);
    });
    expect(state.powerDeck.length).toBe(24 - 4 * HAND_SIZE);
  });

  it('central pile contains all feelings + action cards', () => {
    const state = startGame(2);
    expect(state.centralPile.length).toBe(53 + 50);
    expect(state.totalEmpathyCards).toBe(53);
  });
});

describe('turn rotation', () => {
  it('cycles through players correctly', () => {
    const state = startGame(3);
    expect(state.activePlayerIndex).toBe(0);

    const next1 = gameReducer(state, { type: 'NEXT_TURN' });
    expect(next1.activePlayerIndex).toBe(1);

    const next2 = gameReducer(next1, { type: 'NEXT_TURN' });
    expect(next2.activePlayerIndex).toBe(2);

    const next3 = gameReducer(next2, { type: 'NEXT_TURN' });
    expect(next3.activePlayerIndex).toBe(0); // wraps around
  });
});

describe('draw card', () => {
  it('draws from central pile', () => {
    const state = startGame(2);
    const pileSize = state.centralPile.length;
    const drawn = gameReducer(state, { type: 'DRAW_CARD' });
    expect(drawn.centralPile.length).toBe(pileSize - 1);
    expect(drawn.currentDrawnCard).not.toBeNull();
  });

  it('transitions to action-prompt for action cards', () => {
    // Create a state where the top card is an action card
    let state = startGame(2);
    // Force an action card on top
    const actionCard = state.centralPile.find(c => 'promptText' in c)!;
    state = {
      ...state,
      centralPile: [actionCard, ...state.centralPile.filter(c => c !== actionCard)],
    };
    const drawn = gameReducer(state, { type: 'DRAW_CARD' });
    expect(drawn.phase).toBe('action-prompt');
  });

  it('transitions to empathy-drawn for feelings cards', () => {
    let state = startGame(2);
    const feelingsCard = state.centralPile.find(c => 'emotion' in c)!;
    state = {
      ...state,
      centralPile: [feelingsCard, ...state.centralPile.filter(c => c !== feelingsCard)],
    };
    const drawn = gameReducer(state, { type: 'DRAW_CARD' });
    expect(drawn.phase).toBe('empathy-drawn');
  });
});

describe('action card flow', () => {
  it('dismiss action advances turn', () => {
    let state = startGame(2);
    const actionCard = state.centralPile.find(c => 'promptText' in c)!;
    state = {
      ...state,
      centralPile: [actionCard, ...state.centralPile.filter(c => c !== actionCard)],
    };
    state = gameReducer(state, { type: 'DRAW_CARD' });
    expect(state.phase).toBe('action-prompt');

    state = gameReducer(state, { type: 'DISMISS_ACTION' });
    expect(state.phase).toBe('playing');
    expect(state.activePlayerIndex).toBe(1);
  });
});

describe('feelings card match flow', () => {
  it('successful match adds to completed pairs and draws new power card', () => {
    let state = startGame(2);

    // Find a feelings card and a matching power card in player 0's hand
    const player = state.players[0];
    let targetFeelings: FeelingsCard | undefined;
    let matchingPower: PowerCard | undefined;

    for (const fc of state.centralPile) {
      if ('emotion' in fc) {
        matchingPower = player.hand.find(pc => canMatch(pc, fc as FeelingsCard));
        if (matchingPower) {
          targetFeelings = fc as FeelingsCard;
          break;
        }
      }
    }

    // Skip test if no match found (extremely unlikely with full deck)
    if (!targetFeelings || !matchingPower) return;

    // Put the target feelings card on top
    state = {
      ...state,
      centralPile: [targetFeelings, ...state.centralPile.filter(c => c !== targetFeelings)],
    };

    const prevPowerDeckSize = state.powerDeck.length;
    state = gameReducer(state, { type: 'DRAW_CARD' });
    expect(state.phase).toBe('empathy-drawn');

    state = gameReducer(state, { type: 'ATTEMPT_MATCH', powerCardId: matchingPower.id });
    expect(state.phase).toBe('match-success');
    expect(state.completedPairs).toHaveLength(1);
    expect(state.completedPairs[0].feelingsCard.id).toBe(targetFeelings.id);
    expect(state.completedPairs[0].powerCard.id).toBe(matchingPower.id);

    // Player should still have HAND_SIZE cards (drew replacement)
    if (prevPowerDeckSize > 0) {
      expect(state.players[0].hand).toHaveLength(HAND_SIZE);
      expect(state.powerDeck.length).toBe(prevPowerDeckSize - 1);
    }
  });

  it('failed match transitions to match-fail', () => {
    let state = startGame(2);

    // Find a feelings card with NO matching power card in player 0's hand
    const player = state.players[0];
    let targetFeelings: FeelingsCard | undefined;
    let nonMatchingPower: PowerCard | undefined;

    for (const fc of state.centralPile) {
      if ('emotion' in fc) {
        const hasMatch = player.hand.some(pc => canMatch(pc, fc as FeelingsCard));
        if (!hasMatch) {
          targetFeelings = fc as FeelingsCard;
          // Use any card from hand — it won't match
          nonMatchingPower = player.hand[0];
          break;
        }
      }
    }

    if (!targetFeelings || !nonMatchingPower) return;

    state = {
      ...state,
      centralPile: [targetFeelings, ...state.centralPile.filter(c => c !== targetFeelings)],
    };

    state = gameReducer(state, { type: 'DRAW_CARD' });
    state = gameReducer(state, { type: 'ATTEMPT_MATCH', powerCardId: nonMatchingPower.id });
    expect(state.phase).toBe('match-fail');
  });

  it('send to active empathy works', () => {
    let state = startGame(2);
    const feelingsCard = state.centralPile.find(c => 'emotion' in c)!;
    state = {
      ...state,
      centralPile: [feelingsCard, ...state.centralPile.filter(c => c !== feelingsCard)],
    };

    state = gameReducer(state, { type: 'DRAW_CARD' });
    expect(state.phase).toBe('empathy-drawn');

    state = gameReducer(state, { type: 'SEND_TO_ACTIVE' });
    expect(state.phase).toBe('playing');
    expect(state.activeEmpathy).toHaveLength(1);
    expect(state.activePlayerIndex).toBe(1);
  });
});

describe('active empathy matching', () => {
  it('matches from active empathy zone', () => {
    let state = startGame(2);

    // Park a feelings card in active empathy
    const feelingsCard = state.centralPile.find(c => 'emotion' in c) as FeelingsCard;
    state = {
      ...state,
      activeEmpathy: [feelingsCard],
    };

    // Find a matching power card in player 0's hand
    const matchingPower = state.players[0].hand.find(pc => canMatch(pc, feelingsCard));
    if (!matchingPower) return;

    state = gameReducer(state, {
      type: 'ATTEMPT_MATCH_ACTIVE',
      feelingsCardId: feelingsCard.id,
      powerCardId: matchingPower.id,
    });

    expect(state.phase).toBe('match-success');
    expect(state.activeEmpathy).toHaveLength(0);
    expect(state.completedPairs).toHaveLength(1);
  });
});

describe('win condition', () => {
  it('triggers game-won when all empathy cards matched', () => {
    let state = startGame(2);

    // Simulate all empathy cards being matched
    state = {
      ...state,
      phase: 'match-success',
      totalEmpathyCards: 1,
      completedPairs: [{
        feelingsCard: { id: 'FLG-001', emotion: 'sad', event: 'test' },
        powerCard: state.players[0].hand[0],
      }],
    };

    state = gameReducer(state, { type: 'ACKNOWLEDGE_MATCH' });
    expect(state.phase).toBe('game-won');
  });
});

describe('new game', () => {
  it('resets to welcome state', () => {
    let state = startGame(2);
    state = gameReducer(state, { type: 'NEW_GAME' });
    expect(state.phase).toBe('welcome');
    expect(state.players).toHaveLength(0);
    expect(state.completedPairs).toHaveLength(0);
  });
});
