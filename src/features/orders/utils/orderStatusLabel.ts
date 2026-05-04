import type { OrderStatus } from "../types";

const ORDER_STATUS_LABEL_HE: Record<OrderStatus, string> = {
  Pending: "ממתינה",
  Completed: "הושלמה",
  Cancelled: "בוטלה",
};

/** API / DB use English `OrderStatus`; this is display-only Hebrew. */
export function orderStatusLabelHe(status: OrderStatus | undefined | null): string {
  const key = (status ?? "Pending") as OrderStatus;
  return ORDER_STATUS_LABEL_HE[key] ?? String(status ?? "Pending");
}

export type OrderStatusChipColor = "success" | "error" | "default";

export function orderStatusChipColor(status: OrderStatus | undefined | null): OrderStatusChipColor {
  const s = status ?? "Pending";
  if (s === "Pending") return "success";
  if (s === "Cancelled") return "error";
  return "default";
}
