# Science of AI Subpage Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a bilingual Science of AI subpage and expose it through the shared navigation on every site page.

**Architecture:** Build one static HTML page at `science_of_ai/index.html`, reuse the shared stylesheet and inline i18n runtime, then protect the duplicated navigation and required content with the existing Node verifier.

**Tech Stack:** Static HTML, shared CSS, inline JavaScript translations, Node.js `assert`, browser verification.

---

### Task 1: Add Failing Coverage

**Files:**
- Modify: `scripts/verify-i18n.mjs`

- [x] Add `science_of_ai/index.html` to the page list.
- [x] Require `nav.aiScience` between `nav.knowledge` and `nav.papers` on every page.
- [x] Require `nav.aiScience` to translate to `Science of AI` and `AI 科学`.
- [x] Require the new page to own the active navigation marker.
- [x] Add a page validator for the hero, five foundational questions, new-theory statement, six future questions, and four research lenses.
- [x] Run `node scripts/verify-i18n.mjs` and confirm it fails because the page and navigation are not implemented.

### Task 2: Implement the Page and Navigation

**Files:**
- Create: `science_of_ai/index.html`
- Modify: `index.html`
- Modify: `knowledge_memory/index.html`
- Modify: `data_modeling/index.html`
- Modify: `papers/index.html`
- Modify: `ref.css`

- [x] Create the new hero and four content sections with complete Chinese fallback copy.
- [x] Add complete English and Chinese translations for every visible string.
- [x] Add the Science of AI link and translation key to each existing page.
- [x] Keep relative paths and active-page semantics correct from both root and subdirectories.
- [x] Run `node scripts/verify-i18n.mjs` and confirm it passes.
- [x] Run `git diff --check`.

### Task 3: Browser Verification

**Files:**
- Verify: `science_of_ai/index.html`
- Verify: all page navigation

- [x] Serve the worktree through a local HTTP server.
- [x] Inspect Chinese desktop layout, required section order, card counts, and active navigation.
- [x] Toggle to English and verify translated navigation, hero, and question copy.
- [x] Inspect a mobile viewport and verify cards stack without horizontal overflow or text overlap.
- [x] Stop the local server after verification.

### Task 3.5: Address Review Findings

- [x] Add a 761-1024 px tablet navigation layout so the four English links remain visible.
- [x] Localize theory, question, and framework labels in both languages.
- [x] Assert exact navigation destinations for root and subpage-relative links.
- [x] Remove the pointer affordance from the non-interactive Science of AI hero.
- [x] Re-run `node scripts/verify-i18n.mjs` and `git diff --check`.

### Task 4: Integrate

- [x] Commit only the design, plan, verifier, new page, navigation, and any necessary shared style changes.
- [x] Fast-forward the completed branch into `main`.
- [x] Preserve the unrelated untracked research note in the main worktree.
- [x] Run the verifier and `git diff --check` on merged `main`.
