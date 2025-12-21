/**
 * Mock Technique Library Data
 * Comprehensive BJJ curriculum covering all positions and belt levels
 *
 * NOTE: This is FPO (For Placement Only) content.
 * Production version requires BJJ subject matter expert validation.
 */

import type { BeltColor } from './users';

export type Position =
  | 'closed-guard'
  | 'open-guard'
  | 'half-guard'
  | 'mount'
  | 'side-control'
  | 'back'
  | 'turtle'
  | 'standing'
  | 'north-south'
  | 'knee-on-belly';

export type TechniqueCategory =
  | 'submission'
  | 'sweep'
  | 'pass'
  | 'escape'
  | 'takedown'
  | 'control'
  | 'transition';

export type ProficiencyLevel = 'learning' | 'developing' | 'proficient';

export interface Technique {
  id: string;
  name: string;
  position: Position;
  category: TechniqueCategory;
  beltLevel: BeltColor;
  description: string;
  keyPoints: string[];
  commonMistakes: string[];
  videoId?: string;
  thumbnailId?: string;
  relatedTechniques: string[];
  variations: string[];
  gipiNogi: 'gi' | 'nogi' | 'both';
}

export interface TechniqueProgress {
  techniqueId: string;
  proficiency: ProficiencyLevel;
  timesDrilled: number;
  lastDrilled: string;
  coachEndorsed: boolean;
  notes?: string;
}

// ===========================================
// POSITIONS
// ===========================================

export const positions: { id: Position; name: string; description: string }[] = [
  { id: 'closed-guard', name: 'Closed Guard', description: 'Bottom position with legs wrapped around opponent\'s torso' },
  { id: 'open-guard', name: 'Open Guard', description: 'Bottom positions with legs not closed (spider, DLR, lasso, butterfly, etc.)' },
  { id: 'half-guard', name: 'Half Guard', description: 'Bottom position controlling one of opponent\'s legs between yours' },
  { id: 'mount', name: 'Mount', description: 'Top position sitting on opponent\'s torso with knees on mat' },
  { id: 'side-control', name: 'Side Control', description: 'Top position chest-to-chest, perpendicular to opponent' },
  { id: 'back', name: 'Back Control', description: 'Behind opponent with hooks or body triangle, controlling upper body' },
  { id: 'turtle', name: 'Turtle', description: 'Defensive position on hands and knees, protecting neck' },
  { id: 'standing', name: 'Standing', description: 'Both practitioners on feet, wrestling/judo position' },
  { id: 'north-south', name: 'North-South', description: 'Top position head-to-head, chest on opponent\'s chest' },
  { id: 'knee-on-belly', name: 'Knee on Belly', description: 'Top position with knee driving into opponent\'s torso' },
];

// ===========================================
// COMPREHENSIVE TECHNIQUE LIBRARY
// ===========================================

