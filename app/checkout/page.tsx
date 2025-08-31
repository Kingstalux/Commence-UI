"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { RouteGuard } from "@/components/auth/route-guard";
import { BreadcrumbNav } from "@/components/layout/breadcrumb-nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { PaymentMethodForm } from "@/components/checkout/payment-method-form";
import { PaymentMethodsList } from "@/components/checkout/payment-methods-list";
import { CheckoutConfirmation } from "@/components/checkout/checkout-confirmation";
import { useGetCartQuery, useClearCartMutation } from "@/features/cart/api";
import {
  useGetPaymentMethodsQuery,
  useProcessCheckoutMutation,
} from "@/features/payments/api";
import { useToast } from "@/hooks/use-toast";
import { Plus, CreditCard, MapPin } from "lucide-react";
import type {
  PaymentMethod,
  CheckoutResponse,
} from "@/features/payments/types";
import { formatPrice } from "@/lib/utils";

const checkoutSchema = z.object({
  billingAddress: z.object({
    street: z.string().min(1, "Street address is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    zipCode: z.string().min(5, "ZIP code is required"),
    country: z.string().min(1, "Country is required"),
  }),
  shippingAddress: z.object({
    street: z.string().min(1, "Street address is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    zipCode: z.string().min(5, "ZIP code is required"),
    country: z.string().min(1, "Country is required"),
  }),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [showAddPayment, setShowAddPayment] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<PaymentMethod | null>(null);
  const [orderConfirmation, setOrderConfirmation] =
    useState<CheckoutResponse | null>(null);
  const [sameAsShipping, setSameAsShipping] = useState(true);

  const { data: cart } = useGetCartQuery();
  const { data: paymentMethods = [] } = useGetPaymentMethodsQuery();
  const [processCheckout, { isLoading: isProcessing }] =
    useProcessCheckoutMutation();
  const [clearCart] = useClearCartMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      billingAddress: {
        street: "123 Main St",
        city: "New York",
        state: "NY",
        zipCode: "10001",
        country: "US",
      },
      shippingAddress: {
        street: "123 Main St",
        city: "New York",
        state: "NY",
        zipCode: "10001",
        country: "US",
      },
    },
  });

  const shippingAddress = watch("shippingAddress");

  // Auto-select default payment method
  useEffect(() => {
    const defaultPayment = paymentMethods.find((pm) => pm.isDefault);
    if (defaultPayment && !selectedPaymentMethod) {
      setSelectedPaymentMethod(defaultPayment);
    }
  }, [paymentMethods, selectedPaymentMethod]);

  // Copy shipping to billing when checkbox is checked
  useEffect(() => {
    if (sameAsShipping) {
      setValue("billingAddress", shippingAddress);
    }
  }, [sameAsShipping, shippingAddress, setValue]);

  console.log("cart", isProcessing);
  console.log("Form errors:", errors);
  console.log("Selected payment method:", selectedPaymentMethod);

  const onSubmit = async (data: CheckoutFormData) => {
    console.log("Form submitted with data:", data);
    if (!selectedPaymentMethod) {
      toast({
        title: "Payment method required",
        description: "Please select a payment method to continue.",
        variant: "destructive",
      });
      return;
    }

    if (!cart || !cart.items || cart.items.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add items to your cart before checkout.",
        variant: "destructive",
      });
      return;
    }

    try {
      const result = await processCheckout({
        paymentMethodId: selectedPaymentMethod.id,
        useDefaultPayment: selectedPaymentMethod.isDefault,
        billingAddress: data.billingAddress,
        shippingAddress: data.shippingAddress,
        total: total,
        items: cart.items, // Include cart items in checkout
      }).unwrap();

      // Clear the cart after successful checkout
      await clearCart().unwrap();

      setOrderConfirmation(result);

      toast({
        title: "Order placed successfully!",
        description:
          "Your order has been confirmed and your cart has been cleared.",
      });
    } catch (error: any) {
      console.error("Checkout error:", error);
      toast({
        title: "Checkout failed",
        description:
          error?.data?.message ||
          "There was an error processing your order. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (orderConfirmation) {
    return (
      <RouteGuard requireAuth>
        <div className="container mx-auto px-4 py-8">
          <CheckoutConfirmation
            orderDetails={orderConfirmation}
            onContinueShopping={() => router.push("/catalog")}
          />
        </div>
      </RouteGuard>
    );
  }

  const cartTotal =
    cart?.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    ) || 0;
  const shipping = 9.99;
  const tax = cartTotal * 0.08;
  const total = cartTotal + shipping + tax;

  return (
    <RouteGuard requireAuth>
      <div className="container mx-auto px-4 py-8">
        <BreadcrumbNav />
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        {showAddPayment ? (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <PaymentMethodForm
                  onSuccess={() => {
                    setShowAddPayment(false);
                    toast({
                      title: "Payment method added",
                      description: "Your new payment method is ready to use.",
                    });
                  }}
                  onCancel={() => setShowAddPayment(false)}
                />
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Checkout Form */}
              <div className="lg:col-span-2 space-y-8">
                {/* Payment Methods */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      Payment Method
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <PaymentMethodsList
                      selectedPaymentMethodId={selectedPaymentMethod?.id}
                      onSelectPaymentMethod={setSelectedPaymentMethod}
                      showSelection={true}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowAddPayment(true)}
                      className="w-full"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add New Payment Method
                    </Button>
                  </CardContent>
                </Card>

                {/* Shipping Address */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Shipping Address
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="shippingStreet">Street Address</Label>
                      <Input
                        id="shippingStreet"
                        {...register("shippingAddress.street")}
                        placeholder="123 Main St"
                      />
                      {errors.shippingAddress?.street && (
                        <p className="text-sm text-destructive">
                          {errors.shippingAddress.street.message}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="shippingCity">City</Label>
                        <Input
                          id="shippingCity"
                          {...register("shippingAddress.city")}
                          placeholder="New York"
                        />
                        {errors.shippingAddress?.city && (
                          <p className="text-sm text-destructive">
                            {errors.shippingAddress.city.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="shippingState">State</Label>
                        <Input
                          id="shippingState"
                          {...register("shippingAddress.state")}
                          placeholder="NY"
                        />
                        {errors.shippingAddress?.state && (
                          <p className="text-sm text-destructive">
                            {errors.shippingAddress.state.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="shippingZip">ZIP Code</Label>
                        <Input
                          id="shippingZip"
                          {...register("shippingAddress.zipCode")}
                          placeholder="10001"
                        />
                        {errors.shippingAddress?.zipCode && (
                          <p className="text-sm text-destructive">
                            {errors.shippingAddress.zipCode.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="shippingCountry">Country</Label>
                        <Input
                          id="shippingCountry"
                          {...register("shippingAddress.country")}
                          placeholder="US"
                        />
                        {errors.shippingAddress?.country && (
                          <p className="text-sm text-destructive">
                            {errors.shippingAddress.country.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Billing Address */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Billing Address
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="sameAsShipping"
                        checked={sameAsShipping}
                        onCheckedChange={(checked) =>
                          setSameAsShipping(!!checked)
                        }
                      />
                      <Label htmlFor="sameAsShipping">
                        Same as shipping address
                      </Label>
                    </div>

                    {!sameAsShipping && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="billingStreet">Street Address</Label>
                          <Input
                            id="billingStreet"
                            {...register("billingAddress.street")}
                            placeholder="123 Main St"
                          />
                          {errors.billingAddress?.street && (
                            <p className="text-sm text-destructive">
                              {errors.billingAddress.street.message}
                            </p>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="billingCity">City</Label>
                            <Input
                              id="billingCity"
                              {...register("billingAddress.city")}
                              placeholder="New York"
                            />
                            {errors.billingAddress?.city && (
                              <p className="text-sm text-destructive">
                                {errors.billingAddress.city.message}
                              </p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="billingState">State</Label>
                            <Input
                              id="billingState"
                              {...register("billingAddress.state")}
                              placeholder="NY"
                            />
                            {errors.billingAddress?.state && (
                              <p className="text-sm text-destructive">
                                {errors.billingAddress.state.message}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="billingZip">ZIP Code</Label>
                            <Input
                              id="billingZip"
                              {...register("billingAddress.zipCode")}
                              placeholder="10001"
                            />
                            {errors.billingAddress?.zipCode && (
                              <p className="text-sm text-destructive">
                                {errors.billingAddress.zipCode.message}
                              </p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="billingCountry">Country</Label>
                            <Input
                              id="billingCountry"
                              {...register("billingAddress.country")}
                              placeholder="US"
                            />
                            {errors.billingAddress?.country && (
                              <p className="text-sm text-destructive">
                                {errors.billingAddress.country.message}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isProcessing || !selectedPaymentMethod}
                  size="lg"
                  onClick={() => {
                    // Show validation errors if any
                    if (Object.keys(errors).length > 0) {
                      toast({
                        title: "Please fill in all required fields",
                        description:
                          "Check the shipping and billing address sections for missing information.",
                        variant: "destructive",
                      });
                    }
                  }}
                >
                  {isProcessing
                    ? "Processing..."
                    : `Place Order - ${formatPrice(total)}`}
                </Button>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <Card className="sticky top-4">
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {cart?.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between items-center"
                      >
                        <div className="flex-1">
                          <p className="font-medium">{item.product.title}</p>
                          <p className="text-sm text-muted-foreground">
                            Qty: {item.quantity}
                          </p>
                        </div>
                        <p className="font-medium">
                          {formatPrice(item.product.price * item.quantity)}
                        </p>
                      </div>
                    ))}

                    <Separator />

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>{formatPrice(cartTotal)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Shipping</span>
                        <span>{formatPrice(shipping)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tax</span>
                        <span>{formatPrice(tax)}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span>{formatPrice(total)}</span>
                      </div>
                    </div>

                    {selectedPaymentMethod && (
                      <div className="pt-4 border-t">
                        <p className="text-sm text-muted-foreground mb-2">
                          Payment Method
                        </p>
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4" />
                          <span className="text-sm">
                            {selectedPaymentMethod.brand || "Unknown"} ••••{" "}
                            {selectedPaymentMethod.last4}
                          </span>
                          {selectedPaymentMethod.isDefault && (
                            <Badge variant="secondary" className="text-xs">
                              Default
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </form>
        )}
      </div>
    </RouteGuard>
  );
}
