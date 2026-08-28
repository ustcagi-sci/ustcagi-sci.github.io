# Scientific Literature Intelligence Layout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a bilingual research-layout subpage that organizes Scientific Literature Intelligence as Search → Extract → Discover and connects the existing project portfolio to the next research priorities.

**Architecture:** Create one nested static HTML page that reuses the shared navigation, footer, translation runtime, and `ref.css`. Expose it from the parent literature-intelligence page, register it in the sitemap and verification manifest, and add only the shared CSS required for its flow visualization and responsive cards.

**Tech Stack:** Static HTML5, shared CSS, inline JavaScript translation dictionary, Node.js assertion-based site verifier.

---

### Task 1: Lock the new route and content contract

**Files:**
- Modify: `scripts/verify-i18n.mjs`
- Test: `scripts/verify-i18n.mjs`

- [ ] **Step 1: Write the failing page-contract test**

Add `knowledge_memory/research_layout/index.html` to `pages` and `publicUrls`, define its nested navigation hrefs, and assert that it contains:

```js
assert.ok(/data-i18n="hero\.title">科技文献智能研究布局</.test(html));
assert.deepEqual(
  ["Search", "Extract", "Discover"],
  [...html.matchAll(/class="layout-stage-code">([^<]+)</g)].map((match) => match[1])
);
for (const project of ["PaperScout", "ScholarQuest", "PaperArena", "Mind2Report"]) {
  assert.ok(html.includes(project));
}
```

- [ ] **Step 2: Run the verifier and confirm the route is missing**

Run: `node scripts/verify-i18n.mjs`

Expected: FAIL because `knowledge_memory/research_layout/index.html` does not exist.

### Task 2: Build and connect the research-layout page

**Files:**
- Create: `knowledge_memory/research_layout/index.html`
- Modify: `knowledge_memory/index.html`
- Modify: `ref.css`
- Modify: `sitemap.xml`
- Modify: `README.md`

- [ ] **Step 1: Implement the bilingual static page**

Create the page with the shared brand navigation, hero, seven content sections, unified footer, complete English/Chinese translation dictionaries, and the existing language persistence script.

- [ ] **Step 2: Add the parent-page entry point**

Insert this action after the parent introduction:

```html
<div class="section-actions">
  <a class="btn ghost" href="./research_layout/" data-i18n="intro.layoutCta">查看研究布局</a>
</div>
```

Add `intro.layoutCta` to both parent-page translation dictionaries.

- [ ] **Step 3: Add focused responsive styles**

Add `.layout-flow`, `.layout-stage`, `.layout-stage-code`, `.layout-arrow`, and `.discovery-grid` styles to `ref.css`, including one-column layouts at the existing mobile breakpoint.

- [ ] **Step 4: Register the route**

Add `https://ustcagi-sci.github.io/knowledge_memory/research_layout/` to `sitemap.xml` and describe the bilingual research-layout subpage in `README.md`.

### Task 3: Verify site-wide integration

**Files:**
- Test: `scripts/verify-i18n.mjs`

- [ ] **Step 1: Run the full site verifier**

Run: `node scripts/verify-i18n.mjs`

Expected: exit code 0 with no assertion output.

- [ ] **Step 2: Check whitespace and retired terminology**

Run: `git diff --check`

Expected: exit code 0. The full site verifier in Step 1 also enforces the retired-terminology contract across every public page.

- [ ] **Step 3: Preview the nested route**

Serve the repository locally, open `/knowledge_memory/research_layout/`, verify the Chinese layout at desktop and mobile widths, toggle English, and follow the parent-page CTA.
