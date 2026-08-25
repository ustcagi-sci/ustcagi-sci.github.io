# USTC-AGI · AI for Science

This repository hosts the USTC-AGI research homepage for AI for Science:
[https://ustcagi-sci.github.io/](https://ustcagi-sci.github.io/).

## Research Areas

- **Scientific Literature Mining** — retrieval, document understanding, evidence synthesis, and testable hypothesis formation.
- **Scientific AI-Ready Data** — task-conditioned readiness assessment, data diagnosis and repair, model- and agent-facing data services, and continuous evolution through model and experimental feedback.
- **Scientific Data Modeling** — structured modeling for tabular data, time series, experiments, and observations.
- **Scientific Inference Agent** — evidence-grounded reasoning, experiment planning, simulation, and verification.
- **AI Scientist** — autonomous epistemic progress through knowledge-state tracking, evidence acquisition, hypothesis falsification, and auditable scientific learning.
- **Science of AI** — empirical and theoretical study of learning, reasoning, emergence, and intelligent systems.
- **Open Source Projects** — reusable evidence infrastructure, research agents, benchmarks, and scientific tools.

## Site Structure

The site is built as static HTML and CSS. The nine bilingual main pages share `ref.css` and inline translation dictionaries; `mind2report/` is an independent project page. Run the site checks before publishing:

```bash
node scripts/verify-i18n.mjs
git diff --check
```
