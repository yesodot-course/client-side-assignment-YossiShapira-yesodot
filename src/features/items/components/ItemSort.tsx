import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { rtlOutlinedFormControlSx, rtlSelectInputProps, rtlSelectMenuProps } from "../../../shared/ui/rtlOutlinedField";

export type SortValue = "name-asc" | "name-desc" | "price-asc" | "price-desc";

interface ItemSortProps {
  value: SortValue;
  onChange: (value: SortValue) => void;
}

export function ItemSort({ value, onChange }: ItemSortProps): JSX.Element {
  return (
    <FormControl fullWidth sx={rtlOutlinedFormControlSx}>
      <InputLabel id="sort-label">מיון</InputLabel>
      <Select
        labelId="sort-label"
        value={value}
        label="מיון"
        onChange={(event) => onChange(event.target.value as SortValue)}
        inputProps={rtlSelectInputProps}
        MenuProps={rtlSelectMenuProps}
      >
        <MenuItem value="name-asc">שם (א-ת)</MenuItem>
        <MenuItem value="name-desc">שם (ת-א)</MenuItem>
        <MenuItem value="price-asc">מחיר (נמוך לגבוה)</MenuItem>
        <MenuItem value="price-desc">מחיר (גבוה לנמוך)</MenuItem>
      </Select>
    </FormControl>
  );
}
