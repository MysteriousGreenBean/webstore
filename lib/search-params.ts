import type { SearchFilters } from "@/lib/types";

export type RawSearchParams = Record<
  string,
  string | string[] | undefined
>;

const asArray = (value: string | string[] | undefined) => {
  if (!value) return [];
  return (Array.isArray(value) ? value : [value])
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 12);
};

export function parseSearchFilters(params: RawSearchParams): SearchFilters {
  const rawPage = Number(Array.isArray(params.page) ? params.page[0] : params.page);

  return {
    query: String(Array.isArray(params.q) ? params.q[0] : params.q ?? "")
      .trim()
      .slice(0, 120),
    brands: asArray(params.brand),
    categories: asArray(params.category),
    freeShipping:
      (Array.isArray(params.shipping) ? params.shipping[0] : params.shipping) ===
      "free",
    page: Number.isInteger(rawPage) && rawPage > 0 ? rawPage : 1,
  };
}

export function buildProductsUrl(
  filters: SearchFilters,
  overrides: Partial<SearchFilters> = {},
) {
  const next = { ...filters, ...overrides };
  const params = new URLSearchParams();

  if (next.query) params.set("q", next.query);
  next.brands.forEach((brand) => params.append("brand", brand));
  next.categories.forEach((category) => params.append("category", category));
  if (next.freeShipping) params.set("shipping", "free");
  if (next.page > 1) params.set("page", String(next.page));

  const query = params.toString();
  return query ? `/products?${query}` : "/products";
}
