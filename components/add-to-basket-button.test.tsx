import { afterEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { AddToBasketButton } from "@/components/add-to-basket-button";
import { BasketProvider } from "@/components/basket-provider";
import type { Product } from "@/lib/types";

const product: Product = {
  objectID: "watch-1",
  name: "Test Watch",
  brand: "Moongazer",
  price: 125,
};

afterEach(() => {
  window.localStorage.clear();
  vi.restoreAllMocks();
});

describe("AddToBasketButton", () => {
  it("adds the product and exposes a product-specific compact label", async () => {
    vi.spyOn(console, "info").mockImplementation(() => undefined);
    render(
      <BasketProvider>
        <AddToBasketButton product={product} compact />
      </BasketProvider>,
    );

    const button = screen.getByRole("button", {
      name: "Add Test Watch to basket",
    });
    expect(button).toHaveClass("compact");
    expect(button).toHaveTextContent("Add");

    fireEvent.click(button);

    expect(screen.getByText("Test Watch added to your basket.")).toBeInTheDocument();
    await waitFor(() => {
      expect(window.localStorage.getItem("moongazer-basket-v1")).toContain(
        '"productId":"watch-1"',
      );
    });
  });

  it("uses the full call to action outside compact cards", () => {
    vi.spyOn(console, "info").mockImplementation(() => undefined);
    render(
      <BasketProvider>
        <AddToBasketButton product={product} />
      </BasketProvider>,
    );

    expect(
      screen.getByRole("button", { name: "Add to basket" }),
    ).not.toHaveClass("compact");
  });
});
