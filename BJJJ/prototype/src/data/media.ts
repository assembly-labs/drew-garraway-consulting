/**
 * Mock Media Data
 * Video content and photography placeholders for technique demonstrations
 */

export type VideoQuality = '480p' | '720p' | '1080p' | '4k';
export type VideoStatus = 'available' | 'processing' | 'coming-soon';

export interface TechniqueVideo {
  id: string;
  techniqueId: string;
  title: string;
  description: string;
  duration: number; // seconds
  thumbnailUrl: string;
  videoUrl: string;
  instructorId: string;
  instructorName: string;
  quality: VideoQuality[];
  views: number;
  likes: number;
  uploadedAt: string;
  status: VideoStatus;
  chapters?: VideoChapter[];
  captions?: boolean;
}

export interface VideoChapter {
  title: string;
  startTime: number; // seconds
}

export interface ThumbnailImage {
  id: string;
  url: string;
  alt: string;
  width: number;
  height: number;
  techniqueId?: string;
  type: 'technique' | 'profile' | 'gym' | 'badge' | 'belt' | 'hero' | 'placeholder';
}

export interface GalleryImage {
  id: string;
  url: string;
  alt: string;
  width: number;
  height: number;
  category: 'training' | 'competition' | 'promotion' | 'gym' | 'team';
  uploadedBy?: string;
  uploadedAt?: string;
  caption?: string;
}

// ===========================================
// MOCK TECHNIQUE VIDEOS
// ===========================================

