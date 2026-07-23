# AI for Science Site Color Alignment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Align every site page with the navy, blue, cyan, pale-blue, and white visual language of the Scientific Inference Agent page without changing content or layout.

**Architecture:** Keep `ref.css` as the shared visual source of truth for the six bilingual pages and retain `mind2report/style.css` as the publication page's scoped stylesheet. Express the reference palette through root custom properties, replace remaining warm literals with cool equivalents, and add a static contract to the existing Node verification script so future edits cannot reintroduce the previous red/brown theme.

**Tech Stack:** Static HTML, CSS custom properties, Node.js `assert`, existing `scripts/verify-i18n.mjs`, browser-based responsive QA.

---

### Task 1: Add a failing whole-site palette contract

**Files:**
- Modify: `scripts/verify-i18n.mjs`
- Test: `scripts/verify-i18n.mjs`

- [ ] **Step 1: Write the failing palette validation**

Add a `validateUnifiedColorPalette` function that reads `ref.css` and `mind2report/style.css`, asserts the shared reference values, asserts both footer backgrounds are `#061f45`, and rejects the legacy red/brown tokens:

```js
const validateUnifiedColorPalette = () => {
  const sharedCss = readFileSync(resolve(root, "ref.css"), "utf8").toLowerCase();
  const reportCss = readFileSync(resolve(root, "mind2report/style.css"), "utf8").toLowerCase();
  const sharedTokens = {
    "--bg": "#f4f7f9",
    "--surface-soft": "#f8fbfd",
    "--surface-warm": "#edf7fc",
    "--text-strong": "#061f45",
    "--text-faint": "#5b7187",
    "--accent": "#0b5fc6",
    "--accent-dark": "#083f7f",
    "--accent-soft": "#edf7fc",
  };
  const reportTokens = {
    "--accent": "#0b5fc6",
    "--accent-deep": "#083f7f",
    "--accent-soft": "#edf7fc",
    "--accent-border": "#b7d9ec",
    "--ink": "#061f45",
    "--faint": "#5b7187",
    "--bg": "#f4f7f9",
    "--line": "#d5e3eb",
  };

  for (const [property, value] of Object.entries(sharedTokens)) {
    assert.ok(
      sharedCss.includes(`${property}: ${value};`),
      `ref.css: ${property} should use the Scientific Inference palette`
    );
  }
  for (const [property, value] of Object.entries(reportTokens)) {
    assert.ok(
      reportCss.includes(`${property}: ${value};`),
      `mind2report/style.css: ${property} should match the shared palette`
    );
  }

  assert.match(
    reportCss,
    /\.authors\s*\{[^}]*color:\s*var\(--faint\);/,
    "mind2report/style.css: small author text should use the accessible faint token"
  );

  for (const [label, css] of [["ref.css", sharedCss], ["mind2report/style.css", reportCss]]) {
    assert.match(
      css,
      /\.footer\s*\{[\s\S]*?background:\s*#061f45;/,
      `${label}: footer should use the shared navy background`
    );
    for (const legacyToken of [
      "#c0392b",
      "#a93226",
      "#b86a3b",
      "#8e4827",
      "#e87b6e",
      "#fff8f7",
      "#fff7ef",
      "#fff4f2",
      "#fff3eb",
      "#fff0ee",
      "rgba(192, 57, 43",
      "rgba(184, 106, 59",
    ]) {
      assert.ok(!css.includes(legacyToken), `${label}: remove legacy token ${legacyToken}`);
    }
  }
};
```

Call `validateUnifiedColorPalette()` with the other validators at the bottom of the script.

- [ ] **Step 2: Run the verifier and confirm the expected failure**

Run: `node scripts/verify-i18n.mjs`

Expected: FAIL because `ref.css` still defines `--bg: #f7f7f5` and the old red accent values.

### Task 2: Apply the reference palette to shared pages

**Files:**
- Modify: `ref.css`
- Test: `scripts/verify-i18n.mjs`

- [ ] **Step 1: Replace the shared root tokens**

Use these exact values in `:root`:

