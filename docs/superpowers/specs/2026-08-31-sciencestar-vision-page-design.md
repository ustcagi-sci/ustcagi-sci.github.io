# 科星 ScienceStar 理念页设计

## 目标

新增一页独立的科星 ScienceStar 项目介绍，把总体规划压缩为可快速理解的战略叙事。页面不复述产品功能、商业模式和完整实施路线，只回答四个核心问题：为什么需要科星、科星连接什么、科星如何演进、科星长期依靠什么形成价值。

## 设计取舍

- 采用“理念叙事页”，而不是完整产品手册。主线从科研工具爆发带来的选择困难出发，落到 `Scientist ↔ Scientific Intelligence` 的核心连接。
- 不采用“功能目录页”。Tool Hub、Chat、Workspace、Workflow、Marketplace 等只保留能够解释平台演进的概念，不逐项展开。
- 不采用“创业路线图页”。不展示商业模式、用户规模、时间周期和阶段指标，避免把规划内容误读为已上线能力或既定承诺。
- 工具导航被明确描述为冷启动入口，不是最终产品边界。长期核心为 `Scientific Tool Graph × Scientist Profile × Tool Orchestration`。

## 页面位置与入口

- 新页面：`scistar/index.html`
- 公网地址：`https://ustcagi-sci.github.io/scistar/`
- 首页增加一个紧凑的 ScienceStar 平台引导区，作为站内入口；不扩充全站顶部导航，避免破坏当前六项主导航结构。
- 新页面复用主站导航、语言切换、页脚、SEO 元数据和共享样式。
- 新页面加入 `sitemap.xml`、README 页面结构说明和 `scripts/verify-i18n.mjs` 验证范围。

## 信息架构

1. **Hero：科星 ScienceStar**
   - 品牌主张：汇聚科学星火，点亮科研未来。
   - 核心关系：连接科学家与科学智能。
   - 页面明确标注为平台愿景，避免暗示产品已完整上线。
2. **为什么需要科星**
   - AI for Science 从“有没有工具”进入“选什么工具、如何组合工具”的阶段。
   - 用 `Tool Availability → Tool Discovery → Tool Orchestration` 表达机会窗口。
3. **一个不变的连接原点**
   - 科星是面向科学家的科学智能工具平台。
   - 连接科研问题、科学任务、AI 能力、工具与工作流。
4. **三层演进**
   - Scientific AI Portal：发现与理解工具。
   - Scientific AI Workspace：使用工具完成科研工作。
   - Scientific Intelligence OS：组合工具与智能体执行复杂任务。
5. **两种核心模式**
   - Explore：回答“有什么、在哪里、用哪个”。
   - Orchestrate：回答“怎么一起用”，组织任务理解、分解、选用、执行与验证。
6. **长期智能闭环**
   - Scientific Tool Graph：知道有什么能力。
   - Scientist Profile：理解谁需要什么。
   - Tool Orchestration：知道怎样真正用起来。
7. **愿景收束**
   - 从科学智能工具入口走向科学智能工作台，再走向科学智能操作系统。
   - 长期使命：Make Scientific Intelligence Accessible to Every Scientist.

## 视觉与交互

- 延续现站蓝白学术风格、网格 Hero、深蓝强调面板、细边框卡片和克制阴影。
- 以 CSS 原生星轨、连接节点和流程关系表达“科星”概念，不引入额外位图资源。
- 关键关系使用小型流程和三层演进卡片；不使用复杂交互、虚假搜索框或不可用的“立即体验”按钮。
- 桌面端三列呈现，平板端两列，移动端单列；语言切换后页面标题、描述和全部正文同步更新。

## 内容边界

- 当前页面是项目理念介绍，不宣称工具库、推荐系统、Chat、工作流编排或商业服务已经上线。
- 不展示商业模式、价格、用户规模、融资叙事、具体月份或阶段承诺。
- 不把 ScienceStar 等同于 Hugging Face，只说明其基本对象从 Model 扩展为 Scientific Capability。
- 不新增顶部一级导航；入口位于首页平台引导区和直接 URL。

## 验收标准

- 页面默认中文且可完整切换英文，所有 `data-i18n` 键在两种语言中存在。
- 页面包含 `Scientist ↔ Scientific Intelligence`、三层演进、Explore / Orchestrate 与三要素闭环。
- 页面明确出现“工具导航是入口，不是终局”的边界表达，并使用愿景语态描述长期能力。
- 首页能够进入新页面，所有相对导航、图标、页脚与站点地图链接有效。
- 通过 `node scripts/verify-i18n.mjs`、`git diff --check`、桌面端与移动端浏览器复核。

## 开源项目页入口补充

- 在 `projects/index.html` 的开放科研生态概览与项目目录之间增加独立的科星 ScienceStar 平台引导区，保留现有三组、六张开源组件卡片不变。
- 直接复用首页已有的 ScienceStar 引导模块与共享样式，突出能力发现、科学家与科学工具连接、可追踪工作流编排三项核心思想。
- 引导区只提供 `../scistar/` 站内介绍入口，不虚构尚未公开的代码仓库，也不把平台愿景误标为单一开源组件。
- 同步七个 `scistar.*` 中英文键，并由 `scripts/verify-i18n.mjs` 锁定独立区块、CTA 路径、双语标题与项目卡片数量不变。
