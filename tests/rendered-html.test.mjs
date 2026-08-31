import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("keeps the required Slivadoc Partners content", async () => {
  const html = await readFile(new URL("../app/partner-portal.tsx", import.meta.url), "utf8");
  const layout = await readFile(new URL("../app/layout.tsx", import.meta.url), "utf8");

  assert.match(layout, /Slivadoc Partners — Tumbuh Bersama Ekosistem Pet Care/);
  assert.match(layout, /brand\/slivadoc-favicon\.png/);
  assert.match(html, /Bisnis pet care Anda layak/);
  assert.match(html, /brand\/slivadoc-logo\.png/);
  assert.match(html, /LanguageSwitcher/);
  assert.match(html, /Daftar jadi partner/);
  assert.match(html, /Pet owner tetap menggunakan aplikasi khusus Pet Owner/);
  assert.match(html, /100% Gratis/);
  assert.match(html, /Semua partner terdaftar mendapatkan akses full gratis/);
  assert.match(html, /Tanpa biaya pendaftaran, onboarding, fitur, atau langganan/);
  assert.match(html, /Apakah bergabung dan menggunakan Slivadoc benar-benar gratis/);
  assert.match(html, /Chat WhatsApp Customer Support Slivadoc/);
  assert.match(html, /wa\.me\/6281977388341/);
  assert.doesNotMatch(html, /akses dasar untuk memulai gratis/i);
  assert.doesNotMatch(html, /codex-preview/);
});
