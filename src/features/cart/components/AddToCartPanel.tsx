import { useState } from "react";
import { Box, Button, TextField } from "@mui/material";

interface AddToCartPanelProps {
  onAdd: (quantity: number) => void;
  maxQuantity: number;
}

export function AddToCartPanel({ onAdd, maxQuantity }: AddToCartPanelProps): JSX.Element {
  const [quantity, setQuantity] = useState(1);

  return (
    <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
      <TextField
        label="כמות"
        type="number"
        size="small"
        value={quantity}
        slotProps={{ htmlInput: { min: 1, max: maxQuantity } }}
        onChange={(event) => {
          const nextValue = Number(event.target.value);
          setQuantity(Number.isNaN(nextValue) ? 1 : Math.max(1, Math.min(nextValue, maxQuantity)));
        }}
        sx={{ width: 100 }}
      />
      <Button variant="contained" onClick={() => onAdd(quantity)} disabled={maxQuantity <= 0}>
        הוסף לעגלה
      </Button>
    </Box>
  );
}
