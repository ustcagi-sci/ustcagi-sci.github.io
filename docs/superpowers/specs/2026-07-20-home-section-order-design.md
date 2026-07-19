# Homepage Section Order Design

Date: 2026-07-20

## Goal

Move the complete "Scientific Literature Cognition" section before the "Scientific Data Modeling" section on the homepage.

## Target Order

1. AI for Science importance
2. Scientific Literature Cognition
3. Scientific Data Modeling

## Scope

- Move the complete `<section id="hierarchy">` block, including the five cognition-level cards and representative project cards.
- Place it immediately before `<section id="data-modeling">`.
- Keep all section content, IDs, classes, links, styles, and Chinese/English translations unchanged.
- Do not refactor unrelated homepage markup or styling.

## Verification

- Update the homepage order assertion so it requires `importance < hierarchy < data-modeling`.
- Run `node scripts/verify-i18n.mjs`.
- Run `git diff --check` and confirm only the intended homepage ordering, verifier assertion, and design/plan artifacts changed.
