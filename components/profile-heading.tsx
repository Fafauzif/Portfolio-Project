import type { CSSProperties } from 'react';

export function ProfileHeading({ name, as: Heading = 'h1', id }: { name: string; as?: 'h1' | 'h2'; id?: string }) {
  const words = name.trim().split(/\s+/);
  const longestWord = Math.max(...words.map(word => Array.from(word).length), 1);
  const fit = Math.min(16, 100 / (longestWord * .57));

  return <Heading className="profile-heading" id={id} style={{ '--profile-fit': `${fit}cqi` } as CSSProperties}>{name}</Heading>;
}
