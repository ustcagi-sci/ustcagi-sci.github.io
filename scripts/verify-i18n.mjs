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
  "science_of_ai/index.html",
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
  const navLinks = [...navMatch[1].matchAll(/<a\s+([^>]+)>/g)].map((match) => {
    const href = match[1].match(/href="([^"]+)"/)?.[1];
    const key = match[1].match(/data-i18n="([^"]+)"/)?.[1];
    return { key, href };
  });
  const navFallbacks = Object.fromEntries(
    [...navMatch[1].matchAll(/<a\s+[^>]*data-i18n="([^"]+)"[^>]*>([^<]+)<\/a>/g)].map((match) => [
      match[1],
      match[2].trim(),
    ])
  );

  assert.deepEqual(
    navKeys,
    ["nav.data", "nav.knowledge", "nav.aiScience", "nav.papers"],
    `${label}: navigation should match the main page link set`
  );

  const expectedLinks = {
    "index.html": [
      { key: "nav.data", href: "./data_modeling/" },
      { key: "nav.knowledge", href: "./knowledge_memory/" },
      { key: "nav.aiScience", href: "./science_of_ai/" },
      { key: "nav.papers", href: "./papers/" },
    ],
    "knowledge_memory/index.html": [
      { key: "nav.data", href: "../data_modeling/" },
      { key: "nav.knowledge", href: "./" },
      { key: "nav.aiScience", href: "../science_of_ai/" },
      { key: "nav.papers", href: "../papers/" },
    ],
    "data_modeling/index.html": [
      { key: "nav.data", href: "./" },
      { key: "nav.knowledge", href: "../knowledge_memory/" },
      { key: "nav.aiScience", href: "../science_of_ai/" },
      { key: "nav.papers", href: "../papers/" },
    ],
    "science_of_ai/index.html": [
      { key: "nav.data", href: "../data_modeling/" },
      { key: "nav.knowledge", href: "../knowledge_memory/" },
      { key: "nav.aiScience", href: "./" },
      { key: "nav.papers", href: "../papers/" },
    ],
    "papers/index.html": [
      { key: "nav.data", href: "../data_modeling/" },
      { key: "nav.knowledge", href: "../knowledge_memory/" },
      { key: "nav.aiScience", href: "../science_of_ai/" },
      { key: "nav.papers", href: "./" },
    ],
  };

  assert.deepEqual(
    navLinks,
    expectedLinks[relativePath],
    `${label}: navigation hrefs should resolve correctly from this page`
  );

  const currentMatches = [...navMatch[1].matchAll(/aria-current="page"[^>]*data-i18n="([^"]+)"/g)].map(
    (match) => match[1]
  );
  const expectedCurrent = {
    "knowledge_memory/index.html": "nav.knowledge",
    "data_modeling/index.html": "nav.data",
    "science_of_ai/index.html": "nav.aiScience",
    "papers/index.html": "nav.papers",
  }[relativePath];

  assert.deepEqual(
    currentMatches,
    expectedCurrent ? [expectedCurrent] : [],
    `${label}: active navigation marker should match the current page`
  );

  assert.equal(
    context.translations.en["nav.knowledge"],
    "Scientific Knowledge Discovery",
    `${label}: English knowledge navigation label should be Scientific Knowledge Discovery`
  );
  assert.equal(
    context.translations.zh["nav.knowledge"],
    "科学知识发现",
    `${label}: Chinese knowledge navigation label should be 科学知识发现`
  );
  assert.equal(
    context.translations.en["nav.data"],
    "Scientific Task Solving",
    `${label}: English data navigation label should be Scientific Task Solving`
  );
  assert.equal(
    context.translations.zh["nav.data"],
    "科学任务求解",
    `${label}: Chinese data navigation label should be 科学任务求解`
  );
  assert.equal(navFallbacks["nav.data"], "科学任务求解", `${label}: data navigation fallback should be 科学任务求解`);
  assert.equal(
    navFallbacks["nav.knowledge"],
    "科学知识发现",
    `${label}: knowledge navigation fallback should be 科学知识发现`
  );
  assert.equal(
    context.translations.en["nav.aiScience"],
    "Science of AI",
    `${label}: English AI science navigation label should be Science of AI`
  );
  assert.equal(
    context.translations.zh["nav.aiScience"],
    "人工智能科学",
    `${label}: Chinese AI science navigation label should be 人工智能科学`
  );
  assert.equal(
    navFallbacks["nav.aiScience"],
    "人工智能科学",
    `${label}: AI science navigation fallback should be 人工智能科学`
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

const validateFooterTitleRemoved = (relativePath) => {
  const html = readFileSync(resolve(root, relativePath), "utf8");
  const label = relativePath;
  const objectMatch = html.match(
    /const translations = (\{[\s\S]*?\n      \});\n\n      const getStoredLanguage/
  );
  const context = {};

  assert.ok(!/data-i18n="footer\.title"/.test(html), `${label}: footer title should be removed`);
  assert.ok(
    !/中国科学技术大学 认知智能全国重点实验室 AGI研究组/.test(html),
    `${label}: Chinese footer title should be removed`
  );

  assert.ok(objectMatch, `${label}: missing translations object`);
  vm.runInNewContext(`translations = ${objectMatch[1]};`, context);

  for (const language of ["en", "zh"]) {
    assert.equal(
      context.translations[language]["footer.title"],
      undefined,
      `${label}: stale ${language} footer title translation should be removed`
    );
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

const validateHomeMeaningsModule = () => {
  const html = readFileSync(resolve(root, "index.html"), "utf8");
  const objectMatch = html.match(
    /const translations = (\{[\s\S]*?\n      \});\n\n      const getStoredLanguage/
  );
  const context = {};
  const sectionMatches = [...html.matchAll(/<section id="ai4science-meanings" class="section">([\s\S]*?)<\/section>/g)];
  const meaningsIndex = html.indexOf('<section id="ai4science-meanings"');
  const hierarchyIndex = html.indexOf('<section id="hierarchy"');
  const dataModelingIndex = html.indexOf('<section id="data-modeling"');
  const expectedTranslations = {
    en: {
      "meanings.title": "Three Meanings of AI for Science",
      "meanings.description":
        "This site organizes AI for Science into three related levels: using AI to solve scientific tasks, using AI to support scientific discovery, and studying AI itself as a scientific system.",
      "meanings.tasks.title": "AI for Scientific Task Solving",
      "meanings.tasks.description":
        "Develop and evaluate AI methods for scientific problems with explicit objectives and evaluation criteria, including equation solving, molecular design, protein structure prediction, and scientific image analysis.",
      "meanings.discovery.title": "AI for Scientific Discovery",
      "meanings.discovery.description":
        "Integrate data, literature, and experimental evidence to identify candidate laws, mechanisms, invariants, and testable hypotheses, together with their validity conditions and uncertainty.",
      "meanings.science.title": "Science of AI",
      "meanings.science.description":
        "Treat AI systems as empirical and theoretical objects of scientific inquiry, and study scaling, emergence, learning dynamics, and the structure of intelligence.",
    },
    zh: {
      "meanings.title": "AI for Science 的三层涵义",
      "meanings.description":
        "本站将 AI for Science 的研究内涵概括为三个相互关联的层次：用 AI 求解科学任务、用 AI 支持科学发现，以及把 AI 本身作为科学系统进行研究。",
      "meanings.tasks.title": "面向科学任务求解的AI",
      "meanings.tasks.description":
        "面向目标与评价标准相对明确的科学问题，研究并评估方程求解、分子设计、蛋白质结构预测和科学影像分析等任务中的 AI 方法。",
      "meanings.discovery.title": "面向科学规律新发现的AI",
      "meanings.discovery.description":
        "综合数据、文献和实验依据，识别候选规律、机制、守恒关系与可检验假设，同时刻画其成立条件和不确定性。",
      "meanings.science.title": "Science of AI",
      "meanings.science.description":
        "将 AI 系统作为可观测、可实验和可建模的研究对象，考察规模扩展、能力涌现、学习动力学与智能结构。",
    },
  };

  assert.equal(sectionMatches.length, 1, "index.html: homepage should contain exactly one AI for Science meanings section");
  const meaningsSection = sectionMatches[0][1];
  assert.equal(
    (meaningsSection.match(/<article class="card direction-card">/g) || []).length,
    3,
    "index.html: AI for Science meanings section should contain exactly three cards"
  );
  assert.ok(meaningsIndex >= 0, "index.html: missing AI for Science meanings section");
  assert.ok(dataModelingIndex > meaningsIndex, "index.html: data modeling section should follow the meanings section");
  assert.ok(hierarchyIndex > dataModelingIndex, "index.html: hierarchy section should follow the data modeling section");

  assert.ok(objectMatch, "index.html: missing translations object");
  vm.runInNewContext(`translations = ${objectMatch[1]};`, context);

  const visibleFallbacks = Object.fromEntries(
    [...meaningsSection.matchAll(/<(h2|h3|p)[^>]*data-i18n="([^"]+)"[^>]*>([\s\S]*?)<\/\1>/g)].map(
      ([, , key, value]) => [key, value.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim()]
    )
  );

  for (const language of ["en", "zh"]) {
    for (const [key, value] of Object.entries(expectedTranslations[language])) {
      assert.equal(
        context.translations[language][key],
        value,
        `index.html: ${language} translation should match for ${key}`
      );
    }
  }

  for (const [key, value] of Object.entries(expectedTranslations.en)) {
    assert.equal(visibleFallbacks[key], value, `index.html: visible fallback should match English translation for ${key}`);
  }
};

const validateHomeResearchPurposeModule = () => {
  const html = readFileSync(resolve(root, "index.html"), "utf8");
  const objectMatch = html.match(
    /const translations = (\{[\s\S]*?\n      \});\n\n      const getStoredLanguage/
  );
  const context = {};
  const sectionMatches = [...html.matchAll(/<section id="research-purpose" class="section highlights">([\s\S]*?)<\/section>/g)];
  const meaningsIndex = html.indexOf('<section id="ai4science-meanings"');
  const purposeIndex = html.indexOf('<section id="research-purpose"');
  const hierarchyIndex = html.indexOf('<section id="hierarchy"');
  const dataModelingIndex = html.indexOf('<section id="data-modeling"');
  const expectedTranslations = {
    en: {
      "researchPurpose.title": "Purposes of Scientific Research",
      "researchPurpose.description":
        "Scientific research seeks testable explanations of natural and complex systems while developing knowledge and methods for real-world problems; these aims inform and constrain each other.",
      "researchPurpose.fundamental.title": "Discover Fundamental Laws",
      "researchPurpose.fundamental.description":
        "Use observation, experimentation, and theoretical modeling to formulate testable explanations, then establish their reproducibility, scope, and limitations through repeated validation.",
      "researchPurpose.practical.title": "Solve Practical Problems",
      "researchPurpose.practical.description":
        "Translate scientific understanding into verifiable models, methods, and engineering solutions for problems in manufacturing, materials, aerospace, and other domains.",
    },
    zh: {
      "researchPurpose.title": "科学研究的目的",
      "researchPurpose.description":
        "科学研究既旨在形成对自然与复杂系统的可检验解释，也旨在发展解决现实问题的知识与方法；两类目标相互促进，也相互约束。",
      "researchPurpose.fundamental.title": "寻求基本规律",
      "researchPurpose.fundamental.description":
        "通过观测、实验与理论建模提出可检验的解释，并在重复验证与边界分析中明确其可重复性、适用范围和局限。",
      "researchPurpose.practical.title": "解决实际问题",
      "researchPurpose.practical.description":
        "将科学认识转化为可验证的模型、方法与工程方案，用于解决制造、材料、航空航天等领域的实际问题。",
    },
  };

  assert.equal(sectionMatches.length, 1, "index.html: homepage should contain exactly one scientific research purpose section");
  const purposeSection = sectionMatches[0][1];
  assert.equal(
    (purposeSection.match(/<article class="system-panel(?: highlight)?">/g) || []).length,
    2,
    "index.html: scientific research purpose section should contain exactly two cards"
  );
  assert.ok(purposeIndex >= 0, "index.html: missing scientific research purpose section");
  assert.ok(/<main>\s*<section id="research-purpose"/.test(html), "index.html: research purpose section should be the first homepage module");
  assert.ok(meaningsIndex > purposeIndex, "index.html: meanings section should follow the research purpose section");
  assert.ok(dataModelingIndex > meaningsIndex, "index.html: data modeling section should follow the meanings section");
  assert.ok(hierarchyIndex > dataModelingIndex, "index.html: hierarchy section should follow the data modeling section");

  assert.ok(objectMatch, "index.html: missing translations object");
  vm.runInNewContext(`translations = ${objectMatch[1]};`, context);

  const visibleFallbacks = Object.fromEntries(
    [...purposeSection.matchAll(/<(h2|h3|p)[^>]*data-i18n="([^"]+)"[^>]*>([\s\S]*?)<\/\1>/g)].map(
      ([, , key, value]) => [key, value.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim()]
    )
  );

  for (const language of ["en", "zh"]) {
    for (const [key, value] of Object.entries(expectedTranslations[language])) {
      assert.equal(
        context.translations[language][key],
        value,
        `index.html: ${language} translation should match for ${key}`
      );
    }
  }

  for (const [key, value] of Object.entries(expectedTranslations.en)) {
    assert.equal(visibleFallbacks[key], value, `index.html: visible fallback should match English translation for ${key}`);
  }
};

const validateHomeDataModelingModule = () => {
  const html = readFileSync(resolve(root, "index.html"), "utf8");
  const objectMatch = html.match(
    /const translations = (\{[\s\S]*?\n      \});\n\n      const getStoredLanguage/
  );
  const context = {};
  const meaningsIndex = html.indexOf('<section id="ai4science-meanings"');
  const dataModelingIndex = html.indexOf('<section id="data-modeling"');
  const hierarchyIndex = html.indexOf('<section id="hierarchy"');
  const expectedTranslations = {
    en: {
      "dataModeling.title": "Scientific Task Solving: Complex Dynamic Systems Cognition",
      "dataModeling.description":
        "For tables, time series, experimental records, and observational data, we study representations and predictive methods that respect variable semantics, experimental conditions, and domain constraints, providing testable and reusable foundations for scientific task solving.",
      "dataModeling.tabular.title": "Tabular Data",
      "dataModeling.tabular.description":
        "For property tables, experimental matrices, materials and molecular property sheets, and scientific records, study learning and uncertainty estimation under small samples, missing values, heterogeneous fields, distribution shifts, and domain constraints.",
      "dataModeling.series.title": "Time Series",
      "dataModeling.series.description":
        "For experimental curves, sensor sequences, simulation trajectories, and observation streams, characterize multiscale trends, periodicity, abrupt changes, temporal dependencies, and dynamics, while evaluating reliability under extrapolation and distribution shift.",
      "dataModeling.cta": "Learn Scientific Data Modeling",
    },
    zh: {
      "dataModeling.title": "科学任务求解：复杂动态系统认知",
      "dataModeling.description":
        "面向表格、时间序列、实验记录与观测数据，研究符合变量语义、实验条件和领域约束的表示学习与预测方法，为科学任务求解提供可检验、可复用的模型基础。",
      "dataModeling.tabular.title": "Tabular Data",
      "dataModeling.tabular.description":
        "面向属性表、实验矩阵、材料/分子性质表和科学记录，研究小样本、缺失值、异构字段、分布偏移与领域约束下的学习和不确定性估计。",
      "dataModeling.series.title": "Time Series",
      "dataModeling.series.description":
        "面向实验曲线、传感器序列、仿真轨迹和观测流，刻画多尺度趋势、周期、突变、时序依赖与动态过程，并评估模型在外推和分布变化下的可靠性。",
      "dataModeling.cta": "了解科学数据建模",
    },
  };

  assert.ok(meaningsIndex >= 0, "index.html: missing AI for Science meanings module");
  assert.ok(dataModelingIndex > meaningsIndex, "index.html: data modeling module should follow the meanings module");
  assert.ok(hierarchyIndex > dataModelingIndex, "index.html: hierarchy section should appear after the data modeling module");
  assert.ok(/<section id="data-modeling" class="section highlights">/.test(html), "index.html: missing homepage data modeling module");
  assert.ok(
    /<h2 data-i18n="dataModeling\.title">科学任务求解：复杂动态系统认知<\/h2>/.test(html),
    "index.html: data modeling module title should be 科学任务求解：复杂动态系统认知"
  );
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
    /<h2 data-i18n="hierarchy\.title">科学知识发现：科技文献认知<\/h2>/.test(html),
    "index.html: hierarchy title should be 科学知识发现：科技文献认知"
  );

  assert.ok(objectMatch, "index.html: missing translations object");
  vm.runInNewContext(`translations = ${objectMatch[1]};`, context);
  assert.equal(
    context.translations.en["hierarchy.title"],
    "Scientific Knowledge Discovery: Scientific Literature Cognition",
    "index.html: English hierarchy title should lead with Scientific Knowledge Discovery"
  );
  assert.equal(
    context.translations.zh["hierarchy.title"],
    "科学知识发现：科技文献认知",
    "index.html: Chinese hierarchy title should lead with 科学知识发现"
  );
};

