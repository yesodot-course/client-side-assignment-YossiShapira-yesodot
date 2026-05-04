import { Box, Typography } from "@mui/material";

import type { Item } from "../types";
import { ItemCard } from "./ItemCard";

interface ItemsGridProps {
  items: Item[];
  onAddToCart: (item: Item, quantity: number) => void;
}

export function ItemsGrid({ items, onAddToCart }: ItemsGridProps): JSX.Element {
  if (items.length === 0) {
    return <Typography color="text.secondary">לא נמצאו מוצרים.</Typography>;
  }

  return (
    <Box
      sx={{
        display: "grid",
        gap: 2,
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(2, minmax(0, 1fr))",
          lg: "repeat(3, minmax(0, 1fr))",
        },
      }}
    >
      {items.map((item) => (
        <Box key={item._id} sx={{ height: "100%" }}>
          <ItemCard item={item} onAddToCart={onAddToCart} />
        </Box>
      ))}
    </Box>
  );
}
