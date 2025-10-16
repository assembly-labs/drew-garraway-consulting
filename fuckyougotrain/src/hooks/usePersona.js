import { useState } from 'react';
import voiceMatrix from '../data/voiceMatrix.json';

/**
 * Weighted random persona selection hook
 */
export function usePersona() {
  const [lastPersona, setLastPersona] = useState(null);

  /**
   * Select persona based on context with weighted probabilities
   */
  const selectPersona = (context) => {
    // Get context-specific weights or fall back to default weights
    const weights = voiceMatrix.contextWeights[context];

    if (!weights) {
      // Use default persona weights
      const personas = Object.keys(voiceMatrix.personas);
      const defaultWeights = personas.reduce((acc, persona) => {
        acc[persona] = voiceMatrix.personas[persona].weight;
        return acc;
      }, {});
      return weightedRandomSelect(defaultWeights);
    }

    return weightedRandomSelect(weights);
  };

  /**
   * Get message for specific persona and context
   */
  const getMessage = (persona, context) => {
    const message = voiceMatrix.contexts[context]?.[persona];
    return message || "Keep going!";
  };

  /**
   * Get persona info
   */
  const getPersonaInfo = (personaKey) => {
    return voiceMatrix.personas[personaKey];
  };

  /**
   * Trigger a persona message
   */
  const triggerMessage = (context) => {
    const persona = selectPersona(context);
    const message = getMessage(persona, context);
    const personaInfo = getPersonaInfo(persona);

    setLastPersona({ persona, message, name: personaInfo.name });

    return {
      persona,
      message,
      name: personaInfo.name,
    };
  };

  return {
    selectPersona,
    getMessage,
    getPersonaInfo,
    triggerMessage,
    lastPersona,
  };
}

/**
 * Weighted random selection utility
 */
function weightedRandomSelect(weights) {
  const personas = Object.keys(weights);
  const totalWeight = Object.values(weights).reduce((sum, w) => sum + w, 0);
  let random = Math.random() * totalWeight;

  for (const persona of personas) {
    random -= weights[persona];
    if (random <= 0) {
      return persona;
    }
  }

  return personas[0]; // Fallback
}
