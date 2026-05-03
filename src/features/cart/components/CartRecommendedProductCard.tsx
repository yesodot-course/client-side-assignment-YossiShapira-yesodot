import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  Typography,
} from "@mui/material";

import type { Item } from "../../items/types";
import { formatCurrency } from "../../../shared/lib/formatters";
import { AddToCartPanel } from "./AddToCartPanel";

interface CartRecommendedProductCardProps {
  item: Item;
  onAddToCart: (item: Item, quantity: number) => void;
}

export function CartRecommendedProductCard({
  item,
  onAddToCart,
}: CartRecommendedProductCardProps): JSX.Element {
  const supplierName = typeof item.supplier === "string" ? item.supplier : item.supplier?.name ?? "לא ידוע";
  const [imageFailed, setImageFailed] = useState(false);
  const shouldShowImage = Boolean(item.imageUrl) && !imageFailed;

  return (
    <Card variant="outlined" sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Box
        sx={{
          height: 140,
          bgcolor: "grey.100",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {shouldShowImage ? (
          <CardMedia
            component="img"
            image={item.imageUrl}
            alt={item.name}
            sx={{ width: "100%", height: "100%", objectFit: "contain", bgcolor: "grey.100" }}
            onError={() => setImageFailed(true)}
          />
        ) : (
          <Typography component="span" sx={{ fontSize: 40 }} aria-label="אין תמונה">
            🖼️
          </Typography>
        )}
      </Box>
      <CardContent sx={{ flexGrow: 1, pt: 1.5, pb: 1 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 1 }}>
          <Typography variant="subtitle1" sx={{ lineHeight: 1.3 }}>
            {item.name}
          </Typography>
          <Chip label={item.category} size="small" />
        </Box>
        <Typography variant="body2" color="text.secondary">
          ספק: {supplierName}
        </Typography>
        <Typography sx={{ mt: 0.75 }}>{formatCurrency(item.price)}</Typography>
        <Typography variant="body2" color={item.stock > 0 ? "text.secondary" : "error"}>
          מלאי: {item.stock}
        </Typography>
      </CardContent>
      <CardActions
        sx={{
          px: 2,
          pb: 2,
          pt: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          gap: 1,
          mt: "auto",
        }}
      >
        <Button component={Link} to={`/items/${item._id}`} size="small" sx={{ alignSelf: "flex-start" }}>
          פרטים
        </Button>
        <AddToCartPanel maxQuantity={item.stock} onAdd={(quantity) => onAddToCart(item, quantity)} />
      </CardActions>
    </Card>
  );
}
