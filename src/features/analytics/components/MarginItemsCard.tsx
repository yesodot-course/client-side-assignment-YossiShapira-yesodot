import { Box, Card, CardContent, CircularProgress, Divider, Typography } from "@mui/material";
import { useMarginItems } from "../hooks/useMarginItems";

export function MarginItemsCard(): JSX.Element {
  const { data, isLoading } = useMarginItems();

  return (
    <Card variant="outlined" sx={{ height: "100%" }}>
      <CardContent sx={{ p: 2.5, textAlign: "right", direction: "rtl", display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1.25 }}>
          המוצרים עם שיעור הרווח הגבוה והנמוך ביותר
        </Typography>
        <Divider sx={{ mb: 1.5 }} />
        {isLoading ? (
          <Box sx={{ py: 1 }}>
            <CircularProgress size={22} />
          </Box>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1, alignItems: "flex-end", width: "100%" }}>
            <Typography>
              הגבוה ביותר: {data?.highest ? `${data.highest.name} (${(data.highest.margin * 100).toFixed(1)}%)` : "אין"}
            </Typography>
            <Typography>
              הנמוך ביותר: {data?.lowest ? `${data.lowest.name} (${(data.lowest.margin * 100).toFixed(1)}%)` : "אין"}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
