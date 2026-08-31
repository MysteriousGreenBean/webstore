import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SearchForm } from "@/components/search-form";
import { trackEvent } from "@/lib/analytics";
import type { SearchFilters } from "@/lib/types";

vi.mock("@/lib/analytics", () => ({
  trackEvent: vi.fn(),
}));

const filters: SearchFilters = {
  query: "wireless",
  brands: ["Sony", "Bose"],
  categories: ["Audio", "Headphones"],
  freeShipping: true,
  page: 3,
};

function hiddenValues(container: HTMLElement, name: string) {
  const selector = 'input[type="hidden"][name="' + name + '"]';
  return Array.from(container.querySelectorAll<HTMLInputElement>(selector)).map(
    (input) => input.value,
  );
}

describe("SearchForm", () => {
  it("preserves refinements and reports the submitted search query", () => {
    const { container } = render(<SearchForm filters={filters} />);
    const form = screen.getByRole("search");
    const query = screen.getByRole("searchbox", {
      name: "Search the product catalogue",
    });

    expect(form).toHaveAttribute("action", "/products");
    expect(form).toHaveAttribute("method", "get");
    expect(query).toHaveValue("wireless");
    expect(hiddenValues(container, "brand")).toEqual(["Sony", "Bose"]);
    expect(hiddenValues(container, "category")).toEqual([
      "Audio",
      "Headphones",
    ]);
    expect(hiddenValues(container, "shipping")).toEqual(["free"]);

    fireEvent.change(query, { target: { value: "portable speaker" } });
    fireEvent.submit(form);

    expect(trackEvent).toHaveBeenCalledWith({
      name: "search_submitted",
      properties: { query: "portable speaker" },
    });
  });
});
