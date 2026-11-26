import type { Metadata } from "next";
import WorkArchive from "@/components/work-archive";
import { CATEGORIES, getProjects } from "@/lib/content";

export const metadata: Metadata = {
  title: "Work archive",
  description: "Browse campaigns, digital builds, proposals, writing, and speaking.",
};

export default function WorkPage() {
  const projects = getProjects().map(({ html: _html, ...project }) => project);
  return <WorkArchive projects={projects} categories={CATEGORIES} />;
}
