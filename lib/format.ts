export const formatPrice = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);

export function getPrimaryCategory(
  categories?: ProductCategorySource,
): string | undefined {
  if (!categories) return undefined;
  if (Array.isArray(categories)) return categories[0];
  return categories;
}

type ProductCategorySource = string | string[];
