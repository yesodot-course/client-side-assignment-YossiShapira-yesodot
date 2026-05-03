import { Alert, Box, Card, CardContent, CircularProgress, Divider, Typography } from "@mui/material";
import { formatCurrency } from "../../../shared/lib/formatters";
import { useDailyItem } from "../hooks/useDailyItem";

export function DailyItemCard(): JSX.Element {
  const { data, isLoading, isError } = useDailyItem();

  return (
    <Card variant="outlined" sx={{ height: "100%" }}>
      <CardContent sx={{ p: 2.5, textAlign: "start", direction: "rtl", display: "flex", flexDirection: "column", alignItems: "stretch" }}>
        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1.25 }}>
          המוצר הרווחי ביותר (24 שעות)
        </Typography>
        <Divider sx={{ mb: 1.5 }} />
        {isLoading ? (
          <Box sx={{ py: 1 }}>
            <CircularProgress size={22} />
          </Box>
        ) : isError ? (
          <Alert severity="error" sx={{ width: "100%" }}>
            לא ניתן לטעון נתוני פריט יומי.
          </Alert>
        ) : data ? (
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {data.itemName} ({formatCurrency(data.totalProfit)})
          </Typography>
        ) : (
          <Typography color="text.secondary">עדיין אין נתונים</Typography>
        )}
      </CardContent>
    </Card>
  );
}
