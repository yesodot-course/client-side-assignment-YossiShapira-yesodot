export interface Supplier {
  _id: string;
  name: string;
  contactInfo: string;
  items: SupplierCatalogItem[];
}

export interface SupplierCatalogItem {
  itemName: string;
  price: number;
  imageUrl?: string;
}

export interface SupplierInput {
  name: string;
  contactInfo: string;
  items: SupplierCatalogItem[];
}