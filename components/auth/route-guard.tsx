"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSelector } from "react-redux"
import { useGetMeQuery } from "@/features/auth/api"
import type { RootState } from "@/lib/store"
import { Loader2 } from "lucide-react"

interface RouteGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
  requireRole?: "USER" | "ADMIN"
  redirectTo?: string
}

export function RouteGuard({ children, requireAuth = false, requireRole, redirectTo = "/login" }: RouteGuardProps) {
  const router = useRouter()
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth)
  const { isLoading, error } = useGetMeQuery()

  useEffect(() => {
    if (isLoading) return

    if (requireAuth && (!isAuthenticated || error)) {
      router.push(redirectTo)
      return
    }

    if (requireRole && user?.role !== requireRole) {
      router.push("/catalog")
      return
    }
  }, [isAuthenticated, user, requireAuth, requireRole, router, redirectTo, isLoading, error])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading...</span>
        </div>
      </div>
    )
  }

  if (requireAuth && (!isAuthenticated || error)) {
    return null
  }

  if (requireRole && user?.role !== requireRole) {
    return null
  }

  return <>{children}</>
}
