import { useEffect, useState } from "react";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";

import type { SupplierInput } from "../types";
import { SupplierEditorCore, validateSupplierForm } from "./SupplierEditorCore";

interface SupplierFormModalProps {
  open: boolean;
  onClose: () => void;
  initialValue?: SupplierInput;
  submitLabel: string;
  onSubmit: (value: SupplierInput) => void;
}

const emptyValue: SupplierInput = {
  name: "",
  contactInfo: "",
  items: [],
};

export function SupplierFormModal({ open, onClose, initialValue, submitLabel, onSubmit }: SupplierFormModalProps): JSX.Element {
  const [form, setForm] = useState<SupplierInput>(initialValue ?? emptyValue);

  useEffect(() => {
    setForm(initialValue ?? emptyValue);
  }, [initialValue, open]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      slotProps={{ paper: { sx: { direction: "rtl", textAlign: "start" } } }}
    >
      <DialogTitle>טופס ספק</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 1 }}>
          <SupplierEditorCore form={form} setForm={setForm} />
        </Box>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "flex-start", gap: 1, px: 2, pb: 2, direction: "rtl" }}>
        <Button
          variant="contained"
          onClick={() => {
            if (!validateSupplierForm(form)) {
              return;
            }
            onSubmit(form);
            onClose();
          }}
        >
          {submitLabel}
        </Button>
        <Button onClick={onClose}>ביטול</Button>
      </DialogActions>
    </Dialog>
  );
}
