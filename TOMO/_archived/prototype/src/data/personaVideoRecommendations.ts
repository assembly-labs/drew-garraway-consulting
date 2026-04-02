/**
 * Persona-Specific Video Recommendations
 *
 * Each persona gets curated video content based on what they're "working on":
 * - Their specific struggles and weaknesses
 * - Their psychological state (at-risk vs thriving)
 * - Their belt-level needs
 *
 * Videos are pulled from techniqueVideos.ts and given persona-specific
 * reasoning that speaks directly to their situation.
 *
 * Reference: /internal-docs/personas/PERSONA_PROFILES.md
 */

import type { PersonaKey } from './personas';
import type { TechniqueVideo } from '../types/techniqueVideos';
import { techniqueVideos } from './techniqueVideos';

// ===========================================
// TYPES
// ===========================================

export interface PersonaVideoRecommendation {
  video: TechniqueVideo;
  /** Personalized reason that speaks to this persona's specific situation */
  personalizedReason: string;
  /** Short headline for the card */
  headline: string;
  /** Category tag */
  category: 'technique' | 'mindset' | 'lifestyle';
  /** Priority for display order */
  priority: 1 | 2 | 3;
  /** One-liner that matches the persona's struggles */
  oneLiner: string;
}

export interface PersonaVideoConfig {
  personaKey: PersonaKey;
  personaName: string;
  /** Hero video for "Up Next" section */
  heroVideo: PersonaVideoRecommendation;
  /** Supporting videos for "Level Up" section (3-5 videos) */
  levelUpVideos: PersonaVideoRecommendation[];
  /** Psychological support videos for at-risk personas */
  supportVideos?: PersonaVideoRecommendation[];
}

// ===========================================
// HELPER FUNCTIONS
// ===========================================

function getVideoById(techniqueId: string): TechniqueVideo | null {
  return techniqueVideos.find(v => v.technique_id === techniqueId) || null;
}

// ===========================================
// WHITE-EXCELLING: Jake Thompson - "The Natural"
// ===========================================
//
// What he's working on:
// - Guard game (weak because of wrestling background)
// - Submissions from bottom
// - Slowing down, using technique over athleticism
// - Competition prep
//
const jakeThompsonVideos: PersonaVideoConfig = {
  personaKey: 'white-excelling',
  personaName: 'Jake Thompson',
  heroVideo: {
    video: getVideoById('CG_001')!,
    headline: 'Your Guard Needs This',
    personalizedReason: "Wrestling made you dangerous on top. Now build the guard that makes you dangerous everywhere. This is the foundation you're missing.",
    category: 'technique',
    priority: 1,
    oneLiner: 'Your wrestling base is a weapon. Now add a guard.',
  },
  levelUpVideos: [
    {
      video: getVideoById('CG_FS_001')!,
      headline: 'Featured: Low-Risk Flower Sweep',
      personalizedReason: "MMALeech's Gustavo Gasperin breaks down the safest sweep in BJJ. Low risk, high reward - perfect for building your bottom game without losing position.",
      category: 'technique',
      priority: 1,
      oneLiner: 'Your first reliable sweep from guard.',
    },
    {
      video: getVideoById('CG_008')!,
      headline: 'Add the Triangle',
      personalizedReason: "You've got the top control. Now develop the submission that catches people when they pass into your guard. This chains perfectly with your armbar attempts.",
      category: 'technique',
      priority: 1,
      oneLiner: 'Stop muscling. Start finishing.',
    },
    {
      video: getVideoById('SC_001')!,
      headline: 'When They Get You',
      personalizedReason: "Even the best wrestlers end up on bottom sometimes. These escapes use the frames and hip movement that wrestling doesn't teach.",
      category: 'technique',
      priority: 2,
      oneLiner: 'Escapes that work when athleticism fails.',
    },
    {
      video: getVideoById('BJ_002')!,
      headline: 'The Ego Check',
      personalizedReason: "You're talented. But the wrestlers who become great at BJJ are the ones who let go of what worked before. This is how.",
      category: 'mindset',
      priority: 2,
      oneLiner: 'Humility accelerates progress.',
    },
    {
      video: getVideoById('MG_003')!,
      headline: 'Find Flow State',
      personalizedReason: "You're going hard every round. This is about learning when to flow and when to fight. It'll save your body and improve your learning.",
      category: 'mindset',
      priority: 3,
      oneLiner: 'Hard sparring has its place. So does flow.',
    },
    {
      video: getVideoById('MG_001')!,
      headline: 'Competition Ready',
      personalizedReason: "You want to compete in 6 months. This is the mental framework that separates competitors from hobbyists.",
      category: 'mindset',
      priority: 3,
      oneLiner: 'The mind game starts now.',
    },
  ],
};

