import { Box, Typography } from "@mui/material";

import { CartList } from "../features/cart/components/CartList";
import { CartSummary } from "../features/cart/components/CartSummary";
import { CartRecommendations } from "../features/cart/components/CartRecommendations";
import { CheckoutForm } from "../features/cart/components/CheckoutForm";

export function CartPage(): JSX.Element {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Typography variant="h4" sx={{ alignSelf: "flex-end", textAlign: "right" }}>
        העגלה שלך
      </Typography>

      <Box
        sx={{
          display: "grid",
          gap: 2,
          gridTemplateColumns: {
            xs: "1fr",
            md: "2fr 1fr",
          },
        }}
      >
        <Box>
          <CartList />
        </Box>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <CartSummary />
            <CheckoutForm />
            <CartRecommendations />
        </Box>
      </Box>
    </Box>
  );
}