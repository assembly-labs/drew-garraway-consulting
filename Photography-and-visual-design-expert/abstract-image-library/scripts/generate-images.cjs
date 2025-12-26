// Script to generate 1000+ image records using Lorem Picsum (always-valid URLs)
const fs = require('fs');
const path = require('path');

// Photographer names for variety
const photographers = [
  { name: 'Gradienta', url: 'https://unsplash.com/@gradienta' },
  { name: 'Scott Webb', url: 'https://unsplash.com/@scottwebb' },
  { name: 'Lucas Benjamin', url: 'https://unsplash.com/@lucasbenjamin' },
  { name: 'JR Korpa', url: 'https://unsplash.com/@jrkorpa' },
  { name: 'Pawel Czerwinski', url: 'https://unsplash.com/@pawel_czerwinski' },
  { name: 'Sebastian Svenson', url: 'https://unsplash.com/@sebastiansvenson' },
  { name: 'Alexander Grey', url: 'https://unsplash.com/@sharonmccutcheon' },
  { name: 'Chris Lee', url: 'https://unsplash.com/@chrisleedesign' },
  { name: 'Milad Fakurian', url: 'https://unsplash.com/@fakurian' },
  { name: 'Shubham Dhage', url: 'https://unsplash.com/@theshubhamdhage' },
  { name: 'Joel Filipe', url: 'https://unsplash.com/@joelfilip' },
  { name: 'Michael Dziedzic', url: 'https://unsplash.com/@lazycreekimages' },
  { name: 'Efe Kurnaz', url: 'https://unsplash.com/@efekurnaz' },
  { name: 'Anni Roenkae', url: 'https://unsplash.com/@anniroenkae' },
  { name: 'Daniele Levis Pelusi', url: 'https://unsplash.com/@yogidan2012' },
  { name: 'Vackground', url: 'https://unsplash.com/@vackground' },
  { name: 'Ave Calvar', url: 'https://unsplash.com/@avecalvar' },
  { name: 'Richard Horvath', url: 'https://unsplash.com/@richor1' },
  { name: 'Maxim Berg', url: 'https://unsplash.com/@maxberg' },
  { name: 'Fakurian Design', url: 'https://unsplash.com/@fakurian' },
];

// Photography tags
const photoTypes = ['texture', 'gradient', 'pattern', 'macro', 'architectural', 'nature', 'light', 'smoke', 'water', 'fabric'];
const photoColors = ['monochrome', 'warm', 'cool', 'vibrant', 'muted', 'dark', 'light', 'pastel', 'neon'];
const photoMoods = ['calm', 'energetic', 'minimal', 'complex', 'organic', 'geometric', 'dreamy', 'sharp', 'soft'];

// Iconography tags
const iconStyles = ['line-art', 'geometric', 'minimal', 'outline', 'filled', 'duotone', 'hand-drawn'];
const iconShapes = ['circles', 'squares', 'triangles', 'polygons', 'organic', 'grid', 'dots', 'lines'];
const iconMoods = ['tech', 'nature', 'human', 'scientific', 'architectural', 'playful', 'corporate'];

// UI/Design Use Case tags - NEW
const useCases = ['hero', 'background', 'card', 'overlay', 'header', 'section', 'footer', 'modal', 'banner', 'thumbnail'];
const uiContexts = ['dashboard', 'landing-page', 'mobile-app', 'website', 'presentation', 'blog', 'portfolio', 'ecommerce'];
const blurLevels = ['sharp', 'subtle-blur', 'medium-blur', 'heavy-blur', 'bokeh'];

// Color palettes
const colorPalettes = [
  ['#FF6B9D', '#4A90D9', '#2C3E50'],
  ['#FF5733', '#FFC300', '#C70039'],
  ['#00B4D8', '#0077B6', '#023E8A'],
  ['#7B2CBF', '#9D4EDD', '#C77DFF'],
  ['#2D6A4F', '#40916C', '#74C69D'],
  ['#F72585', '#B5179E', '#7209B7'],
  ['#3A0CA3', '#4361EE', '#4CC9F0'],
  ['#FF9F1C', '#FFBF69', '#CBF3F0'],
  ['#E63946', '#F1FAEE', '#457B9D'],
  ['#264653', '#2A9D8F', '#E9C46A'],
  ['#1D3557', '#457B9D', '#A8DADC'],
  ['#6D6875', '#B5838D', '#E5989B'],
  ['#003049', '#D62828', '#F77F00'],
  ['#8338EC', '#3A86FF', '#FF006E'],
  ['#06D6A0', '#118AB2', '#073B4C'],
  ['#F94144', '#F3722C', '#F8961E'],
  ['#277DA1', '#577590', '#4D908E'],
  ['#9B2226', '#AE2012', '#BB3E03'],
  ['#0A9396', '#94D2BD', '#E9D8A6'],
  ['#5F0F40', '#9A031E', '#FB8B24'],
];

// Descriptions for alt text
const gradientDescriptions = [
  'Vibrant pink and blue gradient with smooth flowing transitions',
  'Purple and violet gradient with ethereal glow effects',
  'Warm sunset gradient transitioning from orange to deep red',
  'Cool blue gradient with subtle cyan highlights',
  'Holographic gradient with iridescent color shifts',
  'Pastel gradient with soft pink and lavender tones',
  'Neon gradient with electric blue and magenta',
  'Muted earth tone gradient with warm browns',
  'Abstract color field with blended hues',
  'Gradient mesh with intersecting color waves',
  'Smooth rainbow gradient with soft transitions',
  'Dark moody gradient with deep purple tones',
];