// ===========================================
// WHITE-AT-RISK: David Morrison - "The Late Starter"
// ===========================================
//
// What he's working on (CRITICAL - RETENTION FOCUS):
// - Staying consistent (9 days since last session)
// - Managing age-related doubts (52 years old)
// - Injury prevention (knee, shoulder)
// - Building confidence that he belongs
// - Smart training, not hard training
//
const davidMorrisonVideos: PersonaVideoConfig = {
  personaKey: 'white-at-risk',
  personaName: 'David Morrison',
  heroVideo: {
    video: getVideoById('AL_001')!,
    headline: 'Train Smart, Train Forever',
    personalizedReason: "This is the philosophy that lets people train into their 60s and beyond. Firas Zahabi's 'Never Be Sore' approach is built for bodies that need time to recover.",
    category: 'lifestyle',
    priority: 1,
    oneLiner: "Training smart isn't weak. It's wise.",
  },
  levelUpVideos: [
    {
      video: getVideoById('CG_FS_001')!,
      headline: 'Featured: Low-Risk Flower Sweep',
      personalizedReason: "MMALeech's Gustavo Gasperin breaks down the safest sweep in BJJ. Low risk, high reward - perfect for building confidence when you return to the mats.",
      category: 'technique',
      priority: 1,
      oneLiner: 'Your first reliable sweep from guard.',
    },
    {
      video: getVideoById('SC_016')!,
      headline: 'Escape the Crush',
      personalizedReason: "You mentioned getting stuck in side control. This escape uses frames and timing, not athleticism. It works regardless of age or strength.",
      category: 'technique',
      priority: 1,
      oneLiner: 'Frames over force. Every time.',
    },
    {
      video: getVideoById('IR_001')!,
      headline: 'Protect Your Body',
      personalizedReason: "Your knee and shoulder are talking to you. This is about training smart so those conversations don't become permanent injuries.",
      category: 'lifestyle',
      priority: 1,
      oneLiner: 'Longevity is a strategy.',
    },
    {
      video: getVideoById('CG_001')!,
      headline: 'Build Your Safe Space',
      personalizedReason: "Closed guard should feel like home. When you're tired and getting pressured, this is where you reset. Learn to love the bottom.",
      category: 'technique',
      priority: 2,
      oneLiner: 'Guard is survival. And survival is everything.',
    },
  ],
  // Special support videos for at-risk personas
  supportVideos: [
    {
      video: getVideoById('BJ_004')!,
      headline: 'When It Gets Hard: GOOD',
      personalizedReason: "Every setback is a setup. Jocko's 3-minute philosophy applies to the knee that's acting up, the sessions you've missed, the doubts. All of it.",
      category: 'mindset',
      priority: 1,
      oneLiner: 'Missed sessions? GOOD. Start again.',
    },
    {
      video: getVideoById('AL_003')!,
      headline: 'Training After 40',
      personalizedReason: "The 25-year-olds recover in a day. You need 2-3. That's not a weakness - it's a different optimization problem. This is how you solve it.",
      category: 'lifestyle',
      priority: 1,
      oneLiner: "You're not behind. You're playing a different game.",
    },
    {
      video: getVideoById('LB_005')!,
      headline: 'Consistency Over Intensity',
      personalizedReason: "Two sessions a week, every week, beats four sessions followed by three weeks off. This is the math of long-term progress.",
      category: 'lifestyle',
      priority: 2,
      oneLiner: 'Show up. Repeat. That is the path.',
    },
  ],
};

