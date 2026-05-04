import { useState } from "react";
import { Box, Button, TextField } from "@mui/material";
import { rtlOutlinedTextFieldHtmlInputProps, rtlOutlinedTextFieldSx } from "../../../shared/ui/rtlOutlinedField";

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
        variant="outlined"
        dir="rtl"
        value={quantity}
        slotProps={{
          htmlInput: { min: 1, max: maxQuantity, ...rtlOutlinedTextFieldHtmlInputProps },
        }}
        sx={{ ...rtlOutlinedTextFieldSx, width: 100 }}
        onChange={(event) => {
          const nextValue = Number(event.target.value);
          if (!Number.isFinite(nextValue)) {
            setQuantity(1);
            return;
          }
          const normalized = Math.trunc(nextValue);
          setQuantity(Math.max(1, Math.min(normalized, maxQuantity)));
        }}
      />
      <Button variant="contained" onClick={() => onAdd(quantity)} disabled={maxQuantity <= 0}>
        הוסף לעגלה
      </Button>
    </Box>
  );
}
