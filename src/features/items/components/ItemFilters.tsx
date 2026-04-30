import { Box, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";

interface ItemFiltersProps {
  category: string;
  categories: string[];
  supplier: string;
  suppliers: string[];
  minPrice: string;
  maxPrice: string;
  onCategoryChange: (value: string) => void;
  onSupplierChange: (value: string) => void;
  onMinPriceChange: (value: string) => void;
  onMaxPriceChange: (value: string) => void;
}

export function ItemFilters(props: ItemFiltersProps): JSX.Element {
  const {
    category,
    categories,
    supplier,
    suppliers,
    minPrice,
    maxPrice,
    onCategoryChange,
    onSupplierChange,
    onMinPriceChange,
    onMaxPriceChange,
  } = props;

  return (
    <Box
      sx={{
        display: "grid",
        gap: 2,
        gridTemplateColumns: { xs: "1fr", md: "repeat(4, minmax(0, 1fr))" },
      }}
    >
      <FormControl fullWidth>
        <InputLabel id="category-label">קטגוריה</InputLabel>
        <Select
          labelId="category-label"
          value={category}
          label="קטגוריה"
          onChange={(event) => onCategoryChange(event.target.value)}
        >
          <MenuItem value="">הכל</MenuItem>
          {categories.map((value) => (
            <MenuItem key={value} value={value}>
              {value}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth>
        <InputLabel id="supplier-label">ספק</InputLabel>
        <Select
          labelId="supplier-label"
          value={supplier}
          label="ספק"
          onChange={(event) => onSupplierChange(event.target.value)}
        >
          <MenuItem value="">הכל</MenuItem>
          {suppliers.map((value) => (
            <MenuItem key={value} value={value}>
              {value}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        label="מחיר מינימלי"
        type="number"
        value={minPrice}
        onChange={(event) => onMinPriceChange(event.target.value)}
      />
      <TextField
        label="מחיר מקסימלי"
        type="number"
        value={maxPrice}
        onChange={(event) => onMaxPriceChange(event.target.value)}
      />
    </Box>
  );
}