// ===========================================
// BLUE-EXCELLING: Marcus Chen - "The Dedicated Hobbyist"
// ===========================================
//
// What he's working on:
// - Blue belt plateau (normal but frustrating)
// - Guard retention from open guard
// - Developing coherent game vs random techniques
// - Leg locks (identified weakness)
// - Half guard development
//
const marcusChenVideos: PersonaVideoConfig = {
  personaKey: 'blue-excelling',
  personaName: 'Marcus Chen',
  heroVideo: {
    video: getVideoById('GP_024')!,
    headline: 'Stop Collecting, Start Connecting',
    personalizedReason: "You have dozens of techniques. This is how you connect them into a system. Lachlan breaks down the concepts that make random techniques become a game.",
    category: 'technique',
    priority: 1,
    oneLiner: 'Your guard is getting passed. This is why.',
  },
  levelUpVideos: [
    {
      video: getVideoById('GP_KS_001')!,
      headline: 'Master the Knee Cut',
      personalizedReason: "Gustavo Gasperin breaks down 6 knee cut variations. This is the most reliable pass at blue belt - master these and your top game opens up.",
      category: 'technique',
      priority: 1,
      oneLiner: 'The pass that opens your top game.',
    },
    {
      video: getVideoById('HG_001')!,
      headline: 'Build Half Guard',
      personalizedReason: "Half guard is where blue belt games are born. You mentioned wanting a coherent system - this is it. Sweeps, back takes, and leg locks all start here.",
      category: 'technique',
      priority: 1,
      oneLiner: 'Half guard is your new home base.',
    },
    {
      video: getVideoById('SM_028')!,
      headline: 'Leg Lock Defense',
      personalizedReason: "You said leg locks are where you're weakest. Before you can attack legs, you need to stop getting caught. This defense will save your knees.",
      category: 'technique',
      priority: 1,
      oneLiner: 'Leg locks are coming. Be ready.',
    },
    {
      video: getVideoById('OG_019')!,
      headline: 'Open Guard Retention',
      personalizedReason: "Getting passed from open guard is the blue belt struggle. This builds the retention that lets you stay on the attack.",
      category: 'technique',
      priority: 2,
      oneLiner: 'Stop giving up your guard.',
    },
    {
      video: getVideoById('BC_005')!,
      headline: 'Finish the RNC',
      personalizedReason: "You're taking backs. Now finish them. This RNC detail will turn your back takes into submissions.",
      category: 'technique',
      priority: 2,
      oneLiner: "Taking backs means nothing if you can't finish.",
    },
    {
      video: getVideoById('BJ_003')!,
      headline: 'The Plateau is Real',
      personalizedReason: "Blue belt is where most people quit. This isn't about technique - it's about the mindset that keeps you showing up when progress feels invisible.",
      category: 'mindset',
      priority: 3,
      oneLiner: 'The plateau passes. Keep grinding.',
    },
  ],
};

// ===========================================
// BLUE-AT-RISK: Ryan Torres - "The Fading Fire"
// ===========================================
//
// What he's working on (CRITICAL - EMERGENCY RETENTION):
// - 21 days since last session (CRITICAL)
// - Severe imposter syndrome
// - Watching teammates pass him
// - Work stress (60+ hours)
// - Recent breakup
// - Lost connection to training partners
//
const ryanTorresVideos: PersonaVideoConfig = {
  personaKey: 'blue-at-risk',
  personaName: 'Ryan Torres',
  heroVideo: {
    video: getVideoById('BJ_004')!,
    headline: 'When Everything Falls Apart',
    personalizedReason: "21 days since you trained. Teammates getting promoted. Work crushing you. Jocko's answer to all of it is the same: GOOD. 3 minutes that might change everything.",
    category: 'mindset',
    priority: 1,
    oneLiner: "Missed 3 weeks? GOOD. Fresh start.",
  },
  levelUpVideos: [
    {
      video: getVideoById('HG_KS_001')!,
      headline: 'Beat the Knee Shield',
      personalizedReason: "Gustavo Gasperin shows how to pass the knee shield. Fundamental, satisfying, and immediately useful when you get back on the mats.",
      category: 'technique',
      priority: 1,
      oneLiner: 'A passing problem you can solve.',
    },
    {
      video: getVideoById('BJ_003')!,
      headline: 'When the Fire Dies',
      personalizedReason: "You used to train 4x a week. Now you can barely get once. This is about rekindling discipline when motivation disappears.",
      category: 'mindset',
      priority: 1,
      oneLiner: 'Discipline outlasts motivation.',
    },
    {
      video: getVideoById('MG_002')!,
      headline: 'Losing to People Who Started With You',
      personalizedReason: "Your teammate just got purple. You watched it happen. This is the hardest part of the journey - and it's the part that makes the breakthrough possible.",
      category: 'mindset',
      priority: 1,
      oneLiner: "Everyone's timeline is different. Including yours.",
    },
    {
      video: getVideoById('LB_005')!,
      headline: 'One Session at a Time',
      personalizedReason: "Forget 4x a week. Can you do one? This is about building back slowly, sustainably. Consistency over intensity.",
      category: 'lifestyle',
      priority: 2,
      oneLiner: 'One session beats zero. Start there.',
    },
  ],
  // Emergency psychological support for critical at-risk
  supportVideos: [
    {
      video: getVideoById('MG_004')!,
      headline: 'Say GOOD',
      personalizedReason: "Work running late. Relationship ended. Training collapsed. To all of it, say GOOD. This 3-minute clip has brought people back from darker places than this.",
      category: 'mindset',
      priority: 1,
      oneLiner: 'GOOD. Now what are you going to do about it?',
    },
    {
      video: getVideoById('IR_002')!,
      headline: 'Coming Back After Time Off',
      personalizedReason: "You haven't been in 3 weeks. Walking back in feels impossible. This is about the mental game of returning when you feel like an outsider.",
      category: 'lifestyle',
      priority: 1,
      oneLiner: "The mat will be there. Your team will be there.",
    },
    {
      video: getVideoById('LB_004')!,
      headline: 'Finding the Why Again',
      personalizedReason: "You lost the reason. Work, stress, life. But the reason is still there. Sometimes it just needs to be rediscovered.",
      category: 'mindset',
      priority: 2,
      oneLiner: 'Remember why you started.',
    },
  ],
};

