import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const pages = [
  "index.html",
  "knowledge_memory/index.html",
  "data_modeling/index.html",
  "papers/index.html",
];

const validatePage = (relativePath) => {
  const html = readFileSync(resolve(root, relativePath), "utf8");
  const label = relativePath;

  assert.ok(/id="language-toggle"/.test(html), `${label}: missing language toggle button`);
  assert.ok(
    /data-language="zh"/.test(html),
    `${label}: html element should declare initial language`
  );
  assert.ok(/data-i18n="/.test(html), `${label}: missing translatable text markers`);

  const objectMatch = html.match(
    /const translations = (\{[\s\S]*?\n      \});\n\n      const getStoredLanguage/
  );
  const scriptMatch = html.match(/<script>\n([\s\S]*?)\n    <\/script>/);

  assert.ok(objectMatch, `${label}: missing translations object`);
  assert.ok(scriptMatch, `${label}: missing language script`);

  const context = {};
  vm.runInNewContext(`translations = ${objectMatch[1]};`, context);

  const keys = new Set(
    [...html.matchAll(/data-i18n="([^"]+)"/g)].map((match) => match[1])
  );

  assert.ok(keys.size > 0, `${label}: no translation keys found`);

  for (const language of ["en", "zh"]) {
    assert.ok(context.translations[language], `${label}: missing ${language} translations`);

    for (const key of keys) {
      assert.equal(
        typeof context.translations[language][key],
        "string",
        `${label}: missing ${language} translation for ${key}`
      );
      assert.ok(
        context.translations[language][key].trim(),
        `${label}: empty ${language} translation for ${key}`
      );
    }
  }

  const keyedElements = [...keys].map((key) => ({
    dataset: { i18n: key },
    textContent: "",
  }));
  const toggle = {
    attributes: {},
    textContent: "",
    setAttribute(name, value) {
      this.attributes[name] = String(value);
    },
    getAttribute(name) {
      return this.attributes[name] ?? null;
    },
    addEventListener(eventName, handler) {
      if (eventName === "click") {
        this.click = handler;
      }
    },
  };
  const year = { textContent: "" };
  const description = {
    attributes: {},
    setAttribute(name, value) {
      this.attributes[name] = String(value);
    },
  };
  const document = {
    documentElement: { dataset: {}, lang: "" },
    title: "",
    getElementById(id) {
      return { "language-toggle": toggle, year }[id] ?? null;
    },
    querySelector(selector) {
      return selector === 'meta[name="description"]' ? description : null;
    },
    querySelectorAll(selector) {
      return selector === "[data-i18n]" ? keyedElements : [];
    },
  };
  const storage = new Map();

  vm.runInNewContext(scriptMatch[1], {
    Date,
    URLSearchParams,
    document,
    localStorage: {
      getItem(key) {
        return storage.get(key) ?? null;
      },
      setItem(key, value) {
        storage.set(key, String(value));
      },
    },
    window: { location: { search: "" } },
  });

  assert.equal(document.documentElement.lang, "zh-CN", `${label}: default lang should be zh-CN`);
  assert.equal(document.documentElement.dataset.language, "zh", `${label}: default language should be zh`);
  assert.equal(document.title, context.translations.zh["meta.title"], `${label}: default title should be Chinese`);
  assert.equal(toggle.textContent, "EN", `${label}: default toggle should offer English`);
  assert.equal(toggle.getAttribute("aria-pressed"), "true", `${label}: default toggle state should be true`);
  assert.equal(typeof toggle.click, "function", `${label}: toggle click handler was not registered`);

  toggle.click();

  assert.equal(document.documentElement.lang, "en", `${label}: toggled lang should be en`);
  assert.equal(document.documentElement.dataset.language, "en", `${label}: toggled language should be en`);
  assert.equal(document.title, context.translations.en["meta.title"], `${label}: toggled title should be English`);
  assert.equal(toggle.textContent, "中文", `${label}: toggled button should offer Chinese`);
  assert.equal(toggle.getAttribute("aria-pressed"), "false", `${label}: toggled state should be false`);
  assert.equal(storage.get("preferredLanguage"), "en", `${label}: toggled language should persist`);

  for (const element of keyedElements) {
    assert.equal(
      element.textContent,
      context.translations.en[element.dataset.i18n],
      `${label}: ${element.dataset.i18n} did not update to English`
    );
  }
};

const validateBrandLabels = (relativePath) => {
  const html = readFileSync(resolve(root, relativePath), "utf8");
  const label = relativePath;
  const objectMatch = html.match(
    /const translations = (\{[\s\S]*?\n      \});\n\n      const getStoredLanguage/
  );
  const context = {};

  assert.ok(
    /aria-label="USTC-AGI AI for Science"/.test(html),
    `${label}: logo aria label should match the visible brand`
  );
  assert.ok(
    /<span class="logo-title" data-i18n="brand\.title">USTC-AGI<\/span>/.test(html),
    `${label}: initial logo title should be USTC-AGI`
  );
  assert.ok(
    /<span class="logo-subtitle" data-i18n="brand\.subtitle">AI for Science<\/span>/.test(html),
    `${label}: initial logo subtitle should be AI for Science`
  );

  assert.ok(objectMatch, `${label}: missing translations object`);
  vm.runInNewContext(`translations = ${objectMatch[1]};`, context);

  for (const language of ["en", "zh"]) {
    assert.equal(
      context.translations[language]["brand.title"],
      "USTC-AGI",
      `${label}: ${language} logo title should remain USTC-AGI`
    );
    assert.equal(
      context.translations[language]["brand.subtitle"],
      "AI for Science",
      `${label}: ${language} logo subtitle should remain AI for Science`
    );
  }
};

const validateNavigation = (relativePath) => {
  const html = readFileSync(resolve(root, relativePath), "utf8");
  const label = relativePath;
  const navMatch = html.match(/<div class="nav-links">([\s\S]*?)<span class="nav-break"/);
  const objectMatch = html.match(
    /const translations = (\{[\s\S]*?\n      \});\n\n      const getStoredLanguage/
  );
  const context = {};

  assert.ok(navMatch, `${label}: missing navigation links`);
  assert.ok(objectMatch, `${label}: missing translations object`);
  vm.runInNewContext(`translations = ${objectMatch[1]};`, context);

  const navKeys = [...navMatch[1].matchAll(/data-i18n="([^"]+)"/g)].map((match) => match[1]);

  assert.deepEqual(
    navKeys,
    ["nav.data", "nav.knowledge", "nav.papers"],
    `${label}: navigation should match the main page link set`
  );

  const currentMatches = [...navMatch[1].matchAll(/aria-current="page"[^>]*data-i18n="([^"]+)"/g)].map(
    (match) => match[1]
  );
  const expectedCurrent = {
    "knowledge_memory/index.html": "nav.knowledge",
    "data_modeling/index.html": "nav.data",
    "papers/index.html": "nav.papers",
  }[relativePath];

  assert.deepEqual(
    currentMatches,
    expectedCurrent ? [expectedCurrent] : [],
    `${label}: active navigation marker should match the current page`
  );

  assert.equal(
    context.translations.en["nav.knowledge"],
    "Scientific Literature",
    `${label}: English knowledge navigation label should be Scientific Literature`
  );
  assert.equal(
    context.translations.zh["nav.knowledge"],
    "科技文献",
    `${label}: Chinese knowledge navigation label should be 科技文献`
  );
  assert.equal(
    context.translations.en["nav.data"],
    "Scientific Data",
    `${label}: English data navigation label should be Scientific Data`
  );
  assert.equal(
    context.translations.zh["nav.data"],
    "科学数据",
    `${label}: Chinese data navigation label should be 科学数据`
  );
};

