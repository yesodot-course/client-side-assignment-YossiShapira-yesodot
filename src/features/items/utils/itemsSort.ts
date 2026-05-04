import type { Item } from "../types";

export function sortItemsByName(items: Item[]): Item[] {
  return [...items].sort((a, b) => a.name.localeCompare(b.name));
}