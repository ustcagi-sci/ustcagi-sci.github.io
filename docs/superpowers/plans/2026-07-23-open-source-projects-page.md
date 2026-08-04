# Open Source Projects Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a bilingual `/projects/` catalog for six verified public research repositories and integrate it into the existing AI for Science site.

**Architecture:** Keep the site static and reuse the shared `ref.css`, inline translation dictionary, language toggle script, navigation, SEO metadata, and footer contract. Organize the new page into three semantic project groups with two cards each; extend the existing Node verifier before adding production markup so the route, navigation, copy, links, sitemap, and footer remain synchronized.

**Tech Stack:** Static HTML, shared CSS, inline JavaScript translations, Node.js `assert`, GitHub Pages, browser-based responsive QA.

---

### Task 1: Add a failing site contract for the new route

**Files:**
- Modify: `scripts/verify-i18n.mjs`
- Test: `scripts/verify-i18n.mjs`

- [ ] **Step 1: Register the new bilingual route**

Add `"projects/index.html"` to `pages` and:

```js
"projects/index.html": "https://ustcagi-sci.github.io/projects/",
```

to `publicUrls`.

- [ ] **Step 2: Extend the navigation contract**

Require this exact key order on every bilingual main page:

```js
[
  "nav.knowledge",
  "nav.data",
  "nav.inference",
  "nav.aiScience",
  "nav.projects",
  "nav.papers",
]
```

Add the route-aware `projects/` href to each expected link list and set `"projects/index.html": "nav.projects"` in the active-navigation map. Assert English `"Open Source"` and Chinese `"开源项目"` values and fallback text.

- [ ] **Step 3: Add a `validateProjectsPage` function**

Read `projects/index.html` and assert:

```js
assert.match(html, /<header id="top" class="hero">\s*<div class="hero-content">/);
assert.equal((html.match(/<section class="project-group"/g) || []).length, 3);
assert.equal((html.match(/<article class="project-card"/g) || []).length, 6);
```

Require the six canonical repository URLs:

```js
[
  "https://github.com/ustc-ai4science/Lewen-API",
  "https://github.com/ustc-ai4science/academic-search",
  "https://github.com/AgentR1/PaperScout",
  "https://github.com/ustc-ai4science/PaperArena",
  "https://github.com/ustc-ai4science/Mind2Report",
  "https://github.com/ustc-ai4science/ChemTable",
]
```

Assert exact hero, overview, group title, collaboration, and license-note translations in English and Chinese. Call `validateProjectsPage()` at the bottom of the verifier.

- [ ] **Step 4: Require site integration**

Extend `validateReadmeIdentity()` to require `Open Source Projects`, update the shared footer expectation to include open-source collaboration, and let existing SEO, sitemap, local-link, target-blank, duplicate-ID, and image-alt checks cover the new route.

- [ ] **Step 5: Run the verifier and confirm RED**

Run:

```bash
node scripts/verify-i18n.mjs
```

Expected: FAIL because `projects/index.html` does not exist.

### Task 2: Build the bilingual project catalog

**Files:**
- Create: `projects/index.html`
- Modify: `ref.css`
- Test: `scripts/verify-i18n.mjs`

- [ ] **Step 1: Create the shared page shell**

Use the existing page structure:

```html
<body class="projects-page">
  <nav class="nav">...</nav>
  <header id="top" class="hero">
    <div class="hero-content">
      <h1 data-i18n="hero.title">开源项目</h1>
      <p class="hero-subtitle" data-i18n="hero.subtitle">...</p>
    </div>
  </header>
  <main>...</main>
  <footer id="contact" class="footer">...</footer>
</body>
```

Include canonical, Open Graph, Twitter, icon, shared font, `../ref.css`, and the complete existing language-toggle script.

- [ ] **Step 2: Add the ecosystem overview**

Create three `.project-summary-card` items for:

```text
Evidence & Skills — Lewen API · Academic Search
Research Agents — PaperScout · Mind2Report
Evaluation & Tools — PaperArena · ChemTable
```

Each visible sentence and title receives a `data-i18n` key.

- [ ] **Step 3: Add three groups and six project cards**

Use one `<section class="project-group">` per category and exactly two `<article class="project-card">` children per group. Each card includes a category label, project name, bilingual description, stable tags, and one or more verified links. Add:

```html
<p class="project-license-note" data-i18n="catalog.license">
  使用与二次开发请以各仓库当前 License 与文档为准。
</p>
```

Do not include live Star counts, commit counts, or unverified license labels.

- [ ] **Step 4: Add the collaboration callout**

