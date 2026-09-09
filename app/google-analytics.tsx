import Script from "next/script";

const defaultMeasurementId = "G-1HBZTWHBPN";
const configuredMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim();
const measurementId = configuredMeasurementId && /^G-[A-Z0-9]+$/.test(configuredMeasurementId)
  ? configuredMeasurementId
  : defaultMeasurementId;

export default function GoogleAnalytics() {
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
      <Script id="google-analytics-bootstrap" strategy="afterInteractive">{analyticsBootstrap}</Script>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`} strategy="afterInteractive" />
    </>
  );
}
