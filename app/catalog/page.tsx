"use client"

import { useState, useMemo } from "react"
import { useGetProductsQuery } from "@/features/products/api"
import type { ProductFilters } from "@/features/products/types"
import { BreadcrumbNav } from "@/components/layout/breadcrumb-nav"
import { ProductCard } from "@/components/catalog/product-card"
import { ProductFiltersComponent } from "@/components/catalog/product-filters"
import { ProductSort } from "@/components/catalog/product-sort"
import { CartDrawer } from "@/components/cart/cart-drawer"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Grid, List, Filter } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function CatalogPage() {
  const [filters, setFilters] = useState<ProductFilters>({})
  const [sortBy, setSortBy] = useState("name-asc")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showFilters, setShowFilters] = useState(false)

  const { data: products = [], isLoading, error } = useGetProductsQuery(filters)

  // Sort products client-side for demo
  const sortedProducts = useMemo(() => {
    if (!products.length) return []

    const sorted = [...products]
    switch (sortBy) {
      case "name-asc":
        return sorted.sort((a, b) => (a.title || "").localeCompare(b.title || ""))
      case "name-desc":
        return sorted.sort((a, b) => (b.title || "").localeCompare(a.title || ""))
      case "price-asc":
        return sorted.sort((a, b) => (a.price || 0) - (b.price || 0))
      case "price-desc":
        return sorted.sort((a, b) => (b.price || 0) - (a.price || 0))
      case "category":
        return sorted.sort((a, b) => (a.category || "").localeCompare(b.category || ""))
      default:
        return sorted
    }
  }, [products, sortBy])

  const clearFilters = () => {
    setFilters({})
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <BreadcrumbNav />
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Unable to load products</h2>
          <p className="text-muted-foreground mb-4">Please check your connection and try again.</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <BreadcrumbNav />

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Product Catalog</h1>
          <p className="text-muted-foreground">
            {isLoading ? "Loading products..." : `${sortedProducts.length} products found`}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)} className="md:hidden">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>

          <div className="flex items-center border rounded-md">
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="rounded-r-none"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="rounded-l-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>

          <ProductSort sortBy={sortBy} onSortChange={setSortBy} />
        </div>
      </div>

      <div className="flex gap-8">
        {/* Filters Sidebar */}
        <div className={`w-80 shrink-0 ${showFilters ? "block" : "hidden md:block"}`}>
          <ProductFiltersComponent filters={filters} onFiltersChange={setFilters} onClearFilters={clearFilters} />
        </div>

        {/* Products Grid */}
        <div className="flex-1">
          {isLoading ? (
            <div
              className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}
            >
              {[...Array(12)].map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="aspect-square w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : sortedProducts.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-2">No products found</h3>
              <p className="text-muted-foreground mb-4">Try adjusting your filters or search terms.</p>
              <Button onClick={clearFilters}>Clear Filters</Button>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={`${viewMode}-${sortBy}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className={`grid gap-6 ${
                  viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
                }`}
              >
                {sortedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>

      <CartDrawer />
    </div>
  )
}
