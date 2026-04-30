import { useState } from "react";
import { Link } from "react-router-dom";
import { Box, Button, Card, CardActions, CardContent, CardMedia, Chip, Typography } from "@mui/material";

import type { Item } from "../types";
import { AddToCartPanel } from "../../cart/components/AddToCartPanel";

interface ItemCardProps {
  item: Item;
  onAddToCart: (item: Item, quantity: number) => void;
}

export function ItemCard({ item, onAddToCart }: ItemCardProps): JSX.Element {
  const supplierName = typeof item.supplier === "string" ? item.supplier : item.supplier?.name ?? "לא ידוע";
  const [imageFailed, setImageFailed] = useState(false);
  const shouldShowImage = Boolean(item.imageUrl) && !imageFailed;

  return (
    <Card variant="outlined" sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Box sx={{ height: 220, bgcolor: "grey.100", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {shouldShowImage ? (
          <CardMedia
            component="img"
            image={item.imageUrl}
            alt={item.name}
            sx={{ width: "100%", height: "100%", objectFit: "contain", bgcolor: "grey.100" }}
            onError={() => setImageFailed(true)}
          />
        ) : (
          <Typography component="span" sx={{ fontSize: 48 }} aria-label="אין תמונה">
            🖼️
          </Typography>
        )}
      </Box>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 1 }}>
          <Typography variant="h6">{item.name}</Typography>
          <Chip label={item.category} size="small" />
        </Box>
        <Typography color="text.secondary">ספק: {supplierName}</Typography>
        <Typography sx={{ mt: 1 }}>${item.price.toFixed(2)}</Typography>
        <Typography color={item.stock > 0 ? "text.secondary" : "error"}>מלאי: {item.stock}</Typography>
      </CardContent>
      <CardActions sx={{ px: 2, pb: 2, display: "flex", justifyContent: "space-between", alignItems: "center", mt: "auto" }}>
        <Button component={Link} to={`/items/${item._id}`}>
          פרטים
        </Button>
        <AddToCartPanel maxQuantity={item.stock} onAdd={(quantity) => onAddToCart(item, quantity)} />
      </CardActions>
    </Card>
  );
}
