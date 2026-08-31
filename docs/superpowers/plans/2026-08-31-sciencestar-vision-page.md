# ScienceStar Vision Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a bilingual ScienceStar vision page that explains the platform's central ideas without reproducing the full product plan.

**Architecture:** Create `scistar/index.html` as a static bilingual page using the site's shared `ref.css` and inline translation runtime. Add one compact homepage entry, register the route in the sitemap and README, and extend the existing Node verification contract before implementation so the feature follows a red-green cycle.

**Tech Stack:** Static HTML5, shared CSS, vanilla JavaScript translation dictionary, Node.js assertion-based site verifier.

---

### Task 1: Add the failing ScienceStar contract

**Files:**
- Modify: `scripts/verify-i18n.mjs`

- [ ] **Step 1: Register the expected route and navigation contract**

Add `scistar/index.html` to `pages` and `publicUrls`, and add its relative six-link navigation mapping to `expectedLinks`:

```js
"scistar/index.html": [
  { key: "nav.aiReadyData", href: "../ai_ready_data/" },
  { key: "nav.inference", href: "../scientific_inference/" },
  { key: "nav.aiScientist", href: "../ai_scientist/" },
  { key: "nav.aiScience", href: "../science_of_ai/" },
  { key: "nav.projects", href: "../projects/" },
  { key: "nav.papers", href: "../papers/" },
],
```

- [ ] **Step 2: Add a focused feature validator**

Create `validateScienceStarPage()` that asserts:

```js
assert.ok(existsSync(absolutePath), `${relativePath}: missing bilingual ScienceStar page`);
assert.ok(/<h1 data-i18n="hero\.title">科星 ScienceStar<\/h1>/.test(html));
assert.deepEqual(evolutionStages, [
  "Scientific AI Portal",
  "Scientific AI Workspace",
  "Scientific Intelligence OS",
]);
assert.ok(html.includes("Scientist"));
assert.ok(html.includes("Scientific Intelligence"));
assert.ok(/data-i18n="modes\.explore\.title"/.test(html));
assert.ok(/data-i18n="modes\.orchestrate\.title"/.test(html));
assert.ok(/href="\.\/scistar\/" data-i18n="scistar\.cta"/.test(homeHtml));
```

Also assert the English/Chinese metadata titles and the three long-term engine labels from the translation object.

- [ ] **Step 3: Run the verifier and confirm the expected failure**

Run:

```bash
node scripts/verify-i18n.mjs
```

Expected: FAIL with `scistar/index.html: missing bilingual ScienceStar page`.

### Task 2: Implement the bilingual ScienceStar page

**Files:**
- Create: `scistar/index.html`

- [ ] **Step 1: Build the shared shell**

Create a semantic page with:

```html
<html lang="zh-CN" data-language="zh">
<body class="scistar-page">
  <nav class="nav">...</nav>
  <header id="top" class="hero scistar-hero">...</header>
  <main>...</main>
  <footer id="contact" class="footer">...</footer>
</body>
```

Include canonical, Open Graph and Twitter metadata for `https://ustcagi-sci.github.io/scistar/`, the shared logo, stylesheet and language toggle.

- [ ] **Step 2: Add the seven concise narrative sections**

Implement sections for:

```text
Hero
Why ScienceStar
Scientist ↔ Scientific Intelligence
Portal → Workspace → OS
Explore / Orchestrate
Tool Graph × Scientist Profile × Tool Orchestration
Long-term mission
```

Use planning/future language for capabilities that are not implemented. Do not add pricing, commercial models, user targets, phase dates or a fake product input.

- [ ] **Step 3: Add complete English and Chinese dictionaries**

Use the existing `translations` object and `setLanguage()` runtime. Every visible sentence must use `data-i18n`; metadata title and description must switch with the language.

- [ ] **Step 4: Run the verifier**

Run:

```bash
node scripts/verify-i18n.mjs
```

Expected: the missing-page assertion is resolved; the verifier may still fail on the missing homepage entry or sitemap until Tasks 3 and 4 are complete.

### Task 3: Add a restrained homepage entry and shared styling

**Files:**
- Modify: `index.html`
- Modify: `ref.css`

- [ ] **Step 1: Add a compact homepage callout**

Insert one `section#scistar` before the homepage footer with a concise platform statement and:

```html
<a class="btn ghost" href="./scistar/" data-i18n="scistar.cta">了解科星 ScienceStar</a>
```

Add matching English and Chinese translation keys. Do not add a new top-navigation item.

- [ ] **Step 2: Add page-specific responsive CSS**

Add focused `.scistar-*` rules for the star-orbit hero, opportunity flow, connection panel, three-stage evolution, dual modes and three-part engine. Reuse existing colors, borders, cards and typography. At `1024px` reduce multi-column layouts; at `760px` use a single-column flow and prevent horizontal overflow.

- [ ] **Step 3: Run the verifier**

Run:

```bash
node scripts/verify-i18n.mjs
```

Expected: homepage-entry and bilingual-key assertions pass.

### Task 4: Register the public route and documentation

**Files:**
- Modify: `sitemap.xml`
- Modify: `README.md`

- [ ] **Step 1: Add the public URL**

Add:

```xml
<url>
  <loc>https://ustcagi-sci.github.io/scistar/</loc>
</url>
```

- [ ] **Step 2: Update the site structure description**

Document the additional bilingual ScienceStar vision page and its route without describing planned capabilities as live services.

- [ ] **Step 3: Run the complete static checks**

Run:

```bash
node scripts/verify-i18n.mjs
git diff --check
```

Expected: both commands exit `0`.

### Task 5: Verify rendered behavior

**Files:**
- Verify: `scistar/index.html`
- Verify: `index.html`

- [ ] **Step 1: Serve the site locally**

Run:

```bash
python3 -m http.server 8765 --bind 127.0.0.1
```

- [ ] **Step 2: Check desktop and mobile rendering**

Verify at approximately `1440 × 1000` and `390 × 844`:

```text
no horizontal overflow
three-stage evolution is readable
Explore and Orchestrate remain distinct
homepage CTA opens /scistar/
footer follows the final mission section without excess whitespace
```

- [ ] **Step 3: Check both languages and console output**

Toggle to English and back to Chinese. Confirm document title, hero, all section text and button labels update, and confirm there are no console errors.

- [ ] **Step 4: Stop the local server and review the final diff**

Run:

```bash
git diff --check
git status --short
```

Expected: only the intended ScienceStar page, homepage entry, shared styles, route metadata, README, verifier and design/plan documents are modified.

