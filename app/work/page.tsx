import WorkArchive from "@/components/work-archive";
import { getWorkListings, getWorkCategories } from "@/lib/content";
import { withCanonical } from "@/lib/site-metadata";

export const generateMetadata = () => withCanonical('/work/', {
  title: "Work archive",
  description: "Browse campaigns, digital builds, proposals, writing, and speaking.",
});

export default function WorkPage() {
  return <WorkArchive projects={getWorkListings()} categories={getWorkCategories()} />;
}