// ===========================================
// PURPLE-AVERAGE: Sofia Rodriguez - "The Grinder"
// ===========================================
//
// What she's working on:
// - Leg lock game (playing catch-up)
// - Improving top game (historically guard player)
// - Perfecting lasso/spider systems
// - Teaching methodology
// - Systems thinking refinement
//
const sofiaRodriguezVideos: PersonaVideoConfig = {
  personaKey: 'purple-average',
  personaName: 'Sofia Rodriguez',
  heroVideo: {
    video: getVideoById('SM_028')!,
    headline: 'Close the Leg Lock Gap',
    personalizedReason: "Your guard game is world-class. But the leg lock meta passed you by. This is the crash course that gets you caught up - defense first, then offense.",
    category: 'technique',
    priority: 1,
    oneLiner: 'The generational gap ends here.',
  },
  levelUpVideos: [
    {
      video: getVideoById('SC_PC_001')!,
      headline: 'Featured: Paper Cutter Combo',
      personalizedReason: "MMALeech's Gustavo Gasperin connects the paper cutter choke to armbar threats. Your top game needs this - when they defend one, they give you the other.",
      category: 'technique',
      priority: 1,
      oneLiner: 'Turn side control into a submission machine.',
    },
    {
      video: getVideoById('GP_024')!,
      headline: 'Systems-Level Passing',
      personalizedReason: "You think in systems. Your guard proves it. Now apply that same thinking to passing. This is conceptual, not technique collection.",
      category: 'technique',
      priority: 1,
      oneLiner: 'Pass like you play guard: systematically.',
    },
    {
      video: getVideoById('OG_019')!,
      headline: 'Retention Refinement',
      personalizedReason: "Your lasso and spider are sharp. But partners at your level know your entries. This is about the retention concepts that keep you ahead.",
      category: 'technique',
      priority: 2,
      oneLiner: 'Make your guard unpassable.',
    },
    {
      video: getVideoById('BC_005')!,
      headline: 'Inevitable RNC',
      personalizedReason: "You're taking backs. Your bow and arrow is money. But in no-gi, you need an RNC that finishes. This is the detail work.",
      category: 'technique',
      priority: 2,
      oneLiner: 'Once you get the back, the finish should be inevitable.',
    },
    {
      video: getVideoById('AL_002')!,
      headline: 'Teaching as Learning',
      personalizedReason: "You're starting to teach fundamentals. This is how the best instructors approach teaching - and how it accelerates your own understanding.",
      category: 'lifestyle',
      priority: 3,
      oneLiner: 'Teaching deepens mastery.',
    },
    {
      video: getVideoById('HG_016')!,
      headline: 'Half Guard Depth',
      personalizedReason: "You play spider and lasso. Adding a half guard bottom game gives you a B-game when they get past your open guard. Systems connecting.",
      category: 'technique',
      priority: 3,
      oneLiner: 'Another position in your system.',
    },
  ],
};

