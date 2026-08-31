export type Product = {
  objectID: string;
  name: string;
  description?: string;
  brand?: string;
  categories?: string[];
  hierarchicalCategories?: {
    lvl0?: string | string[];
    lvl1?: string | string[];
  };
  type?: string;
  price: number;
  image?: string;
  url?: string;
  free_shipping?: boolean;
  popularity?: number;
  rating?: number;
};

export type FacetValues = Record<string, number>;

export type ProductSearchResult = {
  hits: Product[];
  nbHits: number;
  page: number;
  nbPages: number;
  hitsPerPage: number;
  queryID?: string;
  processingTimeMS?: number;
  facets?: Record<string, FacetValues>;
};

export type SearchFilters = {
  query: string;
  brands: string[];
  categories: string[];
  freeShipping: boolean;
  page: number;
};

export type BasketItem = {
  productId: string;
  name: string;
  brand?: string;
  image?: string;
  unitPrice: number;
  quantity: number;
};

export type CheckoutPayload = {
  idempotencyKey: string;
  customer: {
    name: string;
    email: string;
  };
  shippingAddress: {
    line1: string;
    city: string;
    postalCode: string;
    country: string;
  };
  items: Array<{
    productId: string;
    name: string;
    unitPrice: number;
    quantity: number;
  }>;
  currency: "USD";
  totals: {
    subtotal: number;
    shipping: number;
    total: number;
  };
  submittedAt: string;
};
