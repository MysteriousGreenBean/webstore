"use client";

import { BagIcon } from "@/components/icons";
import { useBasket } from "@/components/basket-provider";
import type { Product } from "@/lib/types";

export function AddToBasketButton({
  product,
  compact = false,
}: {
  product: Product;
  compact?: boolean;
}) {
  const { addItem } = useBasket();

  return (
    <button
      className={compact ? "add-button compact" : "add-button"}
      type="button"
      onClick={() => addItem(product)}
      aria-label={compact ? `Add ${product.name} to basket` : undefined}
    >
      <BagIcon />
      <span>{compact ? "Add" : "Add to basket"}</span>
    </button>
  );
}
