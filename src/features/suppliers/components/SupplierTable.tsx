import { useMemo, useState } from "react";
import {
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
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

import { useSuppliers } from "../hooks/useSuppliers";
import { useSearchSuppliers } from "../hooks/useSearchSuppliers";
import { useCreateSupplier } from "../hooks/useCreateSupplier";
import { useDeleteSupplier } from "../hooks/useDeleteSupplier";
import { useUpdateSupplier } from "../hooks/useUpdateSupplier";
import { SupplierFormModal } from "./SupplierFormModal";
import type { Supplier, SupplierInput } from "../types";
import { showToast } from "../../../shared/ui/feedback/toast";
import { ApiError } from "../../../shared/api/apiError";

export function SupplierTable(): JSX.Element {
  const { data, isLoading } = useSuppliers();
  const createSupplierMutation = useCreateSupplier();
  const updateSupplierMutation = useUpdateSupplier();
  const deleteSupplierMutation = useDeleteSupplier();
  const [searchTerm, setSearchTerm] = useState("");
  const searchSuppliersQuery = useSearchSuppliers(searchTerm);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [actionSupplier, setActionSupplier] = useState<Supplier | null>(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>(null);

  const rows = useMemo(() => {
    if (searchTerm.trim().length > 0) {
      return searchSuppliersQuery.data ?? [];
    }
    return data ?? [];
  }, [data, searchSuppliersQuery.data, searchTerm]);

  const toInput = (supplier: Supplier): SupplierInput => ({
    name: supplier.name,
    contactInfo: supplier.contactInfo,
    items: supplier.items,
  });

  if (isLoading) {
    return <Typography>טוען ספקים...</Typography>;
  }

  return (
    <>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
        <Paper variant="outlined" sx={{ p: 2.5 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2, flexWrap: "wrap" }}>
            <Typography variant="h5" sx={{ flex: 1, minWidth: 0, fontWeight: 700, textAlign: "start" }}>
              ספקים
            </Typography>
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => setIsCreateOpen(true)}>
              הוסף ספק
            </Button>
          </Box>
          <Box sx={{ mb: 2 }}>
            <TextField
              label="חיפוש ספקים (שם/פרטי קשר)"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              fullWidth
              slotProps={{ htmlInput: { dir: "rtl" } }}
            />
          </Box>
          <TableContainer sx={{ direction: "rtl" }}>
            <Table size="small" sx={{ direction: "rtl" }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ textAlign: "end", verticalAlign: "middle" }}>שם</TableCell>
                  <TableCell sx={{ textAlign: "end", verticalAlign: "middle" }}>פרטי קשר</TableCell>
                  <TableCell sx={{ textAlign: "end", verticalAlign: "middle" }}>פריטי קטלוג</TableCell>
                  <TableCell sx={{ width: 56, textAlign: "center", verticalAlign: "middle" }} />
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((supplier) => (
                  <TableRow key={supplier._id}>
                    <TableCell sx={{ textAlign: "end", verticalAlign: "middle" }}>{supplier.name}</TableCell>
                    <TableCell sx={{ textAlign: "end", verticalAlign: "middle" }}>{supplier.contactInfo}</TableCell>
                    <TableCell sx={{ textAlign: "end", verticalAlign: "middle" }}>{supplier.items.length}</TableCell>
                    <TableCell sx={{ width: 56, textAlign: "center", verticalAlign: "middle" }}>
                      <IconButton
                        size="small"
                        aria-label="פעולות ספק"
                        onClick={(event) => {
                          setActionSupplier(supplier);
                          setMenuAnchorEl(event.currentTarget);
                        }}
                      >
                        ⋮
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>

      <SupplierFormModal
        open={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        submitLabel="יצירה"
        onSubmit={(value) =>
          createSupplierMutation.mutate(
            value,
            {
              onSuccess: () => showToast("הספק נוצר"),
              onError: (error) => showToast(error instanceof ApiError ? error.message : "יצירת ספק נכשלה"),
            }
          )
        }
      />

      <SupplierFormModal
        open={Boolean(editingSupplier)}
        onClose={() => setEditingSupplier(null)}
        initialValue={editingSupplier ? toInput(editingSupplier) : undefined}
        submitLabel="עדכון"
        onSubmit={(value) => {
          if (!editingSupplier) {
            return;
          }
          updateSupplierMutation.mutate(
            { id: editingSupplier._id, payload: value },
            {
              onSuccess: () => showToast("הספק עודכן"),
              onError: (error) => showToast(error instanceof ApiError ? error.message : "עדכון ספק נכשל"),
            }
          );
        }}
      />
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl) && Boolean(actionSupplier)}
        onClose={() => {
          setMenuAnchorEl(null);
          setActionSupplier(null);
        }}
      >
        <MenuItem
          onClick={() => {
            if (!actionSupplier) {
              return;
            }
            setEditingSupplier(actionSupplier);
            setMenuAnchorEl(null);
            setActionSupplier(null);
          }}
        >
          ערוך
        </MenuItem>
        <MenuItem
          sx={{ color: "error.main" }}
          onClick={() => {
            if (!actionSupplier) {
              return;
            }
            deleteSupplierMutation.mutate(actionSupplier._id, {
              onSuccess: () => showToast("הספק נמחק"),
              onError: (error) => showToast(error instanceof ApiError ? error.message : "מחיקת ספק נכשלה"),
            });
            setMenuAnchorEl(null);
            setActionSupplier(null);
          }}
        >
          מחק
        </MenuItem>
      </Menu>
    </>
  );
}
