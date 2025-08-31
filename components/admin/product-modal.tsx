"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  useCreateProductMutation,
  useUpdateProductMutation,
} from "@/features/products/api";
import type { Product } from "@/features/products/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const productSchema = z.object({
  title: z.string().min(1, "Product name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.number().min(0, "Price must be positive"),
  category: z.string().min(1, "Category is required"),
  imageUrl: z.string().url().optional().or(z.literal("")),
  discountPercentage: z.number().min(0).max(100).optional(),
  inStock: z.boolean(),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const categories = [
  "Electronics",
  "Clothing",
  "Home & Garden",
  "Sports",
  "Books",
  "Beauty",
  "Toys",
  "Automotive",
];

export function ProductModal({ product, isOpen, onClose }: ProductModalProps) {
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      category: "",
      imageUrl: "",
      discountPercentage: 0,
      inStock: true,
    },
  });

  const isEditing = !!product;
  const isLoading = isCreating || isUpdating;

  useEffect(() => {
    if (product) {
      reset({
        title: product.title,
        description: product.description,
        price: product.price,
        category: product.category,
        imageUrl: product.imageUrl || "",
        discountPercentage: product.discountPercentage || 0,
        inStock: product.inStock,
      });
    } else {
      reset({
        title: "",
        description: "",
        price: 0,
        category: "",
        imageUrl: "",
        discountPercentage: 0,
        inStock: true,
      });
    }
  }, [product, reset]);

  const onSubmit = async (data: ProductFormData) => {
    try {
      if (isEditing) {
        await updateProduct({
          id: product.id,
          updates: {
            ...data,
            name: data.title, // Map title to required name field
            imageUrl: data.imageUrl || undefined,
            discountPercentage: data.discountPercentage || undefined,
          },
        }).unwrap();
        toast({
          title: "Product updated",
          description: "Product has been updated successfully.",
        });
      } else {
        await createProduct({
          ...data,
          name: data.title, // Map title to required name field
          imageUrl: data.imageUrl || undefined,
          discountPercentage: data.discountPercentage || undefined,
        }).unwrap();
        toast({
          title: "Product created",
          description: "Product has been created successfully.",
        });
      }
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${isEditing ? "update" : "create"} product.`,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Product" : "Create New Product"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the product information below."
              : "Fill in the details to create a new product."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Product Name</Label>
              <Input id="title" {...register("title")} />
              {errors.title && (
                <p className="text-sm text-destructive">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={watch("category")}
                onValueChange={(value) => setValue("category", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-sm text-destructive">
                  {errors.category.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" {...register("description")} rows={3} />
            {errors.description && (
              <p className="text-sm text-destructive">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price (FCFA)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                {...register("price", { valueAsNumber: true })}
              />
              {errors.price && (
                <p className="text-sm text-destructive">
                  {errors.price.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="discountPercentage">Discount (%)</Label>
              <Input
                id="discountPercentage"
                type="number"
                min="0"
                max="100"
                {...register("discountPercentage", { valueAsNumber: true })}
              />
              {errors.discountPercentage && (
                <p className="text-sm text-destructive">
                  {errors.discountPercentage.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageUrl">Image URL (optional)</Label>
            <Input id="imageUrl" type="url" {...register("imageUrl")} />
            {errors.imageUrl && (
              <p className="text-sm text-destructive">
                {errors.imageUrl.message}
              </p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="inStock"
              checked={watch("inStock")}
              onCheckedChange={(checked) => setValue("inStock", checked)}
            />
            <Label htmlFor="inStock">In Stock</Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? "Update Product" : "Create Product"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
