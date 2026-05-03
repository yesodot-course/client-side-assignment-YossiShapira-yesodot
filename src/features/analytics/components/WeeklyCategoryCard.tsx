import { Alert, Box, Card, CardContent, CircularProgress, Divider, Typography } from "@mui/material";
import { formatCurrency } from "../../../shared/lib/formatters";
import { useWeeklyCategory } from "../hooks/useWeeklyCategory";

export function WeeklyCategoryCard(): JSX.Element {
  const { data, isLoading, isError } = useWeeklyCategory();

  return (
    <Card variant="outlined" sx={{ height: "100%" }}>
      <CardContent sx={{ p: 2.5, textAlign: "start", direction: "rtl", display: "flex", flexDirection: "column", alignItems: "stretch" }}>
        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1.25 }}>
          הקטגוריה הרווחית ביותר (7 ימים)
        </Typography>
        <Divider sx={{ mb: 1.5 }} />
        {isLoading ? (
          <Box sx={{ py: 1 }}>
            <CircularProgress size={22} />
          </Box>
        ) : isError ? (
          <Alert severity="error" sx={{ width: "100%" }}>
            לא ניתן לטעון נתוני קטגוריה שבועית.
          </Alert>
        ) : data ? (
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {data._id} ({formatCurrency(data.totalProfit)})
          </Typography>
        ) : (
          <Typography color="text.secondary">עדיין אין נתונים</Typography>
        )}
      </CardContent>
    </Card>
  );
}
