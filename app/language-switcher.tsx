"use client";

import Script from "next/script";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  DEFAULT_LANGUAGE,
  LANGUAGE_COOKIE_KEY,
  LANGUAGE_STORAGE_KEY,
  LANGUAGES,
  getLanguage,
  isSupportedLanguage,
  languageFromBrowser,
} from "./language-config.mjs";

type GoogleTranslateConstructor = new (
  options: { pageLanguage: string; includedLanguages: string; autoDisplay: boolean },
  elementId: string,
) => unknown;

declare global {
  interface Window {
    google?: { translate?: { TranslateElement?: GoogleTranslateConstructor } };
    googleTranslateElementInit?: () => void;
  }
}

const GOOGLE_COOKIE_KEY = "googtrans";
const INCLUDED_LANGUAGES = LANGUAGES.map((language) => language.googleCode).join(",");

function readCookie(name: string) {
  if (typeof document === "undefined") return "";
  const prefix = `${name}=`;
  const value = document.cookie.split(";").map((item) => item.trim()).find((item) => item.startsWith(prefix));
  return value ? decodeURIComponent(value.slice(prefix.length)) : "";
}

function writePreference(language: string) {
  window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  document.cookie = `${LANGUAGE_COOKIE_KEY}=${encodeURIComponent(language)}; Path=/; Max-Age=31536000; SameSite=Lax`;
}

function setGoogleCookie(googleCode: string) {
  document.cookie = `${GOOGLE_COOKIE_KEY}=${encodeURIComponent(`/id/${googleCode}`)}; Path=/; Max-Age=31536000; SameSite=Lax`;
}

function clearGoogleCookie() {
  document.cookie = `${GOOGLE_COOKIE_KEY}=; Path=/; Max-Age=0; SameSite=Lax`;
}

function updateDocumentLanguage(languageCode: string) {
  const language = getLanguage(languageCode);
  document.documentElement.lang = language.code;
  document.documentElement.dir = language.rtl ? "rtl" : "ltr";
}

function syncGoogleSelect(googleCode: string) {
  let attempts = 0;
  const timer = window.setInterval(() => {
    attempts += 1;
    const select = document.querySelector<HTMLSelectElement>(".goog-te-combo");
    if (select) {
      window.clearInterval(timer);
      if (select.value !== googleCode) {
        select.value = googleCode;
        select.dispatchEvent(new Event("change", { bubbles: true }));
      }
    } else if (attempts >= 24) {
      window.clearInterval(timer);
    }
  }, 125);
}

