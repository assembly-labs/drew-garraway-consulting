/**
 * Feature Components
 * Main application screens and feature modules
 */

// Core Screens
export { Dashboard } from './Dashboard';
export { SessionHistory } from './SessionHistory';
export { BeltProgress } from './BeltProgress';
export { TechniqueLibrary } from './TechniqueLibrary';
export { ProfileScreen } from './ProfileScreen';
export { Settings } from './Settings';
export { Onboarding } from './Onboarding';

// Session Logging
export { SessionLogger } from './SessionLogger';  // Primary: wraps VoiceFirstLogger

// Alternative loggers (not currently used in app, kept for potential A/B testing)
// VoiceLogger: Original voice-first approach
// ManualLogger: Form-first with voice assist option
export { VoiceLogger } from './VoiceLogger';
export { ManualLogger } from './ManualLogger';

// Session Display
export { SessionCard } from './SessionCard';
export { SessionDetail } from './SessionDetail';
export { JournalEntryCard } from './JournalEntryCard';
export type { JournalEntry } from './JournalEntryCard';

// Edit Components
export { EditSheet } from './EditSheet';
export * from './EditSections';

// Profile & Feedback
export { ProfileNudge } from './ProfileNudge';
export { TrainingFeedback } from './TrainingFeedback';
export { AttackProfile } from './AttackProfile';

// Video Recommendations
export { UpNextVideos } from './UpNextVideos';

// Development/Showcase
export { IconShowcase } from './IconShowcase';
