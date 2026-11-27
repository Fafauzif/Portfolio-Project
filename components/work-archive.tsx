"use client";

import { useEffect, useId, useRef, useState } from "react";
import { CategoryIcon } from "./category-icon";
import type { Category as CategoryId } from "@/lib/content";
import WorkArrow from "./work-arrow";
import styles from "./work-archive.module.css";

type Listing = {
  slug: string;
  title: string;
  summary: string;
  category: CategoryId;
  kind: string;
  year: number;
  role: string;
  client: string;
  cover: string;
  previewCover?: string;
  imageAlt: string;
  tags: string[];
  featured: boolean;
};

type Category = {
  id: CategoryId;
  label: string;
  description: string;
};

export type { Listing };

function categoryHref(id: string) {
  return id === "all" ? "/work/" : `/work/category/${id}/`;
}

function caseHref(slug: string) {
  return `/work/${slug}/`;
}

function normalize(value: string) {
  return value.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
}

function Cover({ project, eager = false }: { project: Listing; eager?: boolean }) {
  return (
    <a className={styles.cover} href={caseHref(project.slug)} tabIndex={-1} data-pointer-zone="cover" data-reveal-print
      aria-label={`Read case study for ${project.title}`} style={{ viewTransitionName: `case-${project.slug}` }}>
      <img src={project.previewCover ?? project.cover} alt="" width={1200} height={900} loading={eager ? "eager" : "lazy"}
        fetchPriority={eager ? "high" : undefined} decoding="async" />
      <span className={styles.coverArrow}><WorkArrow /></span>
    </a>
  );
}

function titleHasWideWord(title: string) {
  return title.split(/\s+/).some(word => Array.from(word).length > 17);
}

function ProjectCard({ project, onPreview, lead = false, enhanced }: {
  project: Listing;
  onPreview: (project: Listing, button: HTMLButtonElement) => void;
  lead?: boolean;
  enhanced: boolean;
}) {
  return (
    <article className={lead ? styles.lead : styles.card}>
      <Cover project={project} eager={lead} />
      <div className={styles.cardCopy}>
        <h2 data-long-word={titleHasWideWord(project.title)}><a className={styles.titleLink} href={caseHref(project.slug)}>{project.title}</a></h2>
        <p className={styles.cardMeta}><span>{project.kind}</span><time dateTime={String(project.year)}>{project.year}</time></p>
        <p className={styles.cardSummary}>{project.summary}</p>
        <div className={styles.cardActions}>
          {enhanced && <button type="button" className={styles.previewButton} data-pointer-control onClick={event => onPreview(project, event.currentTarget)}
            aria-haspopup="dialog" aria-label={`Preview ${project.title}`}>Quick view<span aria-hidden="true">+</span></button>}
        </div>
      </div>
    </article>
  );
}

