/**
 * data.js — 14 placeholder stations across three bands.
 *
 * EVERYTHING HERE IS PLACEHOLDER. The structure mirrors real work from
 * 02-content-inventory.md so real content can be dropped in without touching
 * layout. `lift` is null wherever no baseline was actually measured — see the
 * note field, which says so on the page rather than inventing a percentage.
 *
 * A metric is `{ v, l }`. `v` holds a figure or a placing and stays short:
 * qualifiers like "National" or "International" belong in `l`, because `v` is
 * set at --fs-metric in a fixed 3-up grid and a 13-character word spills out of
 * its 105px column at 390px. The slot a qualifier leaves behind carries the
 * discipline, which is a word the ledger already publishes for each entry.
 */

export const BANDS = [
  { id: 'work',    label: 'Work' },
  { id: 'writing', label: 'Writing' },
  { id: 'record',  label: 'Record' },
];

export const STATIONS = [
  {
    id: 'tilg', band: 'work', ch: 1, freq: 88.1,
    title: 'Still, We Grow',
    tag: 'Brand strategy · 2026',
    desc: 'A 32-page marketing strategy aligning seven programs under one direction.',
    metrics: [
      { v: '557,080', l: 'Views, 30 days' },
      { v: '62.2%',   l: 'Non-followers' },
      { v: '+154%',   l: 'Vs benchmark' },
    ],
    lift: 154, floorLabel: 'Historical baseline', note: null,
    artifact: 'Strategy · 32 pp',
  },
  {
    id: 'referral', band: 'work', ch: 2, freq: 89.3,
    title: 'The Referral Engine',
    tag: 'Campaign system · 2026',
    desc: 'A 14-post recruitment campaign, then the tooling to run it again without hands.',
    metrics: [
      { v: '691',      l: 'Applicants' },
      { v: '69%',      l: 'Owned-channel' },
      { v: '+130%',    l: 'Vs target' },
    ],
    lift: 130, floorLabel: 'Intake target', note: null,
    artifact: 'Apps Script · 1 tool',
  },
  {
    id: 'mavenpro', band: 'work', ch: 3, freq: 90.7,
    title: 'Naming the Problem',
    tag: 'Consulting · 2026',
    desc: 'A five-person team, a property developer, and a diagnosis the client recognised.',
    metrics: [
      { v: '40',   l: 'Respondents' },
      { v: '3',    l: 'Competitors' },
      { v: '20',   l: 'Slides' },
    ],
    lift: null, floorLabel: 'Not measured', note: 'Validated by the client, never benchmarked. No invented percentage here.',
    artifact: 'Client deck · 20 sl',
  },
  {
    id: 'studentscatalyst', band: 'work', ch: 4, freq: 92.1,
    title: 'Copy for 134,000',
    tag: 'Copywriting · 2025',
    desc: 'Mission-aligned copy for a student community large enough that every word is load-bearing.',
    metrics: [
      { v: '134,000', l: 'Audience' },
      { v: '1,200+',  l: 'Avg engagement' },
      { v: '3,300+',  l: 'Best post' },
    ],
    lift: 210, floorLabel: 'Account median', note: null,
    artifact: 'Post set · 4 shown',
  },
  {
    id: 'selepas', band: 'work', ch: 5, freq: 93.5,
    title: 'Twelve a Month',
    tag: 'Social copy · 2025',
    desc: 'A year of monthly script batches for a youth education account with a small following.',
    metrics: [
      { v: '1,200',  l: 'Followers' },
      { v: '+25%',   l: 'Engagement' },
      { v: '600+',   l: 'Best post' },
    ],
    lift: 25, floorLabel: 'Pre-campaign', note: null,
    artifact: 'Scripts · 12/mo',
  },
  {
    id: 'fbl', band: 'work', ch: 6, freq: 95.1,
    title: 'The Content Architecture',
    tag: 'Content system · 2026',
    desc: 'Three pillars that decide what gets posted, instead of a calendar that does not.',
    metrics: [
      { v: '3',    l: 'Pillars' },
      { v: '2',    l: 'Platforms' },
      { v: '40+',  l: 'Posts' },
    ],
    lift: null, floorLabel: 'Not measured', note: 'A system, not a campaign. Nothing here was measured against a baseline.',
    artifact: 'System · 3 pillars',
  },

  {
    id: 'finvaton', band: 'writing', ch: 7, freq: 96.3,
    title: 'The Finvation Essay',
    tag: 'Essay · National 3rd',
    desc: 'A judged argument, placed third nationally. The clearest evidence that the writing holds up.',
    metrics: [
      { v: '3rd',     l: 'Placement · National' },
      { v: 'Essay',   l: 'Discipline' },
      { v: '2025',    l: 'Year' },
    ],
    lift: null, floorLabel: 'Judged', note: 'Placed by judges, not by a metric. A percentage here would be a lie.',
    artifact: 'Essay · full text',
  },
  {
    id: 'iels', band: 'writing', ch: 8, freq: 97.7,
    title: 'Two Articles a Week',
    tag: 'SEO writing · 2025–26',
    desc: 'Keyword research, competitor analysis, search intent mapping, and five months of shipped articles.',
    metrics: [
      { v: '40+',     l: 'Articles' },
      { v: '2',       l: 'Per week' },
      { v: '5',       l: 'Months' },
    ],
    lift: null, floorLabel: 'Not measured', note: 'Search performance was never reported back. Volume is what can be claimed.',
    artifact: 'Articles · 3 linked',
  },
  {
    id: 'pillars', band: 'writing', ch: 9, freq: 99.1,
    title: 'Theory, Case, Project',
    tag: 'Format design · 2026',
    desc: 'Three repeatable pillars so the account never starts from a blank page.',
    metrics: [
      { v: '3',    l: 'Pillars' },
      { v: '2',    l: 'Platforms' },
      { v: '16',   l: 'Posts' },
    ],
    lift: null, floorLabel: 'Not measured', note: 'A format, not a result. The reason it is here is that it removes the guess.',
    artifact: 'Format · 3 pillars',
  },
  {
    id: 'scripts', band: 'writing', ch: 10, freq: 100.5,
    title: 'Copy That Moved It',
    tag: 'Social copy · 2025',
    desc: 'Twelve tailored scripts a month, measured against the account\u2019s own baseline.',
    metrics: [
      { v: '+25%',    l: 'Engagement' },
      { v: '12',      l: 'Per month' },
      { v: '600+',    l: 'Best post' },
    ],
    lift: 25, floorLabel: 'Pre-campaign', note: null,
    artifact: 'Scripts · 1 shown',
  },

  {
    id: 'bpc1', band: 'record', ch: 11, freq: 102.3,
    title: 'Young Entrepreneur BPC',
    tag: 'Business plan · National 2nd',
    desc: 'Second nationally, on a plan judged for market analysis, financial viability and feasibility.',
    metrics: [
      { v: '2nd',     l: 'Placement · National' },
      { v: 'Plan',    l: 'Discipline' },
      { v: '2025',    l: 'Year' },
    ],
    lift: null, floorLabel: 'Judged', note: 'A placing, not a lift. The judges did the measuring.',
    artifact: 'Deck · as submitted',
  },
  {
    id: 'bpc2', band: 'record', ch: 12, freq: 103.9,
    title: 'Business Plan Vol. 2',
    tag: 'Business plan · National 2nd',
    desc: 'A second national second place in the same discipline, on a different idea.',
    metrics: [
      { v: '2nd',     l: 'Placement · National' },
      { v: 'Plan',    l: 'Discipline' },
      { v: '2025',    l: 'Year' },
    ],
    lift: null, floorLabel: 'Judged', note: 'Same discipline, different problem, same result. That is the point.',
    artifact: 'Deck · as submitted',
  },
  {
    id: 'atamerica', band: 'record', ch: 13, freq: 105.5,
    title: 'Atamerica Speech',
    tag: 'Speech · National 3rd',
    desc: 'Third nationally on the set theme Stay Curious, Stay Creative.',
    metrics: [
      { v: '3rd',     l: 'Placement · National' },
      { v: 'Speech',  l: 'Discipline' },
      { v: '2025',    l: 'Year' },
    ],
    lift: null, floorLabel: 'Judged', note: 'Delivered live. The recording is the artifact, not a number.',
    artifact: 'Recording · pending',
  },
  {
    id: 'padjadjaran', band: 'record', ch: 14, freq: 107.1,
    title: 'Padjadjaran English',
    tag: 'Speech · International finalist',
    desc: 'An international final in his first year, in his second language.',
    metrics: [
      { v: 'Finalist', l: 'Placement · International' },
      { v: 'Speech',   l: 'Discipline' },
      { v: '2024',     l: 'Year' },
    ],
    lift: null, floorLabel: 'Judged', note: 'First year of university. Second language. Worth stating plainly.',
    artifact: 'Recording · pending',
  },
];

export const FREQS = STATIONS.map((s) => s.freq);
