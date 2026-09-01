import AnalyticsConsent from "./analytics-consent";

const defaultMeasurementId = "G-1HBZTWHBPN";
const configuredMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim();
const measurementId = configuredMeasurementId && /^G-[A-Z0-9]+$/.test(configuredMeasurementId)
  ? configuredMeasurementId
  : defaultMeasurementId;

export default function GoogleAnalytics() {
  return <AnalyticsConsent measurementId={measurementId} />;
}
