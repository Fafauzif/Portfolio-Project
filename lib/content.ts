import fs from 'node:fs';
import path from 'node:path';
import MarkdownIt from 'markdown-it';
import { parse } from 'yaml';

export const CATEGORIES = [
  { id: 'strategy', label: 'Strategy & Campaigns', description: 'Audience research, communications and work taken from brief to rollout.' },
  { id: 'builds', label: 'Tools & Digital Builds', description: 'Applications, extensions and experiments built around a specific task.' },
  { id: 'competitions', label: 'Competitions & Proposals', description: 'Business cases, prototypes and proposals developed under constraints.' },
  { id: 'editorial', label: 'Writing & Speaking', description: 'Writing, presentations and conversations designed for a particular audience.' },
] as const;

export type Category = (typeof CATEGORIES)[number]['id'];
export type Project = {
  slug: string;
  title: string;
  summary: string;
  category: Category;
  kind: string;
  year: number;
  role: string;
  client: string;
  cover: string;
  previewCover?: string;
  inspectCover?: string;
  inspectAlt?: string;
  imageAlt: string;
  tags: string[];
  featured: boolean;
  lab: boolean;
  accent?: string;
  html: string;
};

type Experience = { title: string; organization: string; period: string; summary: string; projects: string[] };
type Recognition = { title: string; organization: string; year: number; distinction: string; project?: string };
type Testimonial = { quote: string; author: string; role: string };
export type SiteContent = {
  name: string;
  initials: string;
  role: string;
  location: string;
  tagline: string;
  intro: string;
  about: string[];
  skills: string[];
  contact: { email: string; linkedin?: string };
  experience: Experience[];
  recognition: Recognition[];
  testimonials?: Testimonial[];
  resume?: string;
  portrait?: { src: string; alt: string };
  heroProject?: string;
  labProject?: string;
  url?: string;
  preview?: boolean;
  publishedProjects?: string[];
  allowTrainingBots?: boolean;
};

const contentDir = path.join(process.cwd(), 'content');
const markdown = new MarkdownIt({ html: false, typographer: true, linkify: false });
let projects: Project[] | undefined;
let site: SiteContent | undefined;

function readProject(filename: string): Project {
  const source = fs.readFileSync(path.join(contentDir, 'projects', filename), 'utf8');
  const header = /^---\r?\n([\s\S]*?)\r?\n---\r?\n/.exec(source);

  if (!header) throw new Error(`${filename} needs a YAML frontmatter block.`);

  const fields = parse(header[1]) as Omit<Project, 'html'>;
  const required = ['slug', 'title', 'summary', 'kind', 'role', 'client', 'cover', 'imageAlt'] as const;

  if (!fields || required.some(key => typeof fields[key] !== 'string' || !fields[key].trim())) {
    throw new Error(`${filename} is missing a required text field.`);
  }
  if (fields.slug !== filename.slice(0, -3) || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(fields.slug) || fields.slug === 'category') {
    throw new Error(`${filename} needs a public slug that matches the filename.`);
  }
  if (!CATEGORIES.some(category => category.id === fields.category) || !Number.isInteger(fields.year)) {
    throw new Error(`${filename} needs a valid category and year.`);
  }
  if (!Array.isArray(fields.tags) || fields.tags.some(tag => typeof tag !== 'string') ||
      typeof fields.featured !== 'boolean' || typeof fields.lab !== 'boolean') {
    throw new Error(`${filename} needs string-array tags and boolean featured/lab fields.`);
  }
  if (!/^\/portfolio-media\/[a-z0-9][a-z0-9.-]*\.(webp|avif|jpg|jpeg|png)$/i.test(fields.cover)) {
    throw new Error(`${filename} must reference a local image in /portfolio-media/.`);
  }
  if (fields.previewCover && !/^\/portfolio-media\/[a-z0-9][a-z0-9.-]*\.(webp|avif|jpg|jpeg|png)$/i.test(fields.previewCover)) {
    throw new Error(`${filename} must reference a local preview image in /portfolio-media/.`);
  }
  if (fields.inspectCover && (!/^\/portfolio-media\/[a-z0-9][a-z0-9.-]*\.(webp|avif|jpg|jpeg|png)$/i.test(fields.inspectCover) || !fields.inspectAlt?.trim())) {
    throw new Error(`${filename} must pair the Lab detail image with descriptive alternative text.`);
  }
  if (fields.accent && !/^#[0-9a-f]{6}$/i.test(fields.accent)) {
    throw new Error(`${filename} needs a six-digit hex accent color.`);
  }

  const body = source.slice(header[0].length).trim();
  if (!body) throw new Error(`${filename} needs a case study below the frontmatter.`);
  return { ...fields, html: markdown.render(body) };
}

export function getProjects(): Project[] {
  if (projects && process.env.NODE_ENV === 'production') return projects;
  const directory = path.join(contentDir, 'projects');
  const archive = fs.readdirSync(directory)
    .filter(name => name.endsWith('.md') && !name.startsWith('_'))
    .map(readProject)
    .sort((a, b) => b.year - a.year || a.title.localeCompare(b.title));
  const profile = getSite();
  if (profile.preview !== false) projects = archive;
  else {
    const approved = new Set(profile.publishedProjects);
    const approvedCases = archive.filter(project => approved.has(project.slug));
    if (approvedCases.length !== approved.size) {
      throw new Error('Every slug in content/site.json publishedProjects must match a project file.');
    }
    projects = approvedCases;
  }
  return projects;
}

export function getSite(): SiteContent {
  if (site && process.env.NODE_ENV === 'production') return site;
  const profile = JSON.parse(fs.readFileSync(path.join(contentDir, 'site.json'), 'utf8')) as SiteContent;
  if (profile.preview === false) {
    const url = profile.url && URL.canParse(profile.url) ? new URL(profile.url) : null;
    if (!url || url.protocol !== 'https:' || url.username || url.password || url.pathname !== '/' || url.search || url.hash) {
      throw new Error('Set content/site.json url to a public HTTPS origin before turning off preview.');
    }
    if (!Array.isArray(profile.publishedProjects) || !profile.publishedProjects.length) {
      throw new Error('List approved case slugs in content/site.json publishedProjects before turning off preview.');
    }
  }
  site = profile;
  return site;
}

export function getWorkCategories() {
  const archive = getProjects();
  return CATEGORIES.filter(category => archive.some(project => project.category === category.id));
}

export function getWorkListings() {
  return getProjects().map(({ slug, title, summary, category, kind, year, role, client, cover, previewCover, imageAlt, tags, featured }) =>
    ({ slug, title, summary, category, kind, year, role, client, cover, previewCover, imageAlt, tags, featured }));
}

export function categoryLabel(id: Category) {
  return CATEGORIES.find(category => category.id === id)?.label ?? id;
}
