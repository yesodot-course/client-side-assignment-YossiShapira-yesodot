import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";

import { useAppDispatch, useAppSelector } from "../../../app/store/hooks";
import { decreaseItemQuantity, increaseItemQuantity, removeItem } from "../store/cart.slice";
import { selectCartItems } from "../selectors/cart.selectors";
import { CartItemRow } from "./CartItemRow";

export function CartList(): JSX.Element {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectCartItems);

  if (items.length === 0) {
    return <Typography color="text.secondary">העגלה ריקה כרגע.</Typography>;
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>מוצר</TableCell>
            <TableCell>מחיר</TableCell>
            <TableCell>כמות</TableCell>
            <TableCell>סכום ביניים</TableCell>
            <TableCell>פעולות</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item) => (
            <CartItemRow
              key={item.id}
              item={item}
              onIncrease={() => dispatch(increaseItemQuantity(item.id))}
              onDecrease={() => dispatch(decreaseItemQuantity(item.id))}
              onRemove={() => dispatch(removeItem(item.id))}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
