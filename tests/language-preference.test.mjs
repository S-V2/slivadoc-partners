import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  DEFAULT_LANGUAGE,
  LANGUAGE_COOKIE_KEY,
  LANGUAGE_STORAGE_KEY,
  LANGUAGES,
  isSupportedLanguage,
  getLanguage,
} from "../app/language-config.mjs";

test("offers a broad, unique language list with Indonesian as default", () => {
  const codes = LANGUAGES.map((language) => language.code);
  assert.equal(DEFAULT_LANGUAGE, "id");
  assert.ok(LANGUAGES.length >= 20);
  assert.equal(new Set(codes).size, codes.length);
  assert.equal(isSupportedLanguage("id"), true);
  assert.equal(isSupportedLanguage("unknown"), false);
});

test("uses only an explicit choice with Indonesian as the initial language", () => {
  assert.equal(getLanguage("unknown").code, "id");
  assert.equal(getLanguage("ko").googleCode, "ko");
  assert.equal(LANGUAGE_STORAGE_KEY, "slivadoc_partner_language_v2");
  assert.equal(LANGUAGE_COOKIE_KEY, "slivadoc_partner_selected_language");
});

test("language switcher persists preference and uses the custom translation layer", async () => {
  const source = await readFile(new URL("../app/language-switcher.tsx", import.meta.url), "utf8");
  assert.match(source, /LANGUAGE_STORAGE_KEY/);
  assert.match(source, /translate\.google\.com\/translate_a\/element\.js/);
  assert.match(source, /role="listbox"/);
  assert.match(source, /window\.localStorage\.setItem/);
  assert.doesNotMatch(source, /\/api\/locale|navigator\.languages|languageFromCountry/);
  assert.match(source, /ready && <Script/);
});

test("translated copy remains responsive when labels become longer", async () => {
  const styles = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");
  assert.match(styles, /\.language-menu \{ width: min\(370px,calc\(100vw - 24px\)\); \}/);
  assert.match(styles, /\.hero-proof \{ width: min\(100%,600px\); display: grid;/);
  assert.match(styles, /text-wrap: balance/);
  assert.match(styles, /@media \(max-width: 390px\)/);
});
