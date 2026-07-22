# AI Scientific Paradigm Shift Module Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a bilingual, responsive homepage module that presents the transition from empirical science to an AI-enabled intelligent research paradigm.

**Architecture:** Extend the existing static homepage with one native HTML section placed between the research-purpose and three-meanings sections. Keep all visible copy in the inline English and Chinese dictionaries, add only module-scoped styles to the shared stylesheet, and protect structure, order, copy, and responsive behavior with the existing Node verifier.

**Tech Stack:** Static HTML, CSS Grid, inline JavaScript i18n dictionaries, Node.js `assert` verification.

---

### Task 1: Add the Failing Module Contract

**Files:**
- Modify: `scripts/verify-i18n.mjs:475-554`
- Test: `scripts/verify-i18n.mjs`

- [ ] **Step 1: Add `validateHomeParadigmShiftModule()` after `validateHomeResearchPurposeModule()`**

Add a validator that reads `index.html`, parses the translations object, locates the new section, and asserts exact structure, placement, and copy:

```js
const validateHomeParadigmShiftModule = () => {
  const html = readFileSync(resolve(root, "index.html"), "utf8");
  const objectMatch = html.match(
    /const translations = (\{[\s\S]*?\n      \});\n\n      const getStoredLanguage/
  );
  const context = {};
  const sectionMatches = [
    ...html.matchAll(/<section id="paradigm-shift" class="section paradigm-shift">([\s\S]*?)<\/section>/g),
  ];
  const purposeIndex = html.indexOf('<section id="research-purpose"');
  const paradigmIndex = html.indexOf('<section id="paradigm-shift"');
  const meaningsIndex = html.indexOf('<section id="ai4science-meanings"');
  const expectedTranslations = {
    en: {
      "paradigm.title":
        "Artificial Intelligence Is Driving a Major Leap and Profound Transformation in Scientific Research Paradigms",
      "paradigm.description":
        "Scientific research is advancing from observation, theory, computation, and data-intensive discovery toward an intelligent paradigm powered by foundation models and scientific agents.",
      "paradigm.statement":
        "AI is evolving from an auxiliary analytical tool into a new research infrastructure that connects scientific questions, data, models, experiments, and knowledge—expanding the space scientists can explore, extending cognitive boundaries, and accelerating work on complex scientific problems.",
      "paradigm.empirical.title": "Empirical Paradigm",
      "paradigm.empirical.method": "Observation and induction",
      "paradigm.empirical.example": "Archimedes' principle",
      "paradigm.theoretical.title": "Theoretical Paradigm",
      "paradigm.theoretical.method": "Mathematical and theoretical reasoning",
      "paradigm.theoretical.example": "Newton's law of universal gravitation",
      "paradigm.computational.title": "Computational Paradigm",
      "paradigm.computational.method": "Numerical simulation and computational experiments",
      "paradigm.computational.example": "Global climate models",
      "paradigm.data.title": "Data Paradigm",
      "paradigm.data.method": "Data-intensive scientific discovery",
      "paradigm.data.example": "The Human Genome Project",
      "paradigm.intelligent.title": "Intelligent Paradigm",
      "paradigm.intelligent.method": "Foundation models and scientific agents",
      "paradigm.intelligent.example": "Protein structure prediction",
    },
    zh: {
      "paradigm.title": "人工智能正引领科研范式的重大跃迁与深刻变革",
      "paradigm.description":
        "科学研究正从依赖观察归纳、理论推演、数值计算与海量数据，迈向由基础模型和智能体协同驱动的智能范式。",
      "paradigm.statement":
        "人工智能正从辅助分析工具演进为连接科学问题、数据、模型、实验与知识的新型科研基础设施，帮助科学家拓展可探索空间、突破认知边界，加速解析复杂重大科学问题。",
      "paradigm.empirical.title": "经验范式",
      "paradigm.empirical.method": "观察与归纳",
      "paradigm.empirical.example": "阿基米德浮力定律",
      "paradigm.theoretical.title": "理论范式",
      "paradigm.theoretical.method": "数学与理论推演",
      "paradigm.theoretical.example": "牛顿万有引力定律",
      "paradigm.computational.title": "计算范式",
      "paradigm.computational.method": "数值模拟与计算实验",
      "paradigm.computational.example": "全球气候模型",
      "paradigm.data.title": "数据范式",
      "paradigm.data.method": "数据密集型科学发现",
      "paradigm.data.example": "人类基因组计划",
      "paradigm.intelligent.title": "智能范式",
      "paradigm.intelligent.method": "基础模型与智能体协同",
      "paradigm.intelligent.example": "蛋白质结构预测",
    },
  };

  assert.equal(
    sectionMatches.length,
    1,
    "index.html: homepage should contain exactly one scientific paradigm shift section"
  );
  const paradigmSection = sectionMatches[0][1];
  assert.equal(
    (paradigmSection.match(/<article class="paradigm-stage(?: is-intelligent)?" role="listitem">/g) || [])
      .length,
    5,
    "index.html: scientific paradigm shift section should contain exactly five stages"
  );
  assert.ok(purposeIndex >= 0, "index.html: missing research purpose section");
  assert.ok(paradigmIndex > purposeIndex, "index.html: paradigm shift section should follow research purpose");
  assert.ok(meaningsIndex > paradigmIndex, "index.html: meanings section should follow paradigm shift");

  assert.ok(objectMatch, "index.html: missing translations object");
  vm.runInNewContext(`translations = ${objectMatch[1]};`, context);

  const visibleFallbacks = Object.fromEntries(
    [
      ...paradigmSection.matchAll(
        /<(h2|h3|p|span)[^>]*data-i18n="([^"]+)"[^>]*>([\s\S]*?)<\/\1>/g
      ),
    ].map(([, , key, value]) => [
      key,
      value.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim(),
    ])
  );

  for (const language of ["en", "zh"]) {
    for (const [key, value] of Object.entries(expectedTranslations[language])) {
      assert.equal(
        context.translations[language][key],
        value,
        `index.html: ${language} translation should match for ${key}`
      );
    }
  }

  for (const [key, value] of Object.entries(expectedTranslations.en)) {
    assert.equal(
      visibleFallbacks[key],
      value,
      `index.html: visible fallback should match English translation for ${key}`
    );
  }
};
```

