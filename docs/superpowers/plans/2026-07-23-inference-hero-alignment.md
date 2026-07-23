# Scientific Inference Hero Alignment Implementation Plan

**Goal:** Replace the Scientific Inference Agent page's bespoke dark hero with the site's shared light-grid hero without changing the page body.

**Architecture:** Reuse the existing `.hero`, `.hero-content`, and `.hero-subtitle` contract in `ref.css`. Remove the orphaned inference-only hero and orbit rules, then lock the shared structure into the existing Node verifier.

**Tech Stack:** Static HTML, CSS, Node.js assertions, browser-based responsive QA.

---

### Task 1: Add a failing shared-hero contract

**Files:**
- Modify: `scripts/verify-i18n.mjs`

- [x] Assert that `scientific_inference/index.html` uses `header.hero > .hero-content`.
- [x] Assert that the standard `.hero-subtitle` is present.
- [x] Reject the old inference hero, orbit, hero actions, and their CSS selectors.
- [x] Run `node scripts/verify-i18n.mjs` and confirm the new assertion fails.

### Task 2: Replace the bespoke hero

**Files:**
- Modify: `scientific_inference/index.html`
- Modify: `ref.css`

- [x] Replace the hero markup with the shared centered structure.
- [x] Remove hero CTA translation entries that no longer have rendered bindings.
- [x] Change the page theme color to white.
- [x] Remove inference-only hero, orbit, animation, and responsive CSS.
- [x] Run the full static verifier and `git diff --check`.

### Task 3: Render, compare, and publish

**Files:**
- Verify: `scientific_inference/index.html`
- Compare: `data_modeling/index.html`

- [x] Serve the isolated worktree locally.
- [x] Compare hero layout and computed styles at desktop and mobile widths.
- [x] Confirm no horizontal overflow, missing content, or console errors.
- [ ] Review the exact diff, commit only intended files, push to `main`, and verify the live deployment.
