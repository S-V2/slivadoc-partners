import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { partnershipCategories, partnershipCategoryPath } from "../app/partnership-categories";

// Serious/critical axe findings present on main when this gate landed, as
// "<page> <rule> <element>". Anything else fails the run, and so does an entry
// that no longer occurs: delete it when the markup is fixed.
import knownViolations from "./known-a11y-violations.json" with { type: "json" };

const categoryPages = partnershipCategories.map(({ slug }) => partnershipCategoryPath(slug));
const pages = ["/", "/pet-trainer", ...categoryPages];

const headings: Record<string, RegExp> = {
  "/": /^Dari bisnis lokal menjadi bagian dari ekosistem besar\.$/,
  "/pet-trainer": /^Bantu pet tumbuh, satu sesi pada satu waktu\.$/,
};

async function open(page: Page, path: string) {
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));
  // Google Analytics and Google Translate are third-party: keep CI hits out of
  // the real GA stream and third-party outages out of this repo's checks.
  const origin = new URL(test.info().project.use.baseURL!).origin;
  await page.route((url) => url.origin !== origin, (route) => route.fulfill({ status: 200, body: "" }));
  const response = await page.goto(path, { waitUntil: "networkidle" });
  expect(response?.status()).toBe(200);
  return errors;
}

async function expectInternalLinksResolve(page: Page) {
  const origin = new URL(page.url()).origin;
  const hrefs = await page.locator("a[href]").evaluateAll((anchors) => anchors.map((anchor) => (anchor as HTMLAnchorElement).href));
  for (const href of new Set(hrefs)) {
    const url = new URL(href);
    if (url.origin !== origin) continue;
    const response = await page.request.get(url.pathname + url.search);
    expect(response.status(), href).toBe(200);
    if (url.hash.length > 1) expect(await response.text(), href).toContain(`id="${decodeURIComponent(url.hash.slice(1))}"`);
  }
}

async function expectOnlyKnownA11yViolations(page: Page, path: string) {
  const { violations } = await new AxeBuilder({ page }).analyze();
  const found = violations
    .filter((violation) => violation.impact === "serious" || violation.impact === "critical")
    .flatMap((violation) => violation.nodes.map((node) => `${path} ${violation.id} ${node.target.join(" ")}`));
  const known = knownViolations.filter((entry) => entry.startsWith(`${path} `));
  expect(found.filter((entry) => !known.includes(entry)), "new serious/critical axe violations").toEqual([]);
  expect(known.filter((entry) => !found.includes(entry)), "fixed violations still in knownViolations").toEqual([]);
}

test("the sitemap lists exactly the pages under test", async ({ request }) => {
  const sitemap = await (await request.get("/sitemap.xml")).text();
  const listed = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, loc]) => new URL(loc).pathname);
  expect(listed.sort()).toEqual([...pages].sort());
});

for (const path of pages) {
  test(`${path} renders with its navigation and CTA`, async ({ page }) => {
    const errors = await open(page, path);

    await expect(page.getByRole("heading", { level: 1 })).toHaveText(headings[path] ?? /^Daftar mitra .+ Slivadoc$/);
    await expect(page.getByRole("navigation", { name: "Navigasi utama" })).toBeVisible();
    await expect(page.locator(".header-cta")).toBeVisible();

    await expectInternalLinksResolve(page);
    expect(errors).toEqual([]);
  });

  test(`${path} has no new serious or critical axe violations`, async ({ page }) => {
    await open(page, path);
    await expectOnlyKnownA11yViolations(page, path);
  });
}

test("the language switch applies and remembers the chosen language", async ({ page }) => {
  const errors = await open(page, "/");
  const html = page.locator("html");
  const trigger = page.getByRole("button", { name: /^Pilih bahasa/ });
  const choose = async (name: string) => {
    await trigger.click();
    await page.getByRole("option", { name }).click();
  };
  const googtrans = async () => (await page.context().cookies()).find((cookie) => cookie.name === "googtrans")?.value;

  await choose("English Global");
  await expect(html).toHaveAttribute("lang", "en");
  await expect(trigger).toContainText("EN");
  expect(await googtrans()).toBe(encodeURIComponent("/id/en"));

  await page.reload({ waitUntil: "networkidle" });
  await expect(html).toHaveAttribute("lang", "en");
  await expect(trigger).toContainText("EN");

  await choose("العربية الشرق الأوسط");
  await expect(html).toHaveAttribute("dir", "rtl");

  // Back to the source language reloads the page without Google's translation.
  await Promise.all([page.waitForEvent("load"), choose("Bahasa Indonesia Indonesia")]);
  await expect(html).toHaveAttribute("lang", "id");
  await expect(html).toHaveAttribute("dir", "ltr");
  expect(await googtrans()).toBeUndefined();
  expect(errors).toEqual([]);
});
