"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useCreateDiscountMutation, useUpdateDiscountMutation } from "@/features/discounts/api"
import type { Discount } from "@/features/discounts/types"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

const discountSchema = z.object({
  code: z.string().min(1, "Discount code is required").toUpperCase(),
  description: z.string().min(1, "Description is required"),
  type: z.enum(["PERCENTAGE", "FIXED"]),
  value: z.number().min(0, "Value must be positive"),
  minOrderAmount: z.number().min(0).optional(),
  maxUses: z.number().min(1).optional(),
  expiresAt: z.string().optional(),
  isActive: z.boolean(),
})

type DiscountFormData = z.infer<typeof discountSchema>

interface DiscountModalProps {
  discount: Discount | null
  isOpen: boolean
  onClose: () => void
}

export function DiscountModal({ discount, isOpen, onClose }: DiscountModalProps) {
  const [createDiscount, { isLoading: isCreating }] = useCreateDiscountMutation()
  const [updateDiscount, { isLoading: isUpdating }] = useUpdateDiscountMutation()
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<DiscountFormData>({
    resolver: zodResolver(discountSchema),
    defaultValues: {
      code: "",
      description: "",
      type: "PERCENTAGE",
      value: 0,
      minOrderAmount: undefined,
      maxUses: undefined,
      expiresAt: "",
      isActive: true,
    },
  })

  const isEditing = !!discount
  const isLoading = isCreating || isUpdating
  const discountType = watch("type")

  useEffect(() => {
    if (discount) {
      reset({
        code: discount.code,
        description: discount.description,
        type: discount.type,
        value: discount.value,
        minOrderAmount: discount.minOrderAmount,
        maxUses: discount.maxUses,
        expiresAt: discount.expiresAt ? discount.expiresAt.split("T")[0] : "",
        isActive: discount.isActive,
      })
    } else {
      reset({
        code: "",
        description: "",
        type: "PERCENTAGE",
        value: 0,
        minOrderAmount: undefined,
        maxUses: undefined,
        expiresAt: "",
        isActive: true,
      })
    }
  }, [discount, reset])

  const onSubmit = async (data: DiscountFormData) => {
    try {
      const payload = {
        ...data,
        minOrderAmount: data.minOrderAmount || undefined,
        maxUses: data.maxUses || undefined,
        expiresAt: data.expiresAt || undefined,
      }

      if (isEditing) {
        await updateDiscount({
          id: discount.id,
          updates: payload,
        }).unwrap()
        toast({
          title: "Discount updated",
          description: "Discount has been updated successfully.",
        })
      } else {
        await createDiscount(payload).unwrap()
        toast({
          title: "Discount created",
          description: "Discount has been created successfully.",
        })
      }
      onClose()
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${isEditing ? "update" : "create"} discount.`,
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Discount" : "Create New Discount"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the discount information below."
              : "Fill in the details to create a new discount code."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="code">Discount Code</Label>
              <Input id="code" {...register("code")} placeholder="SAVE20" className="font-mono" />
              {errors.code && <p className="text-sm text-destructive">{errors.code.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Discount Type</Label>
              <Select value={watch("type")} onValueChange={(value: "PERCENTAGE" | "FIXED") => setValue("type", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PERCENTAGE">Percentage</SelectItem>
                  <SelectItem value="FIXED">Fixed Amount</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" {...register("description")} rows={2} />
            {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="value">{discountType === "PERCENTAGE" ? "Percentage (%)" : "Amount ($)"}</Label>
              <Input
                id="value"
                type="number"
                step={discountType === "PERCENTAGE" ? "1" : "0.01"}
                max={discountType === "PERCENTAGE" ? "100" : undefined}
                {...register("value", { valueAsNumber: true })}
              />
              {errors.value && <p className="text-sm text-destructive">{errors.value.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="minOrderAmount">Min Order Amount ($)</Label>
              <Input
                id="minOrderAmount"
                type="number"
                step="0.01"
                {...register("minOrderAmount", { valueAsNumber: true })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="maxUses">Max Uses</Label>
              <Input
                id="maxUses"
                type="number"
                {...register("maxUses", { valueAsNumber: true })}
                placeholder="Unlimited"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="expiresAt">Expiry Date</Label>
              <Input id="expiresAt" type="date" {...register("expiresAt")} />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isActive"
              checked={watch("isActive")}
              onCheckedChange={(checked) => setValue("isActive", checked)}
            />
            <Label htmlFor="isActive">Active</Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? "Update Discount" : "Create Discount"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
