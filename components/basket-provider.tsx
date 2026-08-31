"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { trackEvent } from "@/lib/analytics";
import type { BasketItem, Product } from "@/lib/types";

const STORAGE_KEY = "moongazer-basket-v1";

type BasketContextValue = {
  items: BasketItem[];
  itemCount: number;
  subtotal: number;
  hydrated: boolean;
  addItem: (product: Product) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearBasket: () => void;
};

const BasketContext = createContext<BasketContextValue | null>(null);

function isBasketItem(value: unknown): value is BasketItem {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<BasketItem>;
  return (
    typeof item.productId === "string" &&
    typeof item.name === "string" &&
    typeof item.unitPrice === "number" &&
    Number.isFinite(item.unitPrice) &&
    typeof item.quantity === "number" &&
    Number.isInteger(item.quantity) &&
    item.quantity > 0
  );
}

function readStoredBasket() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    const parsed: unknown = stored ? JSON.parse(stored) : [];
    return Array.isArray(parsed) ? parsed.filter(isBasketItem) : [];
  } catch {
    return [];
  }
}

export function BasketProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<BasketItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [announcement, setAnnouncement] = useState("");

  useEffect(() => {
    // Browser storage is intentionally read after hydration to keep SSR deterministic.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setItems(readStoredBasket());
    setHydrated(true);

    const syncAcrossTabs = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) setItems(readStoredBasket());
    };
    window.addEventListener("storage", syncAcrossTabs);
    return () => window.removeEventListener("storage", syncAcrossTabs);
  }, []);

  useEffect(() => {
    if (hydrated) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [hydrated, items]);

  const addItem = useCallback((product: Product) => {
    setItems((current) => {
      const existing = current.find((item) => item.productId === product.objectID);
      if (existing) {
        return current.map((item) =>
          item.productId === product.objectID
            ? { ...item, quantity: Math.min(item.quantity + 1, 99) }
            : item,
        );
      }

      return [
        ...current,
        {
          productId: product.objectID,
          name: product.name,
          brand: product.brand,
          image: product.image,
          unitPrice: product.price,
          quantity: 1,
        },
      ];
    });
    setAnnouncement(`${product.name} added to your basket.`);
    trackEvent({
      name: "product_added",
      properties: {
        productId: product.objectID,
        productName: product.name,
        brand: product.brand,
        price: product.price,
        currency: "USD",
        quantity: 1,
      },
    });
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    const safeQuantity = Math.max(0, Math.min(Math.floor(quantity), 99));
    setItems((current) =>
      safeQuantity === 0
        ? current.filter((item) => item.productId !== productId)
        : current.map((item) =>
            item.productId === productId
              ? { ...item, quantity: safeQuantity }
              : item,
          ),
    );
    setAnnouncement(
      safeQuantity === 0 ? "Item removed from basket." : "Basket quantity updated.",
    );
    trackEvent({
      name: "basket_updated",
      properties: { productId, quantity: safeQuantity },
    });
  }, []);

  const removeItem = useCallback(
    (productId: string) => updateQuantity(productId, 0),
    [updateQuantity],
  );

  const clearBasket = useCallback(() => {
    setItems([]);
    setAnnouncement("Basket cleared.");
  }, []);

  const value = useMemo(
    () => ({
      items,
      itemCount: items.reduce((total, item) => total + item.quantity, 0),
      subtotal: items.reduce(
        (total, item) => total + item.unitPrice * item.quantity,
        0,
      ),
      hydrated,
      addItem,
      updateQuantity,
      removeItem,
      clearBasket,
    }),
    [
      addItem,
      clearBasket,
      hydrated,
      items,
      removeItem,
      updateQuantity,
    ],
  );

  return (
    <BasketContext.Provider value={value}>
      {children}
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {announcement}
      </p>
    </BasketContext.Provider>
  );
}

export function useBasket() {
  const value = useContext(BasketContext);
  if (!value) throw new Error("useBasket must be used inside BasketProvider");
  return value;
}
