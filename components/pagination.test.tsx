import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Pagination } from "@/components/pagination";
import type { SearchFilters } from "@/lib/types";

const filters: SearchFilters = {
  query: "headphones",
  brands: ["Sony", "Bose"],
  categories: ["Audio"],
  freeShipping: true,
  page: 4,
};

function paramsFor(element: HTMLElement) {
  const href = element.getAttribute("href");
  if (!href) throw new Error("Expected a pagination href");
  return new URL(href, "http://localhost").searchParams;
}

describe("Pagination", () => {
  it("preserves filters in previous, next, and page links", () => {
    const { container } = render(
      <Pagination filters={filters} totalPages={8} />,
    );

    const current = screen.getByRole("link", { name: "Page 4" });
    expect(current).toHaveAttribute("aria-current", "page");
    expect(container.querySelectorAll(".ellipsis")).toHaveLength(2);

    const previousParams = paramsFor(
      screen.getByRole("link", { name: "Previous" }),
    );
    expect(previousParams.get("page")).toBe("3");
    expect(previousParams.get("q")).toBe("headphones");
    expect(previousParams.getAll("brand")).toEqual(["Sony", "Bose"]);
    expect(previousParams.get("category")).toBe("Audio");
    expect(previousParams.get("shipping")).toBe("free");

    const nextParams = paramsFor(screen.getByRole("link", { name: "Next" }));
    expect(nextParams.get("page")).toBe("5");
  });

  it("renders nothing for a single page of results", () => {
    const { container } = render(
      <Pagination filters={{ ...filters, page: 1 }} totalPages={1} />,
    );

    expect(container).toBeEmptyDOMElement();
  });
});
