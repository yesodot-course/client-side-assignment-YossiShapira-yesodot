import type { Order } from "../types";

/** תואם ל־`order.service` בשרת: סך יחידות לכל לקוח בכל ההזמנות (למעט הזמנה אחת בעדכון). */
export const MAX_ITEMS_PER_CUSTOMER_LIFETIME = 50;

function orderTotalQuantity(order: Order): number {
  if (typeof order.totalItemsQuantity === "number" && Number.isFinite(order.totalItemsQuantity)) {
    return order.totalItemsQuantity;
  }
  return (order.items ?? []).reduce((sum, line) => sum + line.quantity, 0);
}

export function sumPastItemsQuantityForCustomer(orders: Order[], customerId: string, excludeOrderId?: string): number {
  const id = customerId.trim();
  if (id.length === 0) {
    return 0;
  }
  return orders
    .filter((order) => order.customerId === id && (!excludeOrderId || order._id !== excludeOrderId))
    .reduce((sum, order) => sum + orderTotalQuantity(order), 0);
}
