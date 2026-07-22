# 全站质量修复 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 修复审计确认的外链、术语、移动端、SEO 与自动检查问题，同时保持现有视觉和信息架构。

**Architecture:** 继续使用静态 HTML、共享 `ref.css` 与页面内双语字典；将跨页约束集中到现有 Node 验证器。Mind2Report 保持独立样式，但纳入同一质量门禁。

**Tech Stack:** HTML5、CSS、Node.js `assert/fs/vm`、本地浏览器实测

---

### Task 1: 固化站点级约束

**Files:**
- Modify: `scripts/verify-i18n.mjs`

- [x] **Step 1: 写失败断言**

新增断言，要求三项中英文页面身份、每页 canonical/社交元数据、HTTPS 许可链接、规范 GitHub 链接、无失效域名、Mind2Report 移动端字号与锚点留白，以及 `robots.txt`/`sitemap.xml` 存在。

- [x] **Step 2: 验证 RED**

Run: `node scripts/verify-i18n.mjs`

Expected: FAIL，首个失败原因是英文导航仍使用旧名称。

### Task 2: 统一术语、链接和元数据

**Files:**
- Modify: `index.html`
- Modify: `knowledge_memory/index.html`
- Modify: `data_modeling/index.html`
- Modify: `scientific_inference/index.html`
- Modify: `science_of_ai/index.html`
- Modify: `papers/index.html`
- Modify: `mind2report/index.html`
- Modify: `README.md`
- Create: `robots.txt`
- Create: `sitemap.xml`

- [x] **Step 1: 实现最小跨页修改**

按设计术语更新页面身份和双语导航；替换失效/重定向链接；为每页加入 canonical、`og:url`、`og:image`、`twitter:card`、`twitter:title` 与 `twitter:description`；新增站点地图和爬虫入口。

- [x] **Step 2: 移除首页伪按钮行为**

删除 hero 的 `role="button"`、`tabindex`、刷新标签翻译及点击/键盘重播脚本，保留页面原有静态视觉。

### Task 3: 修复移动端布局与焦点状态

**Files:**
- Modify: `ref.css`
- Modify: `mind2report/style.css`

- [x] **Step 1: 实现 CSS 修复**

将 Mind2Report 小屏标题改为 `clamp(2.2rem, 15vw, 4rem)`，移除会挤占滚动条空间的 `min-width`，小屏锚点留白改为 `96px`；科学推演小屏锚点留白改为 `166px`；为语言切换按钮增加 `box-shadow` 焦点环并移除首页 hero 的按钮光标/焦点样式。

- [x] **Step 2: 验证 GREEN**

Run: `node scripts/verify-i18n.mjs`

Expected: PASS，无输出。

### Task 4: 完整验证

**Files:**
- Verify only

- [x] **Step 1: 静态验证**

Run: `node scripts/verify-i18n.mjs`

Run: `git diff --check`

Expected: 全部 exit 0；本地链接、重复 ID 和缺失图片替代文本均为 0。

- [x] **Step 2: 浏览器验证**

本地启动 HTTP 服务，对七个页面依次在 1440、820、390、320 宽度检查根节点横向溢出、失败图片、控制台错误和锚点遮挡；Mind2Report 标题的 `scrollWidth` 不得大于容器宽度。

- [x] **Step 3: 提交范围检查**

Run: `git status --short`

Expected: 仅本计划列出的站点文件和设计/计划文档发生变化；用户原有未跟踪文档保持未跟踪且内容未变。
