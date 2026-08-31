import type {
  Product,
  ProductSearchResult,
  SearchFilters,
} from "@/lib/types";

// These defaults are public, search-only demo credentials. Environment overrides
// keep deployment-specific configuration out of the implementation.
const appId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID ?? "latency";
const searchKey =
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY ??
  "af044fb0788d6bb15f807e4420592bc5";
const indexName =
  process.env.NEXT_PUBLIC_ALGOLIA_INDEX ?? "instant_search";

const baseUrl = `https://${appId}-dsn.algolia.net/1/indexes/${encodeURIComponent(indexName)}`;

const headers = {
  "X-Algolia-Application-Id": appId,
  "X-Algolia-API-Key": searchKey,
};

const escapeFacetValue = (value: string) => value.replaceAll("\\", "\\\\").replaceAll(":", "\\:");

export async function searchProducts(
  filters: SearchFilters,
): Promise<ProductSearchResult> {
  const params = new URLSearchParams({
    query: filters.query,
    page: String(filters.page - 1),
    hitsPerPage: "12",
    facets: JSON.stringify([
      "brand",
      "hierarchicalCategories.lvl0",
      "free_shipping",
    ]),
    maxValuesPerFacet: "12",
    clickAnalytics: "true",
    attributesToHighlight: JSON.stringify([]),
    attributesToSnippet: JSON.stringify([]),
  });

  const facetFilters: Array<string | string[]> = [];
  if (filters.brands.length) {
    facetFilters.push(
      filters.brands.map((brand) => `brand:${escapeFacetValue(brand)}`),
    );
  }
  if (filters.categories.length) {
    facetFilters.push(
      filters.categories.map(
        (category) =>
          `hierarchicalCategories.lvl0:${escapeFacetValue(category)}`,
      ),
    );
  }
  if (filters.freeShipping) facetFilters.push("free_shipping:true");
  if (facetFilters.length) {
    params.set("facetFilters", JSON.stringify(facetFilters));
  }

  const response = await fetch(`${baseUrl}/query`, {
    method: "POST",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify({ params: params.toString() }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Product search failed with status ${response.status}`);
  }

  return (await response.json()) as ProductSearchResult;
}

export async function getProduct(productId: string): Promise<Product | null> {
  const response = await fetch(`${baseUrl}/${encodeURIComponent(productId)}`, {
    headers,
    next: { revalidate: 300 },
  });

  if (response.status === 404) return null;
  if (!response.ok) {
    throw new Error(`Product lookup failed with status ${response.status}`);
  }

  return (await response.json()) as Product;
}
