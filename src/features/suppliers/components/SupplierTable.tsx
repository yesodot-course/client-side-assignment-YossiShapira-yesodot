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
                    <TableCell sx={{ textAlign: "end", verticalAlign: "middle" }}>{supplier.name}</TableCell>
                    <TableCell sx={{ textAlign: "end", verticalAlign: "middle" }}>{supplier.contactInfo}</TableCell>
                    <TableCell sx={{ textAlign: "end", verticalAlign: "middle" }}>{supplier.items.length}</TableCell>
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
