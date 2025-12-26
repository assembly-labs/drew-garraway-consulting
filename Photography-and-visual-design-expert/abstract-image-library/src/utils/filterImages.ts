import type { ImageRecord, FilterState } from '../types';

export function filterImages(images: ImageRecord[], filters: FilterState): ImageRecord[] {
  return images.filter((image) => {
    // Collection filter
    if (filters.collection !== 'all' && image.collection !== filters.collection) {
      return false;
    }

    // Orientation filter
    if (filters.orientation !== 'all' && image.orientation !== filters.orientation) {
      return false;
    }

    // Tags filter (image must have at least one of the selected tags)
    if (filters.tags.length > 0) {
      const hasMatchingTag = filters.tags.some((tag) => image.tags.includes(tag));
      if (!hasMatchingTag) {
        return false;
      }
    }

    // Colors filter (check if image colors match any of the selected color families)
    if (filters.colors.length > 0) {
      const hasMatchingColor = filters.colors.some((colorFamily) => {
        return image.tags.includes(colorFamily) || matchesColorFamily(image.colors, colorFamily);
      });
      if (!hasMatchingColor) {
        return false;
      }
    }

    return true;
  });
}

function matchesColorFamily(hexColors: string[], colorFamily: string): boolean {
  const colorRanges: Record<string, (r: number, g: number, b: number) => boolean> = {
    red: (r, g, b) => r > 150 && g < 100 && b < 100,
    orange: (r, g, b) => r > 200 && g > 100 && g < 180 && b < 100,
    yellow: (r, g, b) => r > 200 && g > 200 && b < 100,
    green: (r, g, b) => g > 150 && r < 150 && b < 150,
    blue: (r, g, b) => b > 150 && r < 150 && g < 200,
    purple: (r, g, b) => r > 100 && b > 150 && g < 100,
    pink: (r, g, b) => r > 200 && b > 150 && g < 150,
    brown: (r, g, b) => r > 100 && r < 180 && g > 50 && g < 120 && b < 80,
    gray: (r, g, b) => Math.abs(r - g) < 30 && Math.abs(g - b) < 30 && r > 50 && r < 200,
    black: (r, g, b) => r < 50 && g < 50 && b < 50,
    white: (r, g, b) => r > 230 && g > 230 && b > 230,
    multi: () => true,
  };

  const matchFn = colorRanges[colorFamily];
  if (!matchFn) return false;

  return hexColors.some((hex) => {
    const rgb = hexToRgb(hex);
    if (!rgb) return false;
    return matchFn(rgb.r, rgb.g, rgb.b);
  });
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}
