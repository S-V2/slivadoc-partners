"use client";

import Script from "next/script";
import { useSyncExternalStore } from "react";
import { analyticsConsentKey } from "./analytics";

const consentChangeEvent = "slivadoc-analytics-consent-change";

function subscribeToConsent(callback: () => void) {
  window.addEventListener(consentChangeEvent, callback);
  return () => window.removeEventListener(consentChangeEvent, callback);
}

function getConsentSnapshot() {
  try {
    return window.localStorage.getItem(analyticsConsentKey) ?? "unset";
  } catch {
    return "unset";
  }
}

export default function AnalyticsConsent({ measurementId }: { measurementId: string }) {
  const consent = useSyncExternalStore(subscribeToConsent, getConsentSnapshot, () => "loading");

  function saveChoice(granted: boolean) {
    try {
      window.localStorage.setItem(analyticsConsentKey, granted ? "granted" : "denied");
    } catch {
      // Consent still applies for the current page when storage is unavailable.
    }

    window.dispatchEvent(new Event(consentChangeEvent));
  }

  if (consent === "granted") {
    const analyticsBootstrap = `
window.dataLayer = window.dataLayer || [];
window.gtag = window.gtag || function(){window.dataLayer.push(arguments);};
window.gtag("consent", "default", {
  analytics_storage: "granted",
  ad_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied"
});
window.gtag("set", "ads_data_redaction", true);
window.gtag("js", new Date());
window.gtag("config", ${JSON.stringify(measurementId)}, {
  send_page_view: true,
  allow_google_signals: false,
  allow_ad_personalization_signals: false
});
`;

    return (
      <>
        <Script id="google-analytics-consented" strategy="afterInteractive">{analyticsBootstrap}</Script>
        <Script src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`} strategy="afterInteractive" />
      </>
    );
  }

  if (consent !== "unset") return null;

  return (
    <aside className="analytics-consent" role="dialog" aria-label="Pilihan analitik" aria-live="polite">
      <div>
        <strong>Bantu Slivadoc menjadi lebih baik</strong>
        <p>Kami menggunakan Google Analytics untuk memahami penggunaan halaman tanpa mengirim nama, email, nomor WhatsApp, atau isi formulir Anda.</p>
      </div>
      <div className="analytics-consent-actions">
        <button className="analytics-consent-secondary" type="button" onClick={() => saveChoice(false)}>Tolak analitik</button>
        <button className="analytics-consent-primary" type="button" onClick={() => saveChoice(true)}>Izinkan analitik</button>
      </div>
    </aside>
  );
}
