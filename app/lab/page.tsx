import type { Metadata } from "next";
import LabDesk from "@/components/lab-desk";
import LabFoldStudy from "@/components/lab-fold-study";
import { getProjects } from "@/lib/content";
import styles from "@/components/lab.module.css";

export const metadata: Metadata = {
  title: "Lab",
  description: "A working table of interactive prototypes, browser tools, and spatial studies.",
};

export default function LabPage() {
  const pieces = getProjects()
    .filter((project) => project.lab)
    .map(({ slug, title, summary, kind, cover, imageAlt, inspectCover, inspectAlt, year }) => (
      { slug, title, summary, kind, cover, imageAlt, inspectCover, inspectAlt, year }
    ));

  return (
    <main id="main-content" className={styles.lab} tabIndex={-1}>
      <header className={styles.intro}>
        <div>
          <p className={styles.kicker}>Prototypes and experiments</p>
          <h1>The <i>Lab.</i></h1>
        </div>
        <p className={styles.introText}>
          Some questions are easier to answer with something you can use.
          This is where I try out the small tools and strange objects that
          get me there.
        </p>
      </header>
      <LabDesk pieces={pieces} />
      <LabFoldStudy />
    </main>
  );
}
