import { useEffect, useState } from "react";
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
import type { SupplierInput } from "../types";
import { showToast } from "../../../shared/ui/feedback/toast";
import { uploadSupplierImage } from "../api/supplier-image-upload.api.ts";
import { useItems } from "../../items/hooks/useItems";

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

export function SupplierFormModal({
  open,
  onClose,
  initialValue,
  submitLabel,
  onSubmit,
}: SupplierFormModalProps): JSX.Element {
  const [form, setForm] = useState<SupplierInput>(initialValue ?? emptyValue);
  const itemsQuery = useItems();
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const [actionAnchorEl, setActionAnchorEl] = useState<HTMLElement | null>(null);
  const [actionIndex, setActionIndex] = useState<number | null>(null);
  const [isCatalogDialogOpen, setIsCatalogDialogOpen] = useState(false);
  const [editingCatalogIndex, setEditingCatalogIndex] = useState<number | null>(null);
  const [catalogDraft, setCatalogDraft] = useState<CatalogItemDraft>(emptyCatalogDraft);

  useEffect(() => {
    setForm(initialValue ?? emptyValue);
  }, [initialValue, open]);

  const storeItems = itemsQuery.data ?? [];
  const getFallbackCatalogImage = (itemName: string): string | undefined => {
    const matched = storeItems.find((storeItem) => {
      const supplierName = typeof storeItem.supplier === "string" ? storeItem.supplier : storeItem.supplier?.name;
      return supplierName?.trim() === form.name.trim() && storeItem.name.trim() === itemName.trim();
    });
    return matched?.imageUrl?.trim();
  };

  const validate = (): boolean => {
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
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>טופס ספק</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 1, display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField label="שם" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
          <TextField
            label="פרטי קשר"
            value={form.contactInfo}
            onChange={(event) => setForm({ ...form, contactInfo: event.target.value })}
          />
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            {form.items.map((catalogItem, index) => (
              <Paper
                key={index}
                dir="ltr"
                variant="outlined"
                sx={{ p: 1.25, display: "flex", alignItems: "center" }}
              >
                <Box sx={{ display: "flex", alignItems: "center", flexShrink: 0, gap: 2 }}>
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
                  <Typography variant="body2" color="text.secondary">
                    עלות: {catalogItem.price}
                  </Typography>
                </Box>
                <Box sx={{ flex: 1 }} />
                <Box sx={{ display: "flex", alignItems: "center", minWidth: 0, ml: "auto" }}>
                  <Typography
                    variant="subtitle2"
                    sx={{ textAlign: "right", pr: 0.5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", direction: "rtl" }}
                  >
                    {catalogItem.itemName || "פריט ללא שם"}
                  </Typography>
                  <IconButton
                    onClick={(event) => {
                      setActionAnchorEl(event.currentTarget);
                      setActionIndex(index);
                    }}
                    aria-label="פעולות פריט קטלוג"
                    edge="end"
                    sx={{ p: 0.5, mr: 0 }}
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
            >
              הוסף פריט קטלוג
            </Button>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>ביטול</Button>
        <Button
          variant="contained"
          onClick={() => {
            if (!validate()) {
              return;
            }
            onSubmit(form);
            onClose();
          }}
        >
          {submitLabel}
        </Button>
      </DialogActions>

      <Menu
        anchorEl={actionAnchorEl}
        open={Boolean(actionAnchorEl) && actionIndex !== null}
        onClose={() => {
          setActionAnchorEl(null);
          setActionIndex(null);
        }}
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
          <EditIcon fontSize="small" sx={{ ml: 0.5 }} />
          ערוך
        </MenuItem>
        <MenuItem
          sx={{ color: "error.main" }}
          onClick={() => {
            if (actionIndex === null) {
              return;
            }
            setForm((prev) => ({
              ...prev,
              items: prev.items.filter((_, index) => index !== actionIndex),
            }));
            setActionAnchorEl(null);
            setActionIndex(null);
          }}
        >
          <DeleteIcon fontSize="small" sx={{ ml: 0.5 }} />
          הסר
        </MenuItem>
      </Menu>

      <Dialog open={isCatalogDialogOpen} onClose={() => setIsCatalogDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{editingCatalogIndex === null ? "הוספת פריט קטלוג" : "עריכת פריט קטלוג"}</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 1, display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="שם פריט בקטלוג"
              value={catalogDraft.itemName}
              onChange={(event) => setCatalogDraft((prev) => ({ ...prev, itemName: event.target.value }))}
            />
            <TextField
              label="מחיר פריט בקטלוג"
              type="number"
              value={catalogDraft.price}
              onChange={(event) => setCatalogDraft((prev) => ({ ...prev, price: event.target.value }))}
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
        <DialogActions>
          <Button onClick={() => setIsCatalogDialogOpen(false)}>ביטול</Button>
          <Button variant="contained" onClick={saveCatalogItem}>
            שמירה
          </Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  );
}
