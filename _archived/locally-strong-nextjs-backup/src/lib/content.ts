import fs from 'fs';
import path from 'path';
import type { SiteContent, HomeContent } from './types';

const contentDirectory = path.join(process.cwd(), 'src/content');

export function getSiteContent(): SiteContent {
  try {
    const filePath = path.join(contentDirectory, 'site.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContents) as SiteContent;
  } catch (error) {
    console.error('Error reading site.json:', error);
    throw new Error('Failed to load site content');
  }
}

export function getHomeContent(): HomeContent {
  try {
    const filePath = path.join(contentDirectory, 'home.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContents) as HomeContent;
  } catch (error) {
    console.error('Error reading home.json:', error);
    throw new Error('Failed to load home content');
  }
}
