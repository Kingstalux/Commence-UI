"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useCreatePaymentMethodMutation } from "@/features/payments/api";
import { useToast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";

const paymentMethodSchema = z
  .object({
    type: z.enum(["credit_card", "debit_card", "paypal", "apple_pay"]),
    cardholderName: z.string().optional(),
    cardNumber: z.string().optional(),
    expiryDate: z.string().optional(),
    cvv: z.string().optional(),
    isDefault: z.boolean().default(false),
  })
  .superRefine((data, ctx) => {
    // Only validate card fields for card payment types
    if (data.type === "credit_card" || data.type === "debit_card") {
      if (!data.cardholderName || data.cardholderName.length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Cardholder name is required",
          path: ["cardholderName"],
        });
      }
      if (!data.cardNumber || data.cardNumber.length < 16) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Card number must be 16 digits",
          path: ["cardNumber"],
        });
      }
      if (
        !data.expiryDate ||
        !/^(0[1-9]|1[0-2])\/\d{2}$/.test(data.expiryDate)
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Invalid expiry date (MM/YY)",
          path: ["expiryDate"],
        });
      }
      if (!data.cvv || data.cvv.length < 3 || data.cvv.length > 4) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "CVV must be 3-4 digits",
          path: ["cvv"],
        });
      }
    }
  });

type PaymentMethodFormData = z.infer<typeof paymentMethodSchema>;

interface PaymentMethodFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function PaymentMethodForm({
  onSuccess,
  onCancel,
}: PaymentMethodFormProps) {
  const [createPaymentMethod, { isLoading }] = useCreatePaymentMethodMutation();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(paymentMethodSchema),
    defaultValues: {
      type: "credit_card" as const,
      isDefault: false,
      cardholderName: "",
      cardNumber: "",
      expiryDate: "",
      cvv: "",
    },
  });

  const cardType = watch("type");

  const onSubmit = async (data: PaymentMethodFormData) => {
    try {
      console.log("Submitting payment method:", data);
      const result = await createPaymentMethod(data).unwrap();
      console.log("Payment method created:", result);

      toast({
        title: "Payment method added",
        description: "Your payment method has been saved successfully.",
      });
      onSuccess?.();
    } catch (error: any) {
      console.error("Payment method creation failed:", error);

      const errorMessage =
        error?.data?.message ||
        error?.message ||
        "Failed to add payment method. Please try again.";

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(" ");
    } else {
      return v;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Add Payment Method
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
          noValidate
        >
          <div className="space-y-2">
            <Label htmlFor="type">Payment Type</Label>
            <Select
              value={cardType}
              onValueChange={(value) => setValue("type", value as any)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="credit_card">Credit Card</SelectItem>
                <SelectItem value="debit_card">Debit Card</SelectItem>
                <SelectItem value="paypal">PayPal</SelectItem>
                <SelectItem value="apple_pay">Apple Pay</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {(cardType === "credit_card" || cardType === "debit_card") && (
            <>
              <div className="space-y-2">
                <Label htmlFor="cardholderName">Cardholder Name</Label>
                <Input
                  id="cardholderName"
                  {...register("cardholderName")}
                  placeholder="John Doe"
                />
                {errors.cardholderName && (
                  <p className="text-sm text-destructive">
                    {errors.cardholderName.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input
                  id="cardNumber"
                  {...register("cardNumber")}
                  placeholder="1234 5678 9012 3456"
                  onChange={(e) => {
                    const formatted = formatCardNumber(e.target.value);
                    e.target.value = formatted;
                    setValue("cardNumber", formatted.replace(/\s/g, ""));
                  }}
                />
                {errors.cardNumber && (
                  <p className="text-sm text-destructive">
                    {errors.cardNumber.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiryDate">Expiry Date</Label>
                  <Input
                    id="expiryDate"
                    {...register("expiryDate")}
                    placeholder="MM/YY"
                    maxLength={5}
                    onChange={(e) => {
                      let value = e.target.value.replace(/\D/g, "");
                      if (value.length >= 2) {
                        value =
                          value.substring(0, 2) + "/" + value.substring(2, 4);
                      }
                      e.target.value = value;
                      setValue("expiryDate", value);
                    }}
                  />
                  {errors.expiryDate && (
                    <p className="text-sm text-destructive">
                      {errors.expiryDate.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    {...register("cvv")}
                    placeholder="123"
                    maxLength={4}
                  />
                  {errors.cvv && (
                    <p className="text-sm text-destructive">
                      {errors.cvv.message}
                    </p>
                  )}
                </div>
              </div>
            </>
          )}

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isDefault"
              onCheckedChange={(checked) => setValue("isDefault", !!checked)}
            />
            <Label htmlFor="isDefault">Set as default payment method</Label>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? "Adding..." : "Add Payment Method"}
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
