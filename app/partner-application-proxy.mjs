// Production fallback when SLIVADOC_API_URL is unset; must stay in step with the deployed
// domain. Pointing at retired hosts (e.g. api.slivadoc.xyz) causes partner submissions to 502
// while the form still appears healthy.
export const DEFAULT_SLIVADOC_API_URL = "https://api.slivadoc.com";

const FORWARDED_RESPONSE_HEADERS = [
  "retry-after",
  "x-ratelimit-limit",
  "x-ratelimit-remaining",
  "x-ratelimit-reset",
];

export function resolveSlivadocAPIURL(configuredURL, environment = process.env.NODE_ENV) {
  const value = String(configuredURL || "").trim();
  if (value) return value.replace(/\/$/, "");
  return environment === "production" ? DEFAULT_SLIVADOC_API_URL : "http://127.0.0.1:8080";
}

export async function forwardPartnerApplication({ apiURL, body, userAgent, clientIP, fetchImpl = fetch }) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12_000);

  try {
    const response = await fetchImpl(`${apiURL.replace(/\/$/, "")}/api/v1/public/partner-applications`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "User-Agent": userAgent || "slivadoc-partners",
        ...(clientIP ? { "X-Forwarded-For": clientIP } : {}),
      },
      body: JSON.stringify(body),
      cache: "no-store",
      signal: controller.signal,
    });
    const headers = Object.fromEntries(
      FORWARDED_RESPONSE_HEADERS.flatMap((name) => {
        const value = response.headers.get(name);
        return value ? [[name, value]] : [];
      }),
    );
    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      return { status: 502, payload: { message: "Layanan pendaftaran mengembalikan respons yang tidak valid." }, headers };
    }
    return { status: response.status, payload: await response.json(), headers };
  } finally {
    clearTimeout(timeout);
  }
}
