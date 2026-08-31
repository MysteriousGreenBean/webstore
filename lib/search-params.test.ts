import { describe, expect, it } from "vitest";
import { buildProductsUrl, parseSearchFilters } from "@/lib/search-params";

describe("search parameter state", () => {
  it("parses repeated filters and sanitises invalid pages", () => {
    expect(
      parseSearchFilters({
        q: "  headphones  ",
        brand: ["Sony", "Bose"],
        category: "Audio",
        shipping: "free",
        page: "-4",
      }),
    ).toEqual({
      query: "headphones",
      brands: ["Sony", "Bose"],
      categories: ["Audio"],
      freeShipping: true,
      page: 1,
    });
  });

  it("builds a stable, shareable catalogue URL", () => {
    const url = buildProductsUrl({
      query: "smart tv",
      brands: ["LG", "Sony"],
      categories: ["TV & Home Theater"],
      freeShipping: true,
      page: 3,
    });
    const parsed = new URL(url, "https://example.test");

    expect(parsed.pathname).toBe("/products");
    expect(parsed.searchParams.get("q")).toBe("smart tv");
    expect(parsed.searchParams.getAll("brand")).toEqual(["LG", "Sony"]);
    expect(parsed.searchParams.get("category")).toBe("TV & Home Theater");
    expect(parsed.searchParams.get("shipping")).toBe("free");
    expect(parsed.searchParams.get("page")).toBe("3");
  });
});
