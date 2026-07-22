# Scientific Inference Foundation Model Page Design

## Goal

Add a bilingual, responsive subpage titled `科学推演大模型` that turns the supplied research-loop slide into a native web narrative. The page should explain how a scientific inference foundation model connects evidence, data, planning, simulation, and researcher judgment to produce falsifiable hypotheses and validation-ready research directions.

## Product Positioning

The page presents a research vision, not a claim that a finished autonomous scientist already exists. Its central proposition is:

> 科学推演大模型以证据为起点、以科学约束为边界、以实验与仿真为验证手段，将“为什么值得研究—在什么情境开展—靠什么路径实施—有什么预期成果”组织为可追踪、可迭代的科研闭环。

The English product name is `Scientific Inference Foundation Model`. This wording emphasizes evidence-grounded scientific inference and avoids implying that the model can replace scientific validation.

## Placement and Navigation

Create the page at `scientific_inference/index.html` and add `科学推演` / `Scientific Inference` to the shared navigation between `科学知识发现` and `Science of AI` on all six bilingual pages.

The page remains a distinct research-vision page while linking back to the two capabilities it joins:

- `科学知识发现` supplies literature, evidence, knowledge gaps, and candidate hypotheses.
- `科学任务求解` supplies scientific data modeling, simulation, optimization, and validation.

## Information Architecture

### 1. Hero: From Evidence to Verifiable Discovery

Lead with `科学推演大模型` and the statement `从证据出发，让假设、方案与预期结果进入同一个可验证闭环`. A compact visual rail shows the transformation `Evidence → Hypothesis → Plan → Verify`.

### 2. Definition: What the Model Organizes

Explain that the model accepts a research question, a new hypothesis, or an anomalous observation. It coordinates literature evidence, structured scientific data, domain constraints, simulation and experiment tools, then returns a traceable research proposal rather than an unsupported answer.

### 3. Core Loop: Four Questions of Scientific Inference

Rebuild the supplied slide as a responsive four-stage loop:

1. `文献证据挖掘` — answer `用什么证据支撑？`
2. `情境与数据建模` — answer `在什么情境开展？`
3. `实验与路径规划` — answer `靠什么路径实施？`
4. `仿真与结果评估` — answer `有什么预期成果？`

The desktop treatment uses a two-by-two loop around a central `科学推演引擎`. The mobile treatment becomes a numbered vertical sequence with explicit arrows. A researcher input rail lists `新假设 / 新想法 / 新发现`, preserving the source slide's human-in-the-loop framing.

### 4. Architecture: Four Coordinated Layers

Present four bounded layers:

- `证据与数据层`: literature, tables, time series, experimental records, and provenance.
- `科学世界模型层`: variables, mechanisms, boundary conditions, causal assumptions, and uncertainty.
- `规划与工具层`: retrieval, modeling, simulation, optimization, and experimental design tools.
- `验证与记忆层`: falsification criteria, result comparison, failure analysis, and reusable knowledge updates.

### 5. Researcher–Model Collaboration and Outputs

Describe three deliverables rather than a single generated answer:

- `可检验假设`: claim, evidence basis, assumptions, and falsification conditions.
- `可执行方案`: variables, controls, steps, resource constraints, and fallback paths.
- `可比较预期`: predicted observations, uncertainty, alternative explanations, and decision thresholds.

### 6. Trust and Evaluation

Use four evaluation cards:

- Evidence traceability.
- Scientific constraint consistency.
- Falsifiability and discriminative experiment quality.
- Calibration, reproducibility, and knowledge gain.

### 7. Evolution Path and Cross-links

End with a three-stage path: `证据增强推演 → 工具增强推演 → 实验闭环推演`. Link to `科学知识发现` and `科学任务求解` instead of inventing product or publication links.

## Visual Direction

Use the site's existing white, warm gray, USTC blue, and restrained red accent. The page hero introduces a deep blue scientific canvas with subtle grid and orbital motifs, while the content sections return to the shared light system. The four loop cards use progressively deeper blues; red is reserved for the question each stage answers and for the human research input.

All diagrams must be native HTML/CSS. Do not embed the supplied screenshot: its typography is too small for mobile, it cannot participate in language switching, and it would weaken accessibility.

## Interaction and Accessibility

- Keep the existing Chinese-default language switch and local preference persistence.
- Use semantic sections, headings, lists, and `aria-current="page"` on the new navigation item.
- Make decorative connectors and orbital marks `aria-hidden="true"`.
- Do not require hover to understand any content.
- Collapse the loop into one column below the existing mobile breakpoint and prevent horizontal overflow.
- Respect `prefers-reduced-motion` for decorative animation.

## Implementation Boundaries

Create or modify only:

- `scientific_inference/index.html`: complete bilingual page and inline language dictionary.
- `ref.css`: styles scoped under `inference-*` classes plus responsive behavior.
- `index.html`, `knowledge_memory/index.html`, `data_modeling/index.html`, `science_of_ai/index.html`, and `papers/index.html`: one navigation link and one translation key per language.
- `scripts/verify-i18n.mjs`: include the new page and validate the six-page navigation contract, page structure, copy, and responsive style hooks.

Do not modify or stage the unrelated untracked file `docs/AI_for_Science_科研智能演进框架.md`. Do not implement the separately planned homepage scientific-paradigm module as part of this page.

## Verification

1. Run the verifier before implementation and confirm the missing page/navigation contract fails.
2. Run `node scripts/verify-i18n.mjs` after implementation.
3. Run `git diff --check`.
4. Serve the repository locally and inspect Chinese and English at desktop and mobile widths.
5. Confirm the desktop loop reads clockwise, the mobile sequence reads top-to-bottom, language switching changes all visible copy, links resolve, and no horizontal overflow appears.
