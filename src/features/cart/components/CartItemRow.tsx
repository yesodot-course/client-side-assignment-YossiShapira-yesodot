import { Avatar, Box, IconButton, TableCell, TableRow, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";

import { formatCurrency } from "../../../shared/lib/formatters";
import type { CartItem } from "../types";

interface CartItemRowProps {
  item: CartItem;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
}

export function CartItemRow({ item, onIncrease, onDecrease, onRemove }: CartItemRowProps): JSX.Element {
  return (
    <TableRow>
      <TableCell>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, direction: "rtl" }}>
          <Avatar
            variant="rounded"
            src={item.imageUrl}
            alt={item.name}
            sx={{ width: 48, height: 48, flexShrink: 0, bgcolor: "grey.100", color: "text.secondary" }}
            slotProps={{ img: { style: { objectFit: "contain" } } }}
          >
            🖼️
          </Avatar>
          <Typography sx={{ minWidth: 0, textAlign: "start" }}>{item.name}</Typography>
        </Box>
      </TableCell>
      <TableCell>{formatCurrency(item.price)}</TableCell>
      <TableCell>
        <IconButton size="small" onClick={onDecrease}>
          <RemoveIcon fontSize="small" />
        </IconButton>
        <Typography component="span" sx={{ px: 1 }}>
          {item.quantity}
        </Typography>
        <IconButton size="small" onClick={onIncrease} disabled={item.quantity >= item.stock}>
          <AddIcon fontSize="small" />
        </IconButton>
      </TableCell>
      <TableCell>{formatCurrency(item.price * item.quantity)}</TableCell>
      <TableCell>
        <IconButton color="error" onClick={onRemove}>
          <DeleteIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}
