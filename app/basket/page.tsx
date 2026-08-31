import type { Metadata } from "next";
import { BasketPage } from "@/components/basket-page";

export const metadata: Metadata = {
  title: "Your basket",
  description: "Review your selections and complete mock checkout.",
};

export default function BasketRoute() {
  return <BasketPage />;
}