export const mockTechniqueVideos: TechniqueVideo[] = [
  // WHITE BELT FUNDAMENTALS
  {
    id: 'vid-001',
    techniqueId: 'tech-001',
    title: 'Armbar from Closed Guard - Complete Guide',
    description: 'Master the fundamental armbar from closed guard. This video covers proper hip positioning, grip control, and common mistakes to avoid.',
    duration: 485,
    thumbnailUrl: '/images/thumbnails/armbar-guard.jpg',
    videoUrl: '/videos/techniques/armbar-closed-guard.mp4',
    instructorId: 'coach-001',
    instructorName: 'Professor Ricardo Silva',
    quality: ['720p', '1080p'],
    views: 12453,
    likes: 892,
    uploadedAt: '2024-03-15',
    status: 'available',
    chapters: [
      { title: 'Introduction', startTime: 0 },
      { title: 'Grip Setup', startTime: 45 },
      { title: 'Hip Movement', startTime: 120 },
      { title: 'Finishing Details', startTime: 240 },
      { title: 'Common Mistakes', startTime: 360 },
      { title: 'Drilling Tips', startTime: 420 },
    ],
    captions: true,
  },
  {
    id: 'vid-002',
    techniqueId: 'tech-002',
    title: 'Triangle Choke from Guard - Step by Step',
    description: 'Learn the triangle choke from closed guard with proper angle, leg positioning, and finishing mechanics.',
    duration: 512,
    thumbnailUrl: '/images/thumbnails/triangle-guard.jpg',
    videoUrl: '/videos/techniques/triangle-closed-guard.mp4',
    instructorId: 'coach-001',
    instructorName: 'Professor Ricardo Silva',
    quality: ['720p', '1080p'],
    views: 10234,
    likes: 756,
    uploadedAt: '2024-03-20',
    status: 'available',
    chapters: [
      { title: 'Introduction', startTime: 0 },
      { title: 'Setting Up the Triangle', startTime: 60 },
      { title: 'Cutting the Angle', startTime: 180 },
      { title: 'Finishing Mechanics', startTime: 300 },
      { title: 'Troubleshooting', startTime: 420 },
    ],
    captions: true,
  },
  {
    id: 'vid-003',
    techniqueId: 'tech-003',
    title: 'Kimura from Closed Guard - Control to Finish',
    description: 'The kimura shoulder lock from closed guard. Learn proper grip, figure-four control, and finishing angles.',
    duration: 398,
    thumbnailUrl: '/images/thumbnails/kimura-guard.jpg',
    videoUrl: '/videos/techniques/kimura-closed-guard.mp4',
    instructorId: 'coach-001',
    instructorName: 'Professor Ricardo Silva',
    quality: ['720p', '1080p'],
    views: 8921,
    likes: 634,
    uploadedAt: '2024-04-01',
    status: 'available',
    captions: true,
  },
  {
    id: 'vid-004',
    techniqueId: 'tech-004',
    title: 'Rear Naked Choke - The King of Submissions',
    description: 'Complete breakdown of the rear naked choke. Seatbelt control, choking arm placement, and finishing details.',
    duration: 445,
    thumbnailUrl: '/images/thumbnails/rnc.jpg',
    videoUrl: '/videos/techniques/rear-naked-choke.mp4',
    instructorId: 'coach-001',
    instructorName: 'Professor Ricardo Silva',
    quality: ['720p', '1080p', '4k'],
    views: 15678,
    likes: 1234,
    uploadedAt: '2024-02-10',
    status: 'available',
    chapters: [
      { title: 'Back Control Fundamentals', startTime: 0 },
      { title: 'Seatbelt Grip', startTime: 60 },
      { title: 'Getting the Choking Arm', startTime: 150 },
      { title: 'Finishing Details', startTime: 280 },
      { title: 'Dealing with Defense', startTime: 380 },
    ],
    captions: true,
  },
  {
    id: 'vid-005',
    techniqueId: 'tech-005',
    title: 'Scissor Sweep - Fundamental Guard Sweep',
    description: 'The scissor sweep is essential for white belts. Learn timing, grips, and hip mechanics for effective sweeping.',
    duration: 356,
    thumbnailUrl: '/images/thumbnails/scissor-sweep.jpg',
    videoUrl: '/videos/techniques/scissor-sweep.mp4',
    instructorId: 'coach-002',
    instructorName: 'Coach Amanda Foster',
    quality: ['720p', '1080p'],
    views: 7654,
    likes: 543,
    uploadedAt: '2024-04-15',
    status: 'available',
    captions: true,
  },
  {
    id: 'vid-006',
    techniqueId: 'tech-006',
    title: 'Hip Bump Sweep - Power from Bottom',
    description: 'Use momentum and timing to sweep with the hip bump. Great for when opponent postures in your guard.',
    duration: 312,
    thumbnailUrl: '/images/thumbnails/hip-bump.jpg',
    videoUrl: '/videos/techniques/hip-bump-sweep.mp4',
    instructorId: 'coach-002',
    instructorName: 'Coach Amanda Foster',
    quality: ['720p', '1080p'],
    views: 6234,
    likes: 445,
    uploadedAt: '2024-04-20',
    status: 'available',
    captions: true,
  },
  {
    id: 'vid-007',
    techniqueId: 'tech-007',
    title: 'Toreando Pass - Speed Passing Fundamentals',
    description: 'The toreando (bullfighter) pass. Control the legs, move the hips, and establish side control with speed.',
    duration: 478,
    thumbnailUrl: '/images/thumbnails/toreando.jpg',
    videoUrl: '/videos/techniques/toreando-pass.mp4',
    instructorId: 'coach-001',
    instructorName: 'Professor Ricardo Silva',
    quality: ['720p', '1080p'],
    views: 9876,
    likes: 789,
    uploadedAt: '2024-05-01',
    status: 'available',
    chapters: [
      { title: 'Grip Fighting', startTime: 0 },
      { title: 'Controlling the Legs', startTime: 80 },
      { title: 'The Pass', startTime: 200 },
      { title: 'Establishing Position', startTime: 320 },
      { title: 'Troubleshooting', startTime: 400 },
    ],
    captions: true,
  },
  {
    id: 'vid-008',
    techniqueId: 'tech-008',
    title: 'Knee Cut Pass - Pressure Passing 101',
    description: 'The knee slice/cut pass. Learn how to use weight, underhooks, and hip pressure to complete the pass.',
    duration: 523,
    thumbnailUrl: '/images/thumbnails/knee-cut.jpg',
    videoUrl: '/videos/techniques/knee-cut-pass.mp4',
    instructorId: 'coach-001',
    instructorName: 'Professor Ricardo Silva',
    quality: ['720p', '1080p', '4k'],
    views: 11234,
    likes: 923,
    uploadedAt: '2024-05-10',
    status: 'available',
    chapters: [
      { title: 'Entry from Standing', startTime: 0 },
      { title: 'Underhook Control', startTime: 90 },
      { title: 'Knee Position', startTime: 180 },
      { title: 'Hip Pressure', startTime: 280 },
      { title: 'Completing the Pass', startTime: 380 },
      { title: 'Countering Half Guard', startTime: 450 },
    ],
    captions: true,
  },
  {
    id: 'vid-009',
    techniqueId: 'tech-009',
    title: 'Bridge and Roll Escape from Mount',
    description: 'The fundamental mount escape every practitioner must know. Trap, bridge, and roll to guard.',
    duration: 289,
    thumbnailUrl: '/images/thumbnails/bridge-roll.jpg',
    videoUrl: '/videos/techniques/bridge-roll-escape.mp4',
    instructorId: 'coach-002',
    instructorName: 'Coach Amanda Foster',
    quality: ['720p', '1080p'],
    views: 8765,
    likes: 654,
    uploadedAt: '2024-03-01',
    status: 'available',
    captions: true,
  },
  {
    id: 'vid-010',
    techniqueId: 'tech-010',
    title: 'Elbow-Knee Escape from Mount',
    description: 'Technical escape to half guard using elbow-knee connection and hip movement.',
    duration: 345,
    thumbnailUrl: '/images/thumbnails/elbow-knee.jpg',
    videoUrl: '/videos/techniques/elbow-knee-escape.mp4',
    instructorId: 'coach-002',
    instructorName: 'Coach Amanda Foster',
    quality: ['720p', '1080p'],
    views: 7234,
    likes: 567,
    uploadedAt: '2024-03-05',
    status: 'available',
    captions: true,
  },
  // BLUE BELT TECHNIQUES
  {
    id: 'vid-011',
    techniqueId: 'tech-020',
    title: 'Spider Guard Fundamentals',
    description: 'Introduction to spider guard. Grips, foot placement, and controlling distance.',
    duration: 567,
    thumbnailUrl: '/images/thumbnails/spider-guard.jpg',
    videoUrl: '/videos/techniques/spider-guard.mp4',
    instructorId: 'coach-001',
    instructorName: 'Professor Ricardo Silva',
    quality: ['720p', '1080p'],
    views: 5432,
    likes: 432,
    uploadedAt: '2024-06-01',
    status: 'available',
    captions: true,
  },
  {
    id: 'vid-012',
    techniqueId: 'tech-021',
    title: 'De La Riva Guard - Hook and Control',
    description: 'Master the DLR hook. Off-balancing, grip combinations, and sweep entries.',
    duration: 612,
    thumbnailUrl: '/images/thumbnails/dlr-guard.jpg',
    videoUrl: '/videos/techniques/de-la-riva.mp4',
    instructorId: 'coach-001',
    instructorName: 'Professor Ricardo Silva',
    quality: ['720p', '1080p'],
    views: 6789,
    likes: 534,
    uploadedAt: '2024-06-15',
    status: 'available',
    chapters: [
      { title: 'DLR Hook Placement', startTime: 0 },
      { title: 'Grip Combinations', startTime: 100 },
      { title: 'Off-Balancing', startTime: 220 },
      { title: 'Sweep Entries', startTime: 380 },
      { title: 'Common Problems', startTime: 520 },
    ],
    captions: true,
  },
  {
    id: 'vid-013',
    techniqueId: 'tech-024',
    title: 'X-Guard Sweeps',
    description: 'Enter and sweep from X-guard. Technical stand, ankle pick, and back take options.',
    duration: 534,
    thumbnailUrl: '/images/thumbnails/x-guard.jpg',
    videoUrl: '/videos/techniques/x-guard.mp4',
    instructorId: 'coach-002',
    instructorName: 'Coach Amanda Foster',
    quality: ['720p', '1080p'],
    views: 4567,
    likes: 345,
    uploadedAt: '2024-07-01',
    status: 'available',
    captions: true,
  },
  // LEG LOCKS
  {
    id: 'vid-014',
    techniqueId: 'tech-012',
    title: 'Heel Hook Mechanics - Safety First',
    description: 'Understanding heel hook mechanics, the danger zone, and proper application. Safety and control emphasized.',
    duration: 678,
    thumbnailUrl: '/images/thumbnails/heel-hook.jpg',
    videoUrl: '/videos/techniques/heel-hook.mp4',
    instructorId: 'coach-002',
    instructorName: 'Coach Amanda Foster',
    quality: ['720p', '1080p', '4k'],
    views: 8923,
    likes: 712,
    uploadedAt: '2024-08-01',
    status: 'available',
    chapters: [
      { title: 'Heel Hook Safety', startTime: 0 },
      { title: 'Inside vs Outside', startTime: 80 },
      { title: 'Control Position', startTime: 180 },
      { title: 'Breaking Mechanics', startTime: 340 },
      { title: 'When to Tap', startTime: 500 },
      { title: 'Drilling Safely', startTime: 580 },
    ],
    captions: true,
  },
  {
    id: 'vid-015',
    techniqueId: 'tech-013',
    title: 'Saddle/Inside Sankaku Control',
    description: 'The inside sankaku (411/saddle) position. Entries, control, and finishing options.',
    duration: 589,
    thumbnailUrl: '/images/thumbnails/saddle.jpg',
    videoUrl: '/videos/techniques/saddle-control.mp4',
    instructorId: 'coach-002',
    instructorName: 'Coach Amanda Foster',
    quality: ['720p', '1080p'],
    views: 6234,
    likes: 489,
    uploadedAt: '2024-08-10',
    status: 'available',
    captions: true,
  },
  // COMING SOON - PURPLE+ CONTENT
  {
    id: 'vid-016',
    techniqueId: 'tech-034',
    title: 'Berimbolo - Complete System',
    description: 'The berimbolo back take. Inversions, timing, and troubleshooting common defenses.',
    duration: 0,
    thumbnailUrl: '/images/thumbnails/berimbolo-coming-soon.jpg',
    videoUrl: '',
    instructorId: 'coach-001',
    instructorName: 'Professor Ricardo Silva',
    quality: [],
    views: 0,
    likes: 0,
    uploadedAt: '',
    status: 'coming-soon',
    captions: false,
  },
  {
    id: 'vid-017',
    techniqueId: 'tech-035',
    title: 'Crab Ride to Back Take',
    description: 'Modern back taking using crab ride control. Entries and finishes.',
    duration: 0,
    thumbnailUrl: '/images/thumbnails/crab-ride-coming-soon.jpg',
    videoUrl: '',
    instructorId: 'coach-001',
    instructorName: 'Professor Ricardo Silva',
    quality: [],
    views: 0,
    likes: 0,
    uploadedAt: '',
    status: 'coming-soon',
    captions: false,
  },
  {
    id: 'vid-018',
    techniqueId: 'tech-043',
    title: 'Lapel Guard Systems',
    description: 'Advanced lapel guard concepts. Worm guard, squid guard, and lapel lasso.',
    duration: 0,
    thumbnailUrl: '/images/thumbnails/lapel-coming-soon.jpg',
    videoUrl: '',
    instructorId: 'coach-001',
    instructorName: 'Professor Ricardo Silva',
    quality: [],
    views: 0,
    likes: 0,
    uploadedAt: '',
    status: 'coming-soon',
    captions: false,
  },
];

