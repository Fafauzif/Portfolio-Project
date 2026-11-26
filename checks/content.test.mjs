import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import test from 'node:test';
import { parse } from 'yaml';

const projectDirectory = new URL('../content/projects/', import.meta.url);
const site = JSON.parse(readFileSync(new URL('../content/site.json', import.meta.url), 'utf8'));
const inventoryUrl = new URL('../docs/content-inventory.json', import.meta.url);
const projectFiles = readdirSync(projectDirectory).filter(name => name.endsWith('.md') && !name.startsWith('_'));
const projects = new Map(projectFiles.map(filename => {
  const source = readFileSync(new URL(filename, projectDirectory), 'utf8');
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n/.exec(source);
  assert.ok(match, `${filename} needs frontmatter`);
  const project = parse(match[1]);
  assert.equal(project.slug, filename.slice(0, -3));
  return [project.slug, { ...project, source: source.slice(match[0].length) }];
}));

function hasAsset(url) {
  assert.ok(url.startsWith('/portfolio-media/'), `Unexpected portfolio asset location: ${url}`);
  assert.ok(existsSync(new URL('../public' + url, import.meta.url)), `Missing public asset: ${url}`);
}

function hasProject(slug, from) {
  assert.ok(projects.has(slug), `${from} references missing project ${slug}`);
}

test('profile, experience, and recognition point to existing projects and media', () => {
  if (site.heroProject) {
    hasProject(site.heroProject, 'Home');
    assert.ok(projects.get(site.heroProject).featured, 'The home hero must reference a featured case');
  }
  if (site.labProject) {
    hasProject(site.labProject, 'Home Lab teaser');
    assert.ok(projects.get(site.labProject).lab, 'The Lab teaser must reference a Lab case');
  }
  for (const item of site.experience) for (const slug of item.projects) hasProject(slug, item.title);
  for (const item of site.recognition) if (item.project) hasProject(item.project, item.title);
  if (site.portrait) hasAsset(site.portrait.src);
  if (site.resume) hasAsset(site.resume);
  if (site.url) assert.match(new URL(site.url).protocol, /^https?:$/);
  if (site.preview === false) {
    assert.equal(new URL(site.url).protocol, 'https:');
    assert.ok(Array.isArray(site.publishedProjects) && site.publishedProjects.length, 'Select approved projects before turning off preview');
  }
});

test('the publication allowlist lists actual cases and preserves their case-study links', () => {
  if (!site.publishedProjects) return;
  const approved = new Set(site.publishedProjects);
  assert.equal(approved.size, site.publishedProjects.length, 'Remove duplicate publication slugs');
  for (const slug of approved) {
    hasProject(slug, 'Publication list');
    for (const match of projects.get(slug).source.matchAll(/\]\(\/work\/([a-z0-9-]+)\/?\)/g)) {
      assert.ok(approved.has(match[1]), `${slug} links to ${match[1]}, which is outside the publication list`);
    }
  }
});

test('the source-only inventory covers every case with matching titles and existing assets', () => {
  const inventory = JSON.parse(readFileSync(inventoryUrl, 'utf8'));
  assert.deepEqual(inventory.projects.map(item => item.slug).sort(), [...projects.keys()].sort());
  for (const item of inventory.projects) {
    assert.equal(item.title, projects.get(item.slug).title, `Update the inventory title for ${item.slug}`);
    assert.equal(item.file, `content/projects/${item.slug}.md`);
    for (const asset of item.assets) {
      assert.match(asset, /^public\/portfolio-media\//);
      assert.ok(existsSync(new URL('../' + asset, import.meta.url)), `Missing inventoried asset: ${asset}`);
    }
  }
});

test('cases have cover files, descriptive image text, and valid local cross-links', () => {
  assert.ok(projects.size, 'Add at least one portfolio project');
  for (const project of projects.values()) {
    hasAsset(project.cover);
    if (project.previewCover) hasAsset(project.previewCover);
    if (project.inspectCover) {
      hasAsset(project.inspectCover);
      assert.ok(project.inspectAlt?.trim(), `${project.slug} requires a description of the Lab detail image`);
    }
    assert.ok(project.imageAlt?.trim(), `${project.slug} requires a description of the cover`);
    for (const match of project.source.matchAll(/\]\((\/portfolio-media\/[^)\s]+)\)/g)) hasAsset(match[1]);
    for (const match of project.source.matchAll(/\]\(\/work\/([a-z0-9-]+)\/?\)/g)) hasProject(match[1], project.slug);
  }
});
