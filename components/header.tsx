"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BagIcon } from "@/components/icons";
import { useBasket } from "@/components/basket-provider";

export function Header() {
  const pathname = usePathname();
  const { itemCount, hydrated } = useBasket();

  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Link className="wordmark" href="/" aria-label="Moongazer Supply, home">
          <span className="wordmark-mark" aria-hidden="true">
            M
          </span>
          <span>MOONGAZER</span>
        </Link>
        <nav aria-label="Main navigation">
          <ul className="nav-list">
            <li>
              <Link
                className={pathname === "/products" ? "nav-link active" : "nav-link"}
                href="/products"
              >
                Shop
              </Link>
            </li>
            <li>
              <Link className="basket-link" href="/basket">
                <BagIcon />
                <span>Basket</span>
                <span className="basket-count" aria-label={`${itemCount} items`}>
                  {hydrated ? itemCount : 0}
                </span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
