import { languageFromCountryHeaders } from "../../language-config.mjs";

export const dynamic = "force-dynamic";

export function GET(request: Request) {
  return Response.json(languageFromCountryHeaders(request.headers), {
    headers: {
      "Cache-Control": "private, no-store, max-age=0",
      Vary: "x-vercel-ip-country, cf-ipcountry, x-country-code",
    },
  });
}
