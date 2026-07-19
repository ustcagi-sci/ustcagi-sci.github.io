# Scientific Research Purpose Module Design

## Goal

Add a bilingual homepage module that explains the two basic purposes of scientific research using the supplied slide as source material: discovering fundamental laws and solving practical problems.

## Placement

Insert the new `#research-purpose` section immediately after `#ai4science-meanings` and before `#hierarchy`. The resulting homepage narrative is:

1. Why AI for Science matters.
2. The three meanings of AI for Science.
3. What scientific research ultimately seeks to achieve.
4. The group's scientific literature and scientific data research directions.

## Visual Structure

Reuse the existing unframed section layout, centered section header, `system-grid`, and `system-panel` card styles. Present two equal-width cards on desktop and one column on narrow screens. Do not embed the low-resolution source slide; translate its ideas into native HTML so typography, responsiveness, accessibility, and i18n remain consistent with the homepage.

## Content

### Chinese

- Title: `科学研究的目的`
- Summary: `科学研究一方面探索自然与复杂系统的基本规律，另一方面面向真实需求解决关键问题；二者共同推动知识进步与技术创新。`
- Card 1 title: `寻求基本规律`
- Card 1 description: `通过观测、实验与理论建模揭示可重复、可验证的自然规律，例如行星运动定律和量子力学基本方程。`
- Card 2 title: `解决实际问题`
- Card 2 description: `将科学认知转化为工程与技术能力，服务制造、材料、能源、生命科学和航空航天等真实场景。`

### English

- Title: `Purposes of Scientific Research`
- Summary: `Scientific research seeks fundamental laws and solves practical problems, advancing knowledge and technological innovation through both discovery and application.`
- Card 1 title: `Discover Fundamental Laws`
- Card 1 description: `Use observation, experimentation, and theoretical modeling to uncover repeatable and testable laws, such as the laws of planetary motion and the fundamental equations of quantum mechanics.`
- Card 2 title: `Solve Practical Problems`
- Card 2 description: `Translate scientific understanding into engineering and technological capabilities for manufacturing, materials, energy, life sciences, aerospace, and other real-world domains.`

The fixed card labels are `Purpose 1` and `Purpose 2` in both languages, matching the existing English labels used elsewhere on the homepage.

## Implementation

Modify only `index.html` and `scripts/verify-i18n.mjs` for product behavior. Add `researchPurpose.*` entries to both language dictionaries. The HTML fallback copy will use English, matching the adjacent three-meanings module; the inline language initializer will immediately render the selected Chinese or English copy.

## Verification

Extend the existing Node verifier to require exactly one purpose section, exactly two cards, exact English and Chinese copy, English fallback parity, and final section order:

```text
ai4science-importance
ai4science-meanings
research-purpose
hierarchy
data-modeling
```

Run the verifier before implementation to observe the expected missing-section failure, then rerun after implementation. Finally inspect the page at desktop and mobile viewport sizes, verify both language states, and confirm there is no horizontal overflow.
