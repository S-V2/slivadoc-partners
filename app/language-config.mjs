export const DEFAULT_LANGUAGE = "id";
export const LANGUAGE_STORAGE_KEY = "slivadoc_partner_language_v1";
export const LANGUAGE_COOKIE_KEY = "slivadoc_partner_language";

export const LANGUAGES = Object.freeze([
  { code: "id", googleCode: "id", flag: "🇮🇩", name: "Bahasa Indonesia", region: "Indonesia", rtl: false },
  { code: "en", googleCode: "en", flag: "🇺🇸", name: "English", region: "Global", rtl: false },
  { code: "ms", googleCode: "ms", flag: "🇲🇾", name: "Bahasa Melayu", region: "Malaysia", rtl: false },
  { code: "zh-CN", googleCode: "zh-CN", flag: "🇨🇳", name: "简体中文", region: "中国", rtl: false },
  { code: "zh-TW", googleCode: "zh-TW", flag: "🇹🇼", name: "繁體中文", region: "台灣", rtl: false },
  { code: "ja", googleCode: "ja", flag: "🇯🇵", name: "日本語", region: "日本", rtl: false },
  { code: "ko", googleCode: "ko", flag: "🇰🇷", name: "한국어", region: "대한민국", rtl: false },
  { code: "ar", googleCode: "ar", flag: "🇸🇦", name: "العربية", region: "الشرق الأوسط", rtl: true },
  { code: "es", googleCode: "es", flag: "🇪🇸", name: "Español", region: "España & LATAM", rtl: false },
  { code: "fr", googleCode: "fr", flag: "🇫🇷", name: "Français", region: "France", rtl: false },
  { code: "de", googleCode: "de", flag: "🇩🇪", name: "Deutsch", region: "Deutschland", rtl: false },
  { code: "pt", googleCode: "pt", flag: "🇧🇷", name: "Português", region: "Brasil & Portugal", rtl: false },
  { code: "th", googleCode: "th", flag: "🇹🇭", name: "ภาษาไทย", region: "ประเทศไทย", rtl: false },
  { code: "vi", googleCode: "vi", flag: "🇻🇳", name: "Tiếng Việt", region: "Việt Nam", rtl: false },
  { code: "hi", googleCode: "hi", flag: "🇮🇳", name: "हिन्दी", region: "भारत", rtl: false },
  { code: "ru", googleCode: "ru", flag: "🇷🇺", name: "Русский", region: "Россия", rtl: false },
  { code: "tr", googleCode: "tr", flag: "🇹🇷", name: "Türkçe", region: "Türkiye", rtl: false },
  { code: "nl", googleCode: "nl", flag: "🇳🇱", name: "Nederlands", region: "Nederland", rtl: false },
  { code: "it", googleCode: "it", flag: "🇮🇹", name: "Italiano", region: "Italia", rtl: false },
  { code: "tl", googleCode: "tl", flag: "🇵🇭", name: "Filipino", region: "Pilipinas", rtl: false },
]);

const COUNTRY_LANGUAGE = Object.freeze({
  ID: "id",
  MY: "ms", BN: "ms",
  CN: "zh-CN",
  TW: "zh-TW", HK: "zh-TW", MO: "zh-TW",
  JP: "ja",
  KR: "ko",
  SA: "ar", AE: "ar", QA: "ar", KW: "ar", BH: "ar", OM: "ar", YE: "ar", JO: "ar", LB: "ar", IQ: "ar", SY: "ar", EG: "ar", LY: "ar", DZ: "ar", MA: "ar", TN: "ar", SD: "ar",
  ES: "es", MX: "es", AR: "es", BO: "es", CL: "es", CO: "es", CR: "es", CU: "es", DO: "es", EC: "es", SV: "es", GT: "es", HN: "es", NI: "es", PA: "es", PY: "es", PE: "es", PR: "es", UY: "es", VE: "es",
  FR: "fr", MC: "fr", SN: "fr", CI: "fr", CM: "fr", ML: "fr", BF: "fr", NE: "fr", TD: "fr", GA: "fr", CG: "fr", CD: "fr", MG: "fr",
  DE: "de", AT: "de", CH: "de", LI: "de",
  BR: "pt", PT: "pt", AO: "pt", MZ: "pt",
  TH: "th",
  VN: "vi",
  IN: "hi",
  RU: "ru", BY: "ru", KZ: "ru", KG: "ru",
  TR: "tr",
  NL: "nl", BE: "nl",
  IT: "it", SM: "it", VA: "it",
  PH: "tl",
});

const supportedCodes = new Set(LANGUAGES.map((language) => language.code));

export function isSupportedLanguage(value) {
  return typeof value === "string" && supportedCodes.has(value);
}

export function getLanguage(value) {
  return LANGUAGES.find((language) => language.code === value) || LANGUAGES[0];
}

export function languageFromCountry(country) {
  if (!country) return DEFAULT_LANGUAGE;
  return COUNTRY_LANGUAGE[String(country).trim().toUpperCase()] || "en";
}

export function languageFromBrowser(browserLanguages = []) {
  for (const browserLanguage of browserLanguages) {
    const normalized = String(browserLanguage || "").trim().toLowerCase();
    if (!normalized) continue;
    if (normalized.startsWith("zh-tw") || normalized.startsWith("zh-hk") || normalized.startsWith("zh-hant")) return "zh-TW";
    if (normalized.startsWith("zh")) return "zh-CN";
    const match = LANGUAGES.find((language) => normalized === language.code.toLowerCase() || normalized.startsWith(`${language.code.toLowerCase()}-`));
    if (match) return match.code;
  }
  return DEFAULT_LANGUAGE;
}

export function languageFromCountryHeaders(headers) {
  const country = headers.get("x-vercel-ip-country") || headers.get("cf-ipcountry") || headers.get("x-country-code") || "";
  const normalizedCountry = country.trim().toUpperCase();
  return {
    country: normalizedCountry || null,
    language: normalizedCountry ? languageFromCountry(normalizedCountry) : DEFAULT_LANGUAGE,
    detected: Boolean(normalizedCountry),
  };
}
