import type { Item } from "../../items/types";
import type { CartItem } from "../types";

export function buildRecommendations(itemsInCart: CartItem[], allItems: Item[], limit = 4): Item[] {
  if (itemsInCart.length === 0 || allItems.length === 0) {
    return [];
  }

  const categoriesInCart = new Set(
    itemsInCart
      .map((item) => item.category?.trim())
      .filter((category): category is string => Boolean(category && category.length > 0))
  );
  const itemIdsInCart = new Set(itemsInCart.map((item) => item.id));

  const sameCategory = allItems.filter(
    (item) => categoriesInCart.has(item.category) && !itemIdsInCart.has(item._id) && item.stock > 0
  );

  const fallback = allItems.filter((item) => !itemIdsInCart.has(item._id) && item.stock > 0);

  const recommendationPool = sameCategory.length > 0 ? sameCategory : fallback;
  return recommendationPool.slice(0, limit);
}