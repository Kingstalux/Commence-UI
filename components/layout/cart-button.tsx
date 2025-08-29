"use client"

import { useSelector } from "react-redux"
import { useGetCartQuery } from "@/features/cart/api"
import { toggleCart } from "@/features/cart/slice"
import { useDispatch } from "react-redux"
import type { RootState } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart } from "lucide-react"

export function CartButton() {
  const dispatch = useDispatch()
  const { data: cart } = useGetCartQuery()
  const { isAuthenticated } = useSelector((state: RootState) => state.auth)

  if (!isAuthenticated) return null

  const itemCount = cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0

  return (
    <Button variant="ghost" size="sm" className="relative h-7 w-7 p-0" onClick={() => dispatch(toggleCart())}>
      <ShoppingCart className="h-4 w-4" />
      {itemCount > 0 && (
        <Badge
          variant="destructive"
          className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs flex items-center justify-center"
        >
          {itemCount > 99 ? "99+" : itemCount}
        </Badge>
      )}
    </Button>
  )
}