export const mockTechniques: Technique[] = [
  // =========================================
  // WHITE BELT TECHNIQUES (Fundamentals)
  // =========================================

  // Closed Guard - Submissions
  {
    id: 'tech-001',
    name: 'Armbar from Closed Guard',
    position: 'closed-guard',
    category: 'submission',
    beltLevel: 'white',
    description: 'Classic submission attacking the elbow joint by controlling the arm and creating leverage with your hips.',
    keyPoints: [
      'Control the wrist and elbow before moving',
      'Hip escape to create a 90-degree angle',
      'Pinch knees together tightly',
      'Keep hips high and tight to shoulder',
      'Lift hips to finish, not pull down',
    ],
    commonMistakes: [
      'Not controlling the arm before swinging leg over',
      'Crossing feet incorrectly (should be uncrossed or heel in armpit)',
      'Hips too far from shoulder',
      'Rushing the technique',
    ],
    videoId: 'vid-001',
    thumbnailId: 'thumb-001',
    relatedTechniques: ['tech-002', 'tech-003', 'tech-009'],
    variations: ['High elbow armbar', 'Belly down armbar', 'Armbar from overhook'],
    gipiNogi: 'both',
  },
  {
    id: 'tech-002',
    name: 'Triangle Choke',
    position: 'closed-guard',
    category: 'submission',
    beltLevel: 'white',
    description: 'Blood choke using your legs to form a triangle around opponent\'s neck and one arm, compressing the carotid arteries.',
    keyPoints: [
      'Control posture and isolate one arm first',
      'Shoot hips up high to lock the triangle',
      'Cut a 30-degree angle to the side',
      'Pull head down while squeezing knees',
      'Lock the figure-four with ankle behind knee',
    ],
    commonMistakes: [
      'Not cutting the angle (staying flat)',
      'Wrong arm placement (should be across, not under chin)',
      'Not controlling posture throughout',
      'Locking too low on the neck',
    ],
    videoId: 'vid-002',
    thumbnailId: 'thumb-002',
    relatedTechniques: ['tech-001', 'tech-009'],
    variations: ['Mounted triangle', 'Reverse triangle', 'Side triangle', 'No-arm triangle'],
    gipiNogi: 'both',
  },
  {
    id: 'tech-003',
    name: 'Cross Collar Choke from Guard',
    position: 'closed-guard',
    category: 'submission',
    beltLevel: 'white',
    description: 'Gi choke using both hands gripping the collar to create a scissoring pressure on the neck.',
    keyPoints: [
      'First grip deep, thumb inside collar',
      'Second grip palm up, four fingers inside',
      'Pull elbows to your ribs',
      'Scissor hands while pulling down',
      'Break posture to finish',
    ],
    commonMistakes: [
      'Grips not deep enough',
      'Elbows flaring out instead of staying tight',
      'Not breaking posture',
      'Wrong hand orientation',
    ],
    videoId: 'vid-003',
    thumbnailId: 'thumb-003',
    relatedTechniques: ['tech-002'],
    variations: ['Single hand variation', 'Palm-up palm-up grip'],
    gipiNogi: 'gi',
  },
  {
    id: 'tech-004',
    name: 'Guillotine Choke',
    position: 'closed-guard',
    category: 'submission',
    beltLevel: 'white',
    description: 'Front headlock choke attacking the neck when opponent\'s head is down.',
    keyPoints: [
      'Get arm deep around neck, wrist on throat',
      'Clasp hands (gable grip or figure-four)',
      'Close guard to prevent pass',
      'Arch back and squeeze upward',
      'Keep elbow tight to body',
    ],
    commonMistakes: [
      'Arm not deep enough around neck',
      'Squeezing with arms only (use back arch)',
      'Not closing guard (allows pass)',
      'Chin in wrong position',
    ],
    videoId: 'vid-004',
    thumbnailId: 'thumb-004',
    relatedTechniques: ['tech-002'],
    variations: ['Arm-in guillotine', 'High elbow guillotine', 'Marcelotine'],
    gipiNogi: 'both',
  },

  // Closed Guard - Sweeps
  {
    id: 'tech-005',
    name: 'Scissor Sweep',
    position: 'closed-guard',
    category: 'sweep',
    beltLevel: 'white',
    description: 'Fundamental sweep using a scissoring motion of your legs to off-balance and reverse your opponent.',
    keyPoints: [
      'Break posture first with collar/sleeve control',
      'Shin across belly, other leg hooks behind knee',
      'Pull with grips while scissoring legs',
      'Come up to mount as they fall',
      'Maintain grips throughout',
    ],
    commonMistakes: [
      'Not breaking posture first',
      'Scissoring without pulling with grips',
      'Bottom leg too high (should hook low)',
      'Letting go of grips during sweep',
    ],
    videoId: 'vid-005',
    thumbnailId: 'thumb-005',
    relatedTechniques: ['tech-006', 'tech-007'],
    variations: ['Push sweep', 'Hip bump to scissor'],
    gipiNogi: 'both',
  },
  {
    id: 'tech-006',
    name: 'Hip Bump Sweep',
    position: 'closed-guard',
    category: 'sweep',
    beltLevel: 'white',
    description: 'Explosive sweep shooting your hips up to off-balance opponent when they posture up.',
    keyPoints: [
      'Wait for opponent to posture up',
      'Post on one hand, overhook same-side arm',
      'Explode hips up and forward',
      'Come up to mount or seated guard',
      'Use momentum, not just strength',
    ],
    commonMistakes: [
      'Trying when opponent has good base',
      'Not posting on hand first',
      'Not controlling the arm',
      'Moving up instead of through them',
    ],
    videoId: 'vid-006',
    thumbnailId: 'thumb-006',
    relatedTechniques: ['tech-005', 'tech-009'],
    variations: ['Hip bump to kimura', 'Hip bump to guillotine', 'Hip bump to triangle'],
    gipiNogi: 'both',
  },
  {
    id: 'tech-007',
    name: 'Flower Sweep (Pendulum Sweep)',
    position: 'closed-guard',
    category: 'sweep',
    beltLevel: 'white',
    description: 'High-amplitude sweep using a pendulum motion of your legs to flip opponent over.',
    keyPoints: [
      'Control same-side sleeve and cross collar',
      'Open guard and swing leg high',
      'Other leg kicks through like pendulum',
      'Pull with grips as you swing',
      'Follow through to mount',
    ],
    commonMistakes: [
      'Not getting enough momentum on swing',
      'Weak collar grip',
      'Not committing to the movement',
      'Kicking leg not going through',
    ],
    videoId: 'vid-007',
    thumbnailId: 'thumb-007',
    relatedTechniques: ['tech-005', 'tech-006'],
    variations: ['Overhead sweep', 'Balloon sweep'],
    gipiNogi: 'gi',
  },

  // Mount - Submissions
  {
    id: 'tech-008',
    name: 'Americana from Mount',
    position: 'mount',
    category: 'submission',
    beltLevel: 'white',
    description: 'Shoulder lock attacking the arm when opponent defends by putting hands on your chest.',
    keyPoints: [
      'Isolate arm and pin wrist to mat',
      'Figure-four grip, your wrist under their wrist',
      'Keep elbow tight to their body',
      'Paint the mat - slide wrist toward their hip',
      'Keep weight forward on chest',
    ],
    commonMistakes: [
      'Elbow flaring out (they escape)',
      'Lifting wrist instead of painting mat',
      'Weight too far back',
      'Not controlling the elbow',
    ],
    videoId: 'vid-008',
    thumbnailId: 'thumb-008',
    relatedTechniques: ['tech-010', 'tech-012'],
    variations: ['Gift wrap americana', 'Americana from side control'],
    gipiNogi: 'both',
  },
  {
    id: 'tech-009',
    name: 'Armbar from Mount',
    position: 'mount',
    category: 'submission',
    beltLevel: 'white',
    description: 'Transitioning from mount to armbar when opponent pushes on your chest or hips.',
    keyPoints: [
      'Secure high mount position first',
      'Hug the arm tight to your chest',
      'Swing leg over head, staying tight',
      'Pinch knees, control wrist',
      'Lean back and lift hips to finish',
    ],
    commonMistakes: [
      'Not hugging arm before transitioning',
      'Swinging leg too wide (they escape)',
      'Sitting too far from shoulder',
      'Crossing feet incorrectly',
    ],
    videoId: 'vid-009',
    thumbnailId: 'thumb-009',
    relatedTechniques: ['tech-001', 'tech-008'],
    variations: ['S-mount armbar', 'Spinning armbar'],
    gipiNogi: 'both',
  },
  {
    id: 'tech-010',
    name: 'Cross Collar Choke from Mount',
    position: 'mount',
    category: 'submission',
    beltLevel: 'white',
    description: 'Powerful collar choke attacking from the dominant mount position.',
    keyPoints: [
      'Secure high mount first',
      'First grip deep in collar, thumb inside',
      'Second grip under first arm, palm up',
      'Drop head to mat beside their head',
      'Scissor hands and squeeze',
    ],
    commonMistakes: [
      'Grips not deep enough',
      'Staying too upright (get swept)',
      'Not dropping head to mat',
      'Elbows flaring',
    ],
    videoId: 'vid-010',
    thumbnailId: 'thumb-010',
    relatedTechniques: ['tech-003', 'tech-008'],
    variations: ['Ezekiel choke', 'Palm-up palm-up variation'],
    gipiNogi: 'gi',
  },

  // Mount - Escapes
  {
    id: 'tech-011',
    name: 'Trap and Roll Escape (Upa)',
    position: 'mount',
    category: 'escape',
    beltLevel: 'white',
    description: 'Fundamental mount escape using a bridge to reverse the position.',
    keyPoints: [
      'Trap one arm at the wrist',
      'Trap same-side foot with your foot',
      'Bridge high toward trapped side',
      'Turn into them as you roll',
      'Establish inside closed guard',
    ],
    commonMistakes: [
      'Not trapping the foot',
      'Bridging to the wrong side',
      'Not committing fully to the bridge',
      'Bridging up instead of toward them',
    ],
    videoId: 'vid-011',
    thumbnailId: 'thumb-011',
    relatedTechniques: ['tech-012'],
    variations: ['Bridge when they post', 'Double arm trap'],
    gipiNogi: 'both',
  },
  {
    id: 'tech-012',
    name: 'Elbow-Knee Escape from Mount',
    position: 'mount',
    category: 'escape',
    beltLevel: 'white',
    description: 'Technical escape using frames and hip movement to recover half guard or guard.',
    keyPoints: [
      'Frame on hip and chest/neck',
      'Bridge to create space',
      'Shrimp out and insert knee',
      'Recover to half guard or full guard',
      'Maintain frames throughout',
    ],
    commonMistakes: [
      'Not framing before bridging',
      'Shrimping wrong direction',
      'Staying flat instead of on side',
      'Giving up too early',
    ],
    videoId: 'vid-012',
    thumbnailId: 'thumb-012',
    relatedTechniques: ['tech-011', 'tech-013'],
    variations: ['Heel drag variation', 'Going to butterfly guard'],
    gipiNogi: 'both',
  },

  // Side Control - Escapes
  {
    id: 'tech-013',
    name: 'Hip Escape to Guard (Shrimp)',
    position: 'side-control',
    category: 'escape',
    beltLevel: 'white',
    description: 'Fundamental escape using hip movement to create space and recover guard.',
    keyPoints: [
      'Frame on hip and neck/shoulder',
      'Bridge to create space',
      'Shrimp hips away from them',
      'Insert knee shield or recover guard',
      'Stay on your side, not flat',
    ],
    commonMistakes: [
      'Not framing before moving',
      'Shrimping toward opponent',
      'Staying flat on back',
      'Framing on chest instead of hip',
    ],
    videoId: 'vid-013',
    thumbnailId: 'thumb-013',
    relatedTechniques: ['tech-012', 'tech-014'],
    variations: ['To half guard', 'To full guard', 'To butterfly guard'],
    gipiNogi: 'both',
  },
  {
    id: 'tech-014',
    name: 'Underhook Escape from Side Control',
    position: 'side-control',
    category: 'escape',
    beltLevel: 'white',
    description: 'Escape using an underhook to come up to a wrestling position.',
    keyPoints: [
      'Time the escape when they transition',
      'Get underhook on near side',
      'Bridge and come up to knees',
      'Establish wrestling tie-up',
      'Circle to good angle or take back',
    ],
    commonMistakes: [
      'Going for underhook without timing',
      'Not bridging while coming up',
      'Head position too low',
      'Stopping halfway',
    ],
    videoId: 'vid-014',
    thumbnailId: 'thumb-014',
    relatedTechniques: ['tech-013'],
    variations: ['To single leg', 'To back take'],
    gipiNogi: 'both',
  },

  // Back - Submissions
  {
    id: 'tech-015',
    name: 'Rear Naked Choke',
    position: 'back',
    category: 'submission',
    beltLevel: 'white',
    description: 'The most dominant submission in grappling, choking from back control.',
    keyPoints: [
      'Establish seatbelt control and hooks first',
      'Fight to get choking arm under chin',
      'Connect hand to bicep of other arm',
      'Other hand behind their head',
      'Squeeze elbows together, not hands',
    ],
    commonMistakes: [
      'Trying to choke before position is secure',
      'Hand on top of head instead of behind',
      'Squeezing hands instead of elbows',
      'Crossing feet (illegal + bad position)',
    ],
    videoId: 'vid-015',
    thumbnailId: 'thumb-015',
    relatedTechniques: ['tech-016'],
    variations: ['Short choke', 'One-arm RNC', 'Gable grip variation'],
    gipiNogi: 'both',
  },

  // Back - Escapes
  {
    id: 'tech-016',
    name: 'Back Escape - Clear Hooks',
    position: 'back',
    category: 'escape',
    beltLevel: 'white',
    description: 'Fundamental escape from back control by clearing hooks and turning.',
    keyPoints: [
      'Protect the neck first (chin down, hands fighting)',
      'Clear the bottom hook by pushing with hands',
      'Slide hips to mat on cleared side',
      'Turn into them to side control',
      'Keep elbows tight throughout',
    ],
    commonMistakes: [
      'Not protecting neck first',
      'Trying to turn before clearing hook',
      'Turning away instead of into them',
      'Giving up the neck while escaping',
    ],
    videoId: 'vid-016',
    thumbnailId: 'thumb-016',
    relatedTechniques: ['tech-015'],
    variations: ['Shoulder walk escape', 'Scoot to guard'],
    gipiNogi: 'both',
  },

  // Standing - Takedowns
  {
    id: 'tech-017',
    name: 'Double Leg Takedown',
    position: 'standing',
    category: 'takedown',
    beltLevel: 'white',
    description: 'Fundamental wrestling takedown attacking both legs.',
    keyPoints: [
      'Level change with a penetration step',
      'Head on outside, arms around both legs',
      'Drive forward with your legs',
      'Turn the corner, don\'t push straight',
      'Finish in side control or mount',
    ],
    commonMistakes: [
      'Head down (get guillotined)',
      'Reaching without level change',
      'Stopping on knees instead of driving',
      'Straight line drive instead of corner',
    ],
    videoId: 'vid-017',
    thumbnailId: 'thumb-017',
    relatedTechniques: ['tech-018', 'tech-019'],
    variations: ['High crotch finish', 'Blast double', 'Snatch double'],
    gipiNogi: 'both',
  },
  {
    id: 'tech-018',
    name: 'Single Leg Takedown',
    position: 'standing',
    category: 'takedown',
    beltLevel: 'white',
    description: 'Wrestling takedown attacking one leg, versatile entry.',
    keyPoints: [
      'Level change and step deep',
      'Head on inside, tight grip on leg',
      'Stand up with the leg controlled',
      'Multiple finishes: run the pipe, trip, lift',
      'Keep head up and pressure forward',
    ],
    commonMistakes: [
      'Head on wrong side',
      'Staying on knees too long',
      'Loose grip on leg',
      'Not pressuring forward',
    ],
    videoId: 'vid-018',
    thumbnailId: 'thumb-018',
    relatedTechniques: ['tech-017', 'tech-019'],
    variations: ['High single', 'Low single', 'Sweep single'],
    gipiNogi: 'both',
  },
  {
    id: 'tech-019',
    name: 'Guard Pull',
    position: 'standing',
    category: 'takedown',
    beltLevel: 'white',
    description: 'Pulling opponent into your guard as an alternative to wrestling.',
    keyPoints: [
      'Establish collar and sleeve grip',
      'Sit down while pulling them forward',
      'Get feet on hips immediately',
      'Off-balance them into your guard',
      'Don\'t jump guard (dangerous)',
    ],
    commonMistakes: [
      'Pulling without grips',
      'Jumping and wrapping (knee injury risk)',
      'Sitting back flat (bad guard)',
      'Not controlling their posture',
    ],
    videoId: 'vid-019',
    thumbnailId: 'thumb-019',
    relatedTechniques: ['tech-005', 'tech-006'],
    variations: ['Collar drag guard pull', 'Arm drag to guard pull'],
    gipiNogi: 'gi',
  },

  // =========================================
  // BLUE BELT TECHNIQUES (Intermediate)
  // =========================================

  // Guard Passing
  {
    id: 'tech-020',
    name: 'Toreando Pass (Bull Fighter)',
    position: 'open-guard',
    category: 'pass',
    beltLevel: 'blue',
    description: 'Speed pass controlling the pants at the knees to whip legs aside and pass.',
    keyPoints: [
      'Grip pants at knee level',
      'Push legs to one side quickly',
      'Circle around the legs (don\'t jump over)',
      'Pin hips with shoulder pressure immediately',
      'Transition to side control',
    ],
    commonMistakes: [
      'Leaning too far forward (get swept)',
      'Not pinning hips after pass',
      'Passing too slowly (they recover)',
      'Trying to pass straight instead of around',
    ],
    videoId: 'vid-020',
    thumbnailId: 'thumb-020',
    relatedTechniques: ['tech-021', 'tech-022'],
    variations: ['Leg drag combo', 'Same-side pass'],
    gipiNogi: 'gi',
  },
  {
    id: 'tech-021',
    name: 'Knee Cut Pass',
    position: 'half-guard',
    category: 'pass',
    beltLevel: 'blue',
    description: 'Pressure pass sliding your knee across their thigh to clear half guard.',
    keyPoints: [
      'Secure cross-face and underhook',
      'Free your foot from half guard',
      'Slide knee across to the mat',
      'Keep shoulder pressure on face',
      'Consolidate side control',
    ],
    commonMistakes: [
      'Not securing underhook (they take back)',
      'Allowing deep half guard',
      'Rushing without pressure',
      'Knee sliding wrong direction',
    ],
    videoId: 'vid-021',
    thumbnailId: 'thumb-021',
    relatedTechniques: ['tech-020', 'tech-022'],
    variations: ['Knee cut with collar grip', 'Reverse knee cut'],
    gipiNogi: 'both',
  },
  {
    id: 'tech-022',
    name: 'Leg Drag Pass',
    position: 'open-guard',
    category: 'pass',
    beltLevel: 'blue',
    description: 'Pass by dragging their leg across your body to expose the back.',
    keyPoints: [
      'Control ankle and push knee with other hand',
      'Drag leg across your hip line',
      'Staple knee to mat with your knee',
      'Establish hip-to-hip contact',
      'Take back or settle to side control',
    ],
    commonMistakes: [
      'Not stapling the knee',
      'Staying too upright',
      'Letting them recover leg',
      'Not controlling hip',
    ],
    videoId: 'vid-022',
    thumbnailId: 'thumb-022',
    relatedTechniques: ['tech-020', 'tech-021'],
    variations: ['Leg drag to back', 'Baby bolo'],
    gipiNogi: 'both',
  },
  {
    id: 'tech-023',
    name: 'Stack Pass',
    position: 'closed-guard',
    category: 'pass',
    beltLevel: 'blue',
    description: 'Pass by stacking opponent on their shoulders to break guard.',
    keyPoints: [
      'Posture up and control hips',
      'Stand up in guard',
      'Underhook legs and stack them',
      'Walk around to side control',
      'Keep pressure and control throughout',
    ],
    commonMistakes: [
      'Getting swept while standing',
      'Not controlling hips before stacking',
      'Stacking too hard (they roll you)',
      'Leaving space when passing',
    ],
    videoId: 'vid-023',
    thumbnailId: 'thumb-023',
    relatedTechniques: ['tech-021'],
    variations: ['Over-under pass', 'Double under pass'],
    gipiNogi: 'both',
  },

  // More Blue Belt Submissions
  {
    id: 'tech-024',
    name: 'Kimura from Closed Guard',
    position: 'closed-guard',
    category: 'submission',
    beltLevel: 'blue',
    description: 'Double wristlock submission attacking the shoulder from bottom.',
    keyPoints: [
      'Control posture and overhook arm',
      'Sit up and grab their wrist',
      'Figure-four grip behind their back',
      'Hip escape to create angle',
      'Rotate their arm for submission',
    ],
    commonMistakes: [
      'Not sitting up enough',
      'Loose grip on the wrist',
      'Not controlling the elbow',
      'Flat on back instead of angled',
    ],
    videoId: 'vid-024',
    thumbnailId: 'thumb-024',
    relatedTechniques: ['tech-001', 'tech-025'],
    variations: ['Kimura sweep', 'Kimura to back take', 'Kimura trap system'],
    gipiNogi: 'both',
  },
  {
    id: 'tech-025',
    name: 'Omoplata',
    position: 'closed-guard',
    category: 'submission',
    beltLevel: 'blue',
    description: 'Shoulder lock using your legs to control and torque the arm.',
    keyPoints: [
      'Control same-side wrist',
      'Swing leg over shoulder like armbar',
      'Sit up and face same direction as them',
      'Control their hip with your hands',
      'Lean forward to finish',
    ],
    commonMistakes: [
      'Not controlling the wrist',
      'Not sitting up (they roll out)',
      'Letting them posture up',
      'Leaning back instead of forward',
    ],
    videoId: 'vid-025',
    thumbnailId: 'thumb-025',
    relatedTechniques: ['tech-002', 'tech-024'],
    variations: ['Omoplata sweep', 'Mounted omoplata'],
    gipiNogi: 'both',
  },
  {
    id: 'tech-026',
    name: 'Bow and Arrow Choke',
    position: 'back',
    category: 'submission',
    beltLevel: 'blue',
    description: 'Powerful collar choke from back control using the lapel.',
    keyPoints: [
      'Secure back control with seatbelt',
      'Deep collar grip, four fingers inside',
      'Other hand grabs their pants/leg',
      'Extend them out like drawing a bow',
      'Pull collar while pushing with legs',
    ],
    commonMistakes: [
      'Shallow collar grip',
      'Not controlling the leg',
      'Not extending fully',
      'Losing back control before grip',
    ],
    videoId: 'vid-026',
    thumbnailId: 'thumb-026',
    relatedTechniques: ['tech-015'],
    variations: ['Sliding collar bow and arrow', 'Short bow and arrow'],
    gipiNogi: 'gi',
  },

  // Half Guard - Blue Belt
  {
    id: 'tech-027',
    name: 'Old School Sweep from Half Guard',
    position: 'half-guard',
    category: 'sweep',
    beltLevel: 'blue',
    description: 'Classic half guard sweep going underneath to sweep.',
    keyPoints: [
      'Secure underhook and control far arm',
      'Get to your side, not flat',
      'Shoot arm deep behind their leg',
      'Lift and come up to top',
      'Keep the underhook throughout',
    ],
    commonMistakes: [
      'Staying flat on back',
      'Losing the underhook',
      'Not getting deep enough underneath',
      'Not controlling far arm (they post)',
    ],
    videoId: 'vid-027',
    thumbnailId: 'thumb-027',
    relatedTechniques: ['tech-028'],
    variations: ['Plan B to back take', 'Electric chair entry'],
    gipiNogi: 'both',
  },
  {
    id: 'tech-028',
    name: 'Deep Half Guard Sweep',
    position: 'half-guard',
    category: 'sweep',
    beltLevel: 'blue',
    description: 'Advanced half guard position getting deep under opponent.',
    keyPoints: [
      'Get completely under their hips',
      'Control far leg with arms',
      'Pendulum legs to off-balance',
      'Come up to top or take back',
      'Keep head tight to their hip',
    ],
    commonMistakes: [
      'Not getting deep enough under',
      'Head too far away (get smashed)',
      'Not controlling the far leg',
      'Timing the sweep wrong',
    ],
    videoId: 'vid-028',
    thumbnailId: 'thumb-028',
    relatedTechniques: ['tech-027'],
    variations: ['Waiter sweep', 'Homer Simpson sweep'],
    gipiNogi: 'both',
  },

  // Side Control Attacks - Blue Belt
  {
    id: 'tech-029',
    name: 'Americana from Side Control',
    position: 'side-control',
    category: 'submission',
    beltLevel: 'blue',
    description: 'Shoulder lock from side control when they push on you.',
    keyPoints: [
      'Isolate arm and pin wrist to mat',
      'Figure-four grip (your wrist under theirs)',
      'Keep elbow tight to their body',
      'Slide wrist toward their hip',
      'Keep heavy pressure on chest',
    ],
    commonMistakes: [
      'Elbow flying out (they escape)',
      'Lifting instead of sliding',
      'Not enough chest pressure',
      'Loose grip on wrist',
    ],
    videoId: 'vid-029',
    thumbnailId: 'thumb-029',
    relatedTechniques: ['tech-008', 'tech-030'],
    variations: ['From mount', 'From north-south'],
    gipiNogi: 'both',
  },
  {
    id: 'tech-030',
    name: 'North-South Kimura',
    position: 'north-south',
    category: 'submission',
    beltLevel: 'blue',
    description: 'Kimura attack from north-south position.',
    keyPoints: [
      'Transition to north-south',
      'Isolate arm, step over head',
      'Figure-four grip on wrist',
      'Sit back toward their hips',
      'Rotate arm for finish',
    ],
    commonMistakes: [
      'Not stepping over head (they escape)',
      'Loose grip',
      'Sitting the wrong direction',
      'Not controlling their body',
    ],
    videoId: 'vid-030',
    thumbnailId: 'thumb-030',
    relatedTechniques: ['tech-024', 'tech-029'],
    variations: ['North-south choke', 'To mount'],
    gipiNogi: 'both',
  },
  {
    id: 'tech-031',
    name: 'Paper Cutter Choke',
    position: 'side-control',
    category: 'submission',
    beltLevel: 'blue',
    description: 'Collar choke from side control cutting across the neck.',
    keyPoints: [
      'Deep grip in far collar',
      'Knee near their hip (not head)',
      'Slide arm under their head',
      'Turn collar grip and drop weight',
      'Cut across the neck like paper cutter',
    ],
    commonMistakes: [
      'Collar grip not deep enough',
      'Not sliding arm under head first',
      'Knee in wrong position',
      'Not dropping weight',
    ],
    videoId: 'vid-031',
    thumbnailId: 'thumb-031',
    relatedTechniques: ['tech-010'],
    variations: ['Bread cutter choke', 'From knee on belly'],
    gipiNogi: 'gi',
  },

  // Turtle - Blue Belt
  {
    id: 'tech-032',
    name: 'Turtle Attack - Clock Choke',
    position: 'turtle',
    category: 'submission',
    beltLevel: 'blue',
    description: 'Collar choke against turtled opponent walking around like a clock.',
    keyPoints: [
      'Get deep collar grip from behind',
      'Sprawl and drop hip on their shoulder',
      'Walk your feet around toward their head',
      'Tighten collar as you walk',
      'Roll them to finish if needed',
    ],
    commonMistakes: [
      'Collar grip not deep enough',
      'Walking the wrong direction',
      'Not sprawling hip weight on them',
      'Letting them sit up or roll wrong way',
    ],
    videoId: 'vid-032',
    thumbnailId: 'thumb-032',
    relatedTechniques: ['tech-033'],
    variations: ['Short clock choke', 'Rolling clock choke'],
    gipiNogi: 'gi',
  },
  {
    id: 'tech-033',
    name: 'Seatbelt to Hooks - Back Take from Turtle',
    position: 'turtle',
    category: 'transition',
    beltLevel: 'blue',
    description: 'Taking the back from behind a turtled opponent.',
    keyPoints: [
      'Establish seatbelt grip (over-under)',
      'Drop to your hip on choking-arm side',
      'Insert bottom hook first',
      'Roll them into you to insert top hook',
      'Maintain tight seatbelt throughout',
    ],
    commonMistakes: [
      'Loose seatbelt (they escape)',
      'Trying to insert hooks before sitting',
      'Inserting top hook first',
      'Not rolling them into you',
    ],
    videoId: 'vid-033',
    thumbnailId: 'thumb-033',
    relatedTechniques: ['tech-015', 'tech-032'],
    variations: ['Chair sit back take', 'Rolling back take'],
    gipiNogi: 'both',
  },

  // =========================================
  // PURPLE BELT TECHNIQUES (Advanced)
  // =========================================

  // Open Guard - Purple Belt
  {
    id: 'tech-034',
    name: 'Berimbolo',
    position: 'open-guard',
    category: 'transition',
    beltLevel: 'purple',
    description: 'Inverted spin from De La Riva guard to take the back.',
    keyPoints: [
      'Establish deep DLR hook',
      'Control far leg and belt/pants',
      'Invert underneath them',
      'Spin to their back as they base',
      'Secure back control',
    ],
    commonMistakes: [
      'Inverting without proper grips',
      'Losing DLR hook during spin',
      'Telegraphing the move',
      'Not controlling far leg',
    ],
    videoId: 'vid-034',
    thumbnailId: 'thumb-034',
    relatedTechniques: ['tech-035', 'tech-036'],
    variations: ['Kiss of the dragon', 'Crab ride entry', 'Baby bolo'],
    gipiNogi: 'gi',
  },
  {
    id: 'tech-035',
    name: 'Leg Drag from De La Riva',
    position: 'open-guard',
    category: 'sweep',
    beltLevel: 'purple',
    description: 'Using DLR to off-balance and sweep to leg drag position.',
    keyPoints: [
      'Deep DLR hook and sleeve control',
      'Off-balance them with hook',
      'Transition to leg drag as they step',
      'Follow them up to top',
      'Establish passing position',
    ],
    commonMistakes: [
      'Weak DLR hook',
      'Not following up immediately',
      'Letting them re-establish base',
      'Not controlling sleeve',
    ],
    videoId: 'vid-035',
    thumbnailId: 'thumb-035',
    relatedTechniques: ['tech-034', 'tech-022'],
    variations: ['DLR sweep to mount', 'DLR back take'],
    gipiNogi: 'both',
  },
  {
    id: 'tech-036',
    name: 'X-Guard Sweep',
    position: 'open-guard',
    category: 'sweep',
    beltLevel: 'purple',
    description: 'Powerful sweep from X-guard position under opponent.',
    keyPoints: [
      'Get fully under their hips',
      'Legs in X configuration under thigh',
      'Control their ankle',
      'Extend legs to off-balance',
      'Technical stand up to top',
    ],
    commonMistakes: [
      'Not getting under them fully',
      'X-guard legs not configured right',
      'Not controlling the ankle',
      'Not following up to top',
    ],
    videoId: 'vid-036',
    thumbnailId: 'thumb-036',
    relatedTechniques: ['tech-034', 'tech-035'],
    variations: ['Single leg X', 'X to leg drag', 'X to back take'],
    gipiNogi: 'both',
  },

  // Leg Locks - Purple Belt
  {
    id: 'tech-037',
    name: 'Straight Ankle Lock',
    position: 'open-guard',
    category: 'submission',
    beltLevel: 'purple',
    description: 'Fundamental leg lock attacking the ankle and achilles.',
    keyPoints: [
      'Control the leg at hip level',
      'Grip figure-four around ankle',
      'Blade of wrist on achilles tendon',
      'Arch back to apply pressure',
      'Keep their knee pointed down',
    ],
    commonMistakes: [
      'Wrist not on achilles',
      'Letting them turn knee',
      'Not controlling hip line',
      'Cranking instead of arching',
    ],
    videoId: 'vid-037',
    thumbnailId: 'thumb-037',
    relatedTechniques: ['tech-038', 'tech-039'],
    variations: ['Belly-down ankle lock', 'Standing ankle lock'],
    gipiNogi: 'both',
  },
  {
    id: 'tech-038',
    name: 'Heel Hook',
    position: 'open-guard',
    category: 'submission',
    beltLevel: 'purple',
    description: 'Leg lock attacking the knee by rotating the heel.',
    keyPoints: [
      'Control the hip line with your legs',
      'Clamp above the knee to isolate',
      'Grip the heel (not ankle)',
      'Rotate toward the pinky toe (outside) or big toe (inside)',
      'Control position before attacking',
    ],
    commonMistakes: [
      'Not controlling hips (they escape)',
      'Gripping ankle instead of heel',
      'Wrong rotation direction',
      'Attacking before controlling position',
    ],
    videoId: 'vid-038',
    thumbnailId: 'thumb-038',
    relatedTechniques: ['tech-039', 'tech-037'],
    variations: ['Inside heel hook', 'Outside heel hook', 'From 50/50'],
    gipiNogi: 'nogi',
  },
  {
    id: 'tech-039',
    name: 'Inside Sankaku (Saddle/Honeyhole)',
    position: 'open-guard',
    category: 'control',
    beltLevel: 'purple',
    description: 'Leg entanglement position for heel hook attacks.',
    keyPoints: [
      'Triangle your legs around their thigh',
      'Control the knee line',
      'Keep them turned away from you',
      'Maintain inside position on leg',
      'Hip control is crucial',
    ],
    commonMistakes: [
      'Loose leg triangle',
      'Letting them turn toward you',
      'Not controlling the knee line',
      'Poor hip positioning',
    ],
    videoId: 'vid-039',
    thumbnailId: 'thumb-039',
    relatedTechniques: ['tech-038', 'tech-040'],
    variations: ['Cross ashi', '411 position', 'Outside ashi'],
    gipiNogi: 'both',
  },
  {
    id: 'tech-040',
    name: 'Knee Bar',
    position: 'open-guard',
    category: 'submission',
    beltLevel: 'purple',
    description: 'Leg lock hyperextending the knee from various positions.',
    keyPoints: [
      'Control the ankle between arm and body',
      'Hips tight to the back of their knee',
      'Triangle or clamp legs around thigh',
      'Arch hips to hyperextend',
      'Keep them from turning or sitting up',
    ],
    commonMistakes: [
      'Hips not tight to knee',
      'Allowing them to sit up',
      'Leg control too loose',
      'Not controlling the hip line',
    ],
    videoId: 'vid-040',
    thumbnailId: 'thumb-040',
    relatedTechniques: ['tech-037', 'tech-038'],
    variations: ['From mount', 'From side control', 'Spinning knee bar'],
    gipiNogi: 'both',
  },

  // Purple Belt - Advanced Transitions
  {
    id: 'tech-041',
    name: 'Arm Drag to Back',
    position: 'open-guard',
    category: 'transition',
    beltLevel: 'purple',
    description: 'Classic arm drag from guard to take the back.',
    keyPoints: [
      'Control wrist and tricep',
      'Pull arm across while hip escaping',
      'Come up to seat as you drag',
      'Secure seatbelt immediately',
      'Insert hooks for back control',
    ],
    commonMistakes: [
      'Dragging without hip escape',
      'Not coming up to seated',
      'Slow on the seatbelt',
      'Letting them turn back into you',
    ],
    videoId: 'vid-041',
    thumbnailId: 'thumb-041',
    relatedTechniques: ['tech-033', 'tech-034'],
    variations: ['2-on-1 arm drag', 'Standing arm drag'],
    gipiNogi: 'both',
  },
  {
    id: 'tech-042',
    name: 'Wrestling Up (Technical Stand Up)',
    position: 'open-guard',
    category: 'transition',
    beltLevel: 'purple',
    description: 'Getting to your feet from seated guard position.',
    keyPoints: [
      'Post on one hand behind you',
      'Kick other leg through',
      'Stand up on post-side leg first',
      'Keep guard hand ready (collar or wrist)',
      'Establish wrestling tie-up standing',
    ],
    commonMistakes: [
      'Standing without post (get pushed down)',
      'Losing all grips when standing',
      'Head position too low',
      'Stopping in bad position',
    ],
    videoId: 'vid-042',
    thumbnailId: 'thumb-042',
    relatedTechniques: ['tech-041', 'tech-017'],
    variations: ['To single leg', 'To snapdown'],
    gipiNogi: 'both',
  },

  // =========================================
  // BROWN BELT TECHNIQUES (Expert)
  // =========================================

  {
    id: 'tech-043',
    name: 'Crab Ride to Back',
    position: 'open-guard',
    category: 'transition',
    beltLevel: 'brown',
    description: 'Modern back take controlling from behind using legs like a crab.',
    keyPoints: [
      'Get behind them with hip control',
      'Legs hook their hips/legs like a crab',
      'Stay off your back, ride them',
      'Transition to back hooks or submission',
      'Maintain constant pressure',
    ],
    commonMistakes: [
      'Falling to your back',
      'Legs not hooked properly',
      'Losing hip control',
      'Not transitioning to finish',
    ],
    videoId: 'vid-043',
    thumbnailId: 'thumb-043',
    relatedTechniques: ['tech-034', 'tech-033'],
    variations: ['To truck position', 'To twister', 'To back'],
    gipiNogi: 'both',
  },
  {
    id: 'tech-044',
    name: 'Truck Position',
    position: 'back',
    category: 'control',
    beltLevel: 'brown',
    description: 'Unorthodox back/leg control position with many attacks.',
    keyPoints: [
      'Lockdown one leg with your legs',
      'Control upper body with grips',
      'Creates access to calf slicer and twister',
      'Can transition to full back control',
      'Constant threat position',
    ],
    commonMistakes: [
      'Lockdown not tight enough',
      'Poor upper body control',
      'Not threatening attacks',
      'Letting them roll out',
    ],
    videoId: 'vid-044',
    thumbnailId: 'thumb-044',
    relatedTechniques: ['tech-043', 'tech-045'],
    variations: ['To twister', 'To calf slicer', 'To banana split'],
    gipiNogi: 'both',
  },
  {
    id: 'tech-045',
    name: 'Twister',
    position: 'back',
    category: 'submission',
    beltLevel: 'brown',
    description: 'Spinal lock attack from truck position.',
    keyPoints: [
      'Secure truck position first',
      'Control head under your armpit',
      'Figure-four grip on head',
      'Rotate spine by pulling head and driving hips',
      'Slow and controlled - dangerous submission',
    ],
    commonMistakes: [
      'Attacking before truck is secure',
      'Wrong head control',
      'Cranking too fast (dangerous)',
      'Losing leg control',
    ],
    videoId: 'vid-045',
    thumbnailId: 'thumb-045',
    relatedTechniques: ['tech-044'],
    variations: ['Wrestlers guillotine'],
    gipiNogi: 'both',
  },
  {
    id: 'tech-046',
    name: 'Estima Lock',
    position: 'open-guard',
    category: 'submission',
    beltLevel: 'brown',
    description: 'Foot lock counter when opponent stands in your guard.',
    keyPoints: [
      'They stand in open guard',
      'Grab ankle and pull foot to your chest',
      'Overhook their shin bone',
      'Armpit pressure on top of foot',
      'Extend to apply pressure',
    ],
    commonMistakes: [
      'Foot not secured to chest',
      'Wrong grip on shin',
      'Not extending properly',
      'Letting them pull foot out',
    ],
    videoId: 'vid-046',
    thumbnailId: 'thumb-046',
    relatedTechniques: ['tech-037'],
    variations: ['From 50/50', 'Standing version'],
    gipiNogi: 'both',
  },
  {
    id: 'tech-047',
    name: 'Worm Guard Fundamentals',
    position: 'open-guard',
    category: 'control',
    beltLevel: 'brown',
    description: 'Lapel guard wrapping the leg to control and attack.',
    keyPoints: [
      'Feed lapel behind their leg to yourself',
      'Control lapel with grip on your hip-side',
      'Use DLR hook in conjunction',
      'Multiple sweep and submission options',
      'Constant lapel tension is key',
    ],
    commonMistakes: [
      'Lapel not fed deep enough',
      'Loose lapel control',
      'Not using in combination with hooks',
      'Predictable attacks',
    ],
    videoId: 'vid-047',
    thumbnailId: 'thumb-047',
    relatedTechniques: ['tech-034', 'tech-035'],
    variations: ['Squid guard', 'Ringworm guard', 'Reverse worm'],
    gipiNogi: 'gi',
  },

  // =========================================
  // BLACK BELT TECHNIQUES (Master)
  // =========================================

  {
    id: 'tech-048',
    name: 'System Integration - Guard Retention Concepts',
    position: 'open-guard',
    category: 'control',
    beltLevel: 'black',
    description: 'Advanced concepts of keeping guard against high-level passers.',
    keyPoints: [
      'Frame before they establish grips',
      'Hip movement timing is everything',
      'Layer defenses (frames, legs, grips)',
      'Recover to guard types that match your game',
      'Constant threat creation prevents passing',
    ],
    commonMistakes: [
      'Reactive instead of proactive frames',
      'Static guard positions',
      'Over-reliance on one guard',
      'Not using whole body',
    ],
    videoId: 'vid-048',
    thumbnailId: 'thumb-048',
    relatedTechniques: ['tech-034', 'tech-036'],
    variations: ['Multiple applicable concepts'],
    gipiNogi: 'both',
  },
  {
    id: 'tech-049',
    name: 'Pressure Passing System',
    position: 'half-guard',
    category: 'pass',
    beltLevel: 'black',
    description: 'Systematic approach to heavy pressure passing.',
    keyPoints: [
      'Establish head and arm control',
      'Heavy hips, constant pressure',
      'Chain passes - force reactions',
      'Use their escapes against them',
      'Patience and timing over speed',
    ],
    commonMistakes: [
      'Rushing without pressure',
      'Not chaining techniques',
      'Losing position for pass attempt',
      'Predictable patterns',
    ],
    videoId: 'vid-049',
    thumbnailId: 'thumb-049',
    relatedTechniques: ['tech-021', 'tech-023'],
    variations: ['Multiple applicable concepts'],
    gipiNogi: 'both',
  },
  {
    id: 'tech-050',
    name: 'Submission Chains and Counters',
    position: 'mount',
    category: 'submission',
    beltLevel: 'black',
    description: 'Linking submissions from mount based on defensive reactions.',
    keyPoints: [
      'Every defense opens another attack',
      'Armbar → Triangle → Armbar',
      'Collar choke → Arm attacks when they defend',
      'Read and flow with opponent',
      'Position before submission always',
    ],
    commonMistakes: [
      'Forcing single attack',
      'Not reading reactions',
      'Losing position chasing submission',
      'Telegraphing chains',
    ],
    videoId: 'vid-050',
    thumbnailId: 'thumb-050',
    relatedTechniques: ['tech-001', 'tech-002', 'tech-008'],
    variations: ['Multiple applicable concepts'],
    gipiNogi: 'both',
  },
];

