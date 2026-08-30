import assert from "node:assert/strict";
import test from "node:test";
import {
  DEFAULT_SLIVADOC_API_URL,
  forwardPartnerApplication,
  resolveSlivadocAPIURL,
} from "../app/partner-application-proxy.mjs";

test("uses the public Slivadoc API in production and localhost only in development", () => {
  assert.equal(resolveSlivadocAPIURL(undefined, "production"), DEFAULT_SLIVADOC_API_URL);
  assert.equal(DEFAULT_SLIVADOC_API_URL, "https://api.slivadoc.id");
  assert.equal(resolveSlivadocAPIURL(undefined, "development"), "http://127.0.0.1:8080");
  assert.equal(resolveSlivadocAPIURL("https://staging-api.slivadoc.id/", "production"), "https://staging-api.slivadoc.id");
});

function executionContext() {
  return { waitUntil() {}, passThroughOnException() {} };
}

function assets() {
  return { fetch: async () => new Response("Not found", { status: 404 }) };
}

test("forwards a complete partner application to the Slivadoc API", async () => {
  let forwardedBody;
  const fetchImpl = async (input, init) => {
    assert.equal(String(input), "http://127.0.0.1:8080/api/v1/public/partner-applications");
    assert.equal(init?.method, "POST");
    forwardedBody = JSON.parse(String(init?.body));
    return Response.json({ application_number: "PTR-E2E-0001", status: "submitted" }, { status: 201 });
  };

  const payload = {
    partner_type: "veterinary_clinic",
    legal_name: "PT Klinik Satwa E2E",
    brand_name: "Klinik Satwa E2E",
    email: "partner-e2e@example.test",
    whatsapp: "081234567890",
    services_offered: ["Konsultasi", "Vaksinasi"],
    terms_accepted: true,
    data_consent: true,
    truth_declaration: true,
  };
  const result = await forwardPartnerApplication({
    apiURL: "http://127.0.0.1:8080",
    body: payload,
    userAgent: "slivadoc-e2e",
    clientIP: "198.51.100.80",
    fetchImpl,
  });

  assert.equal(result.status, 201);
  assert.equal(result.payload.application_number, "PTR-E2E-0001");
  assert.deepEqual(forwardedBody, payload);
});

test("rejects malformed partner application JSON before proxying", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("invalid-test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  const response = await worker.fetch(new Request("http://localhost/api/partner-applications", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: "{invalid",
  }), { ASSETS: assets() }, executionContext());
  const result = await response.json();

  assert.equal(response.status, 400);
  assert.match(result.message, /tidak valid/i);
});
