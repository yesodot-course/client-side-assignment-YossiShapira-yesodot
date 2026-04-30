import { Box, Button, Paper, Typography } from "@mui/material";

import { useAppDispatch, useAppSelector } from "../../../app/store/hooks";
import { useItems } from "../../items/hooks/useItems";
import { selectCartItems } from "../selectors/cart.selectors";
import { addItem } from "../store/cart.slice";
import { buildRecommendations } from "../utils/recommendations";
import { showToast } from "../../../shared/ui/feedback/toast";

export function CartRecommendations(): JSX.Element {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector(selectCartItems);
  const itemsQuery = useItems();
  const recommendations = buildRecommendations(cartItems, itemsQuery.data ?? []);

  return (
    <Paper sx={{ p: 2 }}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        <Typography variant="h6">המלצות</Typography>
        {cartItems.length === 0 ? (
          <Typography color="text.secondary">הוסף מוצרים לעגלה כדי לקבל המלצות.</Typography>
        ) : itemsQuery.isLoading ? (
          <Typography color="text.secondary">טוען המלצות...</Typography>
        ) : recommendations.length === 0 ? (
          <Typography color="text.secondary">אין כרגע מוצרים מומלצים זמינים.</Typography>
        ) : (
          <Box sx={{ display: "grid", gap: 1, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" } }}>
            {recommendations.map((item) => (
              <Paper key={item._id} variant="outlined" sx={{ p: 1.25 }}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
                  <Typography variant="subtitle2">{item.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    קטגוריה: {item.category}
                  </Typography>
                  <Typography variant="body2">${item.price.toFixed(2)}</Typography>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => {
                      dispatch(
                        addItem({
                          id: item._id,
                          name: item.name,
                          price: item.price,
                          quantity: 1,
                          stock: item.stock,
                          category: item.category,
                          imageUrl: item.imageUrl,
                        })
                      );
                      showToast(`"${item.name}" נוסף לעגלה`);
                    }}
                  >
                    הוסף לעגלה
                  </Button>
                </Box>
              </Paper>
            ))}
          </Box>
        )}
      </Box>
    </Paper>
  );
}
