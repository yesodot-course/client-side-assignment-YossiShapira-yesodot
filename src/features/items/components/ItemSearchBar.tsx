import { TextField } from "@mui/material";

interface ItemSearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function ItemSearchBar({ value, onChange }: ItemSearchBarProps): JSX.Element {
  return (
    <TextField
      fullWidth
      label="חיפוש מוצרים"
      placeholder="חיפוש לפי שם מוצר..."
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
  );
}
