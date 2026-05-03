import { useMemo, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import { useItems } from "../hooks/useItems";
import { useSearchItems } from "../hooks/useSearchItems";
import { useCreateItem } from "../hooks/useCreateItem";
import { useDeleteItem } from "../hooks/useDeleteItem";
import { useUpdateItem } from "../hooks/useUpdateItem";
import { formatCurrency } from "../../../shared/lib/formatters";
import { ItemFormModal } from "./ItemFormModal";
import type { Item } from "../types";
import type { ItemInput } from "../api/items.api";
import { showToast } from "../../../shared/ui/feedback/toast";
import { ApiError } from "../../../shared/api/apiError";

export function AdminItemsTable(): JSX.Element {
  const { data, isLoading } = useItems();
  const createItemMutation = useCreateItem();
  const updateItemMutation = useUpdateItem();
  const deleteItemMutation = useDeleteItem();
  const [searchTerm, setSearchTerm] = useState("");
  const searchItemsQuery = useSearchItems(searchTerm);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);

  const rows = useMemo(() => {
    if (searchTerm.trim().length > 0) {
      return searchItemsQuery.data ?? [];
    }
    return data ?? [];
  }, [data, searchItemsQuery.data, searchTerm]);

  const toInput = (item: Item): ItemInput => ({
    name: item.name,
    price: item.price,
    supplierPrice: item.supplierPrice,
    stock: item.stock,
    category: item.category,
    imageUrl: item.imageUrl ?? "",
    supplier: typeof item.supplier === "string" ? item.supplier : item.supplier?._id ?? "",
  });

  if (isLoading) {
    return <Typography>טוען מוצרים...</Typography>;
  }

  return (
    <>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
        <Paper variant="outlined" sx={{ p: 2.5 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2, flexWrap: "wrap" }}>
            <Typography variant="h5" sx={{ flex: 1, minWidth: 0, fontWeight: 700, textAlign: "start" }}>
              מוצרים
            </Typography>
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => setIsCreateOpen(true)}>
              הוסף מוצר
            </Button>
          </Box>
          <Box sx={{ mb: 2 }}>
            <TextField
              label="חיפוש מוצרים (שם/קטגוריה)"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              fullWidth
              slotProps={{ htmlInput: { dir: "rtl" } }}
            />
          </Box>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>מלאי</TableCell>
                  <TableCell>עלות ספק</TableCell>
                  <TableCell>מחיר</TableCell>
                  <TableCell sx={{ textAlign: "end" }}>קטגוריה</TableCell>
                  <TableCell sx={{ textAlign: "end" }}>שם</TableCell>
                  <TableCell sx={{ width: 56, textAlign: "center", verticalAlign: "middle" }} />
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((item) => (
                  <TableRow
                    key={item._id}
                    hover
                    sx={{ cursor: "pointer" }}
                    onClick={() => setEditingItem(item)}
                  >
                    <TableCell>{item.stock}</TableCell>
                    <TableCell>{formatCurrency(item.supplierPrice)}</TableCell>
                    <TableCell>{formatCurrency(item.price)}</TableCell>
                    <TableCell sx={{ textAlign: "end" }}>{item.category}</TableCell>
                    <TableCell sx={{ textAlign: "end" }}>{item.name}</TableCell>
                    <TableCell sx={{ width: 56, textAlign: "center", verticalAlign: "middle" }}>
                      <Avatar
                        variant="rounded"
                        src={item.imageUrl}
                        alt={item.name}
                        sx={{ width: 40, height: 40, bgcolor: "grey.100", color: "text.secondary" }}
                      >
                        🖼️
                      </Avatar>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>

      <ItemFormModal
        open={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        submitLabel="יצירה"
        onSubmit={(value) =>
          createItemMutation.mutate(
            value,
            {
              onSuccess: () => showToast("המוצר נוצר"),
              onError: (error) => showToast(error instanceof ApiError ? error.message : "יצירת המוצר נכשלה"),
            }
          )
        }
      />

      <ItemFormModal
        open={Boolean(editingItem)}
        onClose={() => setEditingItem(null)}
        initialValue={editingItem ? toInput(editingItem) : undefined}
        submitLabel="עדכון"
        onDelete={() => {
          if (!editingItem) {
            return;
          }
          deleteItemMutation.mutate(editingItem._id, {
            onSuccess: () => {
              showToast("המוצר נמחק");
              setEditingItem(null);
            },
            onError: (error) => showToast(error instanceof ApiError ? error.message : "מחיקת המוצר נכשלה"),
          });
        }}
        onSubmit={(value) => {
          if (!editingItem) {
            return;
          }
          if (value.name.trim().length < 2 || value.category.trim().length < 2 || value.supplier.trim().length === 0) {
            showToast("יש למלא שם, קטגוריה ומזהה ספק תקינים.");
            return;
          }
          if (value.price < 0 || value.supplierPrice < 0 || value.stock < 0) {
            showToast("מחירים ומלאי חייבים להיות חיוביים.");
            return;
          }
          if (value.imageUrl && value.imageUrl.trim().length > 0) {
            try {
              new URL(value.imageUrl);
            } catch (_error: unknown) {
              showToast("כתובת התמונה אינה תקינה.");
              return;
            }
          }
          updateItemMutation.mutate(
            { id: editingItem._id, payload: value },
            {
              onSuccess: () => {
                showToast("המוצר עודכן");
                setEditingItem(null);
              },
              onError: (error) => showToast(error instanceof ApiError ? error.message : "עדכון המוצר נכשל"),
            }
          );
        }}
      />
    </>
  );
}