const validateNoStaleNavTranslations = (relativePath) => {
  const html = readFileSync(resolve(root, relativePath), "utf8");
  const label = relativePath;
  const objectMatch = html.match(
    /const translations = (\{[\s\S]*?\n      \});\n\n      const getStoredLanguage/
  );
  const context = {};
  const staleKeys = ["nav.directions", "nav.intro", "nav.architecture", "nav.resources", "nav.hierarchy"];

  assert.ok(objectMatch, `${label}: missing translations object`);
  vm.runInNewContext(`translations = ${objectMatch[1]};`, context);

  for (const language of ["en", "zh"]) {
    for (const key of staleKeys) {
      assert.equal(
        context.translations[language][key],
        undefined,
        `${label}: stale ${language} translation should be removed for ${key}`
      );
    }
  }
};

const validateTargetBlankSafety = (relativePath) => {
  const html = readFileSync(resolve(root, relativePath), "utf8");
  const label = relativePath;

  for (const [tag] of html.matchAll(/<a\b[^>]*target="_blank"[^>]*>/g)) {
    const relMatch = tag.match(/\brel="([^"]+)"/);
    const relTokens = new Set((relMatch?.[1] ?? "").split(/\s+/).filter(Boolean));

    assert.ok(relTokens.has("noopener"), `${label}: target="_blank" link is missing noopener: ${tag}`);
    assert.ok(relTokens.has("noreferrer"), `${label}: target="_blank" link is missing noreferrer: ${tag}`);
  }
};

