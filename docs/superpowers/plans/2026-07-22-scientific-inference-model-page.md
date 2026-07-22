# Scientific Inference Foundation Model Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a bilingual, responsive `科学推演大模型` subpage and expose it consistently from the site's shared navigation.

**Architecture:** Add one static HTML page that reuses the site's shared stylesheet and inline i18n runtime. Extend the six-page navigation contract, represent the supplied four-stage process as semantic HTML with scoped CSS, and protect structure, translations, links, and responsive behavior with the existing Node verifier.

**Tech Stack:** Static HTML, CSS Grid/Flexbox, inline JavaScript translation dictionaries, Node.js `assert`, local static HTTP serving.

---

### Task 1: Establish the Failing Page and Navigation Contract

**Files:**
- Modify: `scripts/verify-i18n.mjs`
- Test: `scripts/verify-i18n.mjs`

- [ ] **Step 1: Add the new page to the generic bilingual-page suite**

Extend `pages` with the exact path:

```js
const pages = [
  "index.html",
  "knowledge_memory/index.html",
  "data_modeling/index.html",
  "scientific_inference/index.html",
  "science_of_ai/index.html",
  "papers/index.html",
];
```

- [ ] **Step 2: Extend the navigation contract**

Require this exact key order on every page:

```js
["nav.data", "nav.knowledge", "nav.inference", "nav.aiScience", "nav.papers"]
```

Add `scientific_inference/index.html` to `expectedLinks`; require `../scientific_inference/` from other subpages, `./scientific_inference/` from the homepage, and `./` with `aria-current="page"` on the new page.

- [ ] **Step 3: Add `validateScientificInferencePage()`**

The validator must assert the following exact structural contract:

```js
assert.ok(/<body class="inference-page">/.test(html));
assert.ok(/<h1 data-i18n="hero.title">科学推演大模型<\/h1>/.test(html));
assert.equal((html.match(/<article class="inference-step /g) || []).length, 4);
assert.equal((html.match(/<article class="inference-layer">/g) || []).length, 4);
assert.equal((html.match(/<article class="inference-output">/g) || []).length, 3);
assert.equal((html.match(/<article class="inference-metric">/g) || []).length, 4);
assert.equal((html.match(/<li class="inference-roadmap-step">/g) || []).length, 3);
assert.ok(/href="\.\.\/knowledge_memory\/"/.test(html));
assert.ok(/href="\.\.\/data_modeling\/"/.test(html));
```

Parse the translation dictionary and require exact Chinese and English values for `meta.title`, `hero.title`, the four `loop.*.title` keys, and the four `loop.*.question` keys.

- [ ] **Step 4: Run the suite and confirm RED**

Run:

```bash
node scripts/verify-i18n.mjs
```

Expected: exit code 1 because `scientific_inference/index.html` does not exist.

### Task 2: Build the Semantic Bilingual Page

**Files:**
- Create: `scientific_inference/index.html`
- Test: `scripts/verify-i18n.mjs`

- [ ] **Step 1: Create the document shell and shared navigation**

Use the existing page head, logo, footer, and language runtime. The navigation must contain:

```html
<a href="../data_modeling/" data-i18n="nav.data">科学任务求解</a>
<a href="../knowledge_memory/" data-i18n="nav.knowledge">科学知识发现</a>
<a href="./" aria-current="page" data-i18n="nav.inference">科学推演</a>
<a href="../science_of_ai/" data-i18n="nav.aiScience">Science of AI</a>
<a href="../papers/" data-i18n="nav.papers">论文列表</a>
```

- [ ] **Step 2: Add the hero and definition sections**

Use `body.inference-page`, `header.inference-hero`, and the exact Chinese fallback heading `科学推演大模型`. Include the visible rail `Evidence / Hypothesis / Plan / Verify` and a three-item researcher input list.

- [ ] **Step 3: Add the four-stage loop**

Use these exact article classes and question labels:

```html
<article class="inference-step step-evidence">…用什么证据支撑？…</article>
<article class="inference-step step-context">…在什么情境开展？…</article>
<article class="inference-step step-plan">…靠什么路径实施？…</article>
<article class="inference-step step-evaluate">…有什么预期成果？…</article>
```

Place a central `.inference-core` between the cards and add decorative `.loop-arrow` elements with `aria-hidden="true"`.

