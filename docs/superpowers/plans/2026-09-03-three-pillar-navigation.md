# Three-Pillar Navigation Implementation Plan

> **For Codex:** Use the executing-plans skill to implement this plan task by task, with verification after every task.

**Goal:** Replace the shared six-entry top navigation with three primary pillars: `AI-Ready Data`, `Scientific Knowledge`, and `Scientific Tool`.

**Architecture:** Keep the existing static HTML navigation component and route-relative links. Tighten the repository's i18n verifier first, then update the eleven bilingual pages that share the component. Preserve all removed destinations as ordinary site pages and body links.

**Tech Stack:** Static HTML/CSS/JavaScript, Node.js verification script, local HTTP preview.

---

### Task 1: Define the new navigation contract

**Files:**
- Modify: `scripts/verify-i18n.mjs:231-500`

**Step 1: Update the failing verification contract**

- Require the ordered keys `nav.aiReadyData`, `nav.knowledge`, and `nav.scientificTool`.
- Require the correct relative destination from each of the eleven shared-navigation pages.
- Require active states only on AI-Ready Data, Scientific Knowledge, and Scientific Tool landing pages.
- Require all three visible labels to remain English in both language dictionaries.
- Reject the former top-navigation keys.

**Step 2: Run the verifier and confirm the expected failure**

Run: `node scripts/verify-i18n.mjs`

Expected: FAIL because the HTML pages still expose the former six-entry navigation.

### Task 2: Update all shared-navigation pages

**Files:**
- Modify: `index.html`
- Modify: `ai_ready_data/index.html`
- Modify: `knowledge_memory/index.html`
- Modify: `knowledge_memory/research_layout/index.html`
- Modify: `data_modeling/index.html`
- Modify: `scientific_inference/index.html`
- Modify: `ai_scientist/index.html`
- Modify: `science_of_ai/index.html`
- Modify: `scistar/index.html`
- Modify: `projects/index.html`
- Modify: `papers/index.html`

**Step 1: Replace each top-navigation list**

Keep exactly three anchors, in the requested order, with route-relative links. Apply `aria-current="page"` only to the appropriate pillar landing pages and knowledge subpage.

**Step 2: Synchronize both language dictionaries**

- Keep `nav.aiReadyData` as `AI-Ready Data`.
- Change `nav.knowledge` to `Scientific Knowledge` in Chinese and English dictionaries.
- Add `nav.scientificTool` as `Scientific Tool` in Chinese and English dictionaries.

**Step 3: Run the full static-site verifier**

Run: `node scripts/verify-i18n.mjs`

Expected: PASS.

**Step 4: Check patch hygiene**

Run: `git diff --check`

Expected: no output.

### Task 3: Preview and finish

**Files:**
- Verify only: all files above

**Step 1: Serve the site locally**

Run: `python3 -m http.server 8765 --bind 127.0.0.1`

**Step 2: Inspect desktop and mobile layouts**

Confirm all three labels are visible, ordered correctly, and do not overflow the header.

**Step 3: Verify navigation behavior**

Click all three homepage links and confirm they resolve to `ai_ready_data/`, `knowledge_memory/`, and `scistar/`.

**Step 4: Commit the implementation**

Commit the verified HTML and test changes without publishing them remotely.
