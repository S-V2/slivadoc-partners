export const analyticsConsentKey = "slivadoc-analytics-consent";

type AnalyticsValue = string | number | boolean;
type AnalyticsParameters = Record<string, AnalyticsValue | null | undefined>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackEvent(eventName: string, parameters: AnalyticsParameters = {}) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;

  const safeParameters = Object.fromEntries(
    Object.entries(parameters).filter((entry): entry is [string, AnalyticsValue] => entry[1] !== null && entry[1] !== undefined),
  );

  window.gtag("event", eventName, safeParameters);
}
