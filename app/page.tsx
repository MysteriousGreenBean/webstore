import Link from "next/link";
import { ArrowIcon } from "@/components/icons";
import { ProductCard } from "@/components/product-card";
import { searchProducts } from "@/lib/algolia";

const collections = [
  {
    name: "Computing",
    description: "Work, create and stay connected.",
    category: "Computers & Tablets",
    number: "01",
  },
  {
    name: "Home cinema",
    description: "Bring every scene closer.",
    category: "TV & Home Theater",
    number: "02",
  },
  {
    name: "Sound",
    description: "Personal audio to room-filling sound.",
    category: "Audio",
    number: "03",
  },
];

export default async function Home() {
  const featured = await searchProducts({
    query: "",
    brands: [],
    categories: [],
    freeShipping: false,
    page: 1,
  });

  return (
    <>
      <section className="hero">
        <div className="shell hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">The Moongazer edit · 2026</p>
            <h1>Technology for a more considered everyday.</h1>
            <p className="hero-intro">
              A curated catalogue of useful objects—selected for work, home and the spaces in between.
            </p>
            <Link className="text-link" href="/products">
              Explore the collection <ArrowIcon />
            </Link>
          </div>
          <div className="hero-object" aria-hidden="true">
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />
            <div className="orbit orbit-three" />
            <div className="orbit orbit-four" />
            <div className="hero-disc">
              <span>M</span>
            </div>
            <p>EST. MMXXVI</p>
          </div>
        </div>
      </section>

      <section className="shell collection-section" aria-labelledby="collection-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Shop by collection</p>
            <h2 id="collection-title">Find your focus</h2>
          </div>
          <Link href="/products">View all products</Link>
        </div>
        <div className="collection-grid">
          {collections.map((collection) => (
            <Link
              className="collection-card"
              key={collection.category}
              href={`/products?category=${encodeURIComponent(collection.category)}`}
            >
              <span className="collection-number">{collection.number}</span>
              <div>
                <h3>{collection.name}</h3>
                <p>{collection.description}</p>
              </div>
              <ArrowIcon />
            </Link>
          ))}
        </div>
      </section>

      <section className="featured-section" aria-labelledby="featured-title">
        <div className="shell">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Popular now</p>
              <h2 id="featured-title">The essentials</h2>
            </div>
          </div>
          <div className="product-grid featured-grid">
            {featured.hits.slice(0, 4).map((product, index) => (
              <ProductCard key={product.objectID} product={product} priority={index < 2} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
