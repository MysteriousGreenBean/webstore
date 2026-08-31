"use client";

import { useEffect } from "react";
import { trackEvent, type AnalyticsEvent } from "@/lib/analytics";

export function AnalyticsView({ event }: { event: AnalyticsEvent }) {
  useEffect(() => {
    trackEvent(event);
  }, [event]);

  return null;
}
