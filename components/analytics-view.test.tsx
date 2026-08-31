import { render, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AnalyticsView } from "@/components/analytics-view";
import { trackEvent, type AnalyticsEvent } from "@/lib/analytics";

vi.mock("@/lib/analytics", () => ({
  trackEvent: vi.fn(),
}));

describe("AnalyticsView", () => {
  it("tracks the supplied view event after rendering", async () => {
    const event: AnalyticsEvent = {
      name: "product_viewed",
      properties: { productId: "watch-1", value: 125, currency: "USD" },
    };

    const { container } = render(<AnalyticsView event={event} />);

    expect(container).toBeEmptyDOMElement();
    await waitFor(() => expect(trackEvent).toHaveBeenCalledOnce());
    expect(trackEvent).toHaveBeenCalledWith(event);
  });
});
