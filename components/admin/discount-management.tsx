"use client";

import { useState, forwardRef, useImperativeHandle } from "react";
import {
  useGetDiscountsQuery,
  useDeleteDiscountMutation,
} from "@/features/discounts/api";
import type { Discount } from "@/features/discounts/types";
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
import { DiscountModal } from "./discount-modal";
import { formatPrice } from "@/lib/utils";

export const DiscountManagement = forwardRef<{ triggerAdd: () => void }, {}>(
  function DiscountManagement(props, ref) {
    const { data: discounts = [], isLoading } = useGetDiscountsQuery();
    const [deleteDiscount] = useDeleteDiscountMutation();
    const { toast } = useToast();
    const [selectedDiscount, setSelectedDiscount] = useState<Discount | null>(
      null
    );
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleDelete = async (discount: Discount) => {
      if (
        confirm(
          `Are you sure you want to delete discount code "${discount.code}"?`
        )
      ) {
        try {
          await deleteDiscount(discount.id).unwrap();
          toast({
            title: "Discount deleted",
            description: `Discount code ${discount.code} has been deleted successfully.`,
          });
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to delete discount.",
            variant: "destructive",
          });
        }
      }
    };

    const handleEdit = (discount: Discount) => {
      setSelectedDiscount(discount);
      setIsModalOpen(true);
    };

    const handleCreate = () => {
      setSelectedDiscount(null);
      setIsModalOpen(true);
    };

    useImperativeHandle(ref, () => ({
      triggerAdd: handleCreate,
    }));

    const columns: ColumnDef<Discount>[] = [
      {
        accessorKey: "code",
        header: "Discount Code",
        cell: ({ row }) => {
          const discount = row.original;
          return (
            <div>
              <div className="font-mono font-medium">{discount.code}</div>
              <div className="text-sm text-muted-foreground line-clamp-1">
                {discount.description}
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "type",
        header: "Type",
        cell: ({ row }) => {
          const type = row.getValue("type") as string;
          return (
            <Badge variant="outline">
              {type === "PERCENTAGE" ? "Percentage" : "Fixed Amount"}
            </Badge>
          );
        },
      },
      {
        accessorKey: "value",
        header: "Value",
        cell: ({ row }) => {
          const discount = row.original;
          const value = row.getValue("value") as number;
          return (
            <div className="font-medium">
              {discount.type === "PERCENTAGE"
                ? `${value}%`
                : formatPrice(value)}
            </div>
          );
        },
      },
      {
        accessorKey: "currentUses",
        header: "Usage",
        cell: ({ row }) => {
          const discount = row.original;
          const current = discount.currentUses;
          const max = discount.maxUses;
          return (
            <div className="text-sm">
              {current} / {max || "∞"}
            </div>
          );
        },
      },
      {
        accessorKey: "isActive",
        header: "Status",
        cell: ({ row }) => {
          const isActive = row.getValue("isActive");
          const discount = row.original;
          const isExpired =
            discount.expiresAt && new Date(discount.expiresAt) < new Date();

          if (isExpired) {
            return <Badge variant="destructive">Expired</Badge>;
          }

          return (
            <Badge variant={isActive ? "default" : "secondary"}>
              {isActive ? "Active" : "Inactive"}
            </Badge>
          );
        },
      },
      {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
          const discount = row.original;

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
                <DropdownMenuItem
                  onClick={() => navigator.clipboard.writeText(discount.code)}
                >
                  Copy discount code
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleEdit(discount)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit discount
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleDelete(discount)}
                  className="text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete discount
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ];

    if (isLoading) {
      return <div className="text-center py-8">Loading discounts...</div>;
    }

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Discount Management</h3>
            <p className="text-sm text-muted-foreground">
              Manage discount codes and promotions
            </p>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Add Discount
          </Button>
        </div>

        <DataTable
          columns={columns}
          data={discounts}
          searchKey="code"
          searchPlaceholder="Search discount codes..."
        />

        <DiscountModal
          discount={selectedDiscount}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedDiscount(null);
          }}
        />
      </div>
    );
  }
);
