import { MetadataRoute } from 'next';
import { getAllStorySlugs } from '@/lib/stories';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://locallystrong.org';

  // Static pages
  const staticPages = [
    '',
    '/about',
    '/get-involved',
    '/get-involved/partners',
    '/donate',
    '/contact',
    '/stories',
    '/stories/submit',
    '/policies/privacy',
    '/policies/terms',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'weekly' as const : 'monthly' as const,
    priority: route === '' ? 1 : route.includes('stories') ? 0.8 : 0.7,
  }));

  // Dynamic story pages
  const storySlugs = getAllStorySlugs();
  const storyPages = storySlugs.map((slug) => ({
    url: `${baseUrl}/stories/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...staticPages, ...storyPages];
}
