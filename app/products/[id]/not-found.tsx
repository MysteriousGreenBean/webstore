import Link from "next/link";

export default function ProductNotFound() {
  return (
    <div className="shell empty-state standalone">
      <p className="eyebrow">404 · Product not found</p>
      <h1>This product is no longer available.</h1>
      <p>Explore the current collection to find something else.</p>
      <Link className="primary-link" href="/products">
        Back to all products
      </Link>
    </div>
  );
}
