import { rm } from 'node:fs/promises';

// Extracting a new ZIP over v2 leaves these retired demo-profile assets on disk.
// Only remove them from the generated deploy directory.
const outputMedia = new URL('../out/portfolio-media/', import.meta.url);
await Promise.all(['mara-portrait.webp', 'mara-adair-resume.pdf'].map(filename =>
  rm(new URL(filename, outputMedia), { force: true })));
