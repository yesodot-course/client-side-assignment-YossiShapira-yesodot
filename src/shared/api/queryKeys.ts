export const queryKeys = {
  items: ["items"] as const,
  itemById: (id: string) => ["items", id] as const,
  suppliers: ["suppliers"] as const,
  orders: ["orders"] as const,
  analytics: ["analytics"] as const,
} as const;