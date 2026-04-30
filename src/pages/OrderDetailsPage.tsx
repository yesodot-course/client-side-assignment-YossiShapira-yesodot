import { useEffect, useMemo, useState } from "react";
import { Alert, Autocomplete, Avatar, Box, Button, CircularProgress, IconButton, Paper, TextField, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useNavigate, useParams } from "react-router-dom";
import { useOrderDetails } from "../features/orders/hooks/useOrderDetails";
import { useUpdateOrder } from "../features/orders/hooks/useUpdateOrder";
import { useItems } from "../features/items/hooks/useItems";
import { showToast } from "../shared/ui/feedback/toast";
import { ApiError } from "../shared/api/apiError";
import type { CreateOrderItemInput, OrderItemRef } from "../features/orders/types";

type EditableOrderItem = {
  item: string;
  quantity: string;
};

const getOrderItemId = (item: string | OrderItemRef): string => {
  if (typeof item === "string") {
    return item;
  }
  return item?._id ?? "";
};

export function OrderDetailsPage(): JSX.Element {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const orderQuery = useOrderDetails(id ?? "");
  const itemsQuery = useItems();
  const updateOrderMutation = useUpdateOrder();

  const [customerId, setCustomerId] = useState("");
  const [address, setAddress] = useState("");
  const [editableItems, setEditableItems] = useState<EditableOrderItem[]>([]);
  const availableItems = itemsQuery.data ?? [];
  const itemsMap = useMemo(() => new Map(availableItems.map((item) => [item._id, item])), [availableItems]);

  useEffect(() => {
    if (!orderQuery.data) {
      return;
    }
    setCustomerId(orderQuery.data.customerId);
    setAddress(orderQuery.data.address);
    setEditableItems(
      (orderQuery.data.items ?? []).map((orderItem) => ({
        item: getOrderItemId(orderItem.item),
        quantity: String(orderItem.quantity),
      }))
    );
  }, [orderQuery.data]);

  if (!id) {
    return <Alert severity="error">מזהה הזמנה חסר.</Alert>;
  }
  if (orderQuery.isLoading || itemsQuery.isLoading) {
    return <CircularProgress />;
  }
  if (orderQuery.isError || !orderQuery.data) {
    return <Alert severity="error">טעינת ההזמנה נכשלה.</Alert>;
  }

  const order = orderQuery.data;
  const isLocked = order.status === "Completed" || order.status === "Cancelled";

  const buildItemsPayload = (): CreateOrderItemInput[] | null => {
    const parsed = editableItems.map((entry) => ({
      item: entry.item,
      quantity: Number(entry.quantity),
    }));
    if (parsed.length === 0) {
      showToast("יש להזמנה לפחות פריט אחד.");
      return null;
    }
    if (parsed.some((entry) => !entry.item || !Number.isFinite(entry.quantity) || entry.quantity < 1)) {
      showToast("יש להזין פריטים וכמויות תקינות.");
      return null;
    }
    const uniqueItems = new Set(parsed.map((entry) => entry.item));
    if (uniqueItems.size !== parsed.length) {
      showToast("אין להזין אותו פריט פעמיים.");
      return null;
    }
    return parsed;
  };

  const submitUpdate = (nextStatus: "Pending" | "Completed" | "Cancelled") => {
    if (isLocked) {
      showToast("לא ניתן לערוך הזמנה סגורה או מבוטלת.");
      return;
    }
    const isStatusOnlyUpdate = nextStatus === "Completed" || nextStatus === "Cancelled";

    if (!isStatusOnlyUpdate) {
      if (customerId.trim().length === 0 || address.trim().length === 0) {
        showToast("יש למלא מזהה לקוח וכתובת.");
        return;
      }
      const itemsPayload = buildItemsPayload();
      if (!itemsPayload) {
        return;
      }

      updateOrderMutation.mutate(
        {
          id,
          payload: {
            customerId: customerId.trim(),
            address: address.trim(),
            items: itemsPayload,
            status: nextStatus,
          },
        },
        {
          onSuccess: () => {
            showToast("ההזמנה עודכנה");
            void orderQuery.refetch();
          },
          onError: (error) => {
            showToast(error instanceof ApiError ? error.message : "עדכון ההזמנה נכשל");
          },
        }
      );
      return;
    }

    updateOrderMutation.mutate(
      {
        id,
        payload: {
          status: nextStatus,
        },
      },
      {
        onSuccess: () => {
          showToast(nextStatus === "Completed" ? "ההזמנה נסגרה בהצלחה" : "ההזמנה בוטלה");
          void orderQuery.refetch();
        },
        onError: (error) => {
          showToast(error instanceof ApiError ? error.message : "עדכון ההזמנה נכשל");
        },
      }
    );
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, direction: "rtl", textAlign: "right" }}>
      <Button
        variant="text"
        endIcon={<ArrowForwardIosIcon fontSize="small" />}
        sx={{ alignSelf: "flex-end" }}
        onClick={() => navigate("/admin?tab=orders")}
      >
        חזרה להזמנות
      </Button>
      <Typography variant="h4">פרטי הזמנה</Typography>
      <Paper variant="outlined" sx={{ p: 2, display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography variant="body2">סטטוס: {order.status ?? "Pending"}</Typography>
        <Typography variant="body2">נפתחה: {order.openedAt ? new Date(order.openedAt).toLocaleString() : "-"}</Typography>
        <Typography variant="body2">נסגרה: {order.closedAt ? new Date(order.closedAt).toLocaleString() : "-"}</Typography>
        <TextField label="מזהה לקוח" value={customerId} onChange={(event) => setCustomerId(event.target.value)} disabled={isLocked} />
        <TextField label="כתובת" value={address} onChange={(event) => setAddress(event.target.value)} disabled={isLocked} />

        <Typography variant="h6">פריטים בהזמנה</Typography>
        {editableItems.length === 0 ? (
          <Alert severity="info">אין כרגע פריטים בהזמנה. אפשר להוסיף פריט חדש.</Alert>
        ) : null}
        {editableItems.map((entry, index) => (
          <Box key={`${entry.item}-${index}`} sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <Box sx={{ width: 42, height: 42, flexShrink: 0 }}>
              {entry.item && itemsMap.get(entry.item)?.imageUrl ? (
                <Avatar
                  variant="rounded"
                  src={itemsMap.get(entry.item)?.imageUrl ?? undefined}
                  alt={itemsMap.get(entry.item)?.name ?? "תמונת מוצר"}
                  sx={{ width: 42, height: 42, bgcolor: "grey.100", color: "text.secondary" }}
                />
              ) : null}
            </Box>
            <Autocomplete
              options={availableItems}
              getOptionLabel={(option) => option.name}
              isOptionEqualToValue={(option, value) => option._id === value._id}
              value={availableItems.find((item) => item._id === entry.item) ?? null}
              onChange={(_event, value) => {
                setEditableItems((prev) => prev.map((item, i) => (i === index ? { ...item, item: value?._id ?? "" } : item)));
              }}
              renderInput={(params) => <TextField {...params} label="פריט" />}
              renderOption={(props, option) => (
                <Box component="li" {...props} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  {option.imageUrl ? (
                    <Avatar
                      variant="rounded"
                      src={option.imageUrl}
                      alt={option.name}
                      sx={{ width: 32, height: 32, bgcolor: "grey.100", color: "text.secondary" }}
                    />
                  ) : null}
                  <span>{option.name}</span>
                </Box>
              )}
              sx={{ flex: 1 }}
              disabled={isLocked}
            />
            <TextField
              label="כמות"
              type="number"
              value={entry.quantity}
              onChange={(event) => {
                setEditableItems((prev) => prev.map((item, i) => (i === index ? { ...item, quantity: event.target.value } : item)));
              }}
              sx={{ width: 120 }}
              disabled={isLocked}
            />
            <Typography variant="caption" sx={{ minWidth: 120 }}>
              במלאי: {entry.item ? (itemsMap.get(entry.item)?.stock ?? "-") : "-"}
            </Typography>
            <IconButton
              color="error"
              onClick={() => setEditableItems((prev) => prev.filter((_, i) => i !== index))}
              disabled={isLocked}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        ))}

        <Button variant="outlined" onClick={() => setEditableItems((prev) => [...prev, { item: "", quantity: "1" }])} disabled={isLocked}>
          הוסף פריט
        </Button>

        <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
          <Button variant="contained" onClick={() => submitUpdate("Pending")} disabled={isLocked || updateOrderMutation.isPending}>
            שמור שינויים
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={() => submitUpdate("Completed")}
            disabled={isLocked || updateOrderMutation.isPending}
          >
            סגור הזמנה
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => submitUpdate("Cancelled")}
            disabled={isLocked || updateOrderMutation.isPending}
          >
            בטל הזמנה
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
