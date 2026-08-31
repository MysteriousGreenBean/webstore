"use client";

import type { FormEvent } from "react";
import { SearchIcon } from "@/components/icons";
import { trackEvent } from "@/lib/analytics";
import type { SearchFilters } from "@/lib/types";

export function SearchForm({ filters }: { filters: SearchFilters }) {
  const submit = (event: FormEvent<HTMLFormElement>) => {
    const data = new FormData(event.currentTarget);
    trackEvent({
      name: "search_submitted",
      properties: { query: String(data.get("q") ?? "") },
    });
  };

  return (
    <form className="search-form" action="/products" method="get" role="search" onSubmit={submit}>
      <label className="sr-only" htmlFor="catalogue-search">
        Search the product catalogue
      </label>
      <SearchIcon />
      <input
        id="catalogue-search"
        type="search"
        name="q"
        defaultValue={filters.query}
        placeholder="Search products, brands and categories"
      />
      {filters.brands.map((brand) => (
        <input key={brand} type="hidden" name="brand" value={brand} />
      ))}
      {filters.categories.map((category) => (
        <input key={category} type="hidden" name="category" value={category} />
      ))}
      {filters.freeShipping ? (
        <input type="hidden" name="shipping" value="free" />
      ) : null}
      <button type="submit">Search</button>
    </form>
  );
}