- [ ] **Step 2: Invoke the validator after the research-purpose validator**

Add this line near the bottom of the verifier:

```js
validateHomeParadigmShiftModule();
```

- [ ] **Step 3: Run the verifier and confirm RED**

Run:

```bash
node scripts/verify-i18n.mjs
```

Expected: exit code 1 with `homepage should contain exactly one scientific paradigm shift section`.

### Task 2: Implement the Bilingual Native HTML Module

**Files:**
- Modify: `index.html:92-94`
- Modify: `index.html:318-500`
- Test: `scripts/verify-i18n.mjs`

- [ ] **Step 1: Insert the module after `#research-purpose`**

Insert this section before `#ai4science-meanings`:

```html
<section id="paradigm-shift" class="section paradigm-shift">
  <div class="section-header">
    <h2 data-i18n="paradigm.title">Artificial Intelligence Is Driving a Major Leap and Profound Transformation in Scientific Research Paradigms</h2>
    <p data-i18n="paradigm.description">
      Scientific research is advancing from observation, theory, computation, and data-intensive discovery toward an intelligent paradigm powered by foundation models and scientific agents.
    </p>
  </div>

  <div class="paradigm-statement">
    <span class="paradigm-statement-mark" aria-hidden="true">AI</span>
    <p data-i18n="paradigm.statement">
      AI is evolving from an auxiliary analytical tool into a new research infrastructure that connects scientific questions, data, models, experiments, and knowledge—expanding the space scientists can explore, extending cognitive boundaries, and accelerating work on complex scientific problems.
    </p>
  </div>

  <div class="paradigm-grid" role="list">
    <article class="paradigm-stage" role="listitem">
      <span class="paradigm-index">01</span>
      <span class="paradigm-method" data-i18n="paradigm.empirical.method">Observation and induction</span>
      <h3 data-i18n="paradigm.empirical.title">Empirical Paradigm</h3>
      <p data-i18n="paradigm.empirical.example">Archimedes' principle</p>
    </article>
    <article class="paradigm-stage" role="listitem">
      <span class="paradigm-index">02</span>
      <span class="paradigm-method" data-i18n="paradigm.theoretical.method">Mathematical and theoretical reasoning</span>
      <h3 data-i18n="paradigm.theoretical.title">Theoretical Paradigm</h3>
      <p data-i18n="paradigm.theoretical.example">Newton's law of universal gravitation</p>
    </article>
    <article class="paradigm-stage" role="listitem">
      <span class="paradigm-index">03</span>
      <span class="paradigm-method" data-i18n="paradigm.computational.method">Numerical simulation and computational experiments</span>
      <h3 data-i18n="paradigm.computational.title">Computational Paradigm</h3>
      <p data-i18n="paradigm.computational.example">Global climate models</p>
    </article>
    <article class="paradigm-stage" role="listitem">
      <span class="paradigm-index">04</span>
      <span class="paradigm-method" data-i18n="paradigm.data.method">Data-intensive scientific discovery</span>
      <h3 data-i18n="paradigm.data.title">Data Paradigm</h3>
      <p data-i18n="paradigm.data.example">The Human Genome Project</p>
    </article>
    <article class="paradigm-stage is-intelligent" role="listitem">
      <span class="paradigm-index">05 · AI</span>
      <span class="paradigm-method" data-i18n="paradigm.intelligent.method">Foundation models and scientific agents</span>
      <h3 data-i18n="paradigm.intelligent.title">Intelligent Paradigm</h3>
      <p data-i18n="paradigm.intelligent.example">Protein structure prediction</p>
    </article>
  </div>
</section>
```

