import { afterEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BasketPage } from "@/components/basket-page";
import { BasketProvider } from "@/components/basket-provider";
import { trackEvent } from "@/lib/analytics";

vi.mock("@/lib/analytics", () => ({
  trackEvent: vi.fn(),
}));

const storedItem = {
  productId: "watch-1",
  name: "Test Watch",
  brand: "Moongazer",
  unitPrice: 150,
  quantity: 1,
};

afterEach(() => {
  window.localStorage.clear();
  vi.clearAllMocks();
  vi.unstubAllGlobals();
});

describe("BasketPage", () => {
  it("shows the persisted empty-basket state after hydration", async () => {
    render(
      <BasketProvider>
        <BasketPage />
      </BasketProvider>,
    );

    expect(
      await screen.findByRole("heading", {
        level: 1,
        name: /nothing here yet/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Explore products" })).toHaveAttribute(
      "href",
      "/products",
    );
  });

  it("updates quantity and submits a sensible checkout payload", async () => {
    window.localStorage.setItem(
      "moongazer-basket-v1",
      JSON.stringify([storedItem]),
    );
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ orderId: "MG-TEST" }),
    });
    vi.stubGlobal("fetch", fetchMock);

    render(
      <BasketProvider>
        <BasketPage />
      </BasketProvider>,
    );

    expect(
      await screen.findByRole("heading", { level: 1, name: "Basket" }),
    ).toBeInTheDocument();
    fireEvent.click(
      screen.getByRole("button", {
        name: "Increase quantity of Test Watch",
      }),
    );

    const quantity = document.querySelector(
      'output[aria-labelledby="quantity-watch-1"]',
    );
    await waitFor(() => expect(quantity).toHaveTextContent("2"));
    expect(screen.getAllByText("$300.00")).toHaveLength(3);

    fireEvent.change(screen.getByLabelText("Full name"), {
      target: { value: "Ada Lovelace" },
    });
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "ada@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Address"), {
      target: { value: "1 Moon Street" },
    });
    fireEvent.change(screen.getByLabelText("City"), {
      target: { value: "London" },
    });
    fireEvent.change(screen.getByLabelText("Postal code"), {
      target: { value: "SW1A 1AA" },
    });
    fireEvent.change(screen.getByLabelText("Country"), {
      target: { value: "GB" },
    });
    fireEvent.click(
      screen.getByRole("button", { name: /Place mock order/ }),
    );

    await waitFor(() => expect(fetchMock).toHaveBeenCalledOnce());
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/checkout",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
      }),
    );

    const request = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    const payload = JSON.parse(String(request[1].body));
    expect(payload).toMatchObject({
      customer: { name: "Ada Lovelace", email: "ada@example.com" },
      shippingAddress: {
        line1: "1 Moon Street",
        city: "London",
        postalCode: "SW1A 1AA",
        country: "GB",
      },
      items: [
        {
          productId: "watch-1",
          name: "Test Watch",
          unitPrice: 150,
          quantity: 2,
        },
      ],
      currency: "USD",
      totals: { subtotal: 300, shipping: 0, total: 300 },
    });
    expect(payload.idempotencyKey).toEqual(expect.any(String));
    expect(payload.submittedAt).toEqual(expect.any(String));
    expect(trackEvent).toHaveBeenCalledWith({
      name: "checkout_started",
      properties: { itemCount: 2, value: 300, currency: "USD" },
    });
    expect(trackEvent).toHaveBeenCalledWith({
      name: "checkout_completed",
      properties: {
        orderId: "MG-TEST",
        itemCount: 2,
        value: 300,
        currency: "USD",
      },
    });

    expect(
      await screen.findByRole("heading", { level: 1, name: "Thank you." }),
    ).toBeInTheDocument();
    expect(screen.getByText("MG-TEST")).toBeInTheDocument();
    await waitFor(() => {
      expect(window.localStorage.getItem("moongazer-basket-v1")).toBe("[]");
    });
  });
});
