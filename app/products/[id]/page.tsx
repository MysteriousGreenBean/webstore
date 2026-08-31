import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToBasketButton } from "@/components/add-to-basket-button";
import { AnalyticsView } from "@/components/analytics-view";
import { ChevronIcon } from "@/components/icons";
import { getProduct } from "@/lib/algolia";
import { formatPrice, getPrimaryCategory } from "@/lib/format";

type ProductPageProps = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = await getProduct((await params).id);
  if (!product) return { title: "Product not found" };
  return {
    title: product.name,
    description: product.description?.slice(0, 160),
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProduct((await params).id);
  if (!product) notFound();
  const category = getPrimaryCategory(product.hierarchicalCategories?.lvl0);

  return (
    <article className="product-page shell">
      <AnalyticsView
        event={{
          name: "product_viewed",
          properties: {
            productId: product.objectID,
            productName: product.name,
            brand: product.brand,
            category,
            price: product.price,
            currency: "USD",
          },
        }}
      />
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <ol>
          <li>
            <Link href="/products">Products</Link>
          </li>
          {category ? (
            <li>
              <ChevronIcon />
              <Link href={`/products?category=${encodeURIComponent(category)}`}>{category}</Link>
            </li>
          ) : null}
          <li aria-current="page">
            <ChevronIcon />
            <span>{product.name}</span>
          </li>
        </ol>
      </nav>

      <div className="product-detail-grid">
        <div className="detail-image-wrap">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 840px) 100vw, 54vw"
              className="detail-image"
            />
          ) : (
            <span className="image-placeholder" aria-hidden="true">
              M
            </span>
          )}
        </div>

        <div className="detail-copy">
          <p className="eyebrow">{product.brand ?? category ?? "Moongazer edit"}</p>
          <h1>{product.name}</h1>
          {typeof product.rating === "number" ? (
            <p className="detail-rating" aria-label={`${product.rating} out of 5 stars`}>
              <span aria-hidden="true">★★★★★</span>
              <b>{product.rating.toFixed(1)}</b> / 5
            </p>
          ) : null}
          <p className="detail-price">{formatPrice(product.price)}</p>
          <p className="detail-description">
            {product.description ?? "A considered addition to the Moongazer collection."}
          </p>
          <AddToBasketButton product={product} />
          <dl className="product-facts">
            <div>
              <dt>Delivery</dt>
              <dd>{product.free_shipping ? "Complimentary standard shipping" : "Calculated at checkout"}</dd>
            </div>
            <div>
              <dt>Category</dt>
              <dd>{category ?? "General"}</dd>
            </div>
            <div>
              <dt>Reference</dt>
              <dd>{product.objectID}</dd>
            </div>
          </dl>
        </div>
      </div>
    </article>
  );
}