- [ ] **Step 2: Add the exact English translation entries**

Add every `expectedTranslations.en` entry from Task 1 immediately after the `researchPurpose.*` entries in the English dictionary.

- [ ] **Step 3: Add the exact Chinese translation entries**

Add every `expectedTranslations.zh` entry from Task 1 immediately after the `researchPurpose.*` entries in the Chinese dictionary.

- [ ] **Step 4: Run the verifier and confirm GREEN**

Run:

```bash
node scripts/verify-i18n.mjs
```

Expected: exit code 0 with no output.

- [ ] **Step 5: Commit the structure and copy**

```bash
git add index.html scripts/verify-i18n.mjs
git commit -m "Add scientific paradigm shift content"
```

### Task 3: Add the Ascending Responsive Visual Treatment

**Files:**
- Modify: `scripts/verify-i18n.mjs:554`
- Modify: `ref.css:720`
- Modify: `ref.css:1300-1490`
- Test: `scripts/verify-i18n.mjs`

- [ ] **Step 1: Extend the module validator with CSS assertions**

At the start of `validateHomeParadigmShiftModule()`, read the stylesheet:

```js
const css = readFileSync(resolve(root, "ref.css"), "utf8");
```

Before the closing brace, add:

```js
assert.ok(
  /\.paradigm-grid\s*\{[\s\S]*?grid-template-columns:\s*repeat\(5,\s*minmax\(0,\s*1fr\)\)/.test(css),
  "ref.css: desktop paradigm progression should use five columns"
);
assert.ok(
  /\.paradigm-stage:nth-child\(5\)\s*\{[\s\S]*?min-height:\s*264px/.test(css),
  "ref.css: final paradigm stage should create the top of the desktop ascent"
);
assert.ok(
  /@media \(max-width:\s*760px\)[\s\S]*?\.paradigm-grid\s*\{[\s\S]*?grid-template-columns:\s*1fr/.test(css),
  "ref.css: mobile paradigm progression should collapse to one column"
);
```

- [ ] **Step 2: Run the verifier and confirm RED**

Run:

```bash
node scripts/verify-i18n.mjs
```

Expected: exit code 1 with `desktop paradigm progression should use five columns`.

- [ ] **Step 3: Add the scoped desktop styles after `.system-panel p`**

```css
.paradigm-shift {
  position: relative;
  overflow: hidden;
}

.paradigm-shift::before {
  position: absolute;
  inset: 0;
  z-index: -1;
  background:
    radial-gradient(circle at 12% 22%, rgba(11, 120, 196, 0.09), transparent 28%),
    radial-gradient(circle at 88% 80%, rgba(192, 57, 43, 0.08), transparent 26%);
  content: "";
  pointer-events: none;
}

.paradigm-statement {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  align-items: center;
  gap: 20px;
  max-width: 1040px;
  margin: 0 auto 36px;
  padding: 22px 26px;
  border: 1px solid #d9e9f6;
  border-left: 4px solid #0b78c4;
  border-radius: 14px;
  background: linear-gradient(135deg, #eef7ff 0%, #ffffff 55%, #fff8f7 100%);
  box-shadow: 0 12px 34px rgba(11, 84, 135, 0.09);
}

.paradigm-statement-mark {
  display: inline-grid;
  width: 62px;
  height: 62px;
  place-items: center;
  border-radius: 18px;
  background: linear-gradient(145deg, #0b78c4, #07558d);
  color: #ffffff;
  font-family: "Space Grotesk", sans-serif;
  font-size: 1.22rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  box-shadow: 0 10px 22px rgba(11, 120, 196, 0.2);
}

.paradigm-statement p {
  color: #263746;
  font-size: 1rem;
  font-weight: 650;
  line-height: 1.75;
}

.paradigm-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  align-items: end;
  gap: 18px;
  padding-top: 44px;
}

.paradigm-stage {
  position: relative;
  display: flex;
  min-height: 176px;
  flex-direction: column;
  padding: 18px;
  border: 1px solid #dce8f1;
  border-top: 4px solid #0b78c4;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 8px 24px rgba(11, 84, 135, 0.07);
}

.paradigm-stage:nth-child(2) {
  min-height: 198px;
}

.paradigm-stage:nth-child(3) {
  min-height: 220px;
}

.paradigm-stage:nth-child(4) {
  min-height: 242px;
}

.paradigm-stage:nth-child(5) {
  min-height: 264px;
}

.paradigm-stage:not(:last-child)::after {
  position: absolute;
  top: -31px;
  right: -18px;
  z-index: 2;
  color: #79b9e5;
  content: "↗";
  font-size: 1.45rem;
  font-weight: 800;
  line-height: 1;
}

.paradigm-index {
  align-self: flex-start;
  margin-bottom: 12px;
  color: #0b78c4;
  font-family: "Space Grotesk", sans-serif;
  font-size: 0.76rem;
  font-weight: 800;
  letter-spacing: 0.08em;
}

.paradigm-method {
  margin-bottom: 7px;
  color: #527086;
  font-size: 0.73rem;
  font-weight: 750;
  line-height: 1.4;
}

.paradigm-stage h3 {
  margin-bottom: 10px;
  color: #12334a;
  font-size: 1rem;
  font-weight: 850;
  line-height: 1.35;
}

.paradigm-stage p {
  margin-top: auto;
  color: var(--text-muted);
  font-size: 0.84rem;
  line-height: 1.55;
}

.paradigm-stage.is-intelligent {
  border-color: #e8c5c0;
  border-top-color: var(--accent);
  background: linear-gradient(180deg, #ffffff 0%, #fff4f2 100%);
  box-shadow: 0 14px 32px rgba(192, 57, 43, 0.12);
}

.paradigm-stage.is-intelligent .paradigm-index,
.paradigm-stage.is-intelligent h3 {
  color: var(--accent);
}
```

