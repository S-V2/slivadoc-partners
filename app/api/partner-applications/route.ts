import { NextRequest, NextResponse } from "next/server";
import { forwardPartnerApplication } from "../../partner-application-proxy.mjs";

const DEFAULT_API_URL = "http://127.0.0.1:8080";

export async function POST(request: NextRequest) {
  const apiURL = (process.env.SLIVADOC_API_URL || DEFAULT_API_URL).replace(/\/$/, "");
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
    return NextResponse.json(result.payload, { status: result.status });
  } catch (error) {
    const timedOut = error instanceof Error && error.name === "AbortError";
    return NextResponse.json(
      { message: timedOut ? "Layanan pendaftaran membutuhkan waktu terlalu lama. Silakan coba lagi." : "Layanan pendaftaran sedang tidak tersedia. Silakan coba kembali." },
      { status: 502 },
    );
  }
}
