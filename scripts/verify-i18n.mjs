import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const pages = ["index.html", "knowledge_memory/index.html", "directions/index.html", "papers/index.html"];

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

  assert.ok(navMatch, `${label}: missing navigation links`);

  const navKeys = [...navMatch[1].matchAll(/data-i18n="([^"]+)"/g)].map((match) => match[1]);

  assert.deepEqual(
    navKeys,
    ["nav.directions", "nav.knowledge", "nav.papers"],
    `${label}: navigation should match the main page link set`
  );

  const currentMatches = [...navMatch[1].matchAll(/aria-current="page"[^>]*data-i18n="([^"]+)"/g)].map(
    (match) => match[1]
  );
  const expectedCurrent = {
    "directions/index.html": "nav.directions",
    "knowledge_memory/index.html": "nav.knowledge",
    "papers/index.html": "nav.papers",
  }[relativePath];

  assert.deepEqual(
    currentMatches,
    expectedCurrent ? [expectedCurrent] : [],
    `${label}: active navigation marker should match the current page`
  );
};

const validateNoStaleNavTranslations = (relativePath) => {
  const html = readFileSync(resolve(root, relativePath), "utf8");
  const label = relativePath;
  const objectMatch = html.match(
    /const translations = (\{[\s\S]*?\n      \});\n\n      const getStoredLanguage/
  );
  const context = {};
  const staleKeys = ["nav.intro", "nav.architecture", "nav.resources", "nav.hierarchy"];

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

for (const page of pages) {
  validatePage(page);
  validateBrandLabels(page);
  validateNavigation(page);
  validateNoStaleNavTranslations(page);
  validateTargetBlankSafety(page);
}

validateHomeHeroRefresh();
validatePapersHero();
validatePapersYearLabels();
validatePapersListHeaderRemoved();
validateChemTableVenueLink();
validateScholarSumVenueLink();