- [ ] **Step 4: Add tablet behavior inside `@media (max-width: 1024px)`**

```css
.paradigm-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
  align-items: stretch;
  padding-top: 0;
}

.paradigm-stage,
.paradigm-stage:nth-child(2),
.paradigm-stage:nth-child(3),
.paradigm-stage:nth-child(4),
.paradigm-stage:nth-child(5) {
  min-height: 0;
}

.paradigm-stage::after {
  display: none;
}

.paradigm-stage:last-child {
  grid-column: 1 / -1;
}
```

- [ ] **Step 5: Add mobile behavior inside `@media (max-width: 760px)`**

```css
.paradigm-statement {
  grid-template-columns: 1fr;
  gap: 14px;
  padding: 20px;
}

.paradigm-statement-mark {
  width: 52px;
  height: 52px;
  border-radius: 15px;
}

.paradigm-grid {
  grid-template-columns: 1fr;
}

.paradigm-stage,
.paradigm-stage:last-child {
  grid-column: auto;
}
```

- [ ] **Step 6: Run the verifier and confirm GREEN**

Run:

```bash
node scripts/verify-i18n.mjs
```

Expected: exit code 0 with no output.

- [ ] **Step 7: Commit the visual treatment**

```bash
git add ref.css scripts/verify-i18n.mjs
git commit -m "Style scientific paradigm progression"
```

### Task 4: Verify the Complete Homepage Change

**Files:**
- Verify: `index.html`
- Verify: `ref.css`
- Verify: `scripts/verify-i18n.mjs`
- Verify: `docs/superpowers/specs/2026-07-22-ai-scientific-paradigm-shift-design.md`
- Include: `docs/superpowers/plans/2026-07-22-ai-scientific-paradigm-shift.md`

- [ ] **Step 1: Run automated checks**

```bash
node scripts/verify-i18n.mjs
git diff --check
```

Expected: both commands exit 0.

- [ ] **Step 2: Serve the site locally**

```bash
python3 -m http.server 4175
```

Expected: `http://127.0.0.1:4175/` serves the homepage.

- [ ] **Step 3: Inspect desktop Chinese and English views**

At a viewport near 1440×1000, verify:

- The new section appears directly below `科学研究的主要目的`.
- All five stages form an ascending left-to-right progression.
- The English title and card copy wrap without overlap after toggling language.
- No horizontal overflow is present.

- [ ] **Step 4: Inspect a mobile view**

At a viewport near 390×844, verify:

- The statement panel and all five stages collapse to one column.
- The order remains 01 through 05.
- No text is clipped and no horizontal overflow is present.

- [ ] **Step 5: Commit the plan and any verification-driven corrections**

```bash
git add docs/superpowers/plans/2026-07-22-ai-scientific-paradigm-shift.md index.html ref.css scripts/verify-i18n.mjs
git commit -m "Verify scientific paradigm shift module"
```

