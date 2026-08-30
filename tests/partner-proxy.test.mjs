import assert from "node:assert/strict";
import test from "node:test";
import {
  DEFAULT_SLIVADOC_API_URL,
  forwardPartnerApplication,
  resolveSlivadocAPIURL,
} from "../app/partner-application-proxy.mjs";

test("uses the public Slivadoc API in production and localhost only in development", () => {
  assert.equal(resolveSlivadocAPIURL(undefined, "production"), DEFAULT_SLIVADOC_API_URL);
  assert.equal(DEFAULT_SLIVADOC_API_URL, "https://api.slivadoc.xyz");
  assert.equal(resolveSlivadocAPIURL(undefined, "development"), "http://127.0.0.1:8080");
  assert.equal(resolveSlivadocAPIURL("https://staging-api.slivadoc.xyz/", "production"), "https://staging-api.slivadoc.xyz");
});

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

test("returns a gateway error when the upstream response is not JSON", async () => {
  const result = await forwardPartnerApplication({
    apiURL: "https://api.slivadoc.xyz",
    body: { legal_name: "PT Klinik Satwa" },
    fetchImpl: async () => new Response("Service unavailable", { status: 503 }),
  });

  assert.equal(result.status, 502);
  assert.match(result.payload.message, /respons yang tidak valid/i);
});
