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
        <Typography variant="h5" sx={{ fontWeight: 700, textAlign: "start" }}>
          מוצרים
        </Typography>
        <Paper variant="outlined" sx={{ p: 2.5 }}>
          <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
            <Button variant="contained" endIcon={<AddIcon fontSize="small" />} onClick={() => setIsCreateOpen(true)}>
              הוסף מוצר
            </Button>
          </Box>
          <Box sx={{ mb: 2 }}>
            <TextField
              id="admin-items-search"
              label="חיפוש מוצרים (שם/קטגוריה)"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              fullWidth
              variant="outlined"
              dir="rtl"
              sx={{
                direction: "rtl",
                "& .MuiOutlinedInput-input": { textAlign: "right" },
                "& .MuiOutlinedInput-notchedOutline": { textAlign: "right" },
                /* Mirror MUI’s default left‑anchored label to the right so it sits above the RTL notch */
                "& label.MuiInputLabel-root": {
                  left: "auto",
                  right: 14,
                  transformOrigin: "top right",
                },
                "& label.MuiInputLabel-root:not(.MuiInputLabel-shrink)": {
                  transform: "translate(0, 16px) scale(1)",
                },
                "& label.MuiInputLabel-root.MuiInputLabel-shrink": {
                  transform: "translate(0, -9px) scale(0.75)",
                },
              }}
              slotProps={{ htmlInput: { dir: "rtl", style: { textAlign: "right" } } }}
            />
          </Box>
          <TableContainer dir="rtl" sx={{ direction: "rtl" }}>
            <Table dir="rtl" size="small" sx={{ direction: "rtl" }}>
              <TableHead>
                <TableRow>
                  {/* RTL table: first column is on the right — image, then name … stock on the left */}
                  <TableCell sx={{ width: 56, textAlign: "center", verticalAlign: "middle" }} />
                  <TableCell sx={{ textAlign: "start", verticalAlign: "middle" }}>שם</TableCell>
                  <TableCell sx={{ textAlign: "start", verticalAlign: "middle" }}>קטגוריה</TableCell>
                  <TableCell sx={{ textAlign: "start", verticalAlign: "middle" }}>מחיר</TableCell>
                  <TableCell sx={{ textAlign: "start", verticalAlign: "middle" }}>עלות ספק</TableCell>
                  <TableCell sx={{ textAlign: "start", verticalAlign: "middle" }}>מלאי</TableCell>
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
                    <TableCell sx={{ textAlign: "start", verticalAlign: "middle" }}>{item.name}</TableCell>
                    <TableCell sx={{ textAlign: "start", verticalAlign: "middle" }}>{item.category}</TableCell>
                    <TableCell sx={{ textAlign: "start", verticalAlign: "middle" }}>{formatCurrency(item.price)}</TableCell>
                    <TableCell sx={{ textAlign: "start", verticalAlign: "middle" }}>{formatCurrency(item.supplierPrice)}</TableCell>
                    <TableCell sx={{ textAlign: "start", verticalAlign: "middle" }}>{item.stock}</TableCell>
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
