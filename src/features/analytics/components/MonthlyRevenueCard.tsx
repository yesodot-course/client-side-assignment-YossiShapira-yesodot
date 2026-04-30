import { Alert, Box, Card, CardContent, CircularProgress, Divider, Typography } from "@mui/material";
import { useMonthlyRevenue } from "../hooks/useMonthlyRevenue";

export function MonthlyRevenueCard(): JSX.Element {
  const { data, isLoading, isError } = useMonthlyRevenue();

  return (
    <Card variant="outlined" sx={{ height: "100%" }}>
      <CardContent sx={{ p: 2.5, textAlign: "right", direction: "rtl", display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1.25 }}>
          הכנסות חודשיות (30 ימים)
        </Typography>
        <Divider sx={{ mb: 1.5 }} />
        {isLoading ? (
          <Box sx={{ py: 1 }}>
            <CircularProgress size={22} />
          </Box>
        ) : isError ? (
          <Alert severity="error" sx={{ width: "100%" }}>
            לא ניתן לטעון הכנסות חודשיות.
          </Alert>
        ) : (
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            ${(data?.revenue ?? 0).toFixed(2)}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
