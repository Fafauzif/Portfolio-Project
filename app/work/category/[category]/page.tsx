import type { Metadata } from "next";
import { notFound } from "next/navigation";
import WorkArchive from "@/components/work-archive";
import { CATEGORIES, getProjects } from "@/lib/content";

type PageProps = {
  params: Promise<{ category: string }>;
};

export function generateStaticParams() {
  return CATEGORIES.map(({ id }) => ({ category: id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params;
  const entry = CATEGORIES.find(item => item.id === category);
  if (!entry) return {};
  return { title: entry.label, description: entry.description };
}

export default async function WorkCategoryPage({ params }: PageProps) {
  const { category } = await params;
  if (!CATEGORIES.some(item => item.id === category)) notFound();
  const projects = getProjects().map(({ html: _html, ...project }) => project);
  return <WorkArchive projects={projects} categories={CATEGORIES} initialCategory={category} />;
}
