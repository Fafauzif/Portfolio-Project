import type { MetadataRoute } from 'next';
import { getSite } from '@/lib/content';

export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  const site = getSite();
  return site.preview === false
    ? { rules: { userAgent: '*', allow: '/' }, sitemap: site.url ? new URL('/sitemap.xml', site.url).href : undefined }
    : { rules: { userAgent: '*', disallow: '/' } };
}
