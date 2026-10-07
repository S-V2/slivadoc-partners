export const DEFAULT_LANGUAGE = "id";
// Earlier values could be set by IP detection; only explicit choices use v2.
export const LANGUAGE_STORAGE_KEY = "slivadoc_partner_language_v2";
export const LANGUAGE_COOKIE_KEY = "slivadoc_partner_selected_language";

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

const supportedCodes = new Set(LANGUAGES.map((language) => language.code));

export function isSupportedLanguage(value) {
  return typeof value === "string" && supportedCodes.has(value);
}

export function getLanguage(value) {
  return LANGUAGES.find((language) => language.code === value) || LANGUAGES[0];
}
