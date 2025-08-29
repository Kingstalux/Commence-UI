"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Package, Mail, Truck } from "lucide-react"
import type { CheckoutResponse } from "@/features/payments/types"

interface CheckoutConfirmationProps {
  orderDetails: CheckoutResponse
  onContinueShopping: () => void
}

export function CheckoutConfirmation({ orderDetails, onContinueShopping }: CheckoutConfirmationProps) {
  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl text-green-600">Order Confirmed!</CardTitle>
          <p className="text-muted-foreground">Thank you for your purchase. Your order has been successfully placed.</p>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Order Number</span>
              </div>
              <p className="text-lg font-mono">{orderDetails.orderId}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Tracking Number</span>
              </div>
              <p className="text-lg font-mono">{orderDetails.trackingNumber}</p>
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex items-center gap-2 mb-2">
              <Truck className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Estimated Delivery</span>
            </div>
            <p className="text-lg">{orderDetails.estimatedDelivery}</p>
            <Badge variant="secondary" className="mt-2">
              Standard Shipping
            </Badge>
          </div>

          <div className="border-t pt-4">
            <div className="flex items-center gap-2 mb-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Email Confirmation</span>
            </div>
            <p className="text-muted-foreground">
              A confirmation email with tracking details has been sent to your registered email address. You'll receive
              updates about your order status and delivery notifications.
            </p>
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-medium mb-2">What's Next?</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Your order is being prepared for shipment</li>
              <li>• You'll receive a shipping notification with tracking details</li>
              <li>• Track your package using the tracking number above</li>
              <li>• Contact support if you have any questions</li>
            </ul>
          </div>

          <div className="flex gap-4 pt-4">
            <Button onClick={onContinueShopping} className="flex-1">
              Continue Shopping
            </Button>
            <Button variant="outline" className="flex-1 bg-transparent">
              Track Order
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