const validateHomeHeroRefresh = () => {
  const html = readFileSync(resolve(root, "index.html"), "utf8");
  const objectMatch = html.match(
    /const translations = (\{[\s\S]*?\n      \});\n\n      const getStoredLanguage/
  );
  const context = {};

  assert.ok(
    /<header id="top" class="hero" role="button" tabindex="0" aria-label="刷新首页视觉效果">/.test(html),
    "index.html: hero should expose a clickable refresh affordance"
  );
  assert.ok(/hero\.classList\.add\("hero-refreshing"\)/.test(html), "index.html: hero click should replay the refresh class");
  assert.ok(/hero\.addEventListener\("keydown"/.test(html), "index.html: hero refresh should support keyboard activation");

  assert.ok(objectMatch, "index.html: missing translations object");
  vm.runInNewContext(`translations = ${objectMatch[1]};`, context);
  assert.equal(
    context.translations.en["hero.refreshLabel"],
    "Replay the homepage hero refresh effect",
    "index.html: English hero refresh label should be present"
  );
  assert.equal(
    context.translations.zh["hero.refreshLabel"],
    "刷新首页视觉效果",
    "index.html: Chinese hero refresh label should be present"
  );
};

const validateHomeDataModelingModule = () => {
  const html = readFileSync(resolve(root, "index.html"), "utf8");
  const objectMatch = html.match(
    /const translations = (\{[\s\S]*?\n      \});\n\n      const getStoredLanguage/
  );
  const context = {};
  const importanceIndex = html.indexOf('<section id="ai4science-importance"');
  const dataModelingIndex = html.indexOf('<section id="data-modeling"');
  const hierarchyIndex = html.indexOf('<section id="hierarchy"');
  const expectedTranslations = {
    en: {
      "dataModeling.title": "Scientific Data Modeling",
      "dataModeling.description":
        "Structured scientific data modeling focuses on tables, time series, experimental records, and scientific observations, turning scientific data into learnable, predictive, and reasoned model representations.",
      "dataModeling.tabular.title": "Tabular Data",
      "dataModeling.tabular.description":
        "Model property tables, experimental matrices, materials and molecular property sheets, and scientific records under small samples, missing values, heterogeneous fields, and domain context.",
      "dataModeling.series.title": "Time Series",
      "dataModeling.series.description":
        "Model experimental curves, sensor sequences, simulation trajectories, and observation streams to capture trends, cycles, abrupt changes, and dynamic processes.",
      "dataModeling.cta": "Learn Scientific Data Modeling",
    },
    zh: {
      "dataModeling.title": "科学数据建模",
      "dataModeling.description":
        "结构化科学数据建模关注表格、时间序列、实验记录和科学观测数据，把科学数据转化为可学习、可预测、可推理的模型表示。",
      "dataModeling.tabular.title": "Tabular Data",
      "dataModeling.tabular.description":
        "面向属性表、实验矩阵、材料/分子性质表和科学记录，处理小样本、缺失值、异构字段和领域上下文。",
      "dataModeling.series.title": "Time Series",
      "dataModeling.series.description":
        "面向实验曲线、传感器序列、仿真轨迹和观测流，建模趋势、周期、突变和动态过程。",
      "dataModeling.cta": "了解科学数据建模",
    },
  };

  assert.ok(importanceIndex >= 0, "index.html: missing AI for Science importance section");
  assert.ok(dataModelingIndex > importanceIndex, "index.html: data modeling module should follow the importance section");
  assert.ok(hierarchyIndex > dataModelingIndex, "index.html: data modeling module should appear before hierarchy section");
  assert.ok(/<section id="data-modeling" class="section highlights">/.test(html), "index.html: missing homepage data modeling module");
  assert.ok(/<h2 data-i18n="dataModeling\.title">科学数据建模<\/h2>/.test(html), "index.html: data modeling module title should be 科学数据建模");
  assert.ok(/href="\.\/data_modeling\/" data-i18n="dataModeling\.cta"/.test(html), "index.html: data modeling module should link to the data modeling subpage");
  assert.ok(!/>结构化科学数据<\/p>/.test(html), "index.html: structured scientific data eyebrow should be removed");
  assert.ok(!/data-i18n="dataModeling\.eyebrow"/.test(html), "index.html: data modeling eyebrow marker should not return");

  assert.ok(objectMatch, "index.html: missing translations object");
  vm.runInNewContext(`translations = ${objectMatch[1]};`, context);

  for (const language of ["en", "zh"]) {
    assert.equal(
      context.translations[language]["dataModeling.eyebrow"],
      undefined,
      `index.html: stale ${language} data modeling eyebrow translation should be removed`
    );

    for (const [key, value] of Object.entries(expectedTranslations[language])) {
      assert.equal(
        context.translations[language][key],
        value,
        `index.html: ${language} translation should match for ${key}`
      );
    }
  }
};

const validateHomeHierarchyTitle = () => {
  const html = readFileSync(resolve(root, "index.html"), "utf8");
  const objectMatch = html.match(
    /const translations = (\{[\s\S]*?\n      \});\n\n      const getStoredLanguage/
  );
  const context = {};

  assert.ok(
    /<h2 data-i18n="hierarchy\.title">科技文献认知<\/h2>/.test(html),
    "index.html: hierarchy title should be 科技文献认知"
  );

  assert.ok(objectMatch, "index.html: missing translations object");
  vm.runInNewContext(`translations = ${objectMatch[1]};`, context);
  assert.equal(
    context.translations.en["hierarchy.title"],
    "Scientific Literature Cognition",
    "index.html: English hierarchy title should be Scientific Literature Cognition"
  );
  assert.equal(
    context.translations.zh["hierarchy.title"],
    "科技文献认知",
    "index.html: Chinese hierarchy title should be 科技文献认知"
  );
};

const validateHomeProjectsIntegratedIntoHierarchy = () => {
  const html = readFileSync(resolve(root, "index.html"), "utf8");
  const css = readFileSync(resolve(root, "ref.css"), "utf8");
  const objectMatch = html.match(
    /const translations = (\{[\s\S]*?\n      \});\n\n      const getStoredLanguage/
  );
  const context = {};
  const hierarchyIndex = html.indexOf('<section id="hierarchy"');
  const researchGridIndex = html.indexOf('<div class="research-grid">');
  const hierarchyEndIndex = hierarchyIndex >= 0 ? html.indexOf("</section>", researchGridIndex) : -1;
  const footerIndex = html.indexOf('<footer id="contact"');

  assert.ok(hierarchyIndex >= 0, "index.html: missing hierarchy section");
  assert.equal(
    html.indexOf('<section id="projects"'),
    -1,
    "index.html: project cards should not remain in a standalone projects section"
  );
  assert.ok(
    researchGridIndex > hierarchyIndex,
    "index.html: project card grid should be placed inside the hierarchy section"
  );
  assert.ok(
    hierarchyEndIndex > researchGridIndex,
    "index.html: hierarchy section should wrap the project card grid"
  );
  assert.ok(
    footerIndex > hierarchyEndIndex,
    "index.html: hierarchy section with project cards should stay before the footer"
  );
  assert.ok(!/data-i18n="projects\.title"/.test(html), "index.html: projects title marker should be removed");
  assert.ok(
    !/data-i18n="projects\.description"/.test(html),
    "index.html: projects description marker should be removed"
  );
  assert.ok(!/推进科学智能的前沿/.test(html), "index.html: Chinese projects title should be removed");
  assert.ok(
    !/我们的工作覆盖完整认知层级，为下一代科学 AI 提供工具、基准与研究范式。/.test(html),
    "index.html: Chinese projects description should be removed"
  );
  assert.ok(!/Advancing the Frontiers of Science/.test(html), "index.html: English projects title should be removed");
  assert.ok(
    !/Our work spans the entire hierarchy, providing tools and benchmarks for the next generation of scientific AI\./.test(html),
    "index.html: English projects description should be removed"
  );
  assert.ok(
    /\.hierarchy-grid\s*\+\s*\.research-grid\s*{[\s\S]*?margin-top:\s*28px;[\s\S]*?}/.test(css),
    "ref.css: project cards should keep spacing when integrated after the hierarchy grid"
  );

  assert.ok(objectMatch, "index.html: missing translations object");
  vm.runInNewContext(`translations = ${objectMatch[1]};`, context);

  for (const language of ["en", "zh"]) {
    for (const key of ["projects.eyebrow", "projects.title", "projects.description"]) {
      assert.equal(
        context.translations[language][key],
        undefined,
        `index.html: stale ${language} translation should be removed for ${key}`
      );
    }
  }
};

const validateHomeAiForScienceImportanceModule = () => {
  const html = readFileSync(resolve(root, "index.html"), "utf8");
  const objectMatch = html.match(
    /const translations = (\{[\s\S]*?\n      \});\n\n      const getStoredLanguage/
  );
  const context = {};
  const heroIndex = html.indexOf('<header id="top"');
  const importanceIndex = html.indexOf('<section id="ai4science-importance"');
  const hierarchyIndex = html.indexOf('<section id="hierarchy"');
  const expectedTranslations = {
    en: {
      "importance.eyebrow": "AI for Science",
      "importance.title": "Necessity, Urgency, and Importance of AI for Science",
      "importance.description":
        "Scientific knowledge, experimental data, and computational tools are growing rapidly. Research workflows that rely on manual reading, hand-built models, and isolated tools can no longer keep pace with scientific complexity. Centered on LLMs and Agentic AI, AI for Science connects literature, data, models, and experimental feedback into critical infrastructure for efficient research, new law discovery, and autonomous scientific systems.",
      "importance.necessity.title": "Necessity",
      "importance.necessity.description":
        "Modern scientific problems span literature, data, experiments, and computation, requiring intelligent systems to organize evidence, understand variable relationships, and support research decisions.",
      "importance.urgency.title": "Urgency",
      "importance.urgency.description":
        "Papers, experimental records, and observation data continue to grow explosively, while manual screening, reproduction, and modeling costs rise quickly. Research workflows need more automation, traceability, and collaboration.",
      "importance.importance.title": "Importance",
      "importance.importance.description":
        "AI for Science closes the loop from knowledge acquisition and data modeling to evidence reasoning and hypothesis discovery, supporting breakthroughs in theories, methods, and intelligent systems.",
    },
    zh: {
      "importance.eyebrow": "AI for Science",
      "importance.title": "AI for Science 的必要性、迫切性与重要性",
      "importance.description":
        "科学知识、实验数据和计算工具正在高速增长，传统依赖人工阅读、手动建模和单点工具的科研流程难以跟上问题复杂度。AI for Science 以 LLMs and Agentic AI 为核心，把文献、数据、模型和实验反馈连接起来，成为提升科研效率、发现新规律和构建自主科学系统的关键基础设施。",
      "importance.necessity.title": "必要性",
      "importance.necessity.description":
        "现代科学问题跨越文献、数据、实验和计算，需要智能系统组织证据、理解变量关系并辅助研究决策。",
      "importance.urgency.title": "迫切性",
      "importance.urgency.description":
        "论文、实验记录和观测数据持续爆发增长，人工筛选、复现和建模成本快速上升，科研流程需要更自动化、可追踪和可协同。",
      "importance.importance.title": "重要性",
      "importance.importance.description":
        "AI for Science 推动从知识获取、数据建模到证据推理和假设发现的闭环，支撑基础理论、方法技术与智能系统突破。",
    },
  };

  assert.ok(heroIndex >= 0, "index.html: missing hero section");
  assert.ok(importanceIndex > heroIndex, "index.html: AI for Science importance module should follow the hero section");
  assert.ok(
    hierarchyIndex > importanceIndex,
    "index.html: AI for Science importance module should appear before hierarchy section"
  );
  assert.ok(
    /<section id="ai4science-importance" class="section">/.test(html),
    "index.html: AI for Science importance module should use the homepage section style"
  );
  assert.ok(
    /<h2 data-i18n="importance\.title">AI for Science 的必要性、迫切性与重要性<\/h2>/.test(html),
    "index.html: AI for Science importance title should match the requested focus"
  );

  for (const requiredText of ["必要性", "迫切性", "重要性"]) {
    assert.ok(html.includes(requiredText), `index.html: AI for Science importance module should include ${requiredText}`);
  }

  assert.ok(objectMatch, "index.html: missing translations object");
  vm.runInNewContext(`translations = ${objectMatch[1]};`, context);

  for (const language of ["en", "zh"]) {
    for (const [key, value] of Object.entries(expectedTranslations[language])) {
      assert.equal(
        context.translations[language][key],
        value,
        `index.html: ${language} translation should match for ${key}`
      );
    }
  }
};

const validateHomeVisionRemoved = () => {
  const html = readFileSync(resolve(root, "index.html"), "utf8");
  const objectMatch = html.match(
    /const translations = (\{[\s\S]*?\n      \});\n\n      const getStoredLanguage/
  );
  const context = {};

  assert.ok(!/<section id="vision"/.test(html), "index.html: vision section should be removed");
  assert.ok(!/data-i18n="vision\./.test(html), "index.html: vision translation markers should be removed");

  assert.ok(objectMatch, "index.html: missing translations object");
  vm.runInNewContext(`translations = ${objectMatch[1]};`, context);

  for (const language of ["en", "zh"]) {
    for (const key of Object.keys(context.translations[language])) {
      assert.ok(
        !key.startsWith("vision."),
        `index.html: stale ${language} vision translation should be removed for ${key}`
      );
    }
  }
};

const validateHomeFooterDescriptionRemoved = () => {
  const html = readFileSync(resolve(root, "index.html"), "utf8");
  const objectMatch = html.match(
    /const translations = (\{[\s\S]*?\n      \});\n\n      const getStoredLanguage/
  );
  const context = {};

  assert.ok(
    !/data-i18n="footer\.eyebrow"/.test(html),
    "index.html: footer eyebrow text should be removed"
  );
  assert.ok(
    !/联系合作 · Connect/.test(html),
    "index.html: Chinese footer eyebrow should be removed"
  );
  assert.ok(!/>Connect<\/p>/.test(html), "index.html: English footer eyebrow should be removed");
  assert.ok(
    !/data-i18n="footer\.description"/.test(html),
    "index.html: footer description text should be removed"
  );
  assert.ok(
    !/我们欢迎围绕科学文献挖掘、多模态解析和自主研究智能体展开合作。/.test(html),
    "index.html: Chinese footer description should be removed"
  );
  assert.ok(
    !/We welcome collaborations on AI for scientific literature mining, multimodal parsing, and autonomous research agents\./.test(html),
    "index.html: English footer description should be removed"
  );

  assert.ok(objectMatch, "index.html: missing translations object");
  vm.runInNewContext(`translations = ${objectMatch[1]};`, context);

  for (const language of ["en", "zh"]) {
    assert.equal(
      context.translations[language]["footer.eyebrow"],
      undefined,
      `index.html: stale ${language} footer eyebrow translation should be removed`
    );
    assert.equal(
      context.translations[language]["footer.description"],
      undefined,
      `index.html: stale ${language} footer description translation should be removed`
    );
  }
};

const validateHomeTimelineRemoved = () => {
  const html = readFileSync(resolve(root, "index.html"), "utf8");
  const objectMatch = html.match(
    /const translations = (\{[\s\S]*?\n      \});\n\n      const getStoredLanguage/
  );
  const context = {};

  assert.ok(!/<section id="timeline"/.test(html), "index.html: timeline section should be removed");
  assert.ok(!/data-i18n="timeline\./.test(html), "index.html: timeline translation markers should be removed");
  assert.ok(!/>相关工作<\/h2>/.test(html), "index.html: related work heading should be removed");

  assert.ok(objectMatch, "index.html: missing translations object");
  vm.runInNewContext(`translations = ${objectMatch[1]};`, context);

  for (const language of ["en", "zh"]) {
    for (const key of Object.keys(context.translations[language])) {
      assert.ok(
        !key.startsWith("timeline."),
        `index.html: stale ${language} timeline translation should be removed for ${key}`
      );
    }
  }
};

const validatePapersHero = () => {
  const html = readFileSync(resolve(root, "papers/index.html"), "utf8");
  const heroMatch = html.match(/<header id="top" class="hero">([\s\S]*?)<\/header>/);

  assert.ok(heroMatch, "papers/index.html: missing top hero banner");
  assert.ok(/class="hero-content"/.test(heroMatch[1]), "papers/index.html: hero should match subpage layout");
  assert.ok(!/class="eyebrow"/.test(heroMatch[1]), "papers/index.html: hero eyebrow should be removed");
  assert.ok(!/data-i18n="hero\.eyebrow"/.test(heroMatch[1]), "papers/index.html: removed hero eyebrow should not be translatable");
  assert.ok(/data-i18n="hero\.title"/.test(heroMatch[1]), "papers/index.html: hero title should be translatable");
  assert.ok(/data-i18n="hero\.subtitle"/.test(heroMatch[1]), "papers/index.html: hero subtitle should be translatable");
  assert.ok(/class="hero-actions"/.test(heroMatch[1]), "papers/index.html: hero should include the subpage action row");
};

const validatePapersYearLabels = () => {
  const html = readFileSync(resolve(root, "papers/index.html"), "utf8");
  const year2026Match = html.match(/<h2 id="papers-2026" data-i18n="year\.2026">([^<]+)<\/h2>/);
  const year2025Match = html.match(/<h2 id="papers-2025" data-i18n="year\.2025">([^<]+)<\/h2>/);
  const objectMatch = html.match(
    /const translations = (\{[\s\S]*?\n      \});\n\n      const getStoredLanguage/
  );
  const context = {};

  assert.ok(year2026Match, "papers/index.html: missing 2026 year heading");
  assert.equal(year2026Match[1], "Preprint", "papers/index.html: 2026 heading should be Preprint");
  assert.ok(year2025Match, "papers/index.html: missing 2025 year heading");
  assert.equal(year2025Match[1], "2025", "papers/index.html: 2025 heading should be concise");

  assert.ok(objectMatch, "papers/index.html: missing translations object");
  vm.runInNewContext(`translations = ${objectMatch[1]};`, context);

  assert.equal(context.translations.en["year.2026"], "Preprint", "papers/index.html: English 2026 heading should be Preprint");
  assert.equal(context.translations.zh["year.2026"], "Preprint", "papers/index.html: Chinese 2026 heading should be Preprint");
  assert.equal(context.translations.en["year.2025"], "2025", "papers/index.html: English 2025 heading should be concise");
  assert.equal(context.translations.zh["year.2025"], "2025", "papers/index.html: Chinese 2025 heading should be concise");
};

const validatePapersListHeaderRemoved = () => {
  const html = readFileSync(resolve(root, "papers/index.html"), "utf8");
  const paperListIntroMatch = html.match(
    /<section id="paper-list" class="section highlights">([\s\S]*?)<div class="publication-list">/
  );
  const objectMatch = html.match(
    /const translations = (\{[\s\S]*?\n      \});\n\n      const getStoredLanguage/
  );
  const context = {};

  assert.ok(paperListIntroMatch, "papers/index.html: missing paper list section");
  assert.ok(
    !/class="section-header"/.test(paperListIntroMatch[1]),
    "papers/index.html: paper list section should not repeat a section-header title"
  );

  assert.ok(objectMatch, "papers/index.html: missing translations object");
  vm.runInNewContext(`translations = ${objectMatch[1]};`, context);
  assert.equal(context.translations.en["list.title"], undefined, "papers/index.html: removed list title should not keep English translation");
  assert.equal(context.translations.zh["list.title"], undefined, "papers/index.html: removed list title should not keep Chinese translation");
};

const validateChemTableVenueLink = () => {
  const html = readFileSync(resolve(root, "papers/index.html"), "utf8");
  const chemTableMatch = html.match(
    /<h3>Benchmarking Multimodal LLMs on Recognition and Understanding over Chemical Tables<\/h3>[\s\S]*?<div class="paper-links">([\s\S]*?)<\/div>/
  );

  assert.ok(chemTableMatch, "papers/index.html: missing ChemTable paper links");
  assert.ok(
    /href="https:\/\/arxiv\.org\/abs\/2506\.11375v2"[\s\S]*?>KDD2026<\/a>/.test(chemTableMatch[1]),
    "papers/index.html: ChemTable venue link should be labeled KDD2026"
  );
};

const validateScholarSumVenueLink = () => {
  const html = readFileSync(resolve(root, "papers/index.html"), "utf8");
  const scholarSumMatch = html.match(
    /<h3>ScholarSum: Student-Teacher Abstractive Summarization via Knowledge Graph Reasoning and Reflective Refinement<\/h3>[\s\S]*?<div class="paper-links">([\s\S]*?)<\/div>/
  );

  assert.ok(scholarSumMatch, "papers/index.html: missing ScholarSum paper links");
  assert.ok(
    /href="https:\/\/openreview\.net\/pdf\?id=pLvGIKeZtJ"[\s\S]*?>IJCAI2026<\/a>/.test(scholarSumMatch[1]),
    "papers/index.html: ScholarSum venue link should be labeled IJCAI2026"
  );
};

const validateDataModelingPage = () => {
  const html = readFileSync(resolve(root, "data_modeling/index.html"), "utf8");
  const objectMatch = html.match(
    /const translations = (\{[\s\S]*?\n      \});\n\n      const getStoredLanguage/
  );
  const context = {};

  assert.ok(/<h1 data-i18n="hero\.title">科学数据建模<\/h1>/.test(html), "data_modeling/index.html: hero title should introduce scientific data modeling");
  assert.ok(/Tabular Data/.test(html), "data_modeling/index.html: page should foreground tabular data modeling");
  assert.ok(/Time Series/.test(html), "data_modeling/index.html: page should foreground time series modeling");
  assert.ok(/结构化科学数据建模/.test(html), "data_modeling/index.html: Chinese copy should foreground structured scientific data modeling");

  assert.ok(objectMatch, "data_modeling/index.html: missing translations object");
  vm.runInNewContext(`translations = ${objectMatch[1]};`, context);

  assert.equal(
    context.translations.en["nav.data"],
    "Scientific Data",
    "data_modeling/index.html: English navigation label should name the new section"
  );
  assert.equal(
    context.translations.zh["nav.data"],
    "科学数据",
    "data_modeling/index.html: Chinese navigation label should name the new section"
  );
};

const validateDirectionsPageRemoved = () => {
  assert.equal(
    existsSync(resolve(root, "directions/index.html")),
    false,
    "directions/index.html: research directions page should be removed"
  );
};

for (const page of pages) {
  validatePage(page);
  validateBrandLabels(page);
  validateNavigation(page);
  validateNoStaleNavTranslations(page);
  validateTargetBlankSafety(page);
}

validateHomeHeroRefresh();
validateHomeAiForScienceImportanceModule();
validateHomeDataModelingModule();
validateHomeHierarchyTitle();
validateHomeProjectsIntegratedIntoHierarchy();
validateHomeVisionRemoved();
validateHomeFooterDescriptionRemoved();
validateHomeTimelineRemoved();
validatePapersHero();
validatePapersYearLabels();
validatePapersListHeaderRemoved();
validateChemTableVenueLink();
validateScholarSumVenueLink();
validateDataModelingPage();
validateDirectionsPageRemoved();
