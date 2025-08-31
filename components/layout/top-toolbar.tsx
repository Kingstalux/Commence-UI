"use client";

import { useSelector } from "react-redux";
import type { RootState } from "@/lib/store";
import { UserMenu } from "@/components/auth/user-menu";
import { RoleSelect } from "./user-select";
import { CartButton } from "./cart-button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Search, ShoppingBag } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export function TopToolbar() {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-10 bg-background border-b border-border shadow-sm">
      <div className="flex items-center justify-between h-full px-4">
        {/* Left side - Logo/Brand */}
        <div className="flex items-center space-x-4">
          <Link href="/catalog" className="flex items-center space-x-2">
            <ShoppingBag className="h-5 w-5 text-primary" />
            <span className="font-semibold text-sm">ShopFlow</span>
          </Link>
        </div>

        {/* Center - Search (on larger screens) */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              className="pl-8 h-7 text-xs"
            />
          </div>
        </div>

        {/* Right side - User controls */}
        <div className="flex items-center space-x-2">
          <ThemeToggle />
          {isAuthenticated && <CartButton />}
          <RoleSelect />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