```css
--bg: #f4f7f9;
--surface: #ffffff;
--surface-soft: #f8fbfd;
--surface-warm: #edf7fc;
--text: #17324d;
--text-strong: #061f45;
--text-muted: #4c6176;
--text-faint: #5b7187;
--border: #d5e3eb;
--border-soft: #e6f0f5;
--accent: #0b5fc6;
--accent-dark: #083f7f;
--accent-soft: #edf7fc;
```

Tint shadows with navy/blue transparency instead of neutral black.

- [ ] **Step 2: Convert shared components from warm literals to cool equivalents**

Update navigation, generic heroes, eyebrow labels, links, cards, timeline elements, highlights, and footer colors. Use pale blue for highlighted surfaces, `#b7d9ec` or `#c9dfec` for emphasized borders, `#061f45` for the footer, and `#8fd9ff` for footer links.

- [ ] **Step 3: Remove the remaining warm accents inside the Scientific Inference page**

Convert the input chips, researcher rail, question labels, and any red/brown box shadow or text literal to pale blue, blue border, and deep-blue text while preserving its existing deep-blue hero and blue architecture gradients.

- [ ] **Step 4: Keep the verifier red while Mind2Report remains warm**

Run: `node scripts/verify-i18n.mjs`

Expected: FAIL only on `mind2report/style.css`, proving the shared stylesheet now satisfies its part of the contract.

### Task 3: Align Mind2Report and unify the footer

**Files:**
- Modify: `mind2report/style.css`
- Test: `scripts/verify-i18n.mjs`

- [ ] **Step 1: Replace Mind2Report root tokens**

Use the same main palette with these scoped names:

```css
--accent: #0b5fc6;
--accent-deep: #083f7f;
--accent-soft: #edf7fc;
--accent-border: #b7d9ec;
--ink: #061f45;
--muted: #4c6176;
--faint: #5b7187;
--bg: #f4f7f9;
--surface: #ffffff;
--line: #d5e3eb;
--blue: #0b5fc6;
--blue-soft: #edf7fc;
```

- [ ] **Step 2: Convert remaining warm decorative literals**

Change the hero grid and gradients, border colors, code block, cards, secondary button, and shadows to cool blue-gray equivalents. Set its footer to the same navy, muted text, cyan links, blue primary button, and translucent white ghost button used across the rest of the site.

- [ ] **Step 3: Run the full static verifier**

Run: `node scripts/verify-i18n.mjs`

Expected: PASS with exit code 0 and no output.

- [ ] **Step 4: Run stylesheet integrity checks**

Run: `git diff --check`

Expected: PASS with exit code 0 and no output.

### Task 4: Verify rendered pages and publish

**Files:**
- Verify: `index.html`
- Verify: `knowledge_memory/index.html`
- Verify: `data_modeling/index.html`
- Verify: `scientific_inference/index.html`
- Verify: `science_of_ai/index.html`
- Verify: `papers/index.html`
- Verify: `mind2report/index.html`

- [ ] **Step 1: Serve the worktree locally**

Run: `python3 -m http.server 4177 --bind 127.0.0.1`

Expected: the server reports that it is serving on `127.0.0.1:4177`.

- [ ] **Step 2: Check desktop and mobile rendering**

Open all seven routes at 1440×1000 and 390×844. For each route, verify the page loads, `document.documentElement.scrollWidth <= window.innerWidth`, the body background is cool gray-blue or white, navigation/buttons use blue accents, footer background is navy, and no error-level console logs appear.

- [ ] **Step 3: Review the final diff and run fresh verification**

Run: `git diff --stat && git diff --check && node scripts/verify-i18n.mjs`

Expected: only the design/plan docs, verifier, and two CSS files are changed; all checks exit 0.

- [ ] **Step 4: Commit and publish**

```bash
git add docs/superpowers/specs/2026-07-23-site-color-alignment-design.md \
  docs/superpowers/plans/2026-07-23-site-color-alignment.md \
  scripts/verify-i18n.mjs ref.css mind2report/style.css
git commit -m "style: align site with scientific inference palette"
git push origin codex/site-color-alignment:main
```

Expected: the remote `main` branch points at the completed color-alignment commit.
