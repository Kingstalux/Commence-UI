export interface PaymentMethod {
  id: string
  type: "credit_card" | "debit_card" | "paypal" | "apple_pay"
  cardNumber?: string
  expiryDate?: string
  cardholderName?: string
  isDefault: boolean
  last4?: string
  brand?: string
  createdAt: string
}

export interface CreatePaymentMethodRequest {
  type: "credit_card" | "debit_card" | "paypal" | "apple_pay"
  cardNumber?: string
  expiryDate?: string
  cardholderName?: string
  cvv?: string
  isDefault?: boolean
}

export interface CheckoutRequest {
  paymentMethodId?: string
  useDefaultPayment?: boolean
  billingAddress: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  shippingAddress: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
}

export interface CheckoutResponse {
  orderId: string
  status: "success" | "failed"
  message: string
  estimatedDelivery: string
  trackingNumber?: string
}
