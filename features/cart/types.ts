export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  liked?: boolean;
  addedAt?: string;
  product: {
    id: string;
    name: string;
    title: string;
    price: number;
    discountedPrice?: number;
    imageUrl?: string;
  };
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  subtotal: number;
  tax?: number;
  total?: number;
  discountAmount?: number;
  createdAt: string;
  updatedAt: string;
}
