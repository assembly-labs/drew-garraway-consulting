export const TAG_CATEGORIES = {
  // Iconography-specific
  iconStyle: ['line-art', 'geometric', 'minimal', 'outline', 'filled', 'duotone', 'hand-drawn'],
  iconShape: ['circles', 'squares', 'triangles', 'polygons', 'organic', 'grid', 'dots', 'lines'],
  iconMood: ['tech', 'nature', 'human', 'scientific', 'architectural', 'playful', 'corporate'],

  // Photography-specific
  photoType: ['texture', 'gradient', 'pattern', 'macro', 'architectural', 'nature', 'light', 'smoke', 'water', 'fabric'],
  photoColor: ['monochrome', 'warm', 'cool', 'vibrant', 'muted', 'dark', 'light', 'pastel', 'neon'],
  photoMood: ['calm', 'energetic', 'minimal', 'complex', 'organic', 'geometric', 'dreamy', 'sharp', 'soft'],

  // UI/Design Use Cases - NEW
  useCase: ['hero', 'background', 'card', 'overlay', 'header', 'section', 'footer', 'modal', 'banner', 'thumbnail'],
  uiContext: ['dashboard', 'landing-page', 'mobile-app', 'website', 'presentation', 'blog', 'portfolio', 'ecommerce'],
  blurLevel: ['sharp', 'subtle-blur', 'medium-blur', 'heavy-blur', 'bokeh'],

  // Shared
  orientation: ['landscape', 'portrait', 'square'],

  // Color families (for filtering)
  colorFamily: ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink', 'brown', 'gray', 'black', 'white', 'multi']
} as const;

export const ALL_TAGS = [
  ...TAG_CATEGORIES.iconStyle,
  ...TAG_CATEGORIES.iconShape,
  ...TAG_CATEGORIES.iconMood,
  ...TAG_CATEGORIES.photoType,
  ...TAG_CATEGORIES.photoColor,
  ...TAG_CATEGORIES.photoMood,
  ...TAG_CATEGORIES.useCase,
  ...TAG_CATEGORIES.uiContext,
  ...TAG_CATEGORIES.blurLevel,
];

export const COLOR_SWATCHES: Record<string, string> = {
  red: '#ef4444',
  orange: '#f97316',
  yellow: '#eab308',
  green: '#22c55e',
  blue: '#3b82f6',
  purple: '#a855f7',
  pink: '#ec4899',
  brown: '#a16207',
  gray: '#6b7280',
  black: '#171717',
  white: '#f5f5f5',
  multi: 'linear-gradient(135deg, #ef4444, #f97316, #eab308, #22c55e, #3b82f6, #a855f7)',
};
