import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { BasketProvider } from "@/components/basket-provider";
import { ProductCard } from "@/components/product-card";
import type { Product } from "@/lib/types";

const product: Product = {
  objectID: "watch-1",
  name: "A Very Considered Test Watch",
  brand: "Moongazer",
  hierarchicalCategories: { lvl0: "Wearables" },
  price: 1299.5,
  image: "https://example.com/watch.jpg",
  free_shipping: true,
  rating: 4.25,
};

afterEach(() => {
  window.localStorage.clear();
  vi.restoreAllMocks();
});

describe("ProductCard", () => {
  it("renders product details, PDP links, rating, and card actions", () => {
    vi.spyOn(console, "info").mockImplementation(() => undefined);
    const { container } = render(
      <BasketProvider>
        <ProductCard product={product} priority />
      </BasketProvider>,
    );

    const card = screen.getByRole("article");
    expect(
      within(card).getByRole("link", {
        name: /^View A Very Considered Test Watch/,
      }),
    ).toHaveAttribute("href", "/products/watch-1");
    expect(
      within(card).getByRole("heading", {
        level: 2,
        name: "A Very Considered Test Watch",
      }),
    ).toBeInTheDocument();
    expect(within(card).getByText("Moongazer")).toBeInTheDocument();
    expect(within(card).getByText("$1,299.50")).toBeInTheDocument();
    expect(within(card).getByText("Free shipping")).toBeInTheDocument();
    expect(within(card).getByLabelText("4.25 out of 5 stars")).toHaveTextContent(
      "4.3",
    );

    const image = container.querySelector("img");
    expect(image).toHaveAttribute("src", product.image);
    expect(image).toHaveAttribute("alt", "");
    expect(container.querySelector(".product-card-actions")).toContainElement(
      within(card).getByRole("button", {
        name: "Add A Very Considered Test Watch to basket",
      }),
    );
  });

  it("renders branded fallback content when catalogue media is missing", () => {
    vi.spyOn(console, "info").mockImplementation(() => undefined);
    render(
      <BasketProvider>
        <ProductCard
          product={{
            objectID: "watch-2",
            name: "Minimal Watch",
            price: 80,
          }}
        />
      </BasketProvider>,
    );

    expect(screen.getByText("Moongazer edit")).toBeInTheDocument();
    expect(screen.getByText("M")).toHaveAttribute("aria-hidden", "true");
  });
});
