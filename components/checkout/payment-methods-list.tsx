"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  useGetPaymentMethodsQuery,
  useDeletePaymentMethodMutation,
  useSetDefaultPaymentMethodMutation,
} from "@/features/payments/api";
import { useToast } from "@/hooks/use-toast";
import { CreditCard, Trash2, Star } from "lucide-react";
import type { PaymentMethod } from "@/features/payments/types";

interface PaymentMethodsListProps {
  selectedPaymentMethodId?: string;
  onSelectPaymentMethod?: (paymentMethod: PaymentMethod) => void;
  showSelection?: boolean;
}

export function PaymentMethodsList({
  selectedPaymentMethodId,
  onSelectPaymentMethod,
  showSelection = false,
}: PaymentMethodsListProps) {
  const { data: paymentMethods = [], isLoading } = useGetPaymentMethodsQuery();
  const [deletePaymentMethod] = useDeletePaymentMethodMutation();
  const [setDefaultPaymentMethod] = useSetDefaultPaymentMethodMutation();
  const { toast } = useToast();

  const handleDelete = async (id: string) => {
    try {
      await deletePaymentMethod(id).unwrap();
      toast({
        title: "Payment method deleted",
        description: "The payment method has been removed.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete payment method.",
        variant: "destructive",
      });
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await setDefaultPaymentMethod(id).unwrap();
      toast({
        title: "Default payment method updated",
        description: "Your default payment method has been changed.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update default payment method.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div className="text-center py-4">Loading payment methods...</div>;
  }

  if (paymentMethods.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <CreditCard className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">No payment methods added yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {paymentMethods.map((paymentMethod) => (
        <Card
          key={paymentMethod.id}
          className={`cursor-pointer transition-colors ${
            showSelection && selectedPaymentMethodId === paymentMethod.id
              ? "ring-2 ring-primary"
              : ""
          }`}
          onClick={() =>
            showSelection && onSelectPaymentMethod?.(paymentMethod)
          }
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CreditCard className="h-8 w-8 text-muted-foreground" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {paymentMethod.brand || "Unknown"} ••••{" "}
                      {paymentMethod.last4}
                    </span>
                    {paymentMethod.isDefault && (
                      <Badge variant="secondary" className="text-xs">
                        <Star className="h-3 w-3 mr-1" />
                        Default
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {paymentMethod.cardholderName} • Expires{" "}
                    {paymentMethod.expiryDate}
                  </p>
                </div>
              </div>

              {!showSelection && (
                <div className="flex items-center gap-2">
                  {!paymentMethod.isDefault && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSetDefault(paymentMethod.id)}
                    >
                      Set Default
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(paymentMethod.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