Create a final `.project-collaboration` panel with bilingual copy and links to:

```text
https://github.com/ustc-ai4science
mailto:mycheng@ustc.edu.cn
```

- [ ] **Step 5: Add scoped shared-stylesheet rules**

Add `.project-summary-grid`, `.project-summary-card`, `.project-group`, `.project-group-header`, `.project-grid`, `.project-card`, `.project-card-head`, `.project-tags`, `.project-links`, `.project-license-note`, and `.project-collaboration` rules. Use existing palette tokens, two columns on desktop, one column under 760px, visible keyboard focus, and no new animation.

- [ ] **Step 6: Keep GREEN limited to the page contract**

Run:

```bash
node scripts/verify-i18n.mjs
```

Expected: navigation/footer assertions still fail until Task 3; all new page-specific assertions pass.

### Task 3: Integrate navigation and the unified footer

**Files:**
- Modify: `index.html`
- Modify: `knowledge_memory/index.html`
- Modify: `data_modeling/index.html`
- Modify: `scientific_inference/index.html`
- Modify: `science_of_ai/index.html`
- Modify: `papers/index.html`
- Modify: `projects/index.html`
- Modify: `mind2report/index.html`
- Modify: `scripts/verify-i18n.mjs`

- [ ] **Step 1: Add the navigation link everywhere**

Insert `nav.projects` after `nav.aiScience`:

```html
<a href="./projects/" data-i18n="nav.projects">开源项目</a>
```

on the root page and `../projects/` on subpages. The projects page uses:

```html
<a href="./" aria-current="page" data-i18n="nav.projects">开源项目</a>
```

Add `"nav.projects": "Open Source"` and `"nav.projects": "开源项目"` to every bilingual translation dictionary.

- [ ] **Step 2: Preserve the exact unified footer**

Use this description on all seven bilingual pages and Mind2Report:

```text
欢迎围绕 AI for Science、科学数据建模、科学文献挖掘、科学推演智能体、Science of AI 与开源项目开展交流合作。
```

English:

```text
We welcome collaborations on AI for Science, scientific data modeling, scientific literature mining, scientific inference agents, the Science of AI, and open-source projects.
```

Update `validateUnifiedFooters()` with the same exact markup and translations.

- [ ] **Step 3: Verify navigation and footer GREEN**

Run:

```bash
node scripts/verify-i18n.mjs
```

Expected: only sitemap/README integration remains failing.

### Task 4: Complete discovery metadata and static checks

**Files:**
- Modify: `sitemap.xml`
- Modify: `README.md`
- Test: `scripts/verify-i18n.mjs`

- [ ] **Step 1: Add the public route to the sitemap**

Insert:

```xml
<url>
  <loc>https://ustcagi-sci.github.io/projects/</loc>
</url>
```

before the publications route.

- [ ] **Step 2: Update repository documentation**

Add:

```markdown
- **Open Source Projects** — reusable evidence infrastructure, research agents, evaluation benchmarks, and scientific tools.
```

to Research Areas and change “six bilingual main pages” to “seven bilingual main pages”.

- [ ] **Step 3: Run fresh static verification**

Run:

```bash
node scripts/verify-i18n.mjs
git diff --check
```

Expected: both commands exit 0 with no output.

### Task 5: Render, review, and publish

**Files:**
- Verify: `projects/index.html`
- Verify: all seven bilingual navigation bars
- Verify: `mind2report/index.html` footer

- [ ] **Step 1: Serve the worktree**

Run:

```bash
python3 -m http.server 4179 --bind 127.0.0.1
```

- [ ] **Step 2: Test desktop and mobile**

At 1280×900 and 390×844 verify:

- `/projects/?lang=zh` and `/projects/?lang=en` load the correct title and six cards.
- `document.documentElement.scrollWidth <= window.innerWidth`.
- the active Open Source navigation item is visible and the footer remains navy.
- all project links are present and no error-level console logs occur.
- representative existing pages still render the six-link navigation without clipping.

- [ ] **Step 3: Review and commit only intended files**

Run:

```bash
git status --short
git diff --check
node scripts/verify-i18n.mjs
```

Stage the design, plan, verifier, new page, shared stylesheet, seven main pages, Mind2Report footer, sitemap, and README only.

- [ ] **Step 4: Publish and verify**

Commit with:

```bash
git commit -m "feat: add open source projects page"
```

Push the feature branch to remote `main`, wait for the GitHub Pages workflow to succeed, then verify `https://ustcagi-sci.github.io/projects/` at desktop and mobile widths.