// ===========================================
// MOCK THUMBNAIL IMAGES
// ===========================================

export const mockThumbnails: ThumbnailImage[] = [
  // Technique thumbnails
  { id: 'thumb-001', url: '/images/thumbnails/armbar-guard.jpg', alt: 'Armbar from closed guard thumbnail', width: 1280, height: 720, techniqueId: 'tech-001', type: 'technique' },
  { id: 'thumb-002', url: '/images/thumbnails/triangle-guard.jpg', alt: 'Triangle choke thumbnail', width: 1280, height: 720, techniqueId: 'tech-002', type: 'technique' },
  { id: 'thumb-003', url: '/images/thumbnails/kimura-guard.jpg', alt: 'Kimura from guard thumbnail', width: 1280, height: 720, techniqueId: 'tech-003', type: 'technique' },
  { id: 'thumb-004', url: '/images/thumbnails/rnc.jpg', alt: 'Rear naked choke thumbnail', width: 1280, height: 720, techniqueId: 'tech-004', type: 'technique' },
  { id: 'thumb-005', url: '/images/thumbnails/scissor-sweep.jpg', alt: 'Scissor sweep thumbnail', width: 1280, height: 720, techniqueId: 'tech-005', type: 'technique' },
  { id: 'thumb-006', url: '/images/thumbnails/hip-bump.jpg', alt: 'Hip bump sweep thumbnail', width: 1280, height: 720, techniqueId: 'tech-006', type: 'technique' },
  { id: 'thumb-007', url: '/images/thumbnails/toreando.jpg', alt: 'Toreando pass thumbnail', width: 1280, height: 720, techniqueId: 'tech-007', type: 'technique' },
  { id: 'thumb-008', url: '/images/thumbnails/knee-cut.jpg', alt: 'Knee cut pass thumbnail', width: 1280, height: 720, techniqueId: 'tech-008', type: 'technique' },
  { id: 'thumb-009', url: '/images/thumbnails/bridge-roll.jpg', alt: 'Bridge and roll escape thumbnail', width: 1280, height: 720, techniqueId: 'tech-009', type: 'technique' },
  { id: 'thumb-010', url: '/images/thumbnails/elbow-knee.jpg', alt: 'Elbow knee escape thumbnail', width: 1280, height: 720, techniqueId: 'tech-010', type: 'technique' },
  { id: 'thumb-011', url: '/images/thumbnails/spider-guard.jpg', alt: 'Spider guard thumbnail', width: 1280, height: 720, techniqueId: 'tech-020', type: 'technique' },
  { id: 'thumb-012', url: '/images/thumbnails/dlr-guard.jpg', alt: 'De La Riva guard thumbnail', width: 1280, height: 720, techniqueId: 'tech-021', type: 'technique' },
  { id: 'thumb-013', url: '/images/thumbnails/x-guard.jpg', alt: 'X-Guard thumbnail', width: 1280, height: 720, techniqueId: 'tech-024', type: 'technique' },
  { id: 'thumb-014', url: '/images/thumbnails/heel-hook.jpg', alt: 'Heel hook thumbnail', width: 1280, height: 720, techniqueId: 'tech-012', type: 'technique' },
  { id: 'thumb-015', url: '/images/thumbnails/saddle.jpg', alt: 'Saddle position thumbnail', width: 1280, height: 720, techniqueId: 'tech-013', type: 'technique' },

  // Belt images
  { id: 'belt-white', url: '/images/belts/white-belt.png', alt: 'White belt', width: 400, height: 60, type: 'belt' },
  { id: 'belt-blue', url: '/images/belts/blue-belt.png', alt: 'Blue belt', width: 400, height: 60, type: 'belt' },
  { id: 'belt-purple', url: '/images/belts/purple-belt.png', alt: 'Purple belt', width: 400, height: 60, type: 'belt' },
  { id: 'belt-brown', url: '/images/belts/brown-belt.png', alt: 'Brown belt', width: 400, height: 60, type: 'belt' },
  { id: 'belt-black', url: '/images/belts/black-belt.png', alt: 'Black belt', width: 400, height: 60, type: 'belt' },

  // Badge images
  { id: 'badge-first-session', url: '/images/badges/first-session.png', alt: 'First session badge', width: 200, height: 200, type: 'badge' },
  { id: 'badge-100-sessions', url: '/images/badges/100-sessions.png', alt: '100 sessions badge', width: 200, height: 200, type: 'badge' },
  { id: 'badge-first-sub', url: '/images/badges/first-submission.png', alt: 'First submission badge', width: 200, height: 200, type: 'badge' },
  { id: 'badge-first-comp', url: '/images/badges/first-competition.png', alt: 'First competition badge', width: 200, height: 200, type: 'badge' },
  { id: 'badge-medal', url: '/images/badges/medal-winner.png', alt: 'Medal winner badge', width: 200, height: 200, type: 'badge' },
  { id: 'badge-streak-30', url: '/images/badges/30-day-streak.png', alt: '30 day streak badge', width: 200, height: 200, type: 'badge' },

  // Profile placeholders
  { id: 'profile-default', url: '/images/profiles/default-avatar.png', alt: 'Default profile avatar', width: 400, height: 400, type: 'profile' },
  { id: 'profile-tony', url: '/images/profiles/tony-chen.jpg', alt: 'Tony Chen profile', width: 400, height: 400, type: 'profile' },
  { id: 'profile-coach-ricardo', url: '/images/profiles/ricardo-silva.jpg', alt: 'Professor Ricardo Silva profile', width: 400, height: 400, type: 'profile' },
  { id: 'profile-coach-amanda', url: '/images/profiles/amanda-foster.jpg', alt: 'Coach Amanda Foster profile', width: 400, height: 400, type: 'profile' },

  // Gym images
  { id: 'gym-logo', url: '/images/gym/alliance-austin-logo.png', alt: 'Alliance BJJ Austin logo', width: 400, height: 400, type: 'gym' },
  { id: 'gym-hero', url: '/images/gym/alliance-austin-hero.jpg', alt: 'Alliance BJJ Austin training area', width: 1920, height: 1080, type: 'hero' },

  // Placeholder
  { id: 'placeholder', url: '/images/placeholder.jpg', alt: 'Placeholder image', width: 800, height: 600, type: 'placeholder' },
];

