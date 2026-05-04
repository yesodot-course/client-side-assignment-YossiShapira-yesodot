import { Alert, Box, CircularProgress, Typography } from "@mui/material";
import { useParams } from "react-router-dom";

import { useItemDetails } from "../features/items/hooks/useItemDetails";
import { ItemDetailsCard } from "../features/items/components/ItemDetailsCard";
import { AddToCartPanel } from "../features/cart/components/AddToCartPanel";
import { useAppDispatch } from "../app/store/hooks";
import { addItem } from "../features/cart/store/cart.slice";
import { showToast } from "../shared/ui/feedback/toast";

export function ProductDetailsPage(): JSX.Element {
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>();
  const itemQuery = useItemDetails(id ?? "");

  if (!id) {
    return <Alert severity="error">מזהה מוצר חסר.</Alert>;
  }

  if (itemQuery.isLoading) {
    return <CircularProgress />;
  }

  if (itemQuery.isError || !itemQuery.data) {
    return <Alert severity="error">טעינת פרטי המוצר נכשלה.</Alert>;
  }

  const item = itemQuery.data;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Typography variant="h4">פרטי מוצר</Typography>
      <ItemDetailsCard item={item} />
      <AddToCartPanel
        maxQuantity={item.stock}
        onAdd={(quantity) => {
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
        }}
      />
    </Box>
  );
}