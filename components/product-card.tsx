import Image from "next/image";
import Link from "next/link";
import { AddToBasketButton } from "@/components/add-to-basket-button";
import { formatPrice, getPrimaryCategory } from "@/lib/format";
import type { Product } from "@/lib/types";

export function ProductCard({
  product,
  priority = false,
}: {
  product: Product;
  priority?: boolean;
}) {
  const category = getPrimaryCategory(product.hierarchicalCategories?.lvl0);

  return (
    <article className="product-card">
      <Link className="product-image-link" href={`/products/${product.objectID}`}>
        <span className="sr-only">View {product.name}</span>
        <div className="product-image-wrap">
          {product.image ? (
            <Image
              src={product.image}
              alt=""
              fill
              sizes="(max-width: 620px) 88vw, (max-width: 1024px) 40vw, 23vw"
              className="product-image"
              priority={priority}
            />
          ) : (
            <span className="image-placeholder" aria-hidden="true">
              M
            </span>
          )}
          {product.free_shipping ? (
            <span className="shipping-badge">Free shipping</span>
          ) : null}
        </div>
      </Link>
      <div className="product-card-body">
        <p className="eyebrow">{product.brand ?? category ?? "Moongazer edit"}</p>
        <h2 className="product-card-title">
          <Link href={`/products/${product.objectID}`}>{product.name}</Link>
        </h2>
        <div className="product-card-actions">
          <div className="card-meta">
            <p className="price">{formatPrice(product.price)}</p>
            {typeof product.rating === "number" ? (
              <p className="rating" aria-label={`${product.rating} out of 5 stars`}>
                <span aria-hidden="true">★</span> {product.rating.toFixed(1)}
              </p>
            ) : null}
          </div>
          <AddToBasketButton product={product} compact />
        </div>
      </div>
    </article>
  );
}
