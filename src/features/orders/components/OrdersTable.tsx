import { useMemo, useState } from "react";
import {
  Box,
  Button,
  Chip,
  Checkbox,
  FormControlLabel,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useOrders } from "../hooks/useOrders";
import { useSearchOrders } from "../hooks/useSearchOrders";
import { useUpdateOrder } from "../hooks/useUpdateOrder";
import type { Order } from "../types";
import { formatCurrency } from "../../../shared/lib/formatters";
import { showToast } from "../../../shared/ui/feedback/toast";
import { ApiError } from "../../../shared/api/apiError";

export function OrdersTable(): JSX.Element {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [showInactive, setShowInactive] = useState(false);

  const { data, isLoading } = useOrders();
  const searchedOrdersQuery = useSearchOrders(searchTerm);
  const updateOrderMutation = useUpdateOrder();

  const rows = useMemo(() => {
    if (searchTerm.trim().length > 0) {
      return searchedOrdersQuery.data ?? [];
    }
    return data ?? [];
  }, [data, searchTerm, searchedOrdersQuery.data]);

  const visibleRows = useMemo(() => {
    if (showInactive) {
      return rows;
    }
    return rows.filter((order) => (order.status ?? "Pending") === "Pending");
  }, [rows, showInactive]);

  const getTotalItems = (order: Order): number => {
    if (typeof order.totalItemsQuantity === "number" && Number.isFinite(order.totalItemsQuantity)) {
      return order.totalItemsQuantity;
    }
    return (order.items ?? []).reduce((sum, item) => sum + item.quantity, 0);
  };

  if (isLoading || (searchTerm.trim().length > 0 && searchedOrdersQuery.isLoading)) {
    return <Typography>טוען הזמנות...</Typography>;
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
      <Typography variant="h5" sx={{ fontWeight: 700, alignSelf: "flex-start", textAlign: "start" }}>
        הזמנות
      </Typography>
      <Paper variant="outlined" sx={{ p: 2.5 }}>
        <Box sx={{ mb: 2 }}>
          <TextField
            label="חיפוש הזמנות (לקוח/כתובת)"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            fullWidth
          />
        </Box>
        <Box sx={{ mb: 1, display: "flex", justifyContent: "flex-start" }}>
          <FormControlLabel
            control={<Checkbox checked={showInactive} onChange={(event) => setShowInactive(event.target.checked)} size="small" />}
            label="הצג גם הזמנות לא פעילות"
          />
        </Box>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>מס׳ הזמנה</TableCell>
                <TableCell>לקוח</TableCell>
                <TableCell>סה״כ פריטים</TableCell>
                <TableCell>סה״כ מחיר</TableCell>
                <TableCell>סטטוס</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {visibleRows.map((order) => (
                <TableRow
                  key={order._id}
                  hover
                  onClick={() => navigate(`/orders/${order._id}`)}
                  sx={{ cursor: "pointer" }}
                >
                  <TableCell>{order._id}</TableCell>
                  <TableCell>{order.customerId}</TableCell>
                  <TableCell>{getTotalItems(order)}</TableCell>
                  <TableCell>{formatCurrency(order.totalPrice)}</TableCell>
                  <TableCell>
                    {(order.status ?? "Pending") === "Pending" ? (
                      <Chip size="small" color="success" label="פעיל" />
                    ) : (
                      <Chip size="small" color="default" label="לא פעיל" />
                    )}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-start" }}>
                      <Button
                        size="small"
                        variant="outlined"
                        color="success"
                        disabled={order.status === "Completed" || order.status === "Cancelled" || updateOrderMutation.isPending}
                        onClick={(event) => {
                          event.stopPropagation();
                          updateOrderMutation.mutate(
                            { id: order._id, payload: { status: "Completed" } },
                            {
                              onSuccess: () => showToast("ההזמנה נסגרה בהצלחה"),
                              onError: (error) => showToast(error instanceof ApiError ? error.message : "סגירת ההזמנה נכשלה"),
                            }
                          );
                        }}
                      >
                        סגור
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        disabled={order.status === "Cancelled" || order.status === "Completed" || updateOrderMutation.isPending}
                        onClick={(event) => {
                          event.stopPropagation();
                          updateOrderMutation.mutate(
                            { id: order._id, payload: { status: "Cancelled" } },
                            {
                              onSuccess: () => showToast("ההזמנה בוטלה"),
                              onError: (error) => showToast(error instanceof ApiError ? error.message : "ביטול ההזמנה נכשל"),
                            }
                          );
                        }}
                      >
                        בטל
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}
