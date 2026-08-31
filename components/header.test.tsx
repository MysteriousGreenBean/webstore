import { afterEach, describe, expect, it } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import { BasketProvider } from "@/components/basket-provider";
import { Header } from "@/components/header";

afterEach(() => {
  window.localStorage.clear();
});

describe("Header", () => {
  it("renders the active shop link and hydrated basket count", async () => {
    window.localStorage.setItem(
      "moongazer-basket-v1",
      JSON.stringify([
        {
          productId: "watch-1",
          name: "Test Watch",
          unitPrice: 125,
          quantity: 2,
        },
      ]),
    );

    render(
      <BasketProvider>
        <Header />
      </BasketProvider>,
    );

    const header = screen.getByRole("banner");
    const home = within(header).getByRole("link", {
      name: "Moongazer Supply, home",
    });
    const shop = within(header).getByRole("link", { name: "Shop" });

    expect(home).toHaveAttribute("href", "/");
    expect(within(home).getByText("M")).toHaveAttribute("aria-hidden", "true");
    expect(within(home).getByText("MOONGAZER")).toBeInTheDocument();
    expect(shop).toHaveAttribute("href", "/products");
    expect(shop).toHaveClass("active");

    await waitFor(() => {
      expect(within(header).getByLabelText("2 items")).toHaveTextContent("2");
    });
    expect(within(header).getByRole("link", { name: /Basket/ })).toHaveAttribute(
      "href",
      "/basket",
    );
  });
});
