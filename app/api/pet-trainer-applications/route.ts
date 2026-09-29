import { NextRequest, NextResponse } from "next/server";
import { forwardPartnerApplication, resolveSlivadocAPIURL } from "../../partner-application-proxy.mjs";

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Format pendaftaran tidak valid." }, { status: 400 });
  }
  try {
    const result = await forwardPartnerApplication({
      apiURL: resolveSlivadocAPIURL(process.env.SLIVADOC_API_URL),
      endpoint: "pet-trainer-applications",
      body,
      userAgent: request.headers.get("user-agent"),
      clientIP: request.headers.get("cf-connecting-ip") || request.headers.get("x-forwarded-for"),
    });
    return NextResponse.json(result.payload, { status: result.status, headers: result.headers });
  } catch (error) {
    const timedOut = error instanceof Error && error.name === "AbortError";
    return NextResponse.json(
      { message: timedOut ? "Layanan pendaftaran membutuhkan waktu terlalu lama. Coba lagi." : "Layanan pendaftaran belum tersedia. Coba lagi nanti." },
      { status: 502 },
    );
  }
}