// ===========================================
// CURRICULUM BY BELT
// ===========================================

export const curriculumRequirements: Record<BeltColor, string[]> = {
  white: [
    'tech-001', 'tech-002', 'tech-003', 'tech-004', 'tech-005', 'tech-006', 'tech-007',
    'tech-008', 'tech-009', 'tech-010', 'tech-011', 'tech-012', 'tech-013', 'tech-014',
    'tech-015', 'tech-016', 'tech-017', 'tech-018', 'tech-019',
  ],
  blue: [
    'tech-020', 'tech-021', 'tech-022', 'tech-023', 'tech-024', 'tech-025', 'tech-026',
    'tech-027', 'tech-028', 'tech-029', 'tech-030', 'tech-031', 'tech-032', 'tech-033',
  ],
  purple: [
    'tech-034', 'tech-035', 'tech-036', 'tech-037', 'tech-038', 'tech-039', 'tech-040',
    'tech-041', 'tech-042',
  ],
  brown: [
    'tech-043', 'tech-044', 'tech-045', 'tech-046', 'tech-047',
  ],
  black: [
    'tech-048', 'tech-049', 'tech-050',
  ],
};

// ===========================================
// USER'S TECHNIQUE PROGRESS (Marcus Chen - Blue 2 stripe)
// ===========================================

