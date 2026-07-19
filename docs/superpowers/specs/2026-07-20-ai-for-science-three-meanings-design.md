# AI for Science Three Meanings Module Design

Date: 2026-07-20

## Goal

Add a homepage module that explains the three meanings of AI for Science described by Chao Tang: AI applied to scientific tasks, AI used to discover new science, and the science underlying AI itself.

Source: [汤超：关于 AI for Science 的几层意思](https://mp.weixin.qq.com/s/Uoxo3JA5k8SpdXGrqfrGIg)

## Placement

Insert `<section id="ai4science-meanings">` immediately after `<section id="ai4science-importance">`.

The resulting homepage order is:

1. Hero
2. Necessity, urgency, and importance
3. Three meanings of AI for Science
4. Scientific Literature Cognition
5. Scientific Data Modeling

This order incorporates the previously approved move of the complete literature cognition section before the data modeling section.

## Layout

- Use the existing `section-header`, `direction-grid`, `card`, and `direction-card` classes.
- Show three equal cards on desktop and rely on the existing responsive grid for a single-column mobile layout.
- Do not introduce new CSS, decorative assets, buttons, or nested cards.

## Content

### Module Header

- Chinese title: `AI for Science 的三层涵义`
- English title: `Three Meanings of AI for Science`
- Chinese summary: `AI for Science 不仅是利用 AI 解决科学任务，也包括发现新的科学规律，以及研究智能本身背后的科学原理。`
- English summary: `AI for Science is not only about applying AI to scientific tasks; it also encompasses discovering new science and studying the scientific principles underlying intelligence itself.`

### Card 1

- Label: `Layer 1`
- Chinese title: `面向科学任务的 AI`
- English title: `AI for Scientific Tasks`
- Chinese description: `将 AI 用于方程求解、分子设计、蛋白质折叠和科学影像识别等目标明确的科研任务，加速科学研究与技术创新。`
- English description: `Apply AI to well-defined scientific tasks such as equation solving, molecular design, protein folding, and scientific image recognition to accelerate research and technological innovation.`

### Card 2

- Label: `Layer 2`
- Chinese title: `用 AI 发现新科学`
- English title: `AI for New Science`
- Chinese description: `从预测和优化进一步走向规律、机制、守恒量与可验证假设的发现，探索 AI 能否推动科学创新和范式突破。`
- English description: `Move beyond prediction and optimization toward discovering laws, mechanisms, conserved quantities, and testable hypotheses that may enable scientific and paradigm breakthroughs.`

### Card 3

- Label: `Layer 3`
- Chinese title: `AI 的科学`
- English title: `Science of AI`
- Chinese description: `研究学习、智能与复杂系统背后的科学原理，促进人工智能与数学、物理和神经科学之间的双向启发。`
- English description: `Study the scientific principles behind learning, intelligence, and complex systems, enabling mutual advances across AI, mathematics, physics, and neuroscience.`

## Internationalization

Add synchronized English and Chinese translations under the `meanings.*` namespace for the module title, summary, three card titles, and three card descriptions. The visible fallback text must match the English entries because English is the initial document language.

## Verification

- Add a verifier that requires exactly one `#ai4science-meanings` section with exactly three cards.
- Assert the homepage order `importance < meanings < hierarchy < data-modeling`.
- Assert all required `meanings.*` keys exist in both languages and match the approved copy.
- Run `node scripts/verify-i18n.mjs` and `git diff --check`.
