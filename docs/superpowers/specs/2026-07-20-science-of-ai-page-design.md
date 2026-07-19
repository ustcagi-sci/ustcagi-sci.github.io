# Science of AI Subpage Design

Date: 2026-07-20

## Goal

Create a bilingual `AI 科学 / Science of AI` subpage that treats AI itself as a complex scientific system. The page should frame open questions around scaling, emergence, reinforcement learning, mathematical structure, human intelligence, and agent dynamics rather than presenting another list of engineering applications.

## Navigation

Add a fourth research link to every page navigation:

1. Scientific Data / 科学数据
2. Scientific Literature / 科技文献
3. Science of AI / AI 科学
4. Publications / 论文列表

The new page lives at `science_of_ai/index.html`, uses `aria-current="page"` on its own navigation link, and keeps the existing USTC-AGI AI for Science brand treatment.

## Page Structure

### Hero

- Chinese title: `AI 科学`
- English title: `Science of AI`
- Chinese subtitle: `把 AI 本身作为一种复杂科学系统来研究，探索 Scaling Law、能力涌现、强化学习与智能结构背后的普遍规律。`
- English subtitle: `Study AI itself as a complex scientific system, seeking the general laws behind scaling, emergence, reinforcement learning, and the structure of intelligence.`
- Do not add an eyebrow or hero action button.

### 1. AI as an Object of Scientific Inquiry

Introduce the shift from building increasingly capable models to explaining the mechanisms and regularities that produce those capabilities. Show five foundational questions in the existing five-column hierarchy pattern:

1. Why do scaling laws appear?
2. Where do emergent capabilities come from?
3. How does reinforcement learning change model behavior?
4. Does intelligence have a unified mathematical structure?
5. What mechanisms are shared by artificial and human intelligence?

### 2. A Boundary for New Theory

State explicitly that Science of AI cannot be limited to applying existing physical theories to neural networks. It should define new observables, discover critical behavior, and form testable theories tailored to intelligence.

### 3. Future Scientific Questions

Present six question cards:

1. Can intelligence be described by macroscopic variables analogous to thermodynamic variables?
2. Are there phase-transition points in reasoning ability?
3. Is capability emergence continuous or a critical transition?
4. Is there a unified law connecting memory, compression, and prediction?
5. Why can in-context learning create new capabilities without parameter updates?
6. Do collaboration and autonomy in agent systems follow universal dynamical laws?

### 4. Research Framework

Organize the program into four connected lenses:

1. Macroscopic regularities
2. Learning dynamics
3. Information mechanisms
4. Collective intelligence

The closing position is that the goal is to move from AI engineering toward an explanatory and predictive science of intelligence.

## Visual Direction

- Reuse `hero`, `section-header`, `hierarchy-grid`, `system-grid`, `direction-grid`, `card`, `tldr`, and `stack-diagram` from `ref.css`.
- Keep the restrained white, gray, and USTC red visual language used by existing subpages.
- Avoid new decorative assets, nested cards, oversized copy, and marketing language.
- Let existing media queries stack grids on narrow screens.

## Internationalization

All visible prose receives matching `data-i18n` keys in complete English and Chinese translation objects. The document starts in Chinese and the language toggle must update the page title, metadata, navigation, hero, sections, and footer.

## Verification

- Extend `scripts/verify-i18n.mjs` to include the new page.
- Require the new navigation item and correct active marker on all pages.
- Assert the new page has the five foundational questions, six future questions, new-theory boundary, and four-part framework.
- Run the verifier before implementation to confirm failure, then after implementation to confirm success.
- Inspect the page in Chinese and English at desktop and mobile widths, including horizontal overflow checks.
