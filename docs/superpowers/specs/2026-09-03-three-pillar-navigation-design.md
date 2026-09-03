# Three-Pillar Navigation Design

## Goal

Simplify the shared top navigation to three primary research pillars:

1. `AI-Ready Data`
2. `Scientific Knowledge`
3. `Scientific Tool`

The labels remain in English in both Chinese and English language modes, matching the user's requested information architecture.

## Destinations

- `AI-Ready Data` links to `ai_ready_data/`.
- `Scientific Knowledge` links to `knowledge_memory/`.
- `Scientific Tool` links to `scistar/`.

Existing pages for scientific inference, AI Scientist, Science of AI, open-source projects, publications, and scientific data modeling remain available through homepage and contextual links. This change removes only their top-navigation entries.

## Scope

Update the shared navigation on all eleven bilingual main-site pages:

- `index.html`
- `ai_ready_data/index.html`
- `knowledge_memory/index.html`
- `knowledge_memory/research_layout/index.html`
- `data_modeling/index.html`
- `scientific_inference/index.html`
- `ai_scientist/index.html`
- `science_of_ai/index.html`
- `scistar/index.html`
- `projects/index.html`
- `papers/index.html`

`mind2report/index.html` is an independent project page with internal section navigation and is not changed.

## Active States

- `ai_ready_data/index.html` marks `AI-Ready Data` active.
- `knowledge_memory/index.html` and its `research_layout/` subpage mark `Scientific Knowledge` active.
- `scistar/index.html` marks `Scientific Tool` active.
- The homepage and secondary research/project/publication pages show no active pillar.

## Implementation

Reuse the existing `nav-links` markup and styling. Keep the existing `nav.aiReadyData` translation key, use `nav.knowledge` for `Scientific Knowledge`, and add `nav.scientificTool` for `Scientific Tool`. No new dropdown behavior or CSS component is required.

Update `scripts/verify-i18n.mjs` first so it requires exactly these three ordered links, their route-relative destinations, English labels in both language dictionaries, correct active states, and absence of the former six primary-navigation entries.

## Verification

1. Confirm the revised navigation test fails before page edits.
2. Run `node scripts/verify-i18n.mjs` after implementation.
3. Run `git diff --check`.
4. Serve the site locally and inspect desktop and mobile navigation.
5. Click all three homepage navigation entries and confirm they reach the intended pages.

