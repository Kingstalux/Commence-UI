export interface Product {
  id: string;
  name: string;
  title?: string;
  description: string;
  price: number;
  discountedPrice?: number;
  imageUrl?: string;
  category: string;
  tags?: string[];
  inStock: boolean;
  stockCount?: number;
  discountPercentage?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductFilters {
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  sortBy?: "price_asc" | "price_desc" | "name_asc" | "name_desc" | "newest";
}
