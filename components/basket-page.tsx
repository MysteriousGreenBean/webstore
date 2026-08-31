"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useBasket } from "@/components/basket-provider";
import { MinusIcon, PlusIcon, TrashIcon } from "@/components/icons";
import { trackEvent } from "@/lib/analytics";
import { formatPrice } from "@/lib/format";
import type { CheckoutPayload } from "@/lib/types";

type CheckoutState =
  | { status: "idle" | "submitting" }
  | { status: "error"; message: string }
  | { status: "success"; orderId: string };

export function BasketPage() {
  const {
    items,
    itemCount,
    subtotal,
    hydrated,
    updateQuantity,
    removeItem,
    clearBasket,
  } = useBasket();
  const [checkout, setCheckout] = useState<CheckoutState>({ status: "idle" });

  if (!hydrated) {
    return (
      <div className="shell basket-page" aria-busy="true">
        <p>Loading your basket…</p>
      </div>
    );
  }

  if (checkout.status === "success") {
    return (
      <div className="shell confirmation" role="status">
        <p className="confirmation-mark" aria-hidden="true">✓</p>
        <p className="eyebrow">Order received</p>
        <h1>Thank you.</h1>
        <p>
          Your mock order reference is <strong>{checkout.orderId}</strong>. No payment has been taken.
        </p>
        <Link className="primary-link" href="/products">Continue shopping</Link>
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="shell empty-state standalone">
        <p className="eyebrow">Your basket</p>
        <h1>There’s nothing here yet.</h1>
        <p>Your selections will be saved in this browser between visits.</p>
        <Link className="primary-link" href="/products">Explore products</Link>
      </div>
    );
  }

  const shipping = 0;
  const total = subtotal + shipping;

  const submitCheckout = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const payload: CheckoutPayload = {
      idempotencyKey: crypto.randomUUID(),
      customer: {
        name: String(data.get("name")),
        email: String(data.get("email")),
      },
      shippingAddress: {
        line1: String(data.get("address")),
        city: String(data.get("city")),
        postalCode: String(data.get("postalCode")),
        country: String(data.get("country")),
      },
      items: items.map((item) => ({
        productId: item.productId,
        name: item.name,
        unitPrice: item.unitPrice,
        quantity: item.quantity,
      })),
      currency: "USD",
      totals: { subtotal, shipping, total },
      submittedAt: new Date().toISOString(),
    };

    setCheckout({ status: "submitting" });
    trackEvent({
      name: "checkout_started",
      properties: { itemCount, value: total, currency: "USD" },
    });

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = (await response.json()) as { orderId?: string; error?: string };
      if (!response.ok || !body.orderId) {
        throw new Error(body.error ?? "Checkout could not be completed.");
      }
      trackEvent({
        name: "checkout_completed",
        properties: {
          orderId: body.orderId,
          itemCount,
          value: total,
          currency: "USD",
        },
      });
      clearBasket();
      setCheckout({ status: "success", orderId: body.orderId });
    } catch (error) {
      setCheckout({
        status: "error",
        message: error instanceof Error ? error.message : "Checkout could not be completed.",
      });
    }
  };

  return (
    <div className="shell basket-page">
      <header className="basket-header">
        <div>
          <p className="eyebrow">Your selection</p>
          <h1>Basket</h1>
        </div>
        <p>{itemCount} {itemCount === 1 ? "item" : "items"}</p>
      </header>

      <div className="basket-layout">
        <section aria-labelledby="basket-items-heading">
          <h2 id="basket-items-heading" className="sr-only">Basket items</h2>
          <ul className="basket-items">
            {items.map((item) => (
              <li key={item.productId} className="basket-item">
                <Link href={`/products/${item.productId}`} className="basket-item-image">
                  {item.image ? (
                    <Image src={item.image} alt="" fill sizes="112px" className="product-image" />
                  ) : (
                    <span className="image-placeholder" aria-hidden="true">M</span>
                  )}
                </Link>
                <div className="basket-item-copy">
                  <p className="eyebrow">{item.brand ?? "Moongazer edit"}</p>
                  <h2><Link href={`/products/${item.productId}`}>{item.name}</Link></h2>
                  <p className="price">{formatPrice(item.unitPrice)}</p>
                  <div className="quantity-controls">
                    <span id={`quantity-${item.productId}`}>Quantity</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      aria-label={`Decrease quantity of ${item.name}`}
                    >
                      <MinusIcon />
                    </button>
                    <output aria-live="polite" aria-labelledby={`quantity-${item.productId}`}>
                      {item.quantity}
                    </output>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      aria-label={`Increase quantity of ${item.name}`}
                    >
                      <PlusIcon />
                    </button>
                  </div>
                </div>
                <div className="basket-item-end">
                  <p>{formatPrice(item.unitPrice * item.quantity)}</p>
                  <button
                    className="remove-button"
                    type="button"
                    onClick={() => removeItem(item.productId)}
                  >
                    <TrashIcon /> Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <aside className="checkout-panel" aria-labelledby="checkout-heading">
          <h2 id="checkout-heading">Checkout</h2>
          <dl className="totals">
            <div><dt>Subtotal</dt><dd>{formatPrice(subtotal)}</dd></div>
            <div><dt>Shipping</dt><dd>Complimentary</dd></div>
            <div className="total-row"><dt>Total</dt><dd>{formatPrice(total)}</dd></div>
          </dl>

          <form className="checkout-form" onSubmit={submitCheckout}>
            <p className="form-note">Mock checkout—no payment will be taken.</p>
            <div className="field">
              <label htmlFor="checkout-name">Full name</label>
              <input id="checkout-name" name="name" autoComplete="name" required />
            </div>
            <div className="field">
              <label htmlFor="checkout-email">Email</label>
              <input id="checkout-email" name="email" type="email" autoComplete="email" required />
            </div>
            <div className="field">
              <label htmlFor="checkout-address">Address</label>
              <input id="checkout-address" name="address" autoComplete="street-address" required />
            </div>
            <div className="field-row">
              <div className="field">
                <label htmlFor="checkout-city">City</label>
                <input id="checkout-city" name="city" autoComplete="address-level2" required />
              </div>
              <div className="field">
                <label htmlFor="checkout-postcode">Postal code</label>
                <input id="checkout-postcode" name="postalCode" autoComplete="postal-code" required />
              </div>
            </div>
            <div className="field">
              <label htmlFor="checkout-country">Country</label>
              <select id="checkout-country" name="country" autoComplete="country-name" defaultValue="US">
                <option value="US">United States</option>
                <option value="GB">United Kingdom</option>
                <option value="PL">Poland</option>
                <option value="CH">Switzerland</option>
              </select>
            </div>
            {checkout.status === "error" ? (
              <p className="form-error" role="alert">{checkout.message}</p>
            ) : null}
            <button className="checkout-button" type="submit" disabled={checkout.status === "submitting"}>
              {checkout.status === "submitting" ? "Submitting…" : `Place mock order · ${formatPrice(total)}`}
            </button>
          </form>
        </aside>
      </div>
    </div>
  );
}
