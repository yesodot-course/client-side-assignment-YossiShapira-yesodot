import { useState } from "react";
import { Box, Card, CardContent, CardMedia, Chip, Typography } from "@mui/material";

import { formatCurrency } from "../../../shared/lib/formatters";
import type { Item } from "../types";

interface ItemDetailsCardProps {
  item: Item;
}

export function ItemDetailsCard({ item }: ItemDetailsCardProps): JSX.Element {
  const supplierName = typeof item.supplier === "string" ? item.supplier : item.supplier?.name ?? "לא ידוע";
  const [imageFailed, setImageFailed] = useState(false);
  const shouldShowImage = Boolean(item.imageUrl) && !imageFailed;

  return (
    <Card variant="outlined">
      <Box sx={{ height: 420, bgcolor: "grey.100", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {shouldShowImage ? (
          <CardMedia
            component="img"
            image={item.imageUrl}
            alt={item.name}
            sx={{ width: "100%", height: "100%", objectFit: "contain", bgcolor: "grey.100" }}
            onError={() => setImageFailed(true)}
          />
        ) : (
          <Typography component="span" sx={{ fontSize: 64 }} aria-label="אין תמונה">
            🖼️
          </Typography>
        )}
      </Box>
      <CardContent>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 1 }}>
          <Typography variant="h5">{item.name}</Typography>
          <Chip label={item.category} />
        </Box>
        <Typography sx={{ mt: 2 }}>מחיר: {formatCurrency(item.price)}</Typography>
        <Typography>עלות ספק (לא מלאי): {formatCurrency(item.supplierPrice)}</Typography>
        <Typography>מלאי: {item.stock}</Typography>
        <Typography>ספק: {supplierName}</Typography>
        <Typography sx={{ mt: 2 }} color="text.secondary">
          {item.description ?? "אין תיאור זמין."}
        </Typography>
      </CardContent>
    </Card>
  );
}
