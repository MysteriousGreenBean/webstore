import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FilterPanel } from "@/components/filter-panel";
import type { SearchFilters } from "@/lib/types";

const filters: SearchFilters = {
  query: "noise cancelling",
  brands: ["Sony", "Selected brand"],
  categories: ["Audio"],
  freeShipping: true,
  page: 1,
};

describe("FilterPanel", () => {
  it("renders selected refinements, facet counts, and a shareable clear URL", () => {
    const { container } = render(
      <FilterPanel
        filters={filters}
        brandFacets={{ Apple: 40, Sony: 14 }}
        categoryFacets={{ Audio: 120, Computers: 50 }}
      />,
    );

    const panel = screen.getByRole("complementary", { name: "Product filters" });
    const form = panel.querySelector("form");

    expect(form).toHaveAttribute("action", "/products");
    expect(form).toHaveAttribute("method", "get");
    expect(container.querySelector('input[type="hidden"][name="q"]')).toHaveValue(
      "noise cancelling",
    );
    expect(within(panel).getByRole("checkbox", { name: /Audio/ })).toBeChecked();
    expect(within(panel).getByRole("checkbox", { name: /Sony/ })).toBeChecked();
    expect(
      within(panel).getByRole("checkbox", { name: /Selected brand/ }),
    ).toBeChecked();
    expect(within(panel).getByText("0")).toBeInTheDocument();
    expect(within(panel).getByRole("checkbox", { name: /Apple/ })).not.toBeChecked();
    expect(
      within(panel).getByRole("checkbox", { name: /Free shipping/ }),
    ).toBeChecked();
    expect(within(panel).getByRole("link", { name: "Clear" })).toHaveAttribute(
      "href",
      "/products?q=noise%20cancelling",
    );
    expect(
      within(panel).getByRole("button", { name: "Apply filters" }),
    ).toHaveAttribute("type", "submit");
  });
});
