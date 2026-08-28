# 科技文献智能研究布局子页面设计

## 目标

在现有“科技文献智能”专题页下新增一页个人研究布局说明，把附件中的完整思考压缩为清晰、可浏览、可复用的研究叙事：从海量科技文献中找到知识、恢复并结构化知识，再从已有知识中发现新的规律、研究空白与可验证假设。

## 方案取舍

- 采用“三支柱研究布局页”：以 Search、Extract、Discover 为主轴，最能表达连续的知识状态转化，也便于在主页、项目书和报告中复用。
- 不采用“纯项目目录页”：PaperScout、ScholarQuest、PaperArena 和 Mind2Report 只是布局中的研究基础，不应反客为主。
- 不采用“长篇宣言页”：附件内容完整但篇幅较长，网页需要用流程、卡片、表格和重点段落形成扫描层次。

## 页面位置与导航

- 新页面：`knowledge_memory/research_layout/index.html`
- 公网地址：`https://ustcagi-sci.github.io/knowledge_memory/research_layout/`
- 父页 `knowledge_memory/index.html` 的导论区增加“查看研究布局 / View Research Layout”按钮。
- 顶部主导航保持当前六项，不新增一级入口；新页面品牌标识返回站点首页，不另设独立的个人研究定位与返回模块。
- 新页面加入 `sitemap.xml`、站点双语页面校验和本地链接检查。

## 信息架构

1. **Hero：科技文献智能研究布局**
   - 总命题：从已有知识走向未知知识。
   - 核心路径：Find Knowledge → Extract Knowledge → Discover Knowledge。
2. **总体定位**
   - 解释科技文献为何是科学知识的关键外部载体。
   - 用 Literature → Knowledge → Discovery 展示连续知识转化。
3. **三大研究支柱**
   - 科技文献检索：Where is the knowledge?
   - 科技文献解析与知识抽取：What knowledge is contained?
   - 科技文献知识发现：What new knowledge can be derived?
4. **发现层的四个抓手**
   - Pattern Discovery、Research Gap Discovery、Hypothesis Generation、Candidate Discovery。
5. **现有工作映射**
   - PaperScout、ScholarQuest、PaperArena、Mind2Report 与两个待补齐方向。
6. **下一阶段重点**
   - Scientific Knowledge Extraction。
   - Evidence-driven Scientific Discovery。
## 视觉与交互

- 复用 `ref.css` 的蓝白配色、网格背景 Hero、卡片、列表、表格、按钮、统一导航与页脚。
- 仅为该页面补充少量共享 CSS：三阶段流程、阶段卡片、发现子方向网格与移动端堆叠。
- 不使用新增位图或装饰性插画；核心关系由 HTML/CSS 原生呈现，保持学术、克制和可响应。
- 沿用现有语言切换机制、焦点样式、语义标题结构和移动端导航行为。

## 验收标准

- 新页面中英文完整，默认中文，切换后所有 `data-i18n` 文本同步更新。
- 页面明确出现 Search、Extract、Discover 三支柱和连续知识转化链。
- PaperScout、ScholarQuest、PaperArena、Mind2Report 映射准确。
- 父页入口、导航、图标、样式、站点地图均无断链。
- 页面不渲染独立的“个人研究定位”模块，也不保留对应的中英文翻译键或专用样式。
- `node scripts/verify-i18n.mjs`、`git diff --check` 与旧术语扫描通过。
