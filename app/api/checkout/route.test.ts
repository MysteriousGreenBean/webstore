// @vitest-environment node

import { describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/checkout/route";

const validPayload = {
  idempotencyKey: "checkout-123",
  customer: { name: "Ada Lovelace", email: "ada@example.com" },
  shippingAddress: {
    line1: "1 Test Street",
    city: "London",
    postalCode: "W1A 1AA",
    country: "GB",
  },
  items: [
    { productId: "sku-1", name: "Test product", unitPrice: 49.5, quantity: 2 },
  ],
  currency: "USD",
  totals: { subtotal: 1, shipping: 0, total: 1 },
  submittedAt: "2026-08-23T12:00:00.000Z",
};

describe("POST /api/checkout", () => {
  it("validates and accepts a sensible order payload", async () => {
    vi.spyOn(console, "info").mockImplementation(() => undefined);
    const response = await POST(
      new Request("http://localhost/api/checkout", {
        method: "POST",
        body: JSON.stringify(validPayload),
      }),
    );
    const body = await response.json();

    expect(response.status).toBe(201);
    expect(body.orderId).toMatch(/^MG-/);
    // The endpoint recalculates this, proving it does not trust client totals.
    expect(body.total).toBe(99);
  });

  it("rejects empty baskets", async () => {
    const response = await POST(
      new Request("http://localhost/api/checkout", {
        method: "POST",
        body: JSON.stringify({ ...validPayload, items: [] }),
      }),
    );

    expect(response.status).toBe(422);
  });
});
