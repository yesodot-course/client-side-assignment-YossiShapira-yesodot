import { TextField } from "@mui/material";
import { rtlOutlinedTextFieldHtmlInputProps, rtlOutlinedTextFieldSx } from "../../../shared/ui/rtlOutlinedField";

interface ItemSearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function ItemSearchBar({ value, onChange }: ItemSearchBarProps): JSX.Element {
  return (
    <TextField
      id="store-items-search"
      fullWidth
      variant="outlined"
      label="חיפוש מוצרים"
      placeholder="חיפוש לפי שם מוצר..."
      value={value}
      onChange={(event) => onChange(event.target.value)}
      dir="rtl"
      sx={rtlOutlinedTextFieldSx}
      slotProps={{ htmlInput: { ...rtlOutlinedTextFieldHtmlInputProps } }}
    />
  );
}
