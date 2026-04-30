import { useState } from "react";
import { Alert, Box, Button, Paper, TextField, Typography } from "@mui/material";

import { useAppDispatch, useAppSelector } from "../../../app/store/hooks";
import { showToast } from "../../../shared/ui/feedback/toast";
import { ApiError } from "../../../shared/api/apiError";
import { useCreateOrder } from "../../orders/hooks/useCreateOrder";
import { selectCartItems } from "../selectors/cart.selectors";
import { clearCart } from "../store/cart.slice";

export function CheckoutForm(): JSX.Element {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectCartItems);
  const [customerId, setCustomerId] = useState("");
  const [address, setAddress] = useState("");
  const createOrderMutation = useCreateOrder();

  const handleSubmit = () => {
    if (items.length === 0) {
      showToast("יש להוסיף לפחות מוצר אחד לעגלה.");
      return;
    }
    if (customerId.trim().length === 0) {
      showToast("יש להזין מזהה לקוח.");
      return;
    }
    if (address.trim().length < 5) {
      showToast("יש להזין כתובת תקינה (לפחות 5 תווים).");
      return;
    }

    createOrderMutation.mutate(
      {
        customerId: customerId.trim(),
        address: address.trim(),
        items: items.map((item) => ({ item: item.id, quantity: item.quantity })),
      },
      {
        onSuccess: () => {
          dispatch(clearCart());
          showToast("ההזמנה נוצרה בהצלחה");
        },
        onError: (error) => {
          if (error instanceof ApiError) {
            showToast(error.message);
            return;
          }
          showToast("יצירת ההזמנה נכשלה");
        },
      }
    );
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography variant="h6">סיום הזמנה</Typography>
        <TextField
          label="מזהה לקוח"
          value={customerId}
          onChange={(event) => setCustomerId(event.target.value)}
          required
        />
        <TextField label="כתובת" value={address} onChange={(event) => setAddress(event.target.value)} required />
        <Button variant="contained" onClick={handleSubmit} disabled={createOrderMutation.isPending}>
          בצע הזמנה
        </Button>
        {createOrderMutation.isError ? <Alert severity="error">לא ניתן היה ליצור הזמנה.</Alert> : null}
      </Box>
    </Paper>
  );
}
