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
import { orderStatusChipColor, orderStatusLabelHe } from "../utils/orderStatusLabel";

/** `%` widths via colgroup; first column is visually right in RTL — sums to 100%. */
const ORDERS_COL_WIDTH_PCT = [22, 11, 16, 18, 15, 18] as const;

const ordersTableSx = {
  direction: "rtl" as const,
  tableLayout: "fixed",
  width: "100%",
  "& .MuiTableCell-root": { px: 1.25, py: 1.25 },
} as const;

const ellipsisCellSx = {
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  verticalAlign: "middle",
  maxWidth: 0, // lets table-fixed + % cols honor ellipsis reliably
} as const;

const ellipsisTextSx = {
  display: "block",
  minWidth: 0,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
} as const;

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
            id="admin-orders-search"
            label="חיפוש הזמנות (לקוח/כתובת)"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            fullWidth
            variant="outlined"
            dir="rtl"
            sx={{
              direction: "rtl",
              "& .MuiOutlinedInput-input": { textAlign: "right" },
              "& .MuiOutlinedInput-notchedOutline": { textAlign: "right" },
              "& label.MuiInputLabel-root": {
                left: "auto",
                right: 14,
                transformOrigin: "top right",
              },
              "& label.MuiInputLabel-root:not(.MuiInputLabel-shrink)": {
                transform: "translate(0, 16px) scale(1)",
              },
              "& label.MuiInputLabel-root.MuiInputLabel-shrink": {
                transform: "translate(0, -9px) scale(0.75)",
              },
            }}
            slotProps={{ htmlInput: { dir: "rtl", style: { textAlign: "right" } } }}
          />
        </Box>
        <Box sx={{ mb: 1, display: "flex", justifyContent: "flex-start" }}>
          <FormControlLabel
            control={<Checkbox checked={showInactive} onChange={(event) => setShowInactive(event.target.checked)} size="small" />}
            label="הצג גם הזמנות לא פעילות"
          />
        </Box>
        <TableContainer dir="rtl" sx={{ direction: "rtl", overflowX: "auto" }}>
          <Table dir="rtl" size="small" sx={ordersTableSx}>
            <colgroup>
              {ORDERS_COL_WIDTH_PCT.map((pct, index) => (
                <col key={index} style={{ width: `${pct}%` }} />
              ))}
            </colgroup>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, verticalAlign: "middle" }} align="right">
                  מס׳ הזמנה
                </TableCell>
                <TableCell sx={{ fontWeight: 600, verticalAlign: "middle" }} align="right">
                  לקוח
                </TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="center">
                  סה״כ פריטים
                </TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="right">
                  סה״כ מחיר
                </TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="center">
                  סטטוס
                </TableCell>
                <TableCell sx={{ fontWeight: 600 }} />
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
                  <TableCell sx={ellipsisCellSx} align="right">
                    <Typography component="span" variant="body2" title={order._id} sx={ellipsisTextSx}>
                      {order._id}
                    </Typography>
                  </TableCell>
                  <TableCell sx={ellipsisCellSx} align="right">
                    <Typography component="span" variant="body2" title={order.customerId} sx={ellipsisTextSx}>
                      {order.customerId}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">{getTotalItems(order)}</TableCell>
                  <TableCell align="right">{formatCurrency(order.totalPrice)}</TableCell>
                  <TableCell align="center">
                    <Chip size="small" color={orderStatusChipColor(order.status)} label={orderStatusLabelHe(order.status)} />
                  </TableCell>
                  <TableCell sx={{ verticalAlign: "middle" }}>
                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 1,
                        justifyContent: "flex-end",
                        alignItems: "center",
                      }}
                    >
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
