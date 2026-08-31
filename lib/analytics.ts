export type AnalyticsEvent = {
  name:
    | "product_list_viewed"
    | "product_viewed"
    | "product_added"
    | "basket_updated"
    | "checkout_started"
    | "checkout_completed"
    | "search_submitted";
  properties?: Record<string, unknown>;
};

export function trackEvent(event: AnalyticsEvent) {
  const payload = {
    event: event.name,
    eventId: crypto.randomUUID(),
    occurredAt: new Date().toISOString(),
    page: typeof window === "undefined" ? undefined : window.location.pathname,
    ...event.properties,
  };

  // Deliberate adapter seam: replace this call with a dataLayer or analytics SDK.
  console.info("[analytics]", payload);
  return payload;
}
