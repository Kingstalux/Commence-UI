import type { Cart, CartItem } from "@/features/cart/types";

export function calculateCartTotals(cart: Cart): {
  subtotal: number;
  tax: number;
  total: number;
} {
  const subtotal = cart.items.reduce((sum, item) => {
    const price = item.product.discountedPrice || item.product.price;
    return sum + price * item.quantity;
  }, 0);

  // Tax rate of 7.5% (standard VAT in many countries)
  const tax = subtotal * 0.075;
  const total = subtotal + tax - (cart.discountAmount || 0);

  return {
    subtotal,
    tax,
    total: Math.max(0, total), // Ensure total is never negative
  };
}

export function getCartItemCount(cart: Cart | undefined): number {
  if (!cart?.items) return 0;
  return cart.items.reduce((total, item) => total + item.quantity, 0);
}
