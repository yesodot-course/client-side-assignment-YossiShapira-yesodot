export const queryKeys = {
  items: ["items"] as const,
  itemById: (id: string) => ["items", id] as const,
  suppliers: ["suppliers"] as const,
  supplierById: (id: string) => ["suppliers", id] as const,
  orders: ["orders"] as const,
  orderById: (id: string) => ["orders", id] as const,
  analytics: ["analytics"] as const,
} as const;
