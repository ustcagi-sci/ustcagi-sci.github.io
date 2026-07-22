# AI Scientific Paradigm Shift Module Design

## Goal

Add a bilingual homepage module titled `人工智能正引领科研范式的重大跃迁与深刻变革` immediately after the existing `科学研究的主要目的` section. The module should turn the supplied slide into a native, responsive explanation of how scientific research has progressed from empirical, theoretical, computational, and data-intensive paradigms to an AI-enabled intelligent paradigm.

## Placement and Narrative

Insert `#paradigm-shift` directly after `#research-purpose` and before `#ai4science-meanings`. The opening homepage sequence becomes:

1. The primary purposes of scientific research.
2. The paradigm shift now being driven by artificial intelligence.
3. The site's three meanings of AI for Science.

This keeps the new section tightly connected to the user's requested anchor while preserving the existing research-direction narrative below it.

## Chosen Visual Approach

Build the module as native HTML and CSS rather than embedding the supplied low-resolution slide. A five-stage ascending progression communicates the slide's central spatial idea while remaining readable, accessible, bilingual, and responsive.

The module contains:

- A centered title and short summary.
- A prominent statement panel explaining AI's role as a new research tool and scientific infrastructure.
- Five ascending stage cards on desktop, using USTC blue as the progression color and the site's existing red accent for the AI-driven destination.
- A single-column numbered sequence on narrow screens so no text is compressed or clipped.

The alternatives considered were embedding the full slide, which would preserve its exact appearance but make the text unreadable on mobile, and a flat five-card grid, which would be robust but lose the sense of an accelerating paradigm transition.

## Content

### Chinese

- Title: `人工智能正引领科研范式的重大跃迁与深刻变革`
- Summary: `科学研究正从依赖观察归纳、理论推演、数值计算与海量数据，迈向由基础模型和智能体协同驱动的智能范式。`
- Statement: `人工智能正从辅助分析工具演进为连接科学问题、数据、模型、实验与知识的新型科研基础设施，帮助科学家拓展可探索空间、突破认知边界，加速解析复杂重大科学问题。`
- Stage 1: `经验范式` / `观察与归纳` / `阿基米德浮力定律`
- Stage 2: `理论范式` / `数学与理论推演` / `牛顿万有引力定律`
- Stage 3: `计算范式` / `数值模拟与计算实验` / `全球气候模型`
- Stage 4: `数据范式` / `数据密集型科学发现` / `人类基因组计划`
- Stage 5: `智能范式` / `基础模型与智能体协同` / `蛋白质结构预测`

### English

- Title: `Artificial Intelligence Is Driving a Major Leap and Profound Transformation in Scientific Research Paradigms`
- Summary: `Scientific research is advancing from observation, theory, computation, and data-intensive discovery toward an intelligent paradigm powered by foundation models and scientific agents.`
- Statement: `AI is evolving from an auxiliary analytical tool into a new research infrastructure that connects scientific questions, data, models, experiments, and knowledge—expanding the space scientists can explore, extending cognitive boundaries, and accelerating work on complex scientific problems.`
- Stage 1: `Empirical Paradigm` / `Observation and induction` / `Archimedes' principle`
- Stage 2: `Theoretical Paradigm` / `Mathematical and theoretical reasoning` / `Newton's law of universal gravitation`
- Stage 3: `Computational Paradigm` / `Numerical simulation and computational experiments` / `Global climate models`
- Stage 4: `Data Paradigm` / `Data-intensive scientific discovery` / `The Human Genome Project`
- Stage 5: `Intelligent Paradigm` / `Foundation models and scientific agents` / `Protein structure prediction`

## Implementation Boundaries

Modify only the homepage, shared stylesheet, and existing verifier for product behavior:

- `index.html`: add the section and both language dictionaries.
- `ref.css`: add scoped module styles and mobile behavior.
- `scripts/verify-i18n.mjs`: assert section count, placement, stage count, exact copy, fallback parity, and required responsive styles.

Do not modify or stage the unrelated untracked file `docs/AI_for_Science_科研智能演进框架.md`.

## Verification

Use the existing Node verifier as the regression suite. Add the new assertions first and confirm they fail before implementation. After implementation:

1. Run `node scripts/verify-i18n.mjs`.
2. Run `git diff --check`.
3. Serve the site locally and inspect Chinese and English at desktop and mobile viewport sizes.
4. Confirm the five stages read left-to-right on desktop, collapse to one column on mobile, and cause no horizontal overflow.

