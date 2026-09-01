import { NextRequest, NextResponse } from "next/server";
import { forwardPartnerApplication, resolveSlivadocAPIURL } from "../../partner-application-proxy.mjs";

export async function POST(request: NextRequest) {
  const apiURL = resolveSlivadocAPIURL(process.env.SLIVADOC_API_URL);
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Format data pendaftaran tidak valid." }, { status: 400 });
  }

  try {
    const clientIP = request.headers.get("cf-connecting-ip") || request.headers.get("x-forwarded-for");
    const result = await forwardPartnerApplication({
      apiURL,
      body,
      userAgent: request.headers.get("user-agent"),
      clientIP,
    });
    return NextResponse.json(result.payload, { status: result.status, headers: result.headers });
  } catch (error) {
    const timedOut = error instanceof Error && error.name === "AbortError";
    return NextResponse.json(
      { message: timedOut ? "Layanan pendaftaran membutuhkan waktu terlalu lama. Silakan coba lagi." : "Layanan pendaftaran sedang tidak tersedia. Silakan coba kembali." },
      { status: 502 },
    );
  }
}
