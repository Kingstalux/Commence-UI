"use client";

import { usePathname, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import type { RootState } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  ShoppingBag,
  ShoppingCart,
  CreditCard,
  Info,
  Shield,
  Menu,
  X,
  User,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

const navigationItems = [
  {
    name: "Catalog",
    href: "/catalog",
    icon: ShoppingBag,
    requireAuth: false,
  },
  {
    name: "Cart",
    href: "/cart",
    icon: ShoppingCart,
    requireAuth: true,
  },
  {
    name: "Checkout",
    href: "/checkout",
    icon: CreditCard,
    requireAuth: true,
  },
  {
    name: "Profile",
    href: "/profile",
    icon: User,
    requireAuth: true,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
    requireAuth: true,
  },
  {
    name: "About",
    href: "/about",
    icon: Info,
    requireAuth: false,
  },
];

const adminItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: Shield,
    requireAuth: true,
    requireRole: "ADMIN" as const,
  },
];

export function MainNavigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Auto-navigate based on role changes
  useEffect(() => {
    if (user?.role === "ADMIN" && pathname !== "/dashboard") {
      router.push("/dashboard");
    } else if (user?.role === "USER" && pathname === "/dashboard") {
      router.push("/catalog");
    }
  }, [user?.role, pathname, router]);

  // Show only admin items if user is admin, otherwise show regular items
  const isAdminRole = user?.role === "ADMIN";

  const filteredNavItems = isAdminRole
    ? [] // Hide regular nav items for admin
    : navigationItems.filter((item) => !item.requireAuth || isAuthenticated);

  const filteredAdminItems = adminItems.filter(
    (item) =>
      (!item.requireAuth || isAuthenticated) &&
      (!item.requireRole || user?.role === item.requireRole)
  );

  const allItems = [...filteredNavItems, ...filteredAdminItems];

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="sm"
        className="fixed top-2 left-2 z-50 md:hidden h-6 w-6 p-0"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? (
          <X className="h-4 w-4" />
        ) : (
          <Menu className="h-4 w-4" />
        )}
      </Button>

      {/* Navigation sidebar */}
      <nav
        className={cn(
          "fixed left-0 top-10 bottom-0 w-64 bg-background border-r border-border transform transition-transform duration-200 ease-in-out z-40",
          "md:w-48",
          isMobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="flex flex-col h-full p-4 pt-12 overflow-hidden">
          <div className="space-y-1">
            {allItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start h-8 text-sm",
                      isActive && "bg-secondary text-secondary-foreground"
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    {item.name}
                  </Button>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}
