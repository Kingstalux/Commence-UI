"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

const routeLabels: Record<string, string> = {
  "/": "Home",
  "/catalog": "Catalog",
  "/cart": "Cart",
  "/checkout": "Checkout",
  "/dashboard": "Dashboard",
  "/about": "About",
  "/login": "Login",
  "/signup": "Sign Up",
}

export function BreadcrumbNav() {
  const pathname = usePathname()

  // Don't show breadcrumbs on auth pages or home
  if (pathname === "/" || pathname === "/login" || pathname === "/signup") {
    return null
  }

  const pathSegments = pathname.split("/").filter(Boolean)

  return (
    <Breadcrumb className="mb-6">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/catalog" className="flex items-center">
              <Home className="h-4 w-4" />
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {pathSegments.map((segment, index) => {
          const path = "/" + pathSegments.slice(0, index + 1).join("/")
          const isLast = index === pathSegments.length - 1
          const label = routeLabels[path] || segment.charAt(0).toUpperCase() + segment.slice(1)

          return (
            <div key={path} className="flex items-center">
              <BreadcrumbSeparator>
                <ChevronRight className="h-4 w-4" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={path}>{label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </div>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
