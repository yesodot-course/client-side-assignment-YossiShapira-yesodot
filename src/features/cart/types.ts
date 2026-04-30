export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  stock: number;
  category?: string;
  imageUrl?: string;
}

export interface CartState {
  items: CartItem[];
}