/**
 * BJJ Progress Tracker - Mock Data
 *
 * This file serves as the central export point for all mock data.
 * All fake content for prototyping is organized and stored here.
 *
 * USAGE NOTES:
 * - Active exports: data currently used by components
 * - Inactive exports: specification/planning files not yet integrated
 */

// ===========================================
// ACTIVE EXPORTS (used in prototype)
// ===========================================

// User & Profile Data
export * from './users';
export * from './mock-profiles';
export * from './personas';

// Training & Techniques
export * from './techniques';
export * from './journal';           // Legacy format: used by Dashboard, BeltProgress
export * from './journal-entries';   // V2 format: used by SessionHistory
export * from './submissions';
export * from './techniqueVideos';
export * from './personaVideoRecommendations';  // Persona-specific video recommendations

// Progress & Tracking
export * from './progress';
export * from './competitions';

// Stats Modules (Belt-Adaptive)
export * from './stats-modules';

// ===========================================
// INACTIVE EXPORTS (specs/planning, not in UI)
// Uncomment when integrating these features
// ===========================================

// export * from './feedback';      // Coach feedback - not yet integrated
// export * from './belt-criteria'; // IBJJF requirements - reference only
// export * from './gym';           // Gym data - not yet integrated
// export * from './media';         // Photos/videos - not yet integrated
// export * from './legal';         // Legal docs - not yet integrated
// export * from './payments';      // Monetization - not yet integrated
