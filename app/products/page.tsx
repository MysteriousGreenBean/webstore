import type { Metadata } from "next";
import { AnalyticsView } from "@/components/analytics-view";
import { FilterPanel } from "@/components/filter-panel";
import { Pagination } from "@/components/pagination";
import { ProductCard } from "@/components/product-card";
import { SearchForm } from "@/components/search-form";
import { searchProducts } from "@/lib/algolia";
import { parseSearchFilters, type RawSearchParams } from "@/lib/search-params";
import type { ProductSearchResult } from "@/lib/types";

export const metadata: Metadata = {
  title: "Shop all products",
  description: "Search and filter the Moongazer product collection.",
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  const filters = parseSearchFilters(await searchParams);
  let results: ProductSearchResult;

  try {
    results = await searchProducts(filters);
  } catch {
    return (
      <div className="shell service-error" role="alert">
        <p className="eyebrow">Catalogue unavailable</p>
        <h1>We couldn’t load the collection.</h1>
        <p>Please check your connection and try again.</p>
      </div>
    );
  }

  const categoryFacets = results.facets?.["hierarchicalCategories.lvl0"] ?? {};
  const brandFacets = results.facets?.brand ?? {};
  const event = {
    name: "product_list_viewed" as const,
    properties: {
      query: filters.query,
      brands: filters.brands,
      categories: filters.categories,
      freeShipping: filters.freeShipping,
      page: filters.page,
      resultCount: results.nbHits,
      queryId: results.queryID,
    },
  };

  return (
    <div className="catalogue-page shell">
      <AnalyticsView event={event} />
      <header className="catalogue-header">
        <p className="eyebrow">Moongazer catalogue</p>
        <h1>{filters.query ? `Results for “${filters.query}”` : "The collection"}</h1>
        <p>Explore useful technology for the way you work, live and unwind.</p>
      </header>

      <SearchForm filters={filters} />

      <div className="catalogue-layout">
        <FilterPanel
          filters={filters}
          brandFacets={brandFacets}
          categoryFacets={categoryFacets}
        />
        <section className="results" aria-labelledby="results-heading">
          <div className="results-heading">
            <h2 id="results-heading">
              {results.nbHits.toLocaleString()} {results.nbHits === 1 ? "product" : "products"}
            </h2>
            <p>
              Page {Math.min(filters.page, Math.max(results.nbPages, 1))} of{" "}
              {Math.max(results.nbPages, 1)}
            </p>
          </div>

          {results.hits.length ? (
            <div className="product-grid">
              {results.hits.map((product, index) => (
                <ProductCard
                  key={product.objectID}
                  product={product}
                  priority={index < 4}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p className="eyebrow">No matches</p>
              <h2>Try broadening your search</h2>
              <p>Remove a filter or use a more general search term.</p>
            </div>
          )}
          <Pagination filters={filters} totalPages={results.nbPages} />
        </section>
      </div>
    </div>
  );
}