export default function LanguageSwitcher() {
  const [languageCode, setLanguageCode] = useState(DEFAULT_LANGUAGE);
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);
  const activeLanguage = getLanguage(languageCode);

  useEffect(() => {
    let cancelled = false;

    async function resolveLanguage() {
      const storedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY) || readCookie(LANGUAGE_COOKIE_KEY);
      if (isSupportedLanguage(storedLanguage)) {
        await Promise.resolve();
        if (cancelled) return;
        setLanguageCode(storedLanguage);
        updateDocumentLanguage(storedLanguage);
        const stored = getLanguage(storedLanguage);
        if (stored.code !== DEFAULT_LANGUAGE) setGoogleCookie(stored.googleCode);
        setReady(true);
        return;
      }

      let detectedLanguage = DEFAULT_LANGUAGE;
      try {
        const response = await fetch("/api/locale", { cache: "no-store", headers: { Accept: "application/json" } });
        if (response.ok) {
          const result = await response.json() as { language?: string; detected?: boolean };
          const remoteLanguage = result.language;
          detectedLanguage = result.detected && typeof remoteLanguage === "string" && isSupportedLanguage(remoteLanguage)
            ? remoteLanguage
            : languageFromBrowser(Array.from(window.navigator.languages || [window.navigator.language]));
        } else {
          detectedLanguage = languageFromBrowser(Array.from(window.navigator.languages || [window.navigator.language]));
        }
      } catch {
        detectedLanguage = languageFromBrowser(Array.from(window.navigator.languages || [window.navigator.language]));
      }

      if (cancelled) return;
      const selected = isSupportedLanguage(detectedLanguage) ? detectedLanguage : DEFAULT_LANGUAGE;
      setLanguageCode(selected);
      writePreference(selected);
      updateDocumentLanguage(selected);
      const detected = getLanguage(selected);
      if (detected.code !== DEFAULT_LANGUAGE) setGoogleCookie(detected.googleCode);
      setReady(true);
    }

    void resolveLanguage();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (!pickerRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const initializeGoogleTranslate = useCallback(() => {
    const TranslateElement = window.google?.translate?.TranslateElement;
    const container = document.getElementById("google_translate_element");
    if (!TranslateElement || !container || container.dataset.initialized === "true") return;
    container.dataset.initialized = "true";
    new TranslateElement({ pageLanguage: "id", includedLanguages: INCLUDED_LANGUAGES, autoDisplay: false }, "google_translate_element");
    if (activeLanguage.code !== DEFAULT_LANGUAGE) syncGoogleSelect(activeLanguage.googleCode);
  }, [activeLanguage.code, activeLanguage.googleCode]);

  function selectLanguage(nextCode: string) {
    if (!isSupportedLanguage(nextCode)) return;
    const previous = activeLanguage;
    const next = getLanguage(nextCode);
    setLanguageCode(next.code);
    setOpen(false);
    writePreference(next.code);
    updateDocumentLanguage(next.code);

    if (next.code === DEFAULT_LANGUAGE) {
      const wasTranslated = previous.code !== DEFAULT_LANGUAGE || Boolean(readCookie(GOOGLE_COOKIE_KEY));
      clearGoogleCookie();
      if (wasTranslated) window.location.reload();
      return;
    }

    setGoogleCookie(next.googleCode);
    syncGoogleSelect(next.googleCode);
  }

  useEffect(() => {
    window.googleTranslateElementInit = initializeGoogleTranslate;
    if (window.google?.translate?.TranslateElement) initializeGoogleTranslate();
  }, [initializeGoogleTranslate]);

  return (
    <>
      <div className="language-picker notranslate" translate="no" ref={pickerRef}>
        <button
          className="language-trigger"
          type="button"
          onClick={() => setOpen((current) => !current)}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-label={`Pilih bahasa. Bahasa aktif: ${activeLanguage.name}`}
        >
          <span className="language-flag" aria-hidden="true">{activeLanguage.flag}</span>
          <span className="language-trigger-copy">
            <small>{ready ? "Bahasa" : "Mendeteksi"}</small>
            <strong>{activeLanguage.code.toUpperCase()}</strong>
          </span>
          <svg className={open ? "language-chevron open" : "language-chevron"} viewBox="0 0 20 20" aria-hidden="true"><path d="m5 7.5 5 5 5-5" /></svg>
        </button>

        {open && (
          <div className="language-menu" role="listbox" aria-label="Daftar bahasa Slivadoc">
            <div className="language-menu-heading">
              <span><b>Pilih bahasa</b><small>Pilihan tersimpan otomatis</small></span>
              <i>{LANGUAGES.length} bahasa</i>
            </div>
            <div className="language-options">
              {LANGUAGES.map((language) => (
                <button
                  className={language.code === activeLanguage.code ? "language-option active" : "language-option"}
                  type="button"
                  role="option"
                  aria-selected={language.code === activeLanguage.code}
                  key={language.code}
                  onClick={() => selectLanguage(language.code)}
                >
                  <span className="language-option-flag" aria-hidden="true">{language.flag}</span>
                  <span><b>{language.name}</b><small>{language.region}</small></span>
                  {language.code === activeLanguage.code ? <i aria-hidden="true">✓</i> : <em>{language.code.toUpperCase()}</em>}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div id="google_translate_element" aria-hidden="true" />
      <Script
        id="slivadoc-google-translate"
        src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        strategy="afterInteractive"
        onLoad={initializeGoogleTranslate}
        onReady={initializeGoogleTranslate}
      />
    </>
  );
}
