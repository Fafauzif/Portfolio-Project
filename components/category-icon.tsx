import { ArticleIcon } from '@phosphor-icons/react/dist/ssr/Article';
import { BracketsCurlyIcon } from '@phosphor-icons/react/dist/ssr/BracketsCurly';
import { MegaphoneIcon } from '@phosphor-icons/react/dist/ssr/Megaphone';
import { PresentationChartIcon } from '@phosphor-icons/react/dist/ssr/PresentationChart';
import type { Category } from '@/lib/content';

const categoryIcons = {
  strategy: MegaphoneIcon,
  builds: BracketsCurlyIcon,
  competitions: PresentationChartIcon,
  editorial: ArticleIcon,
} satisfies Record<Category, typeof ArticleIcon>;

export function CategoryIcon({ category }: { category: Category | 'all' }) {
  if (category === 'all') return null;
  const Icon = categoryIcons[category];
  return <Icon className="category-icon" weight="regular" aria-hidden="true" focusable="false" />;
}
