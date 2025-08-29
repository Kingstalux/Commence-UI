"use client"

import { useGetCartQuery, useUpdateCartItemMutation, useRemoveFromCartMutation } from "@/features/cart/api"
import { useApplyDiscountMutation } from "@/features/discounts/api"
import { RouteGuard } from "@/components/auth/route-guard"
import { BreadcrumbNav } from "@/components/layout/breadcrumb-nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { ShoppingCart, Plus, Minus, Trash2, Tag, CreditCard } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import Image from "next/image"

export default function CartPage() {
  const router = useRouter()
  const { data: cart, isLoading } = useGetCartQuery()
  const [updateCartItem] = useUpdateCartItemMutation()
  const [removeFromCart] = useRemoveFromCartMutation()
  const [applyDiscount] = useApplyDiscountMutation()
  const { toast } = useToast()
  const [discountCode, setDiscountCode] = useState("")
  const [isApplyingDiscount, setIsApplyingDiscount] = useState(false)

  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveItem(itemId)
      return
    }

    try {
      await updateCartItem({ id: itemId, quantity: newQuantity }).unwrap()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update item quantity.",
        variant: "destructive",
      })
    }
  }

  const handleRemoveItem = async (itemId: string) => {
    try {
      await removeFromCart(itemId).unwrap()
      toast({
        title: "Item removed",
        description: "Item has been removed from your cart.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove item from cart.",
        variant: "destructive",
      })
    }
  }

  const handleApplyDiscount = async () => {
    if (!discountCode.trim() || !cart) return

    setIsApplyingDiscount(true)
    try {
      await applyDiscount({
        code: discountCode,
        cartId: cart.id,
      }).unwrap()

      toast({
        title: "Discount applied",
        description: "Your discount code has been applied successfully.",
      })
      setDiscountCode("")
    } catch (error) {
      toast({
        title: "Invalid discount code",
        description: "The discount code you entered is not valid or has expired.",
        variant: "destructive",
      })
    } finally {
      setIsApplyingDiscount(false)
    }
  }

  return (
    <RouteGuard requireAuth>
      <div className="container mx-auto px-4 py-8">
        <BreadcrumbNav />

        <div className="flex items-center mb-8">
          <ShoppingCart className="h-8 w-8 mr-3" />
          <h1 className="text-3xl font-bold">Shopping Cart</h1>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <p>Loading your cart...</p>
          </div>
        ) : !cart?.items?.length ? (
          <div className="text-center py-12">
            <ShoppingCart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">Add some products to get started!</p>
            <Button onClick={() => router.push("/catalog")}>Continue Shopping</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.items.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="relative w-24 h-24 bg-muted rounded-lg overflow-hidden">
                        <Image
                          src={
                            item.product.imageUrl ||
                            `/placeholder.svg?height=96&width=96&query=${encodeURIComponent(item.product.title)}`
                          }
                          alt={item.product.title}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg line-clamp-2">{item.product.title}</h3>
                        <p className="text-muted-foreground">Product ID: {item.product.id}</p>
                        <p className="text-lg font-bold mt-2">${item.product.price.toFixed(2)}</p>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <Badge variant="secondary" className="min-w-[3rem] text-center py-2">
                            {item.quantity}
                          </Badge>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="space-y-6">
              {/* Discount Code */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <Tag className="h-5 w-5 mr-2" />
                    Discount Code
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Enter discount code"
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value)}
                    />
                    <Button onClick={handleApplyDiscount} disabled={!discountCode.trim() || isApplyingDiscount}>
                      {isApplyingDiscount ? "Applying..." : "Apply"}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Order Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>${cart.subtotal?.toFixed(2) || "0.00"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax</span>
                      <span>${cart.tax?.toFixed(2) || "0.00"}</span>
                    </div>
                    {cart.discountAmount && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount</span>
                        <span>-${cart.discountAmount.toFixed(2)}</span>
                      </div>
                    )}
                    <Separator />
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total</span>
                      <span>${cart.total?.toFixed(2) || "0.00"}</span>
                    </div>
                  </div>

                  <Button onClick={() => router.push("/checkout")} className="w-full" size="lg">
                    <CreditCard className="h-5 w-5 mr-2" />
                    Proceed to Checkout
                  </Button>

                  <Button variant="outline" onClick={() => router.push("/catalog")} className="w-full">
                    Continue Shopping
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </RouteGuard>
  )
}
