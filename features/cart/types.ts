export interface CartItem {
  id: string
  productId: string
  quantity: number
  product: {
    id: string
    title: string
    price: number
    imageUrl?: string
  }
}

export interface Cart {
  id: string
  items: CartItem[]
  subtotal: number
  tax: number
  total: number
  discountAmount?: number
}
