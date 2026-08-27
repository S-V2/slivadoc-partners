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
    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      return { status: 502, payload: { message: "Layanan pendaftaran mengembalikan respons yang tidak valid." } };
    }
    return { status: response.status, payload: await response.json() };
  } finally {
    clearTimeout(timeout);
  }
}
