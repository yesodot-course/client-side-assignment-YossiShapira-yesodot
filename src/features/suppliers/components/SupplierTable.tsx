import { useMemo, useState } from "react";
import {
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
import { useNavigate } from "react-router-dom";

import { useSuppliers } from "../hooks/useSuppliers";
import { useSearchSuppliers } from "../hooks/useSearchSuppliers";
import { useCreateSupplier } from "../hooks/useCreateSupplier";
import { SupplierFormModal } from "./SupplierFormModal";
import { showToast } from "../../../shared/ui/feedback/toast";
import { ApiError } from "../../../shared/api/apiError";

export function SupplierTable(): JSX.Element {
  const navigate = useNavigate();
  const { data, isLoading } = useSuppliers();
  const createSupplierMutation = useCreateSupplier();
  const [searchTerm, setSearchTerm] = useState("");
  const searchSuppliersQuery = useSearchSuppliers(searchTerm);

  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const rows = useMemo(() => {
    if (searchTerm.trim().length > 0) {
      return searchSuppliersQuery.data ?? [];
    }
    return data ?? [];
  }, [data, searchSuppliersQuery.data, searchTerm]);

  if (isLoading) {
    return <Typography>טוען ספקים...</Typography>;
  }

  return (
    <>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, textAlign: "start" }}>
          ספקים
        </Typography>
        <Paper variant="outlined" sx={{ p: 2.5 }}>
          <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
            <Button variant="contained" endIcon={<AddIcon fontSize="small" />} onClick={() => setIsCreateOpen(true)}>
              הוסף ספק
            </Button>
          </Box>
          <Box sx={{ mb: 2 }}>
            <TextField
              id="admin-suppliers-search"
              label="חיפוש ספקים (שם/פרטי קשר)"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              fullWidth
              variant="outlined"
              dir="rtl"
              sx={{
                direction: "rtl",
                "& .MuiOutlinedInput-input": { textAlign: "right" },
                "& .MuiOutlinedInput-notchedOutline": { textAlign: "right" },
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
          <TableContainer dir="rtl" sx={{ direction: "rtl", width: "100%" }}>
            <Table dir="rtl" size="small" sx={{ direction: "rtl", width: "100%" }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ textAlign: "start", verticalAlign: "middle" }}>שם</TableCell>
                  <TableCell sx={{ textAlign: "start", verticalAlign: "middle" }}>פרטי קשר</TableCell>
                  <TableCell sx={{ textAlign: "start", verticalAlign: "middle" }}>פריטי קטלוג</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((supplier) => (
                  <TableRow
                    key={supplier._id}
                    hover
                    sx={{ cursor: "pointer" }}
                    onClick={() => navigate(`/suppliers/${supplier._id}`)}
                  >
                    <TableCell sx={{ textAlign: "start", verticalAlign: "middle" }}>{supplier.name}</TableCell>
                    <TableCell sx={{ textAlign: "start", verticalAlign: "middle" }}>{supplier.contactInfo}</TableCell>
                    <TableCell sx={{ textAlign: "start", verticalAlign: "middle" }}>{supplier.items.length}</TableCell>
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
    </>
  );
}
