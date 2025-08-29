export interface Discount {
  id: string
  code: string
  description: string
  type: "PERCENTAGE" | "FIXED"
  value: number
  minOrderAmount?: number
  maxUses?: number
  currentUses: number
  expiresAt?: string
  isActive: boolean
}

export interface ApplyDiscountRequest {
  code: string
  cartId: string
}
