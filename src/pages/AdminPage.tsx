import { Box, Paper, Tab, Tabs, Typography } from "@mui/material";
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useItems } from "../features/items/hooks/useItems";
import { AdminItemsTable } from "../features/items/components/AdminItemsTable";
import { SupplierTable } from "../features/suppliers/components/SupplierTable";
import { AdminAnalyticsPanel } from "../features/analytics/components/AdminAnalyticsPanel";
import { OrdersTable } from "../features/orders/components/OrdersTable";

export function AdminPage(): JSX.Element {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data } = useItems();
  const products = data ?? [];
  const lowStockItems = useMemo(() => products.filter((item) => item.stock < 5), [products]);
  const tabFromQuery = searchParams.get("tab");
  const initialTab = tabFromQuery === "suppliers" ? 1 : tabFromQuery === "orders" ? 2 : tabFromQuery === "analytics" ? 3 : 0;
  const [activeTab, setActiveTab] = useState(initialTab);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, direction: "rtl", textAlign: "right" }}>
      <Typography variant="h4" sx={{ alignSelf: "flex-end", textAlign: "right" }}>
        לוח ניהול
      </Typography>
      <Box
        sx={{
          display: "flex",
          gap: 2,
          flexDirection: { xs: "column", md: "row-reverse" },
        }}
      >
        <Box sx={{ flex: 1 }}>
          <Paper sx={{ p: 2, textAlign: "right", direction: "rtl", display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
            <Typography variant="h6" sx={{ textAlign: "right" }}>
              סה״כ מוצרים
            </Typography>
            <Typography variant="h4" sx={{ textAlign: "right" }}>
              {products.length}
            </Typography>
          </Paper>
        </Box>
        <Box sx={{ flex: 1 }}>
          <Paper sx={{ p: 2, textAlign: "right", direction: "rtl", display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
            <Typography variant="h6" sx={{ textAlign: "right" }}>
              מוצרים שעומדים להיגמר (מלאי קטן מ־5)
            </Typography>
            <Typography variant="h4" sx={{ textAlign: "right" }}>
              {lowStockItems.length}
            </Typography>
          </Paper>
        </Box>
      </Box>

      <Paper sx={{ p: 1 }}>
        <Tabs
          value={activeTab}
          onChange={(_event, value: number) => {
            setActiveTab(value);
            const nextTab = value === 0 ? "products" : value === 1 ? "suppliers" : value === 2 ? "orders" : "analytics";
            setSearchParams({ tab: nextTab });
          }}
          variant="scrollable"
          scrollButtons="auto"
          dir="rtl"
          sx={{
            "& .MuiTabs-flexContainer": {
              justifyContent: "flex-end",
            },
          }}
        >
          <Tab label="מוצרים" />
          <Tab label="ספקים" />
          <Tab label="הזמנות" />
          <Tab label="אנליטיקה" />
        </Tabs>
      </Paper>

      <Box sx={{ mt: 1 }}>
        {activeTab === 0 ? <AdminItemsTable /> : null}
        {activeTab === 1 ? <SupplierTable /> : null}
        {activeTab === 2 ? <OrdersTable /> : null}
        {activeTab === 3 ? <AdminAnalyticsPanel /> : null}
      </Box>
    </Box>
  );
}