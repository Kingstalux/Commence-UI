"use client";

import { useSelector, useDispatch } from "react-redux";
import {
  useGetCartQuery,
  useUpdateCartItemMutation,
  useRemoveFromCartMutation,
  useLikeCartItemMutation,
} from "@/features/cart/api";
import { setCartOpen } from "@/features/cart/slice";
import type { RootState } from "@/lib/store";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  CreditCard,
  Heart,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { calculateCartTotals } from "@/lib/cart-utils";

export function CartDrawer() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { isOpen } = useSelector((state: RootState) => state.cart);
  const { data: cart, isLoading } = useGetCartQuery();
  const [updateCartItem] = useUpdateCartItemMutation();
  const [removeFromCart] = useRemoveFromCartMutation();
  const [likeCartItem] = useLikeCartItemMutation();
  const { toast } = useToast();

  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveItem(itemId);
      return;
    }

    try {
      await updateCartItem({ id: itemId, quantity: newQuantity }).unwrap();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update item quantity.",
        variant: "destructive",
      });
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    try {
      await removeFromCart(itemId).unwrap();
      toast({
        title: "Item removed",
        description: "Item has been removed from your cart.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove item from cart.",
        variant: "destructive",
      });
    }
  };

  const handleCheckout = () => {
    dispatch(setCartOpen(false));
    router.push("/checkout");
  };

  // Calculate cart totals
  const cartTotals = cart
    ? calculateCartTotals(cart)
    : { subtotal: 0, tax: 0, total: 0 };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => dispatch(setCartOpen(open))}>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center">
            <ShoppingCart className="h-5 w-5 mr-2" />
            Shopping Cart
          </SheetTitle>
          <SheetDescription>
            {cart?.items?.length
              ? `${cart.items.length} items in your cart`
              : "Your cart is empty"}
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col h-full">
          {isLoading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Loading cart...</p>
              </div>
            </div>
          ) : !cart?.items?.length ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">Your cart is empty</p>
                <Button
                  onClick={() => {
                    dispatch(setCartOpen(false));
                    router.push("/catalog");
                  }}
                >
                  Continue Shopping
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto py-4">
                <div className="space-y-4">
                  {cart.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center space-x-3 p-3 border rounded-lg"
                    >
                      <div className="relative w-16 h-16 bg-muted rounded-md overflow-hidden">
                        <Image
                          src={
                            item.product.imageUrl ||
                            `/placeholder.svg?height=64&width=64&query=${encodeURIComponent(
                              item.product.title
                            )}`
                          }
                          alt={item.product.title}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm line-clamp-2">
                          {item.product.title}
                        </h4>
                        <p className="text-sm font-semibold">
                          {formatPrice(item.product.price)}
                        </p>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0 bg-transparent"
                          onClick={() =>
                            handleQuantityChange(item.id, item.quantity - 1)
                          }
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <Badge
                          variant="secondary"
                          className="min-w-[2rem] text-center"
                        >
                          {item.quantity}
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0 bg-transparent"
                          onClick={() =>
                            handleQuantityChange(item.id, item.quantity + 1)
                          }
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                          onClick={() => handleRemoveItem(item.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>{formatPrice(cartTotals.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax</span>
                    <span>{formatPrice(cartTotals.tax)}</span>
                  </div>
                  {cart.discountAmount && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Discount</span>
                      <span>-{formatPrice(cart.discountAmount)}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>{formatPrice(cartTotals.total)}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button onClick={handleCheckout} className="w-full">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Checkout
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      dispatch(setCartOpen(false));
                      router.push("/cart");
                    }}
                    className="w-full"
                  >
                    View Full Cart
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
