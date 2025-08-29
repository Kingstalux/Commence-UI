export interface CheckoutRequest {
  cartId: string
  shippingAddress: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  paymentMethod: {
    type: "CARD" | "PAYPAL"
    cardNumber?: string
    expiryMonth?: number
    expiryYear?: number
    cvv?: string
  }
}

export interface Transaction {
  id: string
  status: "PENDING" | "COMPLETED" | "FAILED"
  amount: number
  items: Array<{
    productId: string
    quantity: number
    price: number
  }>
  createdAt: string
}

export interface BurstCheckoutResult {
  totalRequests: number
  successCount: number
  errorCount: number
  averageLatency: number
  results: Array<{
    success: boolean
    latency: number
    error?: string
  }>
}