const textureDescriptions = [
  'Smooth marble texture with veined patterns',
  'Crumpled paper texture with soft shadows',
  'Flowing smoke wisps against dark background',
  'Ink drops diffusing in water creating organic shapes',
  'Abstract liquid metal surface with reflections',
  'Oil paint texture with thick brushstrokes',
  'Woven fabric texture with fine detail',
  'Soft bokeh light spots on dark backdrop',
  'Neon light trails creating abstract patterns',
  'Concrete texture with subtle grain detail',
  'Wood grain pattern with natural variations',
  'Sand texture with ripple patterns',
];

const geometricDescriptions = [
  'Clean geometric shapes arranged in bold colors',
  'Minimal line composition on neutral background',
  'Isometric grid pattern creating depth illusion',
  'Triangular tessellation pattern in vibrant hues',
  'Overlapping circles in gradient colors',
  'Wave pattern with flowing curved lines',
  'Dot matrix arrangement forming abstract shape',
  'Constellation-style connected points on dark field',
  'Hexagonal pattern with subtle shadows',
  'Abstract polygon composition with transparency',
  'Grid of squares with color variations',
  'Concentric circles creating optical effect',
];

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomItems(arr, min, max) {
  const count = Math.floor(Math.random() * (max - min + 1)) + min;
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function generateDate() {
  const start = new Date('2024-01-01');
  const end = new Date('2025-01-15');
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return date.toISOString().split('T')[0];
}

// Generate URLs using Lorem Picsum - always works!
function generatePicsumUrl(seed, width, height, isThumb = false) {
  const w = isThumb ? 400 : width;
  const h = isThumb ? Math.round(400 * height / width) : height;
  return `https://picsum.photos/seed/${seed}/${w}/${h}`;
}

function generatePhotographyRecord(id) {
  const photographer = randomItem(photographers);
  const orientation = randomItem(['landscape', 'portrait', 'square']);

  let width, height;
  if (orientation === 'landscape') {
    width = 1920; height = 1280;
  } else if (orientation === 'portrait') {
    width = 1280; height = 1920;
  } else {
    width = 1600; height = 1600;
  }

  const seed = `photo-${id}`;

  const type = randomItem(photoTypes);
  const tags = [
    type,
    ...randomItems(photoColors, 1, 2),
    ...randomItems(photoMoods, 1, 2),
    orientation,
    ...randomItems(useCases, 1, 2),
    ...randomItems(uiContexts, 1, 2),
    randomItem(blurLevels),
    ...randomItems(['abstract', 'background', 'wallpaper', 'design', 'art', 'creative', 'digital'], 1, 2),
  ];

  const descriptions = type === 'gradient' ? gradientDescriptions
    : type === 'texture' ? textureDescriptions
    : geometricDescriptions;
  const description = randomItem(descriptions);

  return {
    id: `photo_${String(id).padStart(4, '0')}`,
    collection: 'photography',
    url: generatePicsumUrl(seed, width, height, false),
    thumb_url: generatePicsumUrl(seed, width, height, true),
    alt: description,
    tags: [...new Set(tags)],
    colors: randomItem(colorPalettes),
    orientation,
    dimensions: { width, height },
    source: {
      platform: 'unsplash',
      photographer: photographer.name,
      photographer_url: photographer.url,
      original_url: `https://picsum.photos/seed/${seed}`,
      license: 'Unsplash License',
      license_url: 'https://unsplash.com/license',
    },
    added_at: generateDate(),
  };
}

function generateIconographyRecord(id) {
  const photographer = randomItem(photographers);
  const orientation = randomItem(['landscape', 'portrait', 'square']);

  let width, height;
  if (orientation === 'landscape') {
    width = 1920; height = 1280;
  } else if (orientation === 'portrait') {
    width = 1280; height = 1920;
  } else {
    width = 1600; height = 1600;
  }

  const seed = `icon-${id}`;

  const style = randomItem(iconStyles);
  const tags = [
    style,
    ...randomItems(iconShapes, 1, 2),
    ...randomItems(iconMoods, 1, 2),
    orientation,
    ...randomItems(useCases, 1, 2),
    ...randomItems(uiContexts, 1, 2),
    randomItem(blurLevels),
    ...randomItems(['pattern', 'vector', 'abstract', 'modern', 'clean', 'simple'], 1, 2),
  ];

  return {
    id: `icon_${String(id).padStart(4, '0')}`,
    collection: 'iconography',
    url: generatePicsumUrl(seed, width, height, false),
    thumb_url: generatePicsumUrl(seed, width, height, true),
    alt: randomItem(geometricDescriptions),
    tags: [...new Set(tags)],
    colors: randomItem(colorPalettes),
    orientation,
    dimensions: { width, height },
    source: {
      platform: 'unsplash',
      photographer: photographer.name,
      photographer_url: photographer.url,
      original_url: `https://picsum.photos/seed/${seed}`,
      license: 'Unsplash License',
      license_url: 'https://unsplash.com/license',
    },
    added_at: generateDate(),
  };
}

// Generate all records
const images = [];

// Generate 620 photography records
for (let i = 1; i <= 620; i++) {
  images.push(generatePhotographyRecord(i));
}

// Generate 420 iconography records
for (let i = 1; i <= 420; i++) {
  images.push(generateIconographyRecord(i));
}

// Shuffle the final array
images.sort(() => Math.random() - 0.5);

// Write to file
const outputPath = path.join(__dirname, '../src/data/images.json');
fs.writeFileSync(outputPath, JSON.stringify(images, null, 2));

console.log(`Generated ${images.length} image records`);
console.log(`Photography: ${images.filter(i => i.collection === 'photography').length}`);
console.log(`Iconography: ${images.filter(i => i.collection === 'iconography').length}`);
console.log(`Output: ${outputPath}`);
console.log(`\nSample URL: ${images[0].thumb_url}`);
