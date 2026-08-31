import { afterEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BasketProvider, useBasket } from "@/components/basket-provider";
import type { Product } from "@/lib/types";

const product: Product = {
  objectID: "watch-1",
  name: "Test Watch",
  brand: "Moongazer",
  price: 125,
};

function Consumer() {
  const { addItem, itemCount, subtotal, hydrated } = useBasket();
  return (
    <>
      <output aria-label="hydrated">{String(hydrated)}</output>
      <output aria-label="count">{itemCount}</output>
      <output aria-label="subtotal">{subtotal}</output>
      <button type="button" onClick={() => addItem(product)}>Add product</button>
    </>
  );
}

afterEach(() => {
  window.localStorage.clear();
  vi.restoreAllMocks();
});

describe("BasketProvider", () => {
  it("adds, combines and persists basket items", async () => {
    vi.spyOn(console, "info").mockImplementation(() => undefined);
    render(
      <BasketProvider>
        <Consumer />
      </BasketProvider>,
    );

    await waitFor(() => expect(screen.getByLabelText("hydrated")).toHaveTextContent("true"));
    fireEvent.click(screen.getByRole("button", { name: "Add product" }));
    fireEvent.click(screen.getByRole("button", { name: "Add product" }));

    expect(screen.getByLabelText("count")).toHaveTextContent("2");
    expect(screen.getByLabelText("subtotal")).toHaveTextContent("250");
    await waitFor(() => {
      expect(window.localStorage.getItem("moongazer-basket-v1")).toContain('"quantity":2');
    });
  });
});
