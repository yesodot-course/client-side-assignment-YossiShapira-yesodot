import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Paper,
  Typography,
} from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useNavigate, useParams } from "react-router-dom";

import { useSupplier } from "../features/suppliers/hooks/useSupplier";
import { useUpdateSupplier } from "../features/suppliers/hooks/useUpdateSupplier";
import { useDeleteSupplier } from "../features/suppliers/hooks/useDeleteSupplier";
import type { SupplierInput } from "../features/suppliers/types";
import { SupplierEditorCore, validateSupplierForm } from "../features/suppliers/components/SupplierEditorCore";
import { showToast } from "../shared/ui/feedback/toast";
import { ApiError } from "../shared/api/apiError";

const emptyForm: SupplierInput = {
  name: "",
  contactInfo: "",
  items: [],
};

function supplierToInput(s: { name: string; contactInfo: string; items: SupplierInput["items"] }): SupplierInput {
  return {
    name: s.name,
    contactInfo: s.contactInfo,
    items: s.items.map((item) => ({
      itemName: item.itemName,
      price: item.price,
      imageUrl: item.imageUrl?.trim() ?? "",
    })),
  };
}

export function SupplierDetailsPage(): JSX.Element {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const supplierQuery = useSupplier(id ?? "");
  const updateMutation = useUpdateSupplier();
  const deleteMutation = useDeleteSupplier();
  const [form, setForm] = useState<SupplierInput>(emptyForm);

  useEffect(() => {
    if (!supplierQuery.data) {
      return;
    }
    setForm(supplierToInput(supplierQuery.data));
  }, [supplierQuery.data]);

  if (!id) {
    return <Alert severity="error">מזהה ספק חסר.</Alert>;
  }

  if (supplierQuery.isLoading) {
    return <CircularProgress />;
  }

  if (supplierQuery.isError || !supplierQuery.data) {
    return <Alert severity="error">טעינת פרטי הספק נכשלה.</Alert>;
  }

  const handleSave = () => {
    if (!validateSupplierForm(form)) {
      return;
    }
    updateMutation.mutate(
      { id, payload: form },
      {
        onSuccess: () => {
          showToast("הספק עודכן");
          void supplierQuery.refetch();
        },
        onError: (error) => showToast(error instanceof ApiError ? error.message : "עדכון הספק נכשל"),
      }
    );
  };

  const handleDelete = () => {
    deleteMutation.mutate(id, {
      onSuccess: () => {
        showToast("הספק נמחק");
        navigate("/admin?tab=suppliers");
      },
      onError: (error) => showToast(error instanceof ApiError ? error.message : "מחיקת הספק נכשלה"),
    });
  };

  return (
    <Box dir="rtl" sx={{ width: "100%", display: "flex", flexDirection: "column", gap: 2, textAlign: "start" }}>
      {/* direction: ltr on this wrapper so flex-end = physical right (stylis rtl flips rtl flex otherwise) */}
      <Box
        style={{
          display: "flex",
          width: "100%",
          justifyContent: "flex-end",
          direction: "ltr",
        }}
      >
        <Box style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
          <Button
            variant="text"
            startIcon={<ArrowForwardIosIcon fontSize="small" />}
            sx={{
              textAlign: "right",
              px: 0,
              minWidth: 0,
              justifyContent: "flex-end",
              direction: "rtl",
            }}
            onClick={() => navigate("/admin?tab=suppliers")}
          >
            חזרה לספקים
          </Button>
          <Typography variant="h4" sx={{ fontWeight: 700, textAlign: "right" }}>
            פרטי ספק
          </Typography>
        </Box>
      </Box>
      <Paper
        variant="outlined"
        dir="rtl"
        sx={{ p: 2, display: "flex", flexDirection: "column", gap: 2, direction: "rtl", textAlign: "start" }}
      >
        <SupplierEditorCore form={form} setForm={setForm} />
        <Box
          sx={{
            pt: 2,
            mt: 0.5,
            borderTop: 1,
            borderColor: "divider",
            width: "100%",
          }}
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 12,
            justifyContent: "flex-end",
            direction: "ltr",
          }}
        >
          <Button variant="outlined" color="error" onClick={handleDelete} disabled={deleteMutation.isPending}>
            מחק ספק
          </Button>
          <Button variant="contained" onClick={handleSave} disabled={updateMutation.isPending}>
            שמור שינויים
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
