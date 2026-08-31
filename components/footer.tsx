import Link from "next/link";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="shell footer-inner">
        <div>
          <p className="footer-brand">MOONGAZER SUPPLY</p>
          <p>Useful technology, thoughtfully selected.</p>
        </div>
        <nav aria-label="Footer navigation">
          <Link href="/products">All products</Link>
          <Link href="/basket">Basket</Link>
        </nav>
        <p className="footer-note">Technical demonstration storefront.</p>
      </div>
    </footer>
  );
}
