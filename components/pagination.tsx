import Link from "next/link";
import { buildProductsUrl } from "@/lib/search-params";
import type { SearchFilters } from "@/lib/types";

function getVisiblePages(current: number, total: number) {
  const pages = new Set([1, total, current - 1, current, current + 1]);
  return [...pages].filter((page) => page > 0 && page <= total).sort((a, b) => a - b);
}

export function Pagination({
  filters,
  totalPages,
}: {
  filters: SearchFilters;
  totalPages: number;
}) {
  if (totalPages <= 1) return null;
  const visiblePages = getVisiblePages(filters.page, totalPages);

  return (
    <nav className="pagination" aria-label="Product results pages">
      {filters.page > 1 ? (
        <Link href={buildProductsUrl(filters, { page: filters.page - 1 })} rel="prev">
          Previous
        </Link>
      ) : (
        <span className="disabled">Previous</span>
      )}
      <div className="page-numbers">
        {visiblePages.map((page, index) => (
          <span key={page} className="page-entry">
            {index > 0 && page - visiblePages[index - 1] > 1 ? (
              <span className="ellipsis" aria-hidden="true">
                …
              </span>
            ) : null}
            <Link
              href={buildProductsUrl(filters, { page })}
              aria-current={page === filters.page ? "page" : undefined}
              aria-label={`Page ${page}`}
            >
              {page}
            </Link>
          </span>
        ))}
      </div>
      {filters.page < totalPages ? (
        <Link href={buildProductsUrl(filters, { page: filters.page + 1 })} rel="next">
          Next
        </Link>
      ) : (
        <span className="disabled">Next</span>
      )}
    </nav>
  );
}
