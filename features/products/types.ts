export interface Product {
  id: string
  title: string
  description: string
  price: number
  imageUrl?: string
  category: string
  inStock: boolean
  discountPercentage?: number
}

export interface ProductFilters {
  category?: string
  search?: string
  minPrice?: number
  maxPrice?: number
  inStock?: boolean
}
