# Scientific Research Purpose Module Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a bilingual two-card homepage module explaining that scientific research discovers fundamental laws and solves practical problems.

**Architecture:** Reuse the homepage's existing static section, `system-grid`, and `system-panel` patterns. Store all visible copy in the inline translation dictionaries and extend the Node verifier to protect section count, card count, exact copy, and narrative order.

**Tech Stack:** Static HTML, existing CSS classes, inline JavaScript i18n, Node.js `assert` verification.

---

### Task 1: Add Failing Purpose Module Assertions

**Files:**
- Modify: `scripts/verify-i18n.mjs`
- Test: `scripts/verify-i18n.mjs`

- [x] **Step 1: Add `validateHomeResearchPurposeModule()`**

The validator must read `index.html`, parse the inline translations object, locate `#research-purpose`, and assert these exact values:

```js
const expectedTranslations = {
  en: {
    "researchPurpose.title": "Purposes of Scientific Research",
    "researchPurpose.description":
      "Scientific research seeks fundamental laws and solves practical problems, advancing knowledge and technological innovation through both discovery and application.",
    "researchPurpose.fundamental.title": "Discover Fundamental Laws",
    "researchPurpose.fundamental.description":
      "Use observation, experimentation, and theoretical modeling to uncover repeatable and testable laws, such as the three laws of planetary motion and the fundamental equations of quantum mechanics.",
    "researchPurpose.practical.title": "Solve Practical Problems",
    "researchPurpose.practical.description":
      "Translate scientific understanding into engineering and technological capabilities that solve practical problems in manufacturing, materials, aerospace, and other real-world domains."
  },
  zh: {
    "researchPurpose.title": "科学研究的目的",
    "researchPurpose.description":
      "科学研究一方面探索自然与复杂系统的基本规律，另一方面面向真实需求解决关键问题；二者共同推动知识进步与技术创新。",
    "researchPurpose.fundamental.title": "寻求基本规律",
    "researchPurpose.fundamental.description":
      "通过观测、实验与理论建模揭示可重复、可验证的自然规律，例如行星运动三大定律和量子力学基本方程。",
    "researchPurpose.practical.title": "解决实际问题",
    "researchPurpose.practical.description":
      "将科学认知转化为工程与技术能力，解决工程、制造、材料和航空航天等领域的实际问题。"
  }
};
```

Also assert exactly one section, exactly two `<article class="system-panel">` cards, English fallback parity, and this order:

```text
importance < meanings < research-purpose < hierarchy < data-modeling
```

- [x] **Step 2: Invoke the validator with the other homepage validators**

Call `validateHomeResearchPurposeModule()` immediately after `validateHomeMeaningsModule()`.

- [x] **Step 3: Run the verifier and confirm RED**

Run:

```bash
node scripts/verify-i18n.mjs
```

Expected: failure stating that the homepage should contain exactly one scientific research purpose section.

### Task 2: Implement the Purpose Module

**Files:**
- Modify: `index.html`
- Test: `scripts/verify-i18n.mjs`

- [x] **Step 1: Insert the section after `#ai4science-meanings`**

Add this native HTML structure before `#hierarchy`:

```html
<section id="research-purpose" class="section highlights">
  <div class="section-header">
    <h2 data-i18n="researchPurpose.title">Purposes of Scientific Research</h2>
    <p data-i18n="researchPurpose.description">Scientific research seeks fundamental laws and solves practical problems, advancing knowledge and technological innovation through both discovery and application.</p>
  </div>
  <div class="system-grid">
    <article class="system-panel highlight">
      <span class="label">Purpose 1</span>
      <h3 data-i18n="researchPurpose.fundamental.title">Discover Fundamental Laws</h3>
      <p data-i18n="researchPurpose.fundamental.description">Use observation, experimentation, and theoretical modeling to uncover repeatable and testable laws, such as the three laws of planetary motion and the fundamental equations of quantum mechanics.</p>
    </article>
    <article class="system-panel">
      <span class="label">Purpose 2</span>
      <h3 data-i18n="researchPurpose.practical.title">Solve Practical Problems</h3>
      <p data-i18n="researchPurpose.practical.description">Translate scientific understanding into engineering and technological capabilities that solve practical problems in manufacturing, materials, aerospace, and other real-world domains.</p>
    </article>
  </div>
</section>
```

- [x] **Step 2: Add English and Chinese translations**

Add the exact `researchPurpose.*` values from Task 1 to both dictionaries immediately after the `meanings.*` keys and before `dataModeling.*`.

- [x] **Step 3: Run the verifier and confirm GREEN**

Run:

```bash
node scripts/verify-i18n.mjs
```

Expected: exit code 0 with no output.

### Task 3: Verify and Commit

**Files:**
- Verify: `index.html`
- Verify: `scripts/verify-i18n.mjs`
- Update: `docs/superpowers/specs/2026-07-20-scientific-research-purpose-design.md`
- Include: `docs/superpowers/plans/2026-07-20-scientific-research-purpose.md`

- [x] **Step 1: Check responsive rendering**

Serve the feature worktree locally and verify desktop and mobile viewports. Confirm the section is between three meanings and literature cognition, cards are two columns on desktop and one column on mobile, both languages render, and the page has no horizontal overflow.

- [x] **Step 2: Run final automated verification**

```bash
node scripts/verify-i18n.mjs
git diff --check
```

Expected: both commands exit 0.

- [x] **Step 3: Commit the implementation**

```bash
git add index.html scripts/verify-i18n.mjs docs/superpowers/specs/2026-07-20-scientific-research-purpose-design.md docs/superpowers/plans/2026-07-20-scientific-research-purpose.md
git commit -m "Add scientific research purpose module"
```
