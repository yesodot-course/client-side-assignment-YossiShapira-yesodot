import { Box, Button, Paper, Typography } from "@mui/material";

import { useAppDispatch, useAppSelector } from "../../../app/store/hooks";
import { formatCurrency } from "../../../shared/lib/formatters";
import { clearCart } from "../store/cart.slice";
import { selectCartCount, selectCartTotal } from "../selectors/cart.selectors";

export function CartSummary(): JSX.Element {
  const dispatch = useAppDispatch();
  const totalItems = useAppSelector(selectCartCount);
  const totalPrice = useAppSelector(selectCartTotal);

  return (
    <Paper sx={{ p: 2 }}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        <Typography variant="h6">סיכום</Typography>
        <Typography>סה״כ פריטים: {totalItems}</Typography>
        <Typography>סה״כ לתשלום: {formatCurrency(totalPrice)}</Typography>
        <Button variant="outlined" color="error" onClick={() => dispatch(clearCart())} disabled={totalItems === 0}>
          נקה עגלה
        </Button>
      </Box>
    </Paper>
  );
}
