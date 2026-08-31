import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  DEFAULT_LANGUAGE,
  LANGUAGES,
  isSupportedLanguage,
  languageFromBrowser,
  languageFromCountry,
  languageFromCountryHeaders,
} from "../app/language-config.mjs";

test("offers a broad, unique language list with Indonesian as default", () => {
  const codes = LANGUAGES.map((language) => language.code);
  assert.equal(DEFAULT_LANGUAGE, "id");
  assert.ok(LANGUAGES.length >= 20);
  assert.equal(new Set(codes).size, codes.length);
  assert.equal(isSupportedLanguage("id"), true);
  assert.equal(isSupportedLanguage("unknown"), false);
});

test("maps visitor countries and browser languages to supported languages", () => {
  assert.equal(languageFromCountry("ID"), "id");
  assert.equal(languageFromCountry("JP"), "ja");
  assert.equal(languageFromCountry("BR"), "pt");
  assert.equal(languageFromCountry("US"), "en");
  assert.equal(languageFromCountry(null), "id");
  assert.equal(languageFromBrowser(["zh-Hant-TW", "en-US"]), "zh-TW");
  assert.equal(languageFromBrowser(["id-ID"]), "id");
  assert.equal(languageFromBrowser([]), "id");
});

test("reads Vercel country headers without caching a shared location", () => {
  const detected = languageFromCountryHeaders(new Headers({ "x-vercel-ip-country": "KR" }));
  assert.deepEqual(detected, { country: "KR", language: "ko", detected: true });
  assert.deepEqual(languageFromCountryHeaders(new Headers()), { country: null, language: "id", detected: false });
});

test("language switcher persists preference and uses the custom translation layer", async () => {
  const source = await readFile(new URL("../app/language-switcher.tsx", import.meta.url), "utf8");
  const route = await readFile(new URL("../app/api/locale/route.ts", import.meta.url), "utf8");
  assert.match(source, /LANGUAGE_STORAGE_KEY/);
  assert.match(source, /translate\.google\.com\/translate_a\/element\.js/);
  assert.match(source, /role="listbox"/);
  assert.match(source, /window\.localStorage\.setItem/);
  assert.match(route, /private, no-store/);
});

test("translated copy remains responsive when labels become longer", async () => {
  const styles = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");
  assert.match(styles, /\.language-menu \{ width: min\(370px,calc\(100vw - 24px\)\); \}/);
  assert.match(styles, /\.hero-proof \{ width: min\(100%,600px\); display: grid;/);
  assert.match(styles, /text-wrap: balance/);
  assert.match(styles, /@media \(max-width: 390px\)/);
});
