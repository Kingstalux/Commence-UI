"use client";

import { useState, forwardRef, useImperativeHandle } from "react";
import {
  useGetProductsQuery,
  useDeleteProductMutation,
} from "@/features/products/api";
import type { Product } from "@/features/products/types";
import { DataTable } from "./data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, MoreHorizontal } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ProductModal } from "./product-modal";

export const ProductManagement = forwardRef<{ triggerAdd: () => void }, {}>(
  function ProductManagement(props, ref) {
    const { data: products = [], isLoading } = useGetProductsQuery();
    const [deleteProduct] = useDeleteProductMutation();
    const { toast } = useToast();
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(
      null
    );
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleDelete = async (product: Product) => {
      if (confirm(`Are you sure you want to delete "${product.title}"?`)) {
        try {
          await deleteProduct(product.id).unwrap();
          toast({
            title: "Product deleted",
            description: `${product.title} has been deleted successfully.`,
          });
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to delete product.",
            variant: "destructive",
          });
        }
      }
    };

    const handleEdit = (product: Product) => {
      setSelectedProduct(product);
      setIsModalOpen(true);
    };

    const handleCreate = () => {
      setSelectedProduct(null);
      setIsModalOpen(true);
    };

    useImperativeHandle(ref, () => ({
      triggerAdd: handleCreate,
    }));

    const columns: ColumnDef<Product>[] = [
      {
        accessorKey: "title",
        header: "Product Name",
        cell: ({ row }) => {
          const product = row.original;
          return (
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-muted rounded-md flex items-center justify-center">
                <span className="text-xs font-medium">
                  {product.title?.charAt(0) || "?"}
                </span>
              </div>
              <div>
                <div className="font-medium">{product.title || "Untitled"}</div>
                <div className="text-sm text-muted-foreground line-clamp-1">
                  {product.description || "No description"}
                </div>
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "category",
        header: "Category",
        cell: ({ row }) => (
          <Badge variant="outline">{row.getValue("category")}</Badge>
        ),
      },
      {
        accessorKey: "price",
        header: "Price",
        cell: ({ row }) => {
          const price = Number.parseFloat(row.getValue("price"));
          const formatted = new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "XAF",
          }).format(price);
          return <div className="font-medium">{formatted}</div>;
        },
      },
      {
        accessorKey: "discountPercentage",
        header: "Discount",
        cell: ({ row }) => {
          const discount = row.getValue("discountPercentage") as number;
          return discount ? (
            <Badge variant="secondary">{discount}% OFF</Badge>
          ) : (
            <span className="text-muted-foreground">-</span>
          );
        },
      },
      {
        accessorKey: "inStock",
        header: "Stock Status",
        cell: ({ row }) => {
          const inStock = row.getValue("inStock");
          return (
            <Badge variant={inStock ? "default" : "destructive"}>
              {inStock ? "In Stock" : "Out of Stock"}
            </Badge>
          );
        },
      },
      {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
          const product = row.original;

          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleEdit(product)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit product
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleDelete(product)}
                  className="text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete product
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ];

    if (isLoading) {
      return <div className="text-center py-8">Loading products...</div>;
    }

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Product Management</h3>
            <p className="text-sm text-muted-foreground">
              Manage your product catalog
            </p>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </div>

        <DataTable
          columns={columns}
          data={products}
          searchKey="title"
          searchPlaceholder="Search products..."
        />

        <ProductModal
          product={selectedProduct}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedProduct(null);
          }}
        />
      </div>
    );
  }
);
