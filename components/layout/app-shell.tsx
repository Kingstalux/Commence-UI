"use client"

import type React from "react"

import { usePathname } from "next/navigation"
import { TopToolbar } from "./top-toolbar"
import { MainNavigation } from "./main-navigation"

interface AppShellProps {
  children: React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname()

  const isAuthPage = pathname === "/login" || pathname === "/signup"
  const isLandingPage = pathname === "/"

  if (isAuthPage || isLandingPage) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-background">
      <TopToolbar />
      <div className="flex flex-1">
        <MainNavigation />
        <main className="flex-1 ml-0 md:ml-48 pt-16">{children}</main>
      </div>
    </div>
  )
}