// ===========================================
// MOCK GALLERY IMAGES
// ===========================================

export const mockGalleryImages: GalleryImage[] = [
  // Training photos
  { id: 'gallery-001', url: '/images/gallery/training-01.jpg', alt: 'Training session', width: 1200, height: 800, category: 'training', caption: 'Evening gi class drilling armbars' },
  { id: 'gallery-002', url: '/images/gallery/training-02.jpg', alt: 'Sparring session', width: 1200, height: 800, category: 'training', caption: 'Rolling during open mat' },
  { id: 'gallery-003', url: '/images/gallery/training-03.jpg', alt: 'Technique drill', width: 1200, height: 800, category: 'training', caption: 'Partner drills - guard passing' },
  { id: 'gallery-004', url: '/images/gallery/training-04.jpg', alt: 'No-gi training', width: 1200, height: 800, category: 'training', caption: 'No-gi Thursday night class' },

  // Competition photos
  { id: 'gallery-005', url: '/images/gallery/comp-01.jpg', alt: 'Competition match', width: 1200, height: 800, category: 'competition', caption: 'Austin Summer Open 2024 - Semi Final' },
  { id: 'gallery-006', url: '/images/gallery/comp-02.jpg', alt: 'Medal ceremony', width: 1200, height: 800, category: 'competition', caption: 'Silver medal - Austin Summer Open' },
  { id: 'gallery-007', url: '/images/gallery/comp-03.jpg', alt: 'Team photo at competition', width: 1200, height: 800, category: 'competition', caption: 'Team Alliance at IBJJF' },

  // Promotion photos
  { id: 'gallery-008', url: '/images/gallery/promo-01.jpg', alt: 'Blue belt promotion', width: 1200, height: 800, category: 'promotion', uploadedAt: '2023-09-15', caption: 'Blue belt promotion - September 2023' },
  { id: 'gallery-009', url: '/images/gallery/promo-02.jpg', alt: 'Stripe ceremony', width: 1200, height: 800, category: 'promotion', uploadedAt: '2024-09-01', caption: 'Second stripe on blue belt' },

  // Gym photos
  { id: 'gallery-010', url: '/images/gallery/gym-01.jpg', alt: 'Gym mat area', width: 1600, height: 900, category: 'gym', caption: 'Main training area - 2000 sq ft of mat space' },
  { id: 'gallery-011', url: '/images/gallery/gym-02.jpg', alt: 'Gym entrance', width: 1600, height: 900, category: 'gym', caption: 'Alliance BJJ Austin entrance' },
  { id: 'gallery-012', url: '/images/gallery/gym-03.jpg', alt: 'Locker room', width: 1200, height: 800, category: 'gym', caption: 'Clean, spacious locker rooms' },

  // Team photos
  { id: 'gallery-013', url: '/images/gallery/team-01.jpg', alt: 'Team photo', width: 1600, height: 900, category: 'team', caption: 'Alliance Austin competition team 2024' },
  { id: 'gallery-014', url: '/images/gallery/team-02.jpg', alt: 'Coaches', width: 1200, height: 800, category: 'team', caption: 'Professor Ricardo and Coach Amanda' },
  { id: 'gallery-015', url: '/images/gallery/team-03.jpg', alt: 'Group training', width: 1600, height: 900, category: 'team', caption: 'Saturday morning all-levels class' },
];

// ===========================================
// MEDIA STATS
// ===========================================

export const mockMediaStats = {
  totalVideos: 18,
  availableVideos: 15,
  comingSoonVideos: 3,
  totalViews: 124567,
  totalLikes: 8923,
  averageVideoLength: 456, // seconds
  mostViewedVideo: 'vid-004', // RNC
  totalPhotos: 15,
  photoCategories: {
    training: 4,
    competition: 3,
    promotion: 2,
    gym: 3,
    team: 3,
  },
};

// ===========================================
// VIDEO PLAYER STATE (for UI)
// ===========================================

export interface VideoPlayerState {
  currentVideoId: string | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  quality: VideoQuality;
  playbackSpeed: number;
  isFullscreen: boolean;
}

export const defaultVideoPlayerState: VideoPlayerState = {
  currentVideoId: null,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 0.8,
  quality: '1080p',
  playbackSpeed: 1,
  isFullscreen: false,
};
