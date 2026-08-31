import { NextResponse } from "next/server";
import type { CheckoutPayload } from "@/lib/types";

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function validateCheckout(value: unknown): value is CheckoutPayload {
  if (!value || typeof value !== "object") return false;
  const payload = value as Partial<CheckoutPayload>;
  if (
    !isNonEmptyString(payload.idempotencyKey) ||
    payload.currency !== "USD" ||
    !payload.customer ||
    !isNonEmptyString(payload.customer.name) ||
    !isNonEmptyString(payload.customer.email) ||
    !payload.customer.email.includes("@") ||
    !payload.shippingAddress ||
    !isNonEmptyString(payload.shippingAddress.line1) ||
    !isNonEmptyString(payload.shippingAddress.city) ||
    !isNonEmptyString(payload.shippingAddress.postalCode) ||
    !isNonEmptyString(payload.shippingAddress.country) ||
    !Array.isArray(payload.items) ||
    payload.items.length === 0 ||
    payload.items.length > 50
  ) {
    return false;
  }

  return payload.items.every(
    (item) =>
      isNonEmptyString(item.productId) &&
      isNonEmptyString(item.name) &&
      typeof item.unitPrice === "number" &&
      Number.isFinite(item.unitPrice) &&
      item.unitPrice >= 0 &&
      Number.isInteger(item.quantity) &&
      item.quantity > 0 &&
      item.quantity <= 99,
  );
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }

  if (!validateCheckout(body)) {
    return NextResponse.json({ error: "Checkout payload is incomplete or invalid." }, { status: 422 });
  }

  // A real commerce service would reload products and prices from an authoritative
  // catalogue. The mock still recalculates the total rather than trusting `totals`.
  const acceptedTotal = body.items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0,
  );
  const orderId = `MG-${Date.now().toString(36).toUpperCase()}-${crypto.randomUUID().slice(0, 6).toUpperCase()}`;

  console.info("[mock-checkout]", {
    orderId,
    idempotencyKey: body.idempotencyKey,
    itemCount: body.items.reduce((sum, item) => sum + item.quantity, 0),
    total: acceptedTotal,
    currency: body.currency,
    submittedAt: body.submittedAt,
  });

  return NextResponse.json(
    {
      orderId,
      status: "accepted",
      total: acceptedTotal,
      currency: body.currency,
    },
    { status: 201 },
  );
}