// ===========================================
// BROWN-AVERAGE: Elena Kim - "The Veteran"
// ===========================================
//
// What she's working on:
// - Refining pressure passing (efficiency)
// - Leg locks (generational gap)
// - Body management at 38
// - Teaching methodology
// - Black belt readiness questions
//
const elenaKimVideos: PersonaVideoConfig = {
  personaKey: 'brown-average',
  personaName: 'Elena Kim',
  heroVideo: {
    video: getVideoById('GP_024')!,
    headline: 'Efficiency Over Everything',
    personalizedReason: "At brown belt, the question is not 'can you pass?' It's 'can you pass with nothing wasted?' This conceptual framework makes your A-game tighter.",
    category: 'technique',
    priority: 1,
    oneLiner: 'The difference between good and great is details.',
  },
  levelUpVideos: [
    {
      video: getVideoById('HG_KS_001')!,
      headline: 'Knee Shield Solutions',
      personalizedReason: "Gustavo Gasperin's passing details for the knee shield. At brown belt, it's not about knowing the pass - it's about the micro-adjustments that make it inevitable.",
      category: 'technique',
      priority: 1,
      oneLiner: 'Refine what you already know.',
    },
    {
      video: getVideoById('SM_028')!,
      headline: 'Modern Leg Lock Meta',
      personalizedReason: "You came up before heel hooks were everywhere. The young purple belts attack legs you've never seen. This closes the generational gap.",
      category: 'technique',
      priority: 1,
      oneLiner: 'The game evolved. Keep up.',
    },
    {
      video: getVideoById('AL_001')!,
      headline: 'Train Forever',
      personalizedReason: "Your knee talks to you now. Recovery takes longer. This philosophy lets you train at 48, 58, 68. Longevity is the real goal.",
      category: 'lifestyle',
      priority: 1,
      oneLiner: 'Decades left. Train accordingly.',
    },
    {
      video: getVideoById('BJ_007')!,
      headline: 'What Black Belt Means',
      personalizedReason: "You're ready technically. But you're not sure what it means. This is about the journey philosophy that makes the belt feel earned.",
      category: 'mindset',
      priority: 2,
      oneLiner: 'Black belt is a beginning, not an end.',
    },
    {
      video: getVideoById('AL_004')!,
      headline: 'Recovery at 38',
      personalizedReason: "The body needs more care now. This is the discipline of recovery - as important as the discipline of training.",
      category: 'lifestyle',
      priority: 2,
      oneLiner: 'Recovery is training.',
    },
    {
      video: getVideoById('AL_005')!,
      headline: 'Training Philosophy for Decades',
      personalizedReason: "8+ years in. How do you keep it fresh? How do you keep growing? This is about the long game - the real long game.",
      category: 'lifestyle',
      priority: 3,
      oneLiner: 'The journey continues.',
    },
  ],
};

// ===========================================
// EXPORTS
// ===========================================

export const personaVideoConfigs: Record<PersonaKey, PersonaVideoConfig> = {
  'white-excelling': jakeThompsonVideos,
  'white-at-risk': davidMorrisonVideos,
  'blue-excelling': marcusChenVideos,
  'blue-at-risk': ryanTorresVideos,
  'purple-average': sofiaRodriguezVideos,
  'brown-average': elenaKimVideos,
};

/**
 * Get video recommendations for a specific persona
 */
export function getPersonaVideos(personaKey: PersonaKey): PersonaVideoConfig {
  return personaVideoConfigs[personaKey];
}

/**
 * Get the hero video for a persona (for "Up Next" section)
 */
export function getHeroVideo(personaKey: PersonaKey): PersonaVideoRecommendation {
  return personaVideoConfigs[personaKey].heroVideo;
}

/**
 * Get level-up videos for a persona
 */
export function getLevelUpVideos(personaKey: PersonaKey): PersonaVideoRecommendation[] {
  return personaVideoConfigs[personaKey].levelUpVideos;
}

/**
 * Get support videos for at-risk personas
 */
export function getSupportVideos(personaKey: PersonaKey): PersonaVideoRecommendation[] | undefined {
  return personaVideoConfigs[personaKey].supportVideos;
}

/**
 * Check if a persona is at-risk (needs support videos)
 */
export function isAtRiskPersona(personaKey: PersonaKey): boolean {
  return personaKey === 'white-at-risk' || personaKey === 'blue-at-risk';
}

/**
 * Get all videos for a persona (hero + level-up + support)
 */
export function getAllPersonaVideos(personaKey: PersonaKey): PersonaVideoRecommendation[] {
  const config = personaVideoConfigs[personaKey];
  const allVideos = [config.heroVideo, ...config.levelUpVideos];
  if (config.supportVideos) {
    allVideos.push(...config.supportVideos);
  }
  return allVideos;
}

export default personaVideoConfigs;