- [ ] **Step 4: Add architecture, outputs, trust, and roadmap**

Create exactly four `.inference-layer` articles, three `.inference-output` articles, four `.inference-metric` articles, and three `.inference-roadmap-step` list items. End with links to the knowledge-discovery and task-solving subpages.

- [ ] **Step 5: Add complete English and Chinese dictionaries**

Every element carrying `data-i18n` must have a non-empty value in both dictionaries. Keep `getStoredLanguage`, query override, `setLanguage`, persistence, toggle behavior, and year behavior identical to other primary pages.

- [ ] **Step 6: Run the suite**

Run:

```bash
node scripts/verify-i18n.mjs
```

Expected: fail only on the still-unimplemented shared navigation or style contract; it must not report missing translations on the new page.

### Task 3: Add the Responsive Visual System

**Files:**
- Modify: `ref.css`
- Test: `scripts/verify-i18n.mjs`

- [ ] **Step 1: Add scoped hero styles**

Define `.inference-page`, `.inference-hero`, `.inference-hero::before`, `.inference-hero-grid`, `.inference-kicker`, `.inference-rail`, and `.inference-orbit`. Use CSS gradients and borders only; no bitmap background.

- [ ] **Step 2: Add the desktop loop**

Define a two-column `.inference-loop` with named grid areas for `step-evidence`, `step-context`, `step-plan`, `step-evaluate`, and `.inference-core`. Cards require readable minimum heights, visible stage numbers, and high-contrast question chips.

- [ ] **Step 3: Add content-grid styles**

Define `.inference-layers`, `.inference-outputs`, `.inference-metrics`, and `.inference-roadmap` using the shared radius, border, and type scale. Scope all selectors with `inference-` names.

- [ ] **Step 4: Add responsive and reduced-motion behavior**

At `max-width: 760px`, turn `.inference-loop` into one column, order the four steps sequentially, place the core before them, hide desktop connectors, and reduce hero heading size. Add a `prefers-reduced-motion: reduce` rule that stops decorative orbit animation.

- [ ] **Step 5: Run the suite**

Run:

```bash
node scripts/verify-i18n.mjs
```

Expected: the page-specific structure and responsive-style assertions pass.

### Task 4: Add the Shared Navigation Entry

**Files:**
- Modify: `index.html`
- Modify: `knowledge_memory/index.html`
- Modify: `data_modeling/index.html`
- Modify: `science_of_ai/index.html`
- Modify: `papers/index.html`
- Test: `scripts/verify-i18n.mjs`

- [ ] **Step 1: Insert the link on all existing pages**

Place `nav.inference` between `nav.knowledge` and `nav.aiScience`, using `./scientific_inference/` from the homepage and `../scientific_inference/` from every existing subpage.

- [ ] **Step 2: Add the navigation translations**

Add the exact values to both dictionaries on every page:

```js
"nav.inference": "Scientific Inference" // English
"nav.inference": "科学推演" // Chinese
```

- [ ] **Step 3: Run the suite and confirm GREEN**

Run:

```bash
node scripts/verify-i18n.mjs
```

Expected: exit code 0 with no output.

### Task 5: Verify Rendering and Scope

**Files:**
- Verify: `scientific_inference/index.html`
- Verify: `ref.css`
- Verify: all six shared navigation blocks

- [ ] **Step 1: Check whitespace and accidental edits**

Run:

```bash
git diff --check
git status --short
```

Expected: no whitespace errors; the unrelated `docs/AI_for_Science_科研智能演进框架.md` remains untracked and untouched.

- [ ] **Step 2: Start a local server**

Run:

```bash
python3 -m http.server 4177
```

Open `http://127.0.0.1:4177/scientific_inference/`.

- [ ] **Step 3: Inspect desktop Chinese and English**

At approximately `1440 × 1000`, verify hero contrast, clockwise loop reading, all four cards, both cross-links, and full language switching.

- [ ] **Step 4: Inspect mobile Chinese and English**

At approximately `390 × 844`, verify the vertical loop order, no clipped headings, no horizontal overflow, usable navigation scrolling, and readable call-to-action buttons.

- [ ] **Step 5: Run the final regression suite**

Run:

```bash
node scripts/verify-i18n.mjs
git diff --check
```

Expected: both commands exit 0.
