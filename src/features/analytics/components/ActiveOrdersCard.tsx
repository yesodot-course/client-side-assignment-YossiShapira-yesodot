import { Alert, Box, Card, CardContent, CircularProgress, Divider, Typography } from "@mui/material";
import { useOrders } from "../../orders/hooks/useOrders";

export function ActiveOrdersCard(): JSX.Element {
  const { data, isLoading, isError } = useOrders();
  const orders = data ?? [];
  const activeOrdersCount = orders.filter((order) => (order.status ?? "Pending") === "Pending").length;

  return (
    <Card variant="outlined" sx={{ height: "100%" }}>
      <CardContent sx={{ p: 2.5, textAlign: "start", direction: "rtl", display: "flex", flexDirection: "column", alignItems: "stretch" }}>
        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1.25 }}>
          הזמנות פעילות
        </Typography>
        <Divider sx={{ mb: 1.5 }} />
        {isLoading ? (
          <Box sx={{ py: 1 }}>
            <CircularProgress size={22} />
          </Box>
        ) : isError ? (
          <Alert severity="error" sx={{ width: "100%" }}>
            לא ניתן לטעון נתוני הזמנות.
          </Alert>
        ) : (
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            {activeOrdersCount}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
