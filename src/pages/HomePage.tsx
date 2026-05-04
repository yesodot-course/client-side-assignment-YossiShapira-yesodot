import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Alert, Box, Button, CircularProgress, Typography } from "@mui/material";

import { useItems } from "../features/items/hooks/useItems";
import { useAppDispatch } from "../app/store/hooks";
import { addItem } from "../features/cart/store/cart.slice";
import type { Item } from "../features/items/types";
import { ItemSearchBar } from "../features/items/components/ItemSearchBar";
import { ItemFilters } from "../features/items/components/ItemFilters";
import { ItemSort, type SortValue } from "../features/items/components/ItemSort";
import { ItemsGrid } from "../features/items/components/ItemsGrid";
import { showToast } from "../shared/ui/feedback/toast";

export function HomePage(): JSX.Element {
  const dispatch = useAppDispatch();
  const itemsQuery = useItems();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [supplier, setSupplier] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState<SortValue>("name-asc");

  const items = itemsQuery.data ?? [];
  const categories = useMemo(() => Array.from(new Set(items.map((item) => item.category))).sort(), [items]);
  const suppliers = useMemo(() => {
    const names = items.map((item) =>
      typeof item.supplier === "string" ? item.supplier : item.supplier?.name ?? "לא ידוע"
    );
    return Array.from(new Set(names)).sort();
  }, [items]);

  const filteredItems = useMemo(() => {
    const min = minPrice.trim().length > 0 ? Number(minPrice) : null;
    const max = maxPrice.trim().length > 0 ? Number(maxPrice) : null;
    const normalizedSearch = search.trim().toLowerCase();

    const list = items.filter((item) => {
      const supplierName = typeof item.supplier === "string" ? item.supplier : item.supplier?.name ?? "לא ידוע";
      if (normalizedSearch && !item.name.toLowerCase().includes(normalizedSearch)) {
        return false;
      }
      if (category && item.category !== category) {
        return false;
      }
      if (supplier && supplierName !== supplier) {
        return false;
      }
      if (min !== null && item.price < min) {
        return false;
      }
      if (max !== null && item.price > max) {
        return false;
      }
      return true;
    });

    return [...list].sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      if (sort === "name-desc") return b.name.localeCompare(a.name);
      return a.name.localeCompare(b.name);
    });
  }, [items, search, category, supplier, minPrice, maxPrice, sort]);

  const handleAddToCart = (item: Item, quantity: number) => {
    dispatch(
      addItem({
        id: item._id,
        name: item.name,
        price: item.price,
        quantity,
        stock: item.stock,
        category: item.category,
        imageUrl: item.imageUrl,
      })
    );
    showToast(`"${item.name}" נוסף לעגלה`);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 2 }}>
        <Typography variant="h4" sx={{ textAlign: "start", flex: 1 }}>
          מוצרי החנות
        </Typography>
        <Button component={Link} to="/cart" variant="outlined" color="primary" sx={{ flexShrink: 0, textTransform: "none" }}>
          לעגלה
        </Button>
      </Box>

      <ItemSearchBar value={search} onChange={setSearch} />
      <ItemFilters
        category={category}
        categories={categories}
        supplier={supplier}
        suppliers={suppliers}
        minPrice={minPrice}
        maxPrice={maxPrice}
        onCategoryChange={setCategory}
        onSupplierChange={setSupplier}
        onMinPriceChange={setMinPrice}
        onMaxPriceChange={setMaxPrice}
      />
      <ItemSort value={sort} onChange={setSort} />

      {itemsQuery.isLoading ? <CircularProgress /> : null}
      {itemsQuery.isError ? <Alert severity="error">טעינת המוצרים מהשרת נכשלה.</Alert> : null}
      {!itemsQuery.isLoading && !itemsQuery.isError ? (
        <ItemsGrid items={filteredItems} onAddToCart={handleAddToCart} />
      ) : null}
    </Box>
  );
}