import Link from "next/link";
import type { FacetValues, SearchFilters } from "@/lib/types";

function mergeFacetValues(facets: FacetValues, selected: string[]) {
  const values = new Map(Object.entries(facets));
  selected.forEach((value) => {
    if (!values.has(value)) values.set(value, 0);
  });
  return [...values.entries()].sort((a, b) => {
    if (selected.includes(a[0]) !== selected.includes(b[0])) {
      return selected.includes(a[0]) ? -1 : 1;
    }
    return b[1] - a[1];
  });
}

export function FilterPanel({
  filters,
  brandFacets,
  categoryFacets,
}: {
  filters: SearchFilters;
  brandFacets: FacetValues;
  categoryFacets: FacetValues;
}) {
  const brands = mergeFacetValues(brandFacets, filters.brands);
  const categories = mergeFacetValues(categoryFacets, filters.categories);

  return (
    <aside className="filters" aria-label="Product filters">
      <div className="filter-heading">
        <h2>Refine</h2>
        {filters.brands.length ||
        filters.categories.length ||
        filters.freeShipping ? (
          <Link href={filters.query ? `/products?q=${encodeURIComponent(filters.query)}` : "/products"}>
            Clear
          </Link>
        ) : null}
      </div>
      <form action="/products" method="get">
        {filters.query ? <input type="hidden" name="q" value={filters.query} /> : null}
        <fieldset className="filter-group">
          <legend>Category</legend>
          <div className="filter-options">
            {categories.map(([category, count]) => (
              <label key={category} className="check-row">
                <input
                  type="checkbox"
                  name="category"
                  value={category}
                  defaultChecked={filters.categories.includes(category)}
                />
                <span>{category}</span>
                <span className="facet-count">{count.toLocaleString()}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <fieldset className="filter-group">
          <legend>Brand</legend>
          <div className="filter-options">
            {brands.map(([brand, count]) => (
              <label key={brand} className="check-row">
                <input
                  type="checkbox"
                  name="brand"
                  value={brand}
                  defaultChecked={filters.brands.includes(brand)}
                />
                <span>{brand}</span>
                <span className="facet-count">{count.toLocaleString()}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <fieldset className="filter-group compact-filter">
          <legend>Delivery</legend>
          <label className="check-row">
            <input
              type="checkbox"
              name="shipping"
              value="free"
              defaultChecked={filters.freeShipping}
            />
            <span>Free shipping</span>
          </label>
        </fieldset>
        <button className="apply-filters" type="submit">
          Apply filters
        </button>
      </form>
    </aside>
  );
}
