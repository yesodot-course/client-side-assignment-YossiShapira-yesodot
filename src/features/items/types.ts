export interface Item {
  _id: string;
  name: string;
  price: number;
  supplierPrice: number;
  stock: number;
  category: string;
  imageUrl?: string;
  description?: string;
  supplier?: {
    _id: string;
    name: string;
  } | string;
}