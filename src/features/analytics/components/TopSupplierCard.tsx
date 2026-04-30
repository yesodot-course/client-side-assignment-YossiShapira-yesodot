import { Box, Card, CardContent, CircularProgress, Divider, Typography } from "@mui/material";
import { useTopSupplier } from "../hooks/useTopSupplier";

export function TopSupplierCard(): JSX.Element {
  const { data, isLoading } = useTopSupplier();

  return (
    <Card variant="outlined" sx={{ height: "100%" }}>
      <CardContent sx={{ p: 2.5, textAlign: "right", direction: "rtl", display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1.25 }}>
          הספק הרווחי ביותר
        </Typography>
        <Divider sx={{ mb: 1.5 }} />
        {isLoading ? (
          <Box sx={{ py: 1 }}>
            <CircularProgress size={22} />
          </Box>
        ) : data ? (
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {data.supplierName} (${data.totalProfit.toFixed(2)})
          </Typography>
        ) : (
          <Typography color="text.secondary">עדיין אין נתונים</Typography>
        )}
      </CardContent>
    </Card>
  );
}
