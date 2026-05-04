import { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import MoreVertIcon from "@mui/icons-material/MoreVert";

import { useItems } from "../../items/hooks/useItems";
import type { SupplierInput } from "../types";
import { formatCurrency } from "../../../shared/lib/formatters";
import { showToast } from "../../../shared/ui/feedback/toast";
import { rtlOutlinedTextFieldHtmlInputProps, rtlOutlinedTextFieldSx } from "../../../shared/ui/rtlOutlinedField";
import { uploadSupplierImage } from "../api/supplier-image-upload.api";

type CatalogItemDraft = {
  itemName: string;
  price: string;
  imageUrl: string;
};

const emptyCatalogDraft: CatalogItemDraft = {
  itemName: "",
  price: "",
  imageUrl: "",
};

export function validateSupplierForm(form: SupplierInput): boolean {
  if (form.name.trim().length < 2) {
    showToast("שם ספק חייב להכיל לפחות 2 תווים.");
    return false;
  }
  if (form.contactInfo.trim().length < 3) {
    showToast("יש להזין פרטי קשר תקינים.");
    return false;
  }
  const hasInvalidCatalogItem = form.items.some((item) => item.itemName.trim().length < 2 || item.price < 0);
  if (hasInvalidCatalogItem) {
    showToast("יש לתקן את פרטי הקטלוג (שם פריט לפחות 2 תווים ומחיר לא שלילי).");
    return false;
  }
  return true;
}

interface SupplierEditorCoreProps {
  form: SupplierInput;
  setForm: React.Dispatch<React.SetStateAction<SupplierInput>>;
}

export function SupplierEditorCore({ form, setForm }: SupplierEditorCoreProps): JSX.Element {
  const itemsQuery = useItems();
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const [actionAnchorEl, setActionAnchorEl] = useState<HTMLElement | null>(null);
  const [actionIndex, setActionIndex] = useState<number | null>(null);
  const [isCatalogDialogOpen, setIsCatalogDialogOpen] = useState(false);
  const [editingCatalogIndex, setEditingCatalogIndex] = useState<number | null>(null);
  const [catalogDraft, setCatalogDraft] = useState<CatalogItemDraft>(emptyCatalogDraft);

  const storeItems = itemsQuery.data ?? [];
  const getFallbackCatalogImage = (itemName: string): string | undefined => {
    const matched = storeItems.find((storeItem) => {
      const supplierName = typeof storeItem.supplier === "string" ? storeItem.supplier : storeItem.supplier?.name;
      return supplierName?.trim() === form.name.trim() && storeItem.name.trim() === itemName.trim();
    });
    return matched?.imageUrl?.trim();
  };

  const openCreateCatalogDialog = () => {
    setEditingCatalogIndex(null);
    setCatalogDraft(emptyCatalogDraft);
    setIsCatalogDialogOpen(true);
  };

  const openEditCatalogDialog = (index: number) => {
    const item = form.items[index];
    if (!item) {
      return;
    }
    setEditingCatalogIndex(index);
    setCatalogDraft({
      itemName: item.itemName,
      price: String(item.price),
      imageUrl: item.imageUrl?.trim() ?? "",
    });
    setIsCatalogDialogOpen(true);
  };

  const removeCatalogItem = (index: number) => {
    setForm((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const saveCatalogItem = () => {
    const itemName = catalogDraft.itemName.trim();
    const price = Number(catalogDraft.price);
    const imageUrl = catalogDraft.imageUrl.trim();
    if (itemName.length < 2) {
      showToast("שם פריט בקטלוג חייב להכיל לפחות 2 תווים.");
      return;
    }
    if (!Number.isFinite(price) || price < 0) {
      showToast("מחיר פריט בקטלוג חייב להיות מספר לא שלילי.");
      return;
    }
    if (imageUrl.length > 0) {
      try {
        new URL(imageUrl);
      } catch {
        showToast("כתובת תמונה אינה תקינה.");
        return;
      }
    }

    const nextItem = {
      itemName,
      price,
      imageUrl,
    };

    setForm((prev) => {
      if (editingCatalogIndex === null) {
        return { ...prev, items: [...prev.items, nextItem] };
      }
      return {
        ...prev,
        items: prev.items.map((item, index) => (index === editingCatalogIndex ? nextItem : item)),
      };
    });
    setIsCatalogDialogOpen(false);
    setCatalogDraft(emptyCatalogDraft);
    setEditingCatalogIndex(null);
  };

  return (
    <Box dir="rtl" sx={{ direction: "rtl", textAlign: "start" }}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          label="שם"
          value={form.name}
          onChange={(event) => setForm({ ...form, name: event.target.value })}
          variant="outlined"
          fullWidth
          dir="rtl"
          sx={rtlOutlinedTextFieldSx}
          slotProps={{ htmlInput: { ...rtlOutlinedTextFieldHtmlInputProps } }}
        />
        <TextField
          label="פרטי קשר"
          value={form.contactInfo}
          onChange={(event) => setForm({ ...form, contactInfo: event.target.value })}
          variant="outlined"
          fullWidth
          dir="rtl"
          sx={rtlOutlinedTextFieldSx}
          slotProps={{ htmlInput: { ...rtlOutlinedTextFieldHtmlInputProps } }}
        />
        <Typography variant="subtitle2" color="text.secondary" sx={{ width: "100%", textAlign: "right" }}>
          פריטי קטלוג
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          {form.items.map((catalogItem, index) => (
            <Paper
              key={index}
              variant="outlined"
              sx={{
                p: 1.25,
                width: "100%",
                boxSizing: "border-box",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 1.5,
                direction: "rtl",
              }}
            >
              <Avatar
                variant="rounded"
                src={
                  catalogItem.imageUrl && catalogItem.imageUrl.trim().length > 0
                    ? catalogItem.imageUrl.trim()
                    : getFallbackCatalogImage(catalogItem.itemName)
                }
                alt={catalogItem.itemName || "תמונת פריט"}
                sx={{
                  width: 52,
                  height: 52,
                  borderRadius: 1,
                  border: "1px solid #ddd",
                  bgcolor: "grey.100",
                  color: "text.secondary",
                  flexShrink: 0,
                }}
              >
                🖼️
              </Avatar>
              <Typography
                variant="subtitle2"
                sx={{
                  flexShrink: 1,
                  minWidth: 0,
                  maxWidth: { xs: "10rem", sm: "16rem" },
                  textAlign: "right",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {catalogItem.itemName || "פריט ללא שם"}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: "nowrap", flexShrink: 0 }}>
                עלות: {formatCurrency(catalogItem.price)}
              </Typography>
              <Box sx={{ flex: "1 1 0%", minWidth: 0 }} aria-hidden />
              <Box sx={{ flexShrink: 0 }}>
                <IconButton
                  size="small"
                  aria-label="פעולות פריט קטלוג"
                  onClick={(event) => {
                    setActionAnchorEl(event.currentTarget);
                    setActionIndex(index);
                  }}
                >
                  <MoreVertIcon />
                </IconButton>
              </Box>
            </Paper>
          ))}
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={openCreateCatalogDialog}
            sx={{ alignSelf: "flex-start", width: "auto", justifyContent: "flex-start", direction: "rtl" }}
          >
            הוסף פריט קטלוג
          </Button>
        </Box>
      </Box>

      <Menu
        anchorEl={actionAnchorEl}
        open={Boolean(actionAnchorEl) && actionIndex !== null}
        onClose={() => {
          setActionAnchorEl(null);
          setActionIndex(null);
        }}
        slotProps={{ paper: { sx: { direction: "rtl", textAlign: "start" } } }}
      >
        <MenuItem
          onClick={() => {
            if (actionIndex === null) {
              return;
            }
            openEditCatalogDialog(actionIndex);
            setActionAnchorEl(null);
            setActionIndex(null);
          }}
        >
          <EditIcon fontSize="small" sx={{ marginInlineEnd: 0.5 }} />
          ערוך
        </MenuItem>
        <MenuItem
          sx={{ color: "error.main" }}
          onClick={() => {
            if (actionIndex === null) {
              return;
            }
            removeCatalogItem(actionIndex);
            setActionAnchorEl(null);
            setActionIndex(null);
          }}
        >
          <DeleteIcon fontSize="small" sx={{ marginInlineEnd: 0.5 }} />
          הסר
        </MenuItem>
      </Menu>

      <Dialog
        open={isCatalogDialogOpen}
        onClose={() => setIsCatalogDialogOpen(false)}
        fullWidth
        maxWidth="sm"
        slotProps={{ paper: { sx: { direction: "rtl", textAlign: "start" } } }}
      >
        <DialogTitle>{editingCatalogIndex === null ? "הוספת פריט קטלוג" : "עריכת פריט קטלוג"}</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 1, display: "flex", flexDirection: "column", gap: 2, direction: "rtl", textAlign: "start" }}>
            <TextField
              label="שם פריט בקטלוג"
              value={catalogDraft.itemName}
              onChange={(event) => setCatalogDraft((prev) => ({ ...prev, itemName: event.target.value }))}
              variant="outlined"
              fullWidth
              dir="rtl"
              sx={rtlOutlinedTextFieldSx}
              slotProps={{ htmlInput: { ...rtlOutlinedTextFieldHtmlInputProps } }}
            />
            <TextField
              label="מחיר פריט בקטלוג"
              type="number"
              value={catalogDraft.price}
              onChange={(event) => setCatalogDraft((prev) => ({ ...prev, price: event.target.value }))}
              variant="outlined"
              fullWidth
              dir="rtl"
              sx={rtlOutlinedTextFieldSx}
              slotProps={{ htmlInput: { ...rtlOutlinedTextFieldHtmlInputProps } }}
            />
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Button component="label" variant="outlined" disabled={uploadingIndex !== null}>
                {uploadingIndex !== null ? "מעלה..." : "העלה תמונה"}
                <input
                  hidden
                  type="file"
                  accept="image/*"
                  onChange={async (event) => {
                    const file = event.target.files?.[0];
                    if (!file) {
                      return;
                    }
                    try {
                      setUploadingIndex(editingCatalogIndex ?? -1);
                      const uploadedUrl = await uploadSupplierImage(file);
                      setCatalogDraft((prev) => ({ ...prev, imageUrl: uploadedUrl.trim() }));
                      showToast("התמונה הועלתה בהצלחה.");
                    } catch (error: unknown) {
                      const message = error instanceof Error ? error.message : "העלאת התמונה נכשלה.";
                      showToast(message);
                    } finally {
                      setUploadingIndex(null);
                      event.target.value = "";
                    }
                  }}
                />
              </Button>
              {uploadingIndex !== null ? <CircularProgress size={20} /> : null}
              {catalogDraft.imageUrl ? (
                <Box
                  component="img"
                  src={catalogDraft.imageUrl.trim()}
                  alt="תצוגת תמונת פריט קטלוג"
                  sx={{ width: "100%", maxHeight: 180, objectFit: "cover", borderRadius: 1, border: "1px solid #ddd" }}
                />
              ) : null}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "flex-start", gap: 1, px: 2, pb: 2, direction: "rtl" }}>
          <Button variant="contained" onClick={saveCatalogItem}>
            שמירה
          </Button>
          <Button onClick={() => setIsCatalogDialogOpen(false)}>ביטול</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
