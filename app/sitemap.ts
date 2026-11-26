import type { MetadataRoute } from 'next';
import { getProjects, getSite, getWorkCategories } from '@/lib/content';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const site = getSite();
  if (site.preview !== false || !site.url) return [];

  const pages = ['/', '/work/', '/lab/', '/about/', '/experience/', '/recognition/', '/resume/', '/contact/'];
  const categories = getWorkCategories().map(category => `/work/category/${category.id}/`);
  const projects = getProjects().map(project => `/work/${project.slug}/`);
  return [...pages, ...categories, ...projects].map(route => ({ url: new URL(route, site.url).href }));
}
