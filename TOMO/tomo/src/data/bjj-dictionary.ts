/**
 * BJJ Dictionary — Static autocomplete suggestions
 *
 * Consolidated from:
 * - AssemblyAI word boost list (~180 terms)
 * - Prototype technique catalog (50+ techniques)
 * - TECHNIQUE_BODY_MAP submission aliases (60+ terms)
 *
 * Used for autocomplete in the Review screen's technique and submission inputs.
 * User history from Supabase is layered on top at runtime.
 */

/** Techniques — positions, sweeps, passes, guards, escapes, takedowns, drills */
export const TECHNIQUE_SUGGESTIONS: string[] = [
  // Guards
  'closed guard',
  'half guard',
  'deep half guard',
  'z guard',
  'butterfly guard',
  'spider guard',
  'lasso guard',
  'de la riva',
  'reverse de la riva',
  'x guard',
  'single leg x',
  'rubber guard',
  'k guard',
  'fifty fifty',
  'quarter guard',
  'lockdown',
  'worm guard',
  'open guard',
  'guard retention',

  // Top positions
  'mount',
  'side control',
  'knee on belly',
  'back control',
  'north south',
  'turtle',
  'crucifix',
  'kesa gatame',
  'back mount',
  'S mount',

  // Sweeps
  'scissor sweep',
  'hip bump sweep',
  'flower sweep',
  'pendulum sweep',
  'elevator sweep',
  'berimbolo',
  'waiter sweep',
  'tripod sweep',
  'overhead sweep',
  'sickle sweep',
  'old school sweep',
  'deep half sweep',
  'x guard sweep',

  // Escapes
  'hip escape',
  'shrimp',
  'trap and roll',
  'upa',
  'frame',
  'underhook escape',
  'granby roll',
  'elbow escape',
  'bridge',
  'back escape',
  'mount escape',
  'side control escape',
  'elbow knee escape',
  'wrestling up',
  'technical stand up',

  // Takedowns
  'double leg',
  'single leg',
  'arm drag',
  'snap down',
  'osoto gari',
  'uchi mata',
  'seoi nage',
  'body lock takedown',
  'ankle pick',
  'fireman carry',
  'harai goshi',
  'ouchi gari',
  'kouchi gari',
  'guard pull',
  'takedown defense',

  // Passes
  'knee slice',
  'knee cut pass',
  'toreando pass',
  'leg drag',
  'x pass',
  'stack pass',
  'body lock pass',
  'smash pass',
  'over under pass',
  'long step pass',
  'headquarters',
  'leg weave',
  'pressure passing',

  // Transitions & concepts
  'back take',
  'arm drag to back',
  'seatbelt',
  'crab ride',
  'truck position',
  'guard retention',
  'submission chains',
  'flow rolling',
  'positional sparring',
  'drilling',
];

/** Submissions — chokes, joint locks, and common aliases */
export const SUBMISSION_SUGGESTIONS: string[] = [
  // Chokes
  'rear naked choke',
  'RNC',
  'guillotine',
  'darce',
  "d'arce",
  'anaconda',
  'arm triangle',
  'bow and arrow',
  'ezekiel',
  'baseball bat choke',
  'loop choke',
  'clock choke',
  'brabo',
  'north south choke',
  'von flue',
  'peruvian necktie',
  'japanese necktie',
  'cross collar choke',
  'paper cutter',
  'gogoplata',
  'triangle',
  'triangle choke',
  'kata gatame',
  'breadcutter',

  // Arm locks
  'armbar',
  'kimura',
  'americana',
  'omoplata',
  'straight armlock',
  'bicep slicer',
  'tarikoplata',
  'baratoplata',
  'monoplata',

  // Wrist locks
  'wrist lock',

  // Leg locks
  'heel hook',
  'inside heel hook',
  'outside heel hook',
  'ankle lock',
  'straight ankle lock',
  'toe hold',
  'kneebar',
  'knee bar',
  'calf slicer',
  'estima lock',
  'aoki lock',

  // Other
  'twister',
  'electric chair',
  'banana split',
  'can opener',
  'neck crank',
];