export const mockTechniqueProgress: TechniqueProgress[] = [
  // White belt techniques (all proficient - completed)
  { techniqueId: 'tech-001', proficiency: 'proficient', timesDrilled: 45, lastDrilled: '2024-12-18', coachEndorsed: true },
  { techniqueId: 'tech-002', proficiency: 'proficient', timesDrilled: 38, lastDrilled: '2024-12-15', coachEndorsed: true },
  { techniqueId: 'tech-003', proficiency: 'proficient', timesDrilled: 30, lastDrilled: '2024-12-10', coachEndorsed: true },
  { techniqueId: 'tech-004', proficiency: 'proficient', timesDrilled: 25, lastDrilled: '2024-12-08', coachEndorsed: true },
  { techniqueId: 'tech-005', proficiency: 'proficient', timesDrilled: 35, lastDrilled: '2024-12-12', coachEndorsed: true },
  { techniqueId: 'tech-006', proficiency: 'proficient', timesDrilled: 22, lastDrilled: '2024-11-28', coachEndorsed: true },
  { techniqueId: 'tech-007', proficiency: 'proficient', timesDrilled: 28, lastDrilled: '2024-12-05', coachEndorsed: true },
  { techniqueId: 'tech-008', proficiency: 'proficient', timesDrilled: 41, lastDrilled: '2024-12-14', coachEndorsed: true },
  { techniqueId: 'tech-009', proficiency: 'proficient', timesDrilled: 33, lastDrilled: '2024-12-16', coachEndorsed: true },
  { techniqueId: 'tech-010', proficiency: 'proficient', timesDrilled: 27, lastDrilled: '2024-12-02', coachEndorsed: true },
  { techniqueId: 'tech-011', proficiency: 'proficient', timesDrilled: 48, lastDrilled: '2024-12-19', coachEndorsed: true },
  { techniqueId: 'tech-012', proficiency: 'proficient', timesDrilled: 52, lastDrilled: '2024-12-20', coachEndorsed: true },
  { techniqueId: 'tech-013', proficiency: 'proficient', timesDrilled: 44, lastDrilled: '2024-12-17', coachEndorsed: true },
  { techniqueId: 'tech-014', proficiency: 'proficient', timesDrilled: 36, lastDrilled: '2024-12-11', coachEndorsed: true },
  { techniqueId: 'tech-015', proficiency: 'proficient', timesDrilled: 55, lastDrilled: '2024-12-19', coachEndorsed: true },
  { techniqueId: 'tech-016', proficiency: 'proficient', timesDrilled: 40, lastDrilled: '2024-12-13', coachEndorsed: true },
  { techniqueId: 'tech-017', proficiency: 'developing', timesDrilled: 18, lastDrilled: '2024-12-10', coachEndorsed: false },
  { techniqueId: 'tech-018', proficiency: 'developing', timesDrilled: 15, lastDrilled: '2024-12-08', coachEndorsed: false },
  { techniqueId: 'tech-019', proficiency: 'proficient', timesDrilled: 60, lastDrilled: '2024-12-20', coachEndorsed: true },

  // Blue belt techniques (in progress)
  { techniqueId: 'tech-020', proficiency: 'proficient', timesDrilled: 28, lastDrilled: '2024-12-19', coachEndorsed: true },
  { techniqueId: 'tech-021', proficiency: 'developing', timesDrilled: 22, lastDrilled: '2024-12-17', coachEndorsed: false },
  { techniqueId: 'tech-022', proficiency: 'developing', timesDrilled: 16, lastDrilled: '2024-12-15', coachEndorsed: false },
  { techniqueId: 'tech-023', proficiency: 'developing', timesDrilled: 12, lastDrilled: '2024-12-12', coachEndorsed: false },
  { techniqueId: 'tech-024', proficiency: 'developing', timesDrilled: 18, lastDrilled: '2024-12-14', coachEndorsed: false },
  { techniqueId: 'tech-025', proficiency: 'learning', timesDrilled: 8, lastDrilled: '2024-12-08', coachEndorsed: false },
  { techniqueId: 'tech-026', proficiency: 'learning', timesDrilled: 10, lastDrilled: '2024-12-10', coachEndorsed: false },
  { techniqueId: 'tech-027', proficiency: 'developing', timesDrilled: 14, lastDrilled: '2024-12-16', coachEndorsed: false },
  { techniqueId: 'tech-028', proficiency: 'learning', timesDrilled: 6, lastDrilled: '2024-12-05', coachEndorsed: false },

  // Purple belt techniques (just exploring)
  { techniqueId: 'tech-037', proficiency: 'learning', timesDrilled: 5, lastDrilled: '2024-12-18', coachEndorsed: false },
  { techniqueId: 'tech-038', proficiency: 'learning', timesDrilled: 4, lastDrilled: '2024-12-15', coachEndorsed: false },
];