const validateHomeAcademicCopy = () => {
  const html = readFileSync(resolve(root, "index.html"), "utf8");
  const objectMatch = html.match(
    /const translations = (\{[\s\S]*?\n      \});\n\n      const getStoredLanguage/
  );
  const context = {};
  const expectedTranslations = {
    en: {
      "meta.description":
        "USTC AGI research on scientific task solving, scientific knowledge discovery, and the Science of AI.",
      "hero.subtitle":
        "We study foundational questions and methods in structured data modeling, evidence-based reasoning, and intelligent systems across scientific task solving, scientific knowledge discovery, and the Science of AI, with a focus on large language models and agentic methods.",
      "hierarchy.description":
        "We organize scientific-literature cognition into five levels: retrieval, structural parsing, information extraction, evidence synthesis, and the formulation of testable hypotheses.",
      "hierarchy.l1.description":
        "Retrieve and trace literature relevant to an explicit research question, preserving query and citation-expansion paths.",
      "hierarchy.l2.description":
        "Parse text, tables, formulas, and figures into structured representations while preserving their document context.",
      "hierarchy.l3.description":
        "Extract research questions, methods, data, findings, and the evidential relations among them.",
      "hierarchy.l4.description":
        "Compare evidence across papers to identify agreement, conflict, applicability limits, and knowledge gaps.",
      "hierarchy.l5.description":
        "Formulate falsifiable hypotheses and validation plans from existing evidence; this remains a long-term research direction.",
      "projects.paperscout.description":
        "A research agent that plans search, citation expansion, and evidence screening around a scientific question, producing a traceable literature set through iterative interaction.",
      "projects.chemtable.description":
        "A benchmark for evaluating multimodal models on structural recognition, symbolic parsing, and semantic understanding of real-world chemical tables, including formulas, table relations, and molecular diagrams.",
      "projects.scholarsum.description":
        "A scientific summarization method combining knowledge-graph reasoning and reflective refinement, with emphasis on consistency among methods, evidence, and conclusions.",
      "projects.paperarena.description":
        "A benchmark designed to evaluate retrieval, evidence integration, and reasoning by tool-augmented agents across multiple scientific papers.",
      "projects.mind2report.description":
        "A deep-research agent for complex research questions that uses intent-guided retrieval and iterative synthesis to produce evidence-supported analytical reports.",
      "projects.vision.title": "Research Intelligence Vision",
      "projects.vision.description":
        "Our long-term objective is to develop research agents that identify knowledge gaps under evidential constraints, formulate falsifiable hypotheses, and propose validation plans.",
      "projects.vision.status": "Long-term Research",
    },
    zh: {
      "meta.description":
        "中国科大 AGI 团队的 AI for Science 研究主页，聚焦科学任务求解、科学知识发现与人工智能科学。",
      "hero.subtitle":
        "聚焦大语言模型与智能体方法，围绕科学任务求解、科学知识发现和人工智能科学，研究结构化数据建模、证据推理与智能系统的基础问题和关键方法。",
      "hierarchy.description":
        "本站以五层框架组织科技文献认知能力：从文献检索与结构解析，逐步走向信息抽取、证据综合和可检验假设的形成。",
      "hierarchy.l1.description":
        "围绕明确的科研问题检索并追踪相关文献，保留查询与引用扩展路径。",
      "hierarchy.l2.description":
        "解析正文、表格、公式与图像，在保留文档上下文的同时形成结构化表示。",
      "hierarchy.l3.description":
        "抽取研究问题、方法、数据、结论及其相互之间的证据关系。",
      "hierarchy.l4.description":
        "跨文献比较证据，识别一致性、冲突、适用边界与知识缺口。",
      "hierarchy.l5.description":
        "依据已有证据提出可证伪假设与验证方案；该能力仍属于长期研究方向。",
      "projects.paperscout.description":
        "围绕科研问题规划检索、引用扩展与证据筛选，并在多轮交互中形成可追踪的文献集合。",
      "projects.chemtable.description":
        "用于评估多模态模型对真实化学表格的结构识别、符号解析与语义理解能力，覆盖化学公式、表格关系和分子图示。",
      "projects.scholarsum.description":
        "结合知识图谱推理与反思式优化生成科学摘要，重点考察方法、证据与结论之间的一致性。",
      "projects.paperarena.description":
        "用于评估工具增强智能体在多篇科学文献上的检索、证据整合与推理能力。",
      "projects.mind2report.description":
        "面向复杂研究问题的深度研究智能体，通过意图驱动检索与迭代综合生成具有证据支撑的分析报告。",
      "projects.vision.title": "科研智能愿景",
      "projects.vision.description":
        "长期目标是研究能够在证据约束下识别知识缺口、提出可证伪假设并形成验证方案的科研智能体。",
      "projects.vision.status": "长期研究",
    },
  };

  assert.ok(objectMatch, "index.html: missing translations object");
  vm.runInNewContext(`translations = ${objectMatch[1]};`, context);

  for (const language of ["en", "zh"]) {
    for (const [key, value] of Object.entries(expectedTranslations[language])) {
      assert.equal(
        context.translations[language][key],
        value,
        `index.html: ${language} academic copy should match for ${key}`
      );
    }
  }

  assert.ok(
    /<meta\s+name="description"\s+content="中国科大 AGI 团队的 AI for Science 研究主页，聚焦科学任务求解、科学知识发现与人工智能科学。"\s*\/>/.test(html),
    "index.html: static metadata should use the revised academic framing"
  );
  assert.ok(
    !/(协同突破|范式突破|终极目标|专家级报告|普遍动力学|高保真)/.test(html),
    "index.html: homepage copy should avoid promotional or overconfident claims"
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

const validateHomeScienceOfAiModule = () => {
  const html = readFileSync(resolve(root, "index.html"), "utf8");
  const objectMatch = html.match(
    /const translations = (\{[\s\S]*?\n      \});\n\n      const getStoredLanguage/
  );
  const context = {};
  const hierarchyIndex = html.indexOf('<section id="hierarchy"');
  const scienceIndex = html.indexOf('<section id="science-of-ai"');
  const mainEndIndex = html.indexOf("</main>");
  const sectionMatch = html.match(/<section id="science-of-ai"[\s\S]*?<\/section>/);
  const expectedTranslations = {
    en: {
      "scienceOfAi.title": "Science of AI",
      "scienceOfAi.description":
        "Treat AI systems as complex scientific objects: study scaling, emergence, learning dynamics, and the structure of intelligence, while developing testable descriptive variables and theories.",
      "scienceOfAi.scaling.title": "Scaling and Emergence",
      "scienceOfAi.scaling.description":
        "Test when scaling laws hold, whether apparent emergence is continuous or transition-like, and how conclusions depend on metrics, data, and training regimes.",
      "scienceOfAi.learning.title": "Learning and Intelligence Mechanisms",
      "scienceOfAi.learning.description":
        "Analyze how reinforcement learning and in-context learning alter model behavior, and test whether memory, compression, prediction, and intelligence admit a shared description.",
      "scienceOfAi.agents.title": "Agents and Multi-Agent Systems",
      "scienceOfAi.agents.description":
        "Compare mechanisms in artificial and human intelligence, and test for transferable dynamical patterns in agent collaboration, autonomy, and collective behavior.",
      "scienceOfAi.cta": "Explore Science of AI",
    },
    zh: {
      "scienceOfAi.title": "Science of AI",
      "scienceOfAi.description":
        "将 AI 系统作为复杂科学对象，研究规模扩展、能力涌现、学习动力学与智能结构，并发展可检验的描述变量和理论。",
      "scienceOfAi.scaling.title": "规模与涌现",
      "scienceOfAi.scaling.description":
        "检验 Scaling Law 在何种条件下成立、表观涌现是连续变化还是类临界跃迁，以及结论如何依赖评价指标、数据与训练过程。",
      "scienceOfAi.learning.title": "学习与智能机制",
      "scienceOfAi.learning.description":
        "分析强化学习与上下文学习如何改变模型行为，并检验记忆、压缩、预测与智能能否获得统一描述。",
      "scienceOfAi.agents.title": "Agent 与群体智能体",
      "scienceOfAi.agents.description":
        "比较人工智能与人类智能的相关机制，并检验 Agent 协作、自主性和群体行为中是否存在可迁移的动力学模式。",
      "scienceOfAi.cta": "探索 Science of AI",
    },
  };

  assert.ok(sectionMatch, "index.html: missing homepage Science of AI module");
  assert.ok(scienceIndex > hierarchyIndex, "index.html: Science of AI module should follow the hierarchy module");
  assert.ok(mainEndIndex > scienceIndex, "index.html: Science of AI module should remain inside main");
  assert.equal(
    (sectionMatch?.[0].match(/<article class="card direction-card">/g) || []).length,
    3,
    "index.html: Science of AI module should contain three research themes"
  );
  assert.ok(
    /href="\.\/science_of_ai\/" data-i18n="scienceOfAi\.cta"/.test(sectionMatch?.[0] || ""),
    "index.html: Science of AI module should link to its subpage"
  );

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

const validateHomeAiForScienceImportanceRemoved = () => {
  const html = readFileSync(resolve(root, "index.html"), "utf8");
  const objectMatch = html.match(
    /const translations = (\{[\s\S]*?\n      \});\n\n      const getStoredLanguage/
  );
  const context = {};

  assert.ok(!/<section id="ai4science-importance"/.test(html), "index.html: AI for Science importance section should be removed");
  assert.ok(!/data-i18n="importance\./.test(html), "index.html: importance translation markers should be removed");

  assert.ok(objectMatch, "index.html: missing translations object");
  vm.runInNewContext(`translations = ${objectMatch[1]};`, context);

  for (const language of ["en", "zh"]) {
    for (const key of Object.keys(context.translations[language])) {
      assert.ok(
        !key.startsWith("importance."),
        `index.html: stale ${language} importance translation should be removed for ${key}`
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
  assert.ok(!/class="hero-actions"/.test(heroMatch[1]), "papers/index.html: hero GitHub action row should be removed");
  assert.ok(!/>GitHub<\/a>/.test(heroMatch[1]), "papers/index.html: hero GitHub button should be removed");
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

const validatePapersFooterDescriptionRemoved = () => {
  const html = readFileSync(resolve(root, "papers/index.html"), "utf8");
  const objectMatch = html.match(
    /const translations = (\{[\s\S]*?\n      \});\n\n      const getStoredLanguage/
  );
  const context = {};

  assert.ok(
    !/data-i18n="footer\.description"/.test(html),
    "papers/index.html: footer description text should be removed"
  );
  assert.ok(
    !/我们欢迎围绕科学文献挖掘、多模态解析和自主研究智能体展开合作。/.test(html),
    "papers/index.html: Chinese footer description should be removed"
  );
  assert.ok(
    !/We welcome collaborations on AI for scientific literature mining, multimodal parsing, and autonomous research agents\./.test(html),
    "papers/index.html: English footer description should be removed"
  );

  assert.ok(objectMatch, "papers/index.html: missing translations object");
  vm.runInNewContext(`translations = ${objectMatch[1]};`, context);

  for (const language of ["en", "zh"]) {
    assert.equal(
      context.translations[language]["footer.description"],
      undefined,
      `papers/index.html: stale ${language} footer description translation should be removed`
    );
  }
};

const validateChemTableVenueLink = () => {
  const html = readFileSync(resolve(root, "papers/index.html"), "utf8");
  const objectMatch = html.match(
    /const translations = (\{[\s\S]*?\n      \});\n\n      const getStoredLanguage/
  );
  const context = {};
  const chemTableMatch = html.match(
    /<p class="paper-meta" data-i18n="papers\.chemtable\.meta">([^<]+)<\/p>\s*<h3>Benchmarking Multimodal LLMs on Recognition and Understanding over Chemical Tables<\/h3>[\s\S]*?<div class="paper-links">([\s\S]*?)<\/div>/
  );

  assert.ok(chemTableMatch, "papers/index.html: missing ChemTable paper links");
  assert.equal(
    chemTableMatch[1],
    "2025 · KDD 2026 Accepted · L2 Element Interpretation",
    "papers/index.html: ChemTable visible metadata should show KDD 2026 acceptance"
  );
  assert.ok(
    /href="https:\/\/arxiv\.org\/abs\/2506\.11375v2"[\s\S]*?>KDD2026<\/a>/.test(chemTableMatch[2]),
    "papers/index.html: ChemTable venue link should be labeled KDD2026"
  );

  assert.ok(objectMatch, "papers/index.html: missing translations object");
  vm.runInNewContext(`translations = ${objectMatch[1]};`, context);
  assert.equal(
    context.translations.en["papers.chemtable.meta"],
    "2025 · KDD 2026 Accepted · L2 Element Interpretation",
    "papers/index.html: English ChemTable metadata should show KDD 2026 acceptance"
  );
  assert.equal(
    context.translations.zh["papers.chemtable.meta"],
    "2025 · KDD 2026 已接收 · L2 元素解析",
    "papers/index.html: Chinese ChemTable metadata should show KDD 2026 acceptance"
  );
};

const validateScholarSumVenueLink = () => {
  const html = readFileSync(resolve(root, "papers/index.html"), "utf8");
  const objectMatch = html.match(
    /const translations = (\{[\s\S]*?\n      \});\n\n      const getStoredLanguage/
  );
  const context = {};
  const expectedAuthors = "Bohou Zhang*, Xiaoyu Tao*, Mingyue Cheng†, Huijie Liu, Qi Liu";
  const scholarSumMatch = html.match(
    /<p class="paper-meta" data-i18n="papers\.scholarsum\.meta">([^<]+)<\/p>\s*<h3>ScholarSum: Student-Teacher Abstractive Summarization via Knowledge Graph Reasoning and Reflective Refinement<\/h3>([\s\S]*?)<div class="paper-links">([\s\S]*?)<\/div>/
  );

  assert.ok(scholarSumMatch, "papers/index.html: missing ScholarSum paper links");
  assert.equal(
    scholarSumMatch[1],
    "2025 · IJCAI 2026 Accepted · L3 Information Extraction",
    "papers/index.html: ScholarSum visible metadata should show IJCAI 2026 acceptance"
  );
  assert.ok(
    scholarSumMatch[2].includes(expectedAuthors),
    "papers/index.html: ScholarSum card should show author information"
  );
  assert.ok(
    !/Anonymous authors under double-blind review|双盲审稿匿名作者/.test(scholarSumMatch[2]),
    "papers/index.html: ScholarSum card should not use anonymous author placeholder"
  );
  assert.ok(
    /href="https:\/\/openreview\.net\/pdf\?id=pLvGIKeZtJ"[\s\S]*?>IJCAI2026<\/a>/.test(scholarSumMatch[3]),
    "papers/index.html: ScholarSum venue link should be labeled IJCAI2026"
  );

  assert.ok(objectMatch, "papers/index.html: missing translations object");
  vm.runInNewContext(`translations = ${objectMatch[1]};`, context);

  assert.equal(
    context.translations.en["papers.scholarsum.meta"],
    "2025 · IJCAI 2026 Accepted · L3 Information Extraction",
    "papers/index.html: English ScholarSum metadata should show IJCAI 2026 acceptance"
  );
  assert.equal(
    context.translations.zh["papers.scholarsum.meta"],
    "2025 · IJCAI 2026 已接收 · L3 信息抽取",
    "papers/index.html: Chinese ScholarSum metadata should show IJCAI 2026 acceptance"
  );

  for (const language of ["en", "zh"]) {
    assert.equal(
      context.translations[language]["papers.scholarsum.authors"],
      expectedAuthors,
      `papers/index.html: ${language} ScholarSum authors should match arXiv author list`
    );
  }
};

const validateKnowledgeDiscoveryPage = () => {
  const html = readFileSync(resolve(root, "knowledge_memory/index.html"), "utf8");
  const heroMatch = html.match(/<header id="top" class="hero">([\s\S]*?)<\/header>/);
  const discoveryMatch = html.match(/<section id="discovery-loop"[\s\S]*?<\/section>/);
  const researchLoopMatch = html.match(/<section id="research-loop"[\s\S]*?<\/section>/);
  const objectMatch = html.match(
    /const translations = (\{[\s\S]*?\n      \});\n\n      const getStoredLanguage/
  );
  const context = {};

  assert.ok(heroMatch, "knowledge_memory/index.html: missing hero section");
  assert.ok(
    /<h1 data-i18n="hero\.title">科学知识发现<\/h1>/.test(heroMatch[1]),
    "knowledge_memory/index.html: hero should introduce scientific knowledge discovery"
  );
  assert.ok(
    !/class="eyebrow"/.test(heroMatch[1]),
    "knowledge_memory/index.html: hero eyebrow button should be removed"
  );
  assert.ok(
    !/data-i18n="hero\.eyebrow"/.test(heroMatch[1]),
    "knowledge_memory/index.html: removed hero eyebrow should not be translatable"
  );
  assert.ok(
    !/class="hero-actions"/.test(heroMatch[1]),
    "knowledge_memory/index.html: hero GitHub action row should be removed"
  );
  assert.ok(
    !/>GitHub<\/a>/.test(heroMatch[1]),
    "knowledge_memory/index.html: hero GitHub button should be removed"
  );
  assert.ok(
    /<h2 data-i18n="intro\.title">科学知识发现是 AI for Science 的第二层<\/h2>/.test(html),
    "knowledge_memory/index.html: introduction should position knowledge discovery as the second layer"
  );
  assert.ok(
    /<h2 data-i18n="position\.title">从知识获取走向科学知识发现<\/h2>/.test(html),
    "knowledge_memory/index.html: positioning should advance from acquisition to discovery"
  );
  assert.ok(discoveryMatch, "knowledge_memory/index.html: missing evidence-to-discovery loop");
  assert.equal(
    (discoveryMatch[0].match(/data-i18n="discovery\.(?:evidence|synthesis|pattern|hypothesis)\.title"/g) || [])
      .length,
    4,
    "knowledge_memory/index.html: discovery loop should contain four stages"
  );
  assert.ok(
    /<h2 data-i18n="discovery\.title">从证据获取到可验证的新知识<\/h2>/.test(discoveryMatch[0]),
    "knowledge_memory/index.html: discovery loop should foreground verifiable new knowledge"
  );
  assert.ok(researchLoopMatch, "knowledge_memory/index.html: missing task-solving and discovery research loop");
  assert.ok(
    /规律发现 → 假设提出 → 实验验证 → 知识形成/.test(researchLoopMatch[0]),
    "knowledge_memory/index.html: research loop should include discovery, hypothesis, validation, and knowledge formation"
  );

  assert.ok(objectMatch, "knowledge_memory/index.html: missing translations object");
  vm.runInNewContext(`translations = ${objectMatch[1]};`, context);
  assert.equal(
    context.translations.en["meta.title"],
    "Scientific Knowledge Discovery",
    "knowledge_memory/index.html: English metadata should match the knowledge-discovery scope"
  );
  assert.equal(
    context.translations.zh["meta.title"],
    "科学知识发现",
    "knowledge_memory/index.html: Chinese metadata should match the knowledge-discovery scope"
  );
  assert.equal(
    context.translations.en["intro.title"],
    "Scientific Knowledge Discovery Is the Second Layer of AI for Science",
    "knowledge_memory/index.html: English introduction should match the second-layer framing"
  );
  assert.equal(
    context.translations.zh["intro.title"],
    "科学知识发现是 AI for Science 的第二层",
    "knowledge_memory/index.html: Chinese introduction should match the second-layer framing"
  );
  assert.equal(
    context.translations.en["researchLoop.path.text"],
    "Regularity discovery → hypothesis generation → experimental validation → knowledge formation",
    "knowledge_memory/index.html: English research loop should be synchronized"
  );
  assert.equal(
    context.translations.zh["researchLoop.path.text"],
    "规律发现 → 假设提出 → 实验验证 → 知识形成",
    "knowledge_memory/index.html: Chinese research loop should be synchronized"
  );
  assert.equal(
    context.translations.en["hero.eyebrow"],
    undefined,
    "knowledge_memory/index.html: stale English hero eyebrow translation should be removed"
  );
  assert.equal(
    context.translations.zh["hero.eyebrow"],
    undefined,
    "knowledge_memory/index.html: stale Chinese hero eyebrow translation should be removed"
  );
};

const validateDataModelingPage = () => {
  const html = readFileSync(resolve(root, "data_modeling/index.html"), "utf8");
  const objectMatch = html.match(
    /const translations = (\{[\s\S]*?\n      \});\n\n      const getStoredLanguage/
  );
  const applicationsMatch = html.match(/<section id="applications"[\s\S]*?<\/section>/);
  const relationshipMatch = html.match(/<section id="relationship"[\s\S]*?<\/section>/);
  const context = {};

  assert.ok(
    /<h1 data-i18n="hero\.title">科学任务求解<\/h1>/.test(html),
    "data_modeling/index.html: hero title should introduce scientific task solving"
  );
  assert.ok(
    !/data-i18n="hero\.eyebrow"/.test(html),
    "data_modeling/index.html: hero eyebrow button should be removed"
  );
  assert.ok(/Tabular Data/.test(html), "data_modeling/index.html: page should foreground tabular data modeling");
  assert.ok(/Time Series/.test(html), "data_modeling/index.html: page should foreground time series modeling");
  assert.ok(/结构化科学数据建模/.test(html), "data_modeling/index.html: Chinese copy should foreground structured scientific data modeling");
  assert.ok(
    /<h2 data-i18n="intro\.title">科学任务求解是 AI for Science 的基础层<\/h2>/.test(html),
    "data_modeling/index.html: introduction should position task solving as the foundation layer"
  );
  assert.ok(
    /<h2 data-i18n="capabilities\.title">从问题定义到验证反馈<\/h2>/.test(html),
    "data_modeling/index.html: capability section should present the scientific solution loop"
  );
  assert.ok(applicationsMatch, "data_modeling/index.html: missing representative scientific tasks section");
  assert.equal(
    (applicationsMatch[0].match(/data-i18n="applications\.(?:property|forecast|simulation|design)\.title"/g) || [])
      .length,
    4,
    "data_modeling/index.html: representative tasks section should contain four task families"
  );
  assert.ok(relationshipMatch, "data_modeling/index.html: missing AI for Science evolution section");
  assert.ok(
    /<h2 data-i18n="relationship\.title">从科学任务求解走向科学知识发现<\/h2>/.test(relationshipMatch[0]),
    "data_modeling/index.html: evolution section should connect task solving to knowledge discovery"
  );
  assert.ok(
    /科学任务自动化 → 科研流程自动化 → 新科学发现 → 科学范式形成/.test(relationshipMatch[0]),
    "data_modeling/index.html: evolution section should include the four-stage research intelligence path"
  );

  assert.ok(objectMatch, "data_modeling/index.html: missing translations object");
  vm.runInNewContext(`translations = ${objectMatch[1]};`, context);

  assert.equal(
    context.translations.en["nav.data"],
    "Scientific Task Solving",
    "data_modeling/index.html: English navigation label should name the new section"
  );
  assert.equal(
    context.translations.zh["nav.data"],
    "科学任务求解",
    "data_modeling/index.html: Chinese navigation label should name the new section"
  );
  assert.equal(
    context.translations.en["meta.title"],
    "Scientific Task Solving",
    "data_modeling/index.html: English metadata should match the task-solving scope"
  );
  assert.equal(
    context.translations.zh["meta.title"],
    "科学任务求解",
    "data_modeling/index.html: Chinese metadata should match the task-solving scope"
  );
  assert.equal(
    context.translations.en["intro.title"],
    "Scientific Task Solving Is the Foundation Layer of AI for Science",
    "data_modeling/index.html: English introduction should match the new foundation-layer framing"
  );
  assert.equal(
    context.translations.zh["intro.title"],
    "科学任务求解是 AI for Science 的基础层",
    "data_modeling/index.html: Chinese introduction should match the new foundation-layer framing"
  );
  assert.equal(
    context.translations.en["relationship.path.text"],
    "Scientific task automation → research workflow automation → new scientific discovery → scientific paradigm formation",
    "data_modeling/index.html: English evolution path should be synchronized"
  );
  assert.equal(
    context.translations.zh["relationship.path.text"],
    "科学任务自动化 → 科研流程自动化 → 新科学发现 → 科学范式形成",
    "data_modeling/index.html: Chinese evolution path should be synchronized"
  );
  assert.equal(
    context.translations.en["hero.eyebrow"],
    undefined,
    "data_modeling/index.html: stale English hero eyebrow translation should be removed"
  );
  assert.equal(
    context.translations.zh["hero.eyebrow"],
    undefined,
    "data_modeling/index.html: stale Chinese hero eyebrow translation should be removed"
  );
};

const validateScienceOfAiPage = () => {
  const html = readFileSync(resolve(root, "science_of_ai/index.html"), "utf8");
  const objectMatch = html.match(
    /const translations = (\{[\s\S]*?\n      \});\n\n      const getStoredLanguage/
  );
  const heroMatch = html.match(
    /<header id="top" class="hero static-hero">([\s\S]*?)<\/header>/
  );
  const foundationsMatch = html.match(
    /<section id="foundations"[\s\S]*?<\/section>/
  );
  const futureMatch = html.match(/<section id="future-questions"[\s\S]*?<\/section>/);
  const frameworkMatch = html.match(/<section id="framework"[\s\S]*?<\/section>/);
  const context = {};

  assert.ok(heroMatch, "science_of_ai/index.html: missing hero section");
  assert.ok(
    /<h1 data-i18n="hero\.title">AI 科学<\/h1>/.test(heroMatch[1]),
    "science_of_ai/index.html: hero should introduce AI 科学"
  );
  assert.ok(
    !/class="eyebrow"/.test(heroMatch[1]),
    "science_of_ai/index.html: hero should not include an eyebrow"
  );
  assert.ok(
    !/class="hero-actions"/.test(heroMatch[1]),
    "science_of_ai/index.html: hero should not include action buttons"
  );

  assert.ok(foundationsMatch, "science_of_ai/index.html: missing foundations section");
  assert.equal(
    (foundationsMatch[0].match(/<article class="hierarchy-step">/g) || []).length,
    5,
    "science_of_ai/index.html: foundations should contain five questions"
  );
  assert.ok(
    /Scaling Law 为什么出现？/.test(foundationsMatch[0]),
    "science_of_ai/index.html: missing scaling-law question"
  );
  assert.ok(
    /智能是否存在统一的数学结构？/.test(foundationsMatch[0]),
    "science_of_ai/index.html: missing unified-intelligence question"
  );

  assert.ok(
    /Science of AI 不能仅仅是“将已有物理理论套到神经网络上”/.test(html),
    "science_of_ai/index.html: page should define the boundary for new theory"
  );

  assert.ok(futureMatch, "science_of_ai/index.html: missing future questions section");
  assert.equal(
    (futureMatch[0].match(/<article class="card direction-card">/g) || []).length,
    6,
    "science_of_ai/index.html: future section should contain six questions"
  );
  assert.ok(
    /推理能力是否存在相变点？/.test(futureMatch[0]),
    "science_of_ai/index.html: missing reasoning phase-transition question"
  );
  assert.ok(
    /上下文学习为何能够在不更新参数时产生新能力？/.test(futureMatch[0]),
    "science_of_ai/index.html: missing in-context-learning question"
  );
  assert.ok(
    /Agent 系统的协作和自主性是否存在普遍动力学规律？/.test(futureMatch[0]),
    "science_of_ai/index.html: missing agent-dynamics question"
  );

  assert.ok(frameworkMatch, "science_of_ai/index.html: missing research framework section");
  assert.equal(
    (frameworkMatch[0].match(/<div class="stack-layer/g) || []).length,
    4,
    "science_of_ai/index.html: framework should contain four research lenses"
  );

  assert.ok(objectMatch, "science_of_ai/index.html: missing translations object");
  vm.runInNewContext(`translations = ${objectMatch[1]};`, context);

  const expectedTranslations = {
    en: {
      "hero.title": "Science of AI",
      "foundations.scaling.title": "Why Do Scaling Laws Appear?",
      "foundations.emergence.title": "Where Do Emergent Capabilities Come From?",
      "foundations.rl.title": "How Does Reinforcement Learning Change Model Behavior?",
      "foundations.structure.title": "Does Intelligence Have a Unified Mathematical Structure?",
      "foundations.shared.title": "What Mechanisms Are Shared by Artificial and Human Intelligence?",
      "theory.observable.label": "Observable",
      "theory.criticality.label": "Criticality",
      "theory.testable.label": "Theory",
      "future.question1.label": "Question 1",
      "future.question2.label": "Question 2",
      "future.question3.label": "Question 3",
      "future.question4.label": "Question 4",
      "future.question5.label": "Question 5",
      "future.question6.label": "Question 6",
      "future.macroscopic.title": "Can Intelligence Have Thermodynamics-Like Macroscopic Variables?",
      "future.phase.title": "Are There Phase-Transition Points in Reasoning Ability?",
      "future.emergence.title": "Is Capability Emergence Continuous or a Critical Transition?",
      "future.information.title": "Is There a Unified Law of Memory, Compression, and Prediction?",
      "future.icl.title": "Why Can In-Context Learning Create New Capabilities Without Parameter Updates?",
      "future.agents.title": "Do Agent Collaboration and Autonomy Follow Universal Dynamical Laws?",
      "framework.lens1.label": "Lens 1",
      "framework.lens2.label": "Lens 2",
      "framework.lens3.label": "Lens 3",
      "framework.lens4.label": "Lens 4",
      "framework.macroscopic.title": "Macroscopic Regularities",
      "framework.dynamics.title": "Learning Dynamics",
      "framework.information.title": "Information Mechanisms",
      "framework.collective.title": "Collective Intelligence"
    },
    zh: {
      "hero.title": "AI 科学",
      "foundations.scaling.title": "Scaling Law 为什么出现？",
      "foundations.emergence.title": "涌现能力从何而来？",
      "foundations.rl.title": "强化学习如何改变模型行为？",
      "foundations.structure.title": "智能是否存在统一的数学结构？",
      "foundations.shared.title": "人工智能与人类智能有哪些共同机制？",
      "theory.observable.label": "可观测量",
      "theory.criticality.label": "临界性",
      "theory.testable.label": "理论",
      "future.question1.label": "问题 1",
      "future.question2.label": "问题 2",
      "future.question3.label": "问题 3",
      "future.question4.label": "问题 4",
      "future.question5.label": "问题 5",
      "future.question6.label": "问题 6",
      "future.macroscopic.title": "智能是否具有类似热力学变量的宏观描述？",
      "future.phase.title": "推理能力是否存在相变点？",
      "future.emergence.title": "能力涌现是连续变化还是临界跃迁？",
      "future.information.title": "记忆、压缩、预测之间是否存在统一规律？",
      "future.icl.title": "上下文学习为何能够在不更新参数时产生新能力？",
      "future.agents.title": "Agent 系统的协作和自主性是否存在普遍动力学规律？",
      "framework.lens1.label": "视角 1",
      "framework.lens2.label": "视角 2",
      "framework.lens3.label": "视角 3",
      "framework.lens4.label": "视角 4",
      "framework.macroscopic.title": "宏观规律",
      "framework.dynamics.title": "学习动力学",
      "framework.information.title": "信息机制",
      "framework.collective.title": "集体智能"
    }
  };

  for (const [language, copy] of Object.entries(expectedTranslations)) {
    for (const [key, value] of Object.entries(copy)) {
      assert.equal(
        context.translations[language][key],
        value,
        `science_of_ai/index.html: unexpected ${language} translation for ${key}`
      );
    }
  }
};

const validateTabletNavigationStyles = () => {
  const css = readFileSync(resolve(root, "ref.css"), "utf8");
  const tabletStart = css.indexOf("@media (min-width: 761px) and (max-width: 1024px)");
  const mobileStart = css.indexOf("@media (max-width: 760px)");

  assert.ok(tabletStart >= 0, "ref.css: missing tablet navigation breakpoint");
  assert.ok(
    mobileStart > tabletStart,
    "ref.css: tablet navigation breakpoint should precede the mobile breakpoint"
  );

  const tabletRules = css.slice(tabletStart, mobileStart);
  assert.ok(
    /\.nav-inner\s*\{[\s\S]*?flex-direction:\s*column/.test(tabletRules),
    "ref.css: tablet navigation should stack below the logo"
  );
  assert.ok(
    /\.nav-links\s*\{[\s\S]*?flex-wrap:\s*wrap/.test(tabletRules),
    "ref.css: tablet navigation links should wrap"
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
  validateFooterTitleRemoved(page);
}

validateHomeHeroRefresh();
validateHomeAiForScienceImportanceRemoved();
validateHomeMeaningsModule();
validateHomeResearchPurposeModule();
validateHomeDataModelingModule();
validateHomeHierarchyTitle();
validateHomeAcademicCopy();
validateHomeProjectsIntegratedIntoHierarchy();
validateHomeScienceOfAiModule();
validateHomeVisionRemoved();
validateHomeFooterDescriptionRemoved();
validateHomeTimelineRemoved();
validatePapersHero();
validatePapersYearLabels();
validatePapersListHeaderRemoved();
validatePapersFooterDescriptionRemoved();
validateChemTableVenueLink();
validateScholarSumVenueLink();
validateKnowledgeDiscoveryPage();
validateDataModelingPage();
validateScienceOfAiPage();
validateTabletNavigationStyles();
validateDirectionsPageRemoved();