export default function WorkArchive({ projects, categories, initialCategory = "all" }: {
  projects: Listing[];
  categories: readonly Category[];
  initialCategory?: string;
}) {
  const [query, setQuery] = useState("");
  const [enhanced, setEnhanced] = useState(false);
  const [preview, setPreview] = useState<Listing | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement>(null);
  const searchInput = useRef<HTMLInputElement>(null);
  const searchId = useId();
  const previewTitleId = useId();
  const currentCategory = categories.find(category => category.id === initialCategory);
  const labels = new Map(categories.map(category => [category.id, category.label]));

  useEffect(() => {
    const syncQuery = () => setQuery(new URLSearchParams(window.location.search).get("q") ?? "");
    syncQuery();
    setEnhanced(true);
    window.addEventListener("popstate", syncQuery);
    return () => window.removeEventListener("popstate", syncQuery);
  }, []);

  function changeQuery(value: string) {
    setQuery(value);
    const url = new URL(window.location.href);
    if (value.trim()) url.searchParams.set("q", value);
    else url.searchParams.delete("q");
    window.history.replaceState(window.history.state, "", url);
  }

  useEffect(() => {
    if (preview && dialog.current && !dialog.current.open) dialog.current.showModal();
  }, [preview]);

  function showPreview(project: Listing, button: HTMLButtonElement) {
    opener.current = button;
    setPreview(project);
  }

  function afterClose() {
    setPreview(null);
    opener.current?.focus();
  }

  const terms = normalize(query.trim()).split(/\s+/).filter(Boolean);
  const visible = projects.filter(project => {
    if (initialCategory !== "all" && project.category !== initialCategory) return false;
    const haystack = normalize([project.title, project.summary, project.kind, project.client, labels.get(project.category), ...project.tags].join(" "));
    return terms.every(term => haystack.includes(term));
  }).sort((a, b) => Number(b.featured) - Number(a.featured));
  const showLead = terms.length === 0 && visible.length > 0;
  const filters = [{ id: "all" as const, label: "All work" }, ...categories];
  const categorySuffix = query.trim() ? `?q=${encodeURIComponent(query)}` : "";

  return (
    <main className={styles.archive} id="main-content" tabIndex={-1}>
      <header className={styles.archiveHeader} data-filtered={!!currentCategory}>
        <div className={styles.headingArea}>
          <h1>{currentCategory ? currentCategory.label : <>Work in <em>print.</em></>}</h1>
        </div>
        <div className={styles.intro}>
          <p>{currentCategory?.description ?? "Campaigns, digital builds, proposals, and editorial work. Each case shows what changed between the brief and the result."}</p>
          <div className={styles.searchSlot}>
            {enhanced && <form role="search" className={styles.search} onSubmit={event => event.preventDefault()}>
              <label htmlFor={searchId}>Search work</label>
              <div className={styles.searchField}>
                <input ref={searchInput} id={searchId} type="search" name="q" value={query}
                  onChange={event => changeQuery(event.target.value)} placeholder="Try research or tools" />
                {query && <button type="button" onClick={() => { changeQuery(""); searchInput.current?.focus(); }}>Clear</button>}
              </div>
            </form>}
          </div>
        </div>
      </header>

      <div className={styles.archiveBar}>
        <nav className={styles.filters} aria-label="Work categories">
          {filters.map(category => (
            <a key={category.id} href={`${categoryHref(category.id)}${categorySuffix}`} data-pointer-control
              aria-current={category.id === initialCategory ? "page" : undefined}>
              <CategoryIcon category={category.id} />
              <span>{category.label}</span>
            </a>
          ))}
        </nav>
        <output className={styles.count} aria-live="polite">{visible.length} {visible.length === 1 ? "project" : "projects"}</output>
      </div>

      {showLead && <ProjectCard project={visible[0]} onPreview={showPreview} enhanced={enhanced} lead />}
      {visible.length > Number(showLead) && (
        <div className={styles.grid}>
          {visible.slice(showLead ? 1 : 0).map(project => (
            <ProjectCard key={project.slug} project={project} onPreview={showPreview} enhanced={enhanced} />
          ))}
        </div>
      )}
      {visible.length === 0 && <section className={styles.empty} aria-labelledby="archive-empty-title">
        <h2 id="archive-empty-title">No matching projects.</h2>
        <p>Try another title, topic, or category.</p>
        {query && <button type="button" onClick={() => { changeQuery(""); searchInput.current?.focus(); }}>Clear search</button>}
      </section>}

      <dialog ref={dialog} className={styles.dialog} aria-labelledby={previewTitleId} onClose={afterClose}
        onClick={event => { if (event.target === event.currentTarget) dialog.current?.close(); }}>
        {preview && <div className={styles.dialogInner}>
          <button type="button" className={styles.close} onClick={() => dialog.current?.close()} autoFocus>Close <span aria-hidden="true">×</span></button>
          <img src={preview.cover} alt={preview.imageAlt} width={1200} height={900} decoding="async" />
          <div className={styles.dialogCopy}>
            <h2 id={previewTitleId} data-long-word={titleHasWideWord(preview.title)}>{preview.title}</h2>
            <p className={styles.cardMeta}><span>{preview.kind}</span><time dateTime={String(preview.year)}>{preview.year}</time></p>
            <p>{preview.summary}</p>
            <p className={styles.previewRole}><strong>Role</strong> {preview.role}</p>
            <a href={caseHref(preview.slug)} className={styles.dialogLink}>Read the full case <WorkArrow /></a>
          </div>
        </div>}
      </dialog>
    </main>
  );
}
