import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Footer } from "@/components/footer";

describe("Footer", () => {
  it("exposes the brand and primary destinations through a labelled navigation", () => {
    render(<Footer />);

    const footer = screen.getByRole("contentinfo");
    const navigation = within(footer).getByRole("navigation", {
      name: "Footer navigation",
    });

    expect(within(footer).getByText("MOONGAZER SUPPLY")).toBeInTheDocument();
    expect(within(navigation).getByRole("link", { name: "All products" })).toHaveAttribute(
      "href",
      "/products",
    );
    expect(within(navigation).getByRole("link", { name: "Basket" })).toHaveAttribute(
      "href",
      "/basket",
    );
    expect(
      within(footer).getByText("Technical demonstration storefront."),
    ).toBeInTheDocument();
  });
});
