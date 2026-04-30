import { useEffect, useState } from "react";
import {
  Avatar,
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import type { ItemInput } from "../api/items.api";
import { showToast } from "../../../shared/ui/feedback/toast";
import { useSuppliers } from "../../suppliers/hooks/useSuppliers";
import { useItems } from "../hooks/useItems";

interface ItemFormModalProps {
  open: boolean;
  onClose: () => void;
  initialValue?: ItemInput;
  submitLabel: string;
  onSubmit: (value: ItemInput) => void;
  onDelete?: () => void;
}

type ItemFormState = {
  name: string;
  price: string;
  supplierPrice: string;
  stock: string;
  category: string;
  imageUrl: string;
  supplier: string;
};

const emptyValue: ItemFormState = {
  name: "",
  price: "",
  supplierPrice: "",
  stock: "",
  category: "",
  imageUrl: "",
  supplier: "",
};

export function ItemFormModal({ open, onClose, initialValue, submitLabel, onSubmit, onDelete }: ItemFormModalProps): JSX.Element {
  const [form, setForm] = useState<ItemFormState>(emptyValue);
  const suppliersQuery = useSuppliers();
  const itemsQuery = useItems();

  useEffect(() => {
    if (!initialValue) {
      setForm(emptyValue);
      return;
    }
    setForm({
      name: initialValue.name,
      price: String(initialValue.price),
      supplierPrice: String(initialValue.supplierPrice),
      stock: String(initialValue.stock),
      category: initialValue.category,
      imageUrl: initialValue.imageUrl ?? "",
      supplier: initialValue.supplier,
    });
  }, [initialValue, open]);

  const suppliers = suppliersQuery.data ?? [];
  const storeItems = itemsQuery.data ?? [];
  const selectedSupplier = suppliers.find((supplier) => supplier._id === form.supplier);
  const supplierCatalog = selectedSupplier?.items ?? [];
  const normalizeName = (value: string): string => value.trim().toLocaleLowerCase();
  const findCatalogItemByName = (value: string) =>
    supplierCatalog.find((item) => normalizeName(item.itemName) === normalizeName(value));
  const exactCatalogItem = findCatalogItemByName(form.name);

  const getFallbackImageFromStore = (itemName: string): string => {
    if (!form.supplier || itemName.trim().length === 0) {
      return "";
    }
    const matchedStoreItem = storeItems.find((storeItem) => {
      const supplierId = typeof storeItem.supplier === "string" ? storeItem.supplier : storeItem.supplier?._id;
      return supplierId === form.supplier && normalizeName(storeItem.name) === normalizeName(itemName);
    });
    return matchedStoreItem?.imageUrl?.trim() ?? "";
  };

  const validate = (): boolean => {
    if (form.name.trim().length < 1) {
      showToast("יש לבחור מוצר מהקטלוג של הספק.");
      return false;
    }
    if (form.supplier.trim().length > 0 && !exactCatalogItem) {
      showToast("יש לבחור שם מוצר שקיים בקטלוג הספק.");
      return false;
    }
    if (form.category.trim().length < 2) {
      showToast("יש להזין קטגוריה תקינה.");
      return false;
    }
    if (form.supplier.trim().length === 0) {
      showToast("יש לבחור ספק.");
      return false;
    }
    const price = Number(form.price);
    const supplierPrice = Number(form.supplierPrice);
    const stock = Number(form.stock);
    if (!Number.isFinite(price) || !Number.isFinite(supplierPrice) || !Number.isFinite(stock)) {
      showToast("יש להזין ערכים מספריים תקינים.");
      return false;
    }
    if (price < 0 || supplierPrice < 0 || stock < 0) {
      showToast("מחיר ומלאי חייבים להיות גדולים או שווים לאפס.");
      return false;
    }
    const minAllowedPrice = supplierPrice * 1.3;
    if (price < minAllowedPrice) {
      showToast(`מחיר מכירה חייב להיות לפחות ${minAllowedPrice.toFixed(2)} (30% מעל עלות ספק).`);
      return false;
    }
    if (form.imageUrl && form.imageUrl.trim().length > 0) {
      try {
        new URL(form.imageUrl);
      } catch (_error: unknown) {
        showToast("כתובת התמונה חייבת להיות URL תקין.");
        return false;
      }
    }
    return true;
  };

  const buildPayload = (): ItemInput => ({
    name: form.name.trim(),
    price: Number(form.price),
    supplierPrice: Number(form.supplierPrice),
    stock: Number(form.stock),
    category: form.category.trim(),
    imageUrl: form.imageUrl.trim(),
    supplier: form.supplier,
  });

  const updateNumericField = (field: "price" | "supplierPrice" | "stock", rawValue: string) => {
    if (rawValue === "") {
      setForm((prev) => ({ ...prev, [field]: "" }));
      return;
    }
    if (!/^\d*\.?\d*$/.test(rawValue)) {
      return;
    }
    setForm((prev) => ({ ...prev, [field]: rawValue }));
  };

  const selectedSupplierOption = suppliers.find((supplier) => supplier._id === form.supplier) ?? null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>טופס מוצר</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 1, display: "flex", flexDirection: "column", gap: 2 }}>
          <Autocomplete
            options={suppliers}
            value={selectedSupplierOption}
            getOptionLabel={(option) => option.name}
            isOptionEqualToValue={(option, value) => option._id === value._id}
            onChange={(_event, value) => {
              setForm((prev) => ({
                ...prev,
                supplier: value?._id ?? "",
                name: "",
                supplierPrice: "",
                imageUrl: "",
              }));
            }}
            renderInput={(params) => <TextField {...params} label="ספק" placeholder="הקלד כדי לחפש ספק..." />}
          />
          <Autocomplete
            freeSolo
            forcePopupIcon
            options={supplierCatalog.map((item) => item.itemName)}
            inputValue={form.name}
            onInputChange={(_event, value) => {
              const matched = findCatalogItemByName(value);
              setForm((prev) => ({
                ...prev,
                name: value,
                supplierPrice: matched ? String(matched.price) : "",
                imageUrl: matched?.imageUrl?.trim() || getFallbackImageFromStore(value),
              }));
            }}
            onChange={(_event, value) => {
              const selectedName = typeof value === "string" ? value : "";
              const selected = findCatalogItemByName(selectedName);
              setForm((prev) => ({
                ...prev,
                name: selectedName,
                supplierPrice: selected ? String(selected.price) : "",
                imageUrl: selected?.imageUrl?.trim() || getFallbackImageFromStore(selectedName),
              }));
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="שם מוצר מהקטלוג"
                placeholder={form.supplier ? "הקלד או בחר..." : "בחר ספק ואז הקלד/בחר מוצר"}
              />
            )}
            renderOption={(props, optionName) => {
              const option = supplierCatalog.find((item) => item.itemName === optionName);
              return (
                <Box component="li" {...props} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Avatar
                    variant="rounded"
                    src={option?.imageUrl || getFallbackImageFromStore(optionName)}
                    alt={optionName}
                    sx={{ width: 36, height: 36, bgcolor: "grey.100", color: "text.secondary" }}
                  >
                    🖼️
                  </Avatar>
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <span>{optionName}</span>
                    <span style={{ color: "#666", fontSize: 12 }}>עלות ספק: {option?.price ?? "-"}</span>
                  </Box>
                </Box>
              );
            }}
          />
          <TextField
            label="קטגוריה"
            value={form.category}
            onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value }))}
          />
          <TextField
            label="מחיר"
            type="number"
            value={form.price}
            onChange={(event) => updateNumericField("price", event.target.value)}
            slotProps={{
              htmlInput: {
                min: form.supplierPrice.trim().length > 0 ? Number((Number(form.supplierPrice) * 1.3).toFixed(2)) : 0,
                style: { direction: "rtl", textAlign: "right" },
              },
            }}
          />
          <TextField
            label="עלות ספק"
            type="number"
            value={form.supplierPrice}
            onChange={(event) => updateNumericField("supplierPrice", event.target.value)}
            disabled
            slotProps={{ htmlInput: { style: { direction: "rtl", textAlign: "right" } } }}
          />
          <TextField
            label="מלאי"
            type="number"
            value={form.stock}
            onChange={(event) => updateNumericField("stock", event.target.value)}
            slotProps={{ htmlInput: { style: { direction: "rtl", textAlign: "right" } } }}
          />
          {form.imageUrl ? (
            <Box
              component="img"
              src={form.imageUrl.trim()}
              alt="תמונת מוצר מהקטלוג"
              sx={{ width: "100%", maxHeight: 180, objectFit: "cover", borderRadius: 1, border: "1px solid #ddd" }}
            />
          ) : null}
        </Box>
      </DialogContent>
      <DialogActions>
        {onDelete ? (
          <Button color="error" onClick={onDelete}>
            מחק מוצר
          </Button>
        ) : null}
        <Button onClick={onClose}>ביטול</Button>
        <Button
          variant="contained"
          onClick={() => {
            if (!validate()) {
              return;
            }
            onSubmit(buildPayload());
            onClose();
          }}
        >
          {submitLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
