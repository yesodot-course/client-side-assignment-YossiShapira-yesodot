import { Box, Paper, Typography } from "@mui/material";

import { useAppDispatch, useAppSelector } from "../../../app/store/hooks";
import { useItems } from "../../items/hooks/useItems";
import type { Item } from "../../items/types";
import { selectCartItems } from "../selectors/cart.selectors";
import { addItem } from "../store/cart.slice";
import { buildRecommendations } from "../utils/recommendations";
import { showToast } from "../../../shared/ui/feedback/toast";
import { CartRecommendedProductCard } from "./CartRecommendedProductCard";

export function CartRecommendations(): JSX.Element {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector(selectCartItems);
  const itemsQuery = useItems();
  const recommendations = buildRecommendations(cartItems, itemsQuery.data ?? []);

  function handleAddToCart(item: Item, quantity: number): void {
    dispatch(
      addItem({
        id: item._id,
        name: item.name,
        price: item.price,
        quantity,
        stock: item.stock,
        category: item.category,
        imageUrl: item.imageUrl,
      })
    );
    showToast(`"${item.name}" נוסף לעגלה`);
  }

  return (
    <Paper sx={{ p: 2 }}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
        <Typography variant="h6">מוצרים מומלצים</Typography>
        {cartItems.length === 0 ? (
          <Typography color="text.secondary">הוסף מוצרים לעגלה כדי לקבל המלצות.</Typography>
        ) : itemsQuery.isLoading ? (
          <Typography color="text.secondary">טוען המלצות...</Typography>
        ) : recommendations.length === 0 ? (
          <Typography color="text.secondary">אין כרגע מוצרים מומלצים זמינים.</Typography>
        ) : (
          <Box
            sx={{
              display: "grid",
              gap: 2,
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, minmax(0, 1fr))",
              },
            }}
          >
            {recommendations.map((item) => (
              <CartRecommendedProductCard key={item._id} item={item} onAddToCart={handleAddToCart} />
            ))}
          </Box>
        )}
      </Box>
    </Paper>
  );
}
