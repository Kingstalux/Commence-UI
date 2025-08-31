"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAddToCartMutation } from "@/features/cart/api";
import { addOptimisticUpdate } from "@/features/cart/slice";
import type { RootState } from "@/lib/store";
import type { Product } from "@/features/products/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ShoppingCart, Star, Heart } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [addToCart] = useAddToCartMutation();
  const { toast } = useToast();

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Sign in required",
        description: "Please sign in to add items to your cart.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Optimistic update
      dispatch(addOptimisticUpdate({ id: product.id, quantity: 1 }));

      await addToCart({
        productId: product.id,
        quantity: 1,
      }).unwrap();

      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const discountedPrice = product.discountPercentage
    ? product.price * (1 - product.discountPercentage / 100)
    : product.price;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="group"
    >
      <Card className="h-full flex flex-col overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow">
        <div className="relative aspect-square overflow-hidden bg-muted">
          <Image
            src={
              product.imageUrl ||
              `/placeholder.svg?height=300&width=300&query=${encodeURIComponent(
                product?.name
              )}`
            }
            alt={product?.name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />

          {/* Discount badge */}
          {product.discountPercentage && (
            <Badge className="absolute top-2 left-2 bg-destructive text-destructive-foreground">
              -{product.discountPercentage}%
            </Badge>
          )}

          {/* Stock status */}
          {!product.inStock && (
            <Badge variant="secondary" className="absolute top-2 right-2">
              Out of Stock
            </Badge>
          )}

          {/* Favorite button */}
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2 h-8 w-8 p-0 bg-background/80 hover:bg-background"
            onClick={() => setIsFavorited(!isFavorited)}
          >
            <Heart
              className={`h-4 w-4 ${
                isFavorited ? "fill-red-500 text-red-500" : ""
              }`}
            />
          </Button>
        </div>

        <CardContent className="flex-1 p-4">
          <div className="space-y-2">
            <Badge variant="outline" className="text-xs">
              {product.category}
            </Badge>
            <h3 className="font-semibold line-clamp-2 text-sm">
              {product.title}
            </h3>
            <p className="text-xs text-muted-foreground line-clamp-2">
              {product.description}
            </p>

            {/* Rating placeholder */}
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="h-3 w-3 fill-yellow-400 text-yellow-400"
                />
              ))}
              <span className="text-xs text-muted-foreground ml-1">(4.5)</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0">
          <div className="flex items-center justify-between w-full">
            <div className="flex flex-col">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg">
                  {discountedPrice.toLocaleString()} FCFA
                </span>
                {product.discountPercentage && (
                  <span className="text-sm text-muted-foreground line-through">
                    {product.price.toLocaleString()} FCFA
                  </span>
                )}
              </div>
            </div>

            <Button
              size="sm"
              onClick={handleAddToCart}
              disabled={!product.inStock || isLoading}
              className="shrink-0"
            >
              <ShoppingCart className="h-4 w-4 mr-1" />
              {isLoading ? "Adding..." : "Add"}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
