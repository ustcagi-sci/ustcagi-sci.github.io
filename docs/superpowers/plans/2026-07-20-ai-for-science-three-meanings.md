# AI for Science Three Meanings Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a bilingual three-card homepage module explaining the three meanings of AI for Science, then place Scientific Literature Cognition before Scientific Data Modeling.

**Architecture:** Reuse the existing static homepage section and `direction-grid` card patterns, with all copy stored in the inline `translations` object. Extend the Node verifier to protect card count, exact copy, i18n parity, and final section order.

**Tech Stack:** Static HTML, existing CSS classes, inline JavaScript i18n, Node.js `assert` verification.

---

### Task 1: Add Failing Homepage Structure and i18n Assertions

**Files:**
- Modify: `scripts/verify-i18n.mjs`
- Test: `scripts/verify-i18n.mjs`

- [x] **Step 1: Add the new module validator**

Add `validateHomeMeaningsModule()` with these required values:

```js
const expectedTranslations = {
  en: {
    "meanings.title": "Three Meanings of AI for Science",
    "meanings.description":
      "AI for Science is not only about applying AI to scientific tasks; it also encompasses discovering new science and studying the scientific principles underlying intelligence itself.",
    "meanings.tasks.title": "AI for Scientific Tasks",
    "meanings.tasks.description":
      "Apply AI to well-defined scientific tasks such as equation solving, molecular design, protein folding, and scientific image recognition to accelerate research and technological innovation.",
    "meanings.discovery.title": "AI for New Science",
    "meanings.discovery.description":
      "Move beyond prediction and optimization toward discovering laws, mechanisms, conserved quantities, and testable hypotheses that may enable scientific and paradigm breakthroughs.",
    "meanings.science.title": "Science of AI",
    "meanings.science.description":
      "Study the scientific principles behind learning, intelligence, and complex systems, enabling mutual advances across AI, mathematics, physics, and neuroscience."
  },
  zh: {
    "meanings.title": "AI for Science 的三层涵义",
    "meanings.description":
      "AI for Science 不仅是利用 AI 解决科学任务，也包括发现新的科学规律，以及研究智能本身背后的科学原理。",
    "meanings.tasks.title": "面向科学任务的 AI",
    "meanings.tasks.description":
      "将 AI 用于方程求解、分子设计、蛋白质折叠和科学影像识别等目标明确的科研任务，加速科学研究与技术创新。",
    "meanings.discovery.title": "用 AI 发现新科学",
    "meanings.discovery.description":
      "从预测和优化进一步走向规律、机制、守恒量与可验证假设的发现，探索 AI 能否推动科学创新和范式突破。",
    "meanings.science.title": "AI 的科学",
    "meanings.science.description":
      "研究学习、智能与复杂系统背后的科学原理，促进人工智能与数学、物理和神经科学之间的双向启发。"
  }
};
```

The validator must assert:

```js
assert.equal((html.match(/<section id="ai4science-meanings"/g) || []).length, 1);
assert.equal((meaningsSection.match(/<article class="card direction-card">/g) || []).length, 3);
assert.ok(importanceIndex < meaningsIndex);
assert.ok(meaningsIndex < hierarchyIndex);
assert.ok(hierarchyIndex < dataModelingIndex);
```

Loop through `expectedTranslations` and compare every `meanings.*` value with the parsed inline translation object. Invoke the validator alongside the other homepage validators.

- [x] **Step 2: Update the existing data-modeling order assertion**

Replace the old `importance < data-modeling < hierarchy` expectation with `importance < meanings < hierarchy < data-modeling` so the verifier matches the approved homepage narrative.

- [x] **Step 3: Run the verifier and confirm RED**

Run:

```bash
node scripts/verify-i18n.mjs
```

Expected: FAIL because `index.html` does not yet contain `#ai4science-meanings` and still places data modeling before hierarchy.

### Task 2: Implement the Three Meanings Module and Final Section Order

**Files:**
- Modify: `index.html`
- Test: `scripts/verify-i18n.mjs`

- [x] **Step 1: Insert the module after the importance section**

Add this structure immediately after `#ai4science-importance`:

```html
<section id="ai4science-meanings" class="section">
  <div class="section-header">
    <h2 data-i18n="meanings.title">Three Meanings of AI for Science</h2>
    <p data-i18n="meanings.description">AI for Science is not only about applying AI to scientific tasks; it also encompasses discovering new science and studying the scientific principles underlying intelligence itself.</p>
  </div>
  <div class="direction-grid">
    <article class="card direction-card">
      <span class="eyebrow">Layer 1</span>
      <h3 data-i18n="meanings.tasks.title">AI for Scientific Tasks</h3>
      <p data-i18n="meanings.tasks.description">Apply AI to well-defined scientific tasks such as equation solving, molecular design, protein folding, and scientific image recognition to accelerate research and technological innovation.</p>
    </article>
    <article class="card direction-card">
      <span class="eyebrow">Layer 2</span>
      <h3 data-i18n="meanings.discovery.title">AI for New Science</h3>
      <p data-i18n="meanings.discovery.description">Move beyond prediction and optimization toward discovering laws, mechanisms, conserved quantities, and testable hypotheses that may enable scientific and paradigm breakthroughs.</p>
    </article>
    <article class="card direction-card">
      <span class="eyebrow">Layer 3</span>
      <h3 data-i18n="meanings.science.title">Science of AI</h3>
      <p data-i18n="meanings.science.description">Study the scientific principles behind learning, intelligence, and complex systems, enabling mutual advances across AI, mathematics, physics, and neuroscience.</p>
    </article>
  </div>
</section>
```

- [x] **Step 2: Reorder the existing sections**

Move the complete `#hierarchy` block before the complete `#data-modeling` block. Do not alter either block internally. The final order must be:

```text
ai4science-importance
ai4science-meanings
hierarchy
data-modeling
```

- [x] **Step 3: Add English and Chinese translations**

Insert the exact `meanings.*` values from Task 1 into both language objects, immediately after the `importance.*` keys and before `dataModeling.*`.

- [x] **Step 4: Run the verifier and confirm GREEN**

Run:

```bash
node scripts/verify-i18n.mjs
```

Expected: PASS with exit code 0 and no output.

- [x] **Step 5: Commit the implementation**

```bash
git add index.html scripts/verify-i18n.mjs docs/superpowers/plans/2026-07-20-ai-for-science-three-meanings.md
git commit -m "Add AI for Science meanings module"
```

### Task 3: Final Verification

**Files:**
- Verify: `index.html`
- Verify: `scripts/verify-i18n.mjs`

- [x] **Step 1: Run the full verifier**

```bash
node scripts/verify-i18n.mjs
```

Expected: exit code 0 with no assertion failures.

- [x] **Step 2: Check formatting and exact scope**

```bash
git diff --check HEAD^ HEAD
git show --stat --oneline HEAD
```

Expected: no whitespace errors; implementation commit contains only `index.html`, `scripts/verify-i18n.mjs`, and this plan file.
