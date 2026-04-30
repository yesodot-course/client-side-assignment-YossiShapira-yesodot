import { Box, Typography } from "@mui/material";
import { ActiveOrdersCard } from "./ActiveOrdersCard";
import { DailyItemCard } from "./DailyItemCard";
import { MarginItemsCard } from "./MarginItemsCard";
import { MonthlyRevenueCard } from "./MonthlyRevenueCard";
import { SupplierSpendingTable } from "./SupplierSpendingTable";
import { TopSupplierCard } from "./TopSupplierCard";
import { WeeklyCategoryCard } from "./WeeklyCategoryCard";

export function AdminAnalyticsPanel(): JSX.Element {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
      <Typography variant="h5" sx={{ fontWeight: 700, alignSelf: "flex-end", textAlign: "right" }}>
        אנליטיקה
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          flexDirection: "row-reverse",
          gap: 2.5,
          alignItems: "stretch",
          "& > *": {
            flex: { xs: "1 1 100%", md: "1 1 calc(33.333% - 16px)" },
            minWidth: 0,
          },
          "& .MuiCard-root": {
            height: 180,
          },
        }}
      >
        <MonthlyRevenueCard />
        <ActiveOrdersCard />
        <WeeklyCategoryCard />
        <DailyItemCard />
        <MarginItemsCard />
        <TopSupplierCard />
      </Box>
      <SupplierSpendingTable />
    </Box>
  );
}
