import type { Metadata } from "next";
import { notFound } from "next/navigation";
import WorkArchive from "@/components/work-archive";
import { getWorkListings, getWorkCategories } from "@/lib/content";
import { withCanonical } from "@/lib/site-metadata";

type PageProps = {
  params: Promise<{ category: string }>;
};

export function generateStaticParams() {
  return getWorkCategories().map(({ id }) => ({ category: id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params;
  const entry = getWorkCategories().find(item => item.id === category);
  if (!entry) return {};
  return withCanonical(`/work/category/${entry.id}/`, { title: entry.label, description: entry.description });
}

export default async function WorkCategoryPage({ params }: PageProps) {
  const { category } = await params;
  const categories = getWorkCategories();
  if (!categories.some(item => item.id === category)) notFound();
  return <WorkArchive projects={getWorkListings()} categories={categories} initialCategory={category} />;
}
