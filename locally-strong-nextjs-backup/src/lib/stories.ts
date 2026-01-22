import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import type { Story, StoryFrontmatter } from './types';

const storiesDirectory = path.join(process.cwd(), 'src/content/stories');

/**
 * Get all stories sorted by date (newest first)
 */
export function getAllStories(): Story[] {
  try {
    const fileNames = fs.readdirSync(storiesDirectory);
    const stories = fileNames
      .filter((fileName) => fileName.endsWith('.mdx'))
      .map((fileName) => {
        const filePath = path.join(storiesDirectory, fileName);
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const { data, content } = matter(fileContents);

        return {
          ...(data as StoryFrontmatter),
          content,
        };
      });

    // Sort by date, newest first
    return stories.sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  } catch (error) {
    console.error('Error reading stories:', error);
    return [];
  }
}

/**
 * Get a single story by slug
 */
export function getStoryBySlug(slug: string): Story | null {
  try {
    const fileNames = fs.readdirSync(storiesDirectory);
    const fileName = fileNames.find((name) => {
      if (!name.endsWith('.mdx')) return false;
      const filePath = path.join(storiesDirectory, name);
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const { data } = matter(fileContents);
      return data.slug === slug;
    });

    if (!fileName) return null;

    const filePath = path.join(storiesDirectory, fileName);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
      ...(data as StoryFrontmatter),
      content,
    };
  } catch (error) {
    console.error(`Error reading story with slug "${slug}":`, error);
    return null;
  }
}

/**
 * Get all featured stories
 */
export function getFeaturedStories(): Story[] {
  const allStories = getAllStories();
  return allStories.filter((story) => story.featured);
}

/**
 * Get all story slugs (for static params)
 */
export function getAllStorySlugs(): string[] {
  try {
    const fileNames = fs.readdirSync(storiesDirectory);
    return fileNames
      .filter((fileName) => fileName.endsWith('.mdx'))
      .map((fileName) => {
        const filePath = path.join(storiesDirectory, fileName);
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const { data } = matter(fileContents);
        return data.slug as string;
      });
  } catch (error) {
    console.error('Error getting story slugs:', error);
    return [];
  }
}

/**
 * Get related stories (excluding current story)
 */
export function getRelatedStories(currentSlug: string, limit: number = 3): Story[] {
  const allStories = getAllStories();
  return allStories
    .filter((story) => story.slug !== currentSlug)
    .slice(0, limit);
}
