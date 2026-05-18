import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const html = readFileSync(resolve(root, "index.html"), "utf8");

assert.ok(/id="language-toggle"/.test(html), "missing language toggle button");
assert.ok(/data-language="zh"/.test(html), "html element should declare initial language");
assert.ok(/data-i18n="/.test(html), "missing translatable text markers");

const objectMatch = html.match(
  /const translations = (\{[\s\S]*?\n      \});\n\n      const getStoredLanguage/
);
const scriptMatch = html.match(/<script>\n([\s\S]*?)\n    <\/script>/);

assert.ok(objectMatch, "missing translations object");
assert.ok(scriptMatch, "missing language script");

const context = {};
vm.runInNewContext(`translations = ${objectMatch[1]};`, context);

const keys = new Set(
  [...html.matchAll(/data-i18n="([^"]+)"/g)].map((match) => match[1])
);

assert.ok(keys.size > 0, "no translation keys found");

for (const language of ["en", "zh"]) {
  assert.ok(context.translations[language], `missing ${language} translations`);

  for (const key of keys) {
    assert.equal(
      typeof context.translations[language][key],
      "string",
      `missing ${language} translation for ${key}`
    );
    assert.ok(
      context.translations[language][key].trim(),
      `empty ${language} translation for ${key}`
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

assert.equal(document.documentElement.lang, "zh-CN");
assert.equal(document.documentElement.dataset.language, "zh");
assert.equal(document.title, context.translations.zh["meta.title"]);
assert.equal(toggle.textContent, "EN");
assert.equal(toggle.getAttribute("aria-pressed"), "true");
assert.equal(typeof toggle.click, "function", "toggle click handler was not registered");

toggle.click();

assert.equal(document.documentElement.lang, "en");
assert.equal(document.documentElement.dataset.language, "en");
assert.equal(document.title, context.translations.en["meta.title"]);
assert.equal(toggle.textContent, "中文");
assert.equal(toggle.getAttribute("aria-pressed"), "false");
assert.equal(storage.get("preferredLanguage"), "en");

const heroTitle = keyedElements.find((element) => element.dataset.i18n === "hero.title");
assert.equal(heroTitle.textContent, context.translations.en["hero.title"]);
