import type { Item } from "../types";

export function filterItemsByText(items: Item[], searchTerm: string): Item[] {
  const normalizedSearch = searchTerm.trim().toLowerCase();
  if (!normalizedSearch) {
    return items;
  }

  return items.filter((item) => item.name.toLowerCase().includes(normalizedSearch));
}