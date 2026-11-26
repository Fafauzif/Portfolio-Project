import type { Metadata } from 'next';
import { getSite } from './content';

export function withCanonical(path: string, metadata: Metadata = {}): Metadata {
  const site = getSite();
  if (site.preview !== false || !site.url) return metadata;

  const canonical = new URL(path, site.url).href;
  return {
    ...metadata,
    alternates: { ...metadata.alternates, canonical },
    ...(metadata.openGraph && { openGraph: { ...metadata.openGraph, url: canonical } }),
  };
}