// ===========================================
// TECHNIQUE STATS
// ===========================================

export const techniqueStats = {
  totalTechniques: mockTechniques.length,
  byBelt: {
    white: mockTechniques.filter(t => t.beltLevel === 'white').length,
    blue: mockTechniques.filter(t => t.beltLevel === 'blue').length,
    purple: mockTechniques.filter(t => t.beltLevel === 'purple').length,
    brown: mockTechniques.filter(t => t.beltLevel === 'brown').length,
    black: mockTechniques.filter(t => t.beltLevel === 'black').length,
  },
  byPosition: {
    'closed-guard': mockTechniques.filter(t => t.position === 'closed-guard').length,
    'open-guard': mockTechniques.filter(t => t.position === 'open-guard').length,
    'half-guard': mockTechniques.filter(t => t.position === 'half-guard').length,
    'mount': mockTechniques.filter(t => t.position === 'mount').length,
    'side-control': mockTechniques.filter(t => t.position === 'side-control').length,
    'back': mockTechniques.filter(t => t.position === 'back').length,
    'turtle': mockTechniques.filter(t => t.position === 'turtle').length,
    'standing': mockTechniques.filter(t => t.position === 'standing').length,
    'north-south': mockTechniques.filter(t => t.position === 'north-south').length,
    'knee-on-belly': mockTechniques.filter(t => t.position === 'knee-on-belly').length,
  },
  byCategory: {
    submission: mockTechniques.filter(t => t.category === 'submission').length,
    sweep: mockTechniques.filter(t => t.category === 'sweep').length,
    pass: mockTechniques.filter(t => t.category === 'pass').length,
    escape: mockTechniques.filter(t => t.category === 'escape').length,
    takedown: mockTechniques.filter(t => t.category === 'takedown').length,
    control: mockTechniques.filter(t => t.category === 'control').length,
    transition: mockTechniques.filter(t => t.category === 'transition').length,
  },
};
