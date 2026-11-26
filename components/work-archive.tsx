"use client";

import { type PointerEvent, useEffect, useId, useRef, useState } from "react";
import WorkArrow from "./work-arrow";
import styles from "./work-archive.module.css";

type Listing = {
  slug: string;
  title: string;
  summary: string;
  category: string;
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
  id: string;
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

function updateDirection(event: PointerEvent<HTMLAnchorElement>) {
  if (event.pointerType !== "mouse") return;
  const cover = event.currentTarget;
  const rect = cover.getBoundingClientRect();
  const dx = (event.clientX - rect.left) / rect.width - .5;
  const dy = (event.clientY - rect.top) / rect.height - .5;
  cover.style.setProperty("--preview-x", Math.abs(dx) > Math.abs(dy) ? (dx < 0 ? "-9px" : "9px") : "0px");
  cover.style.setProperty("--preview-y", Math.abs(dy) >= Math.abs(dx) ? (dy < 0 ? "-9px" : "9px") : "0px");
}

function Cover({ project, eager = false }: { project: Listing; eager?: boolean }) {
  return (
    <a className={styles.cover} href={caseHref(project.slug)}
      aria-label={`Read case study for ${project.title}`} style={{ viewTransitionName: `case-${project.slug}` }} onPointerEnter={updateDirection}>
      <img src={project.previewCover ?? project.cover} alt="" width={1200} height={900} loading={eager ? "eager" : "lazy"}
        fetchPriority={eager ? "high" : undefined} decoding="async" />
      <span className={styles.coverArrow}><WorkArrow /></span>
    </a>
  );
}

function ProjectCard({ project, category, onPreview, lead = false, enhanced }: {
  project: Listing;
  category?: string;
  onPreview: (project: Listing, button: HTMLButtonElement) => void;
  lead?: boolean;
  enhanced: boolean;
}) {
  return (
    <article className={lead ? styles.lead : styles.card}>
      <Cover project={project} eager={lead} />
      <div className={styles.cardCopy}>
        <p className={styles.cardMeta}><span>{category ?? project.kind}</span><span>{project.year}</span></p>
        <h2>{project.title}</h2>
        <p className={styles.cardSummary}>{project.summary}</p>
        <div className={styles.cardActions}>
          {enhanced && <button type="button" className={styles.previewButton} onClick={event => onPreview(project, event.currentTarget)}
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
  const categorySuffix = query.trim() ? `?q=${encodeURIComponent(query)}` : "";

  return (
    <main className={styles.archive} id="main-content" tabIndex={-1}>
      <header className={styles.archiveHeader} data-filtered={!!currentCategory}>
        <div>
          <p className={styles.eyebrow}><a href="/work/">Work archive</a>{currentCategory && <span aria-hidden="true"> / </span>}{currentCategory?.label}</p>
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
          {[{ id: "all", label: "All work" }, ...categories].map(category => (
            <a key={category.id} href={`${categoryHref(category.id)}${categorySuffix}`}
              aria-current={category.id === initialCategory ? "page" : undefined}>
              {category.label}
            </a>
          ))}
        </nav>
        <output className={styles.count} aria-live="polite">{visible.length} {visible.length === 1 ? "project" : "projects"}</output>
      </div>

      {showLead && <ProjectCard project={visible[0]} category={labels.get(visible[0].category)} onPreview={showPreview} enhanced={enhanced} lead />}
      {visible.length > Number(showLead) && (
        <div className={styles.grid}>
          {visible.slice(showLead ? 1 : 0).map(project => (
            <ProjectCard key={project.slug} project={project} category={labels.get(project.category)} onPreview={showPreview} enhanced={enhanced} />
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
            <p className={styles.eyebrow}>{labels.get(preview.category)}<span aria-hidden="true"> / </span>{preview.year}</p>
            <h2 id={previewTitleId}>{preview.title}</h2>
            <p>{preview.summary}</p>
            <p className={styles.previewRole}><strong>Role</strong> {preview.role}</p>
            <a href={caseHref(preview.slug)} className={styles.dialogLink}>Read the full case <WorkArrow /></a>
          </div>
        </div>}
      </dialog>
    </main>
  );
}
