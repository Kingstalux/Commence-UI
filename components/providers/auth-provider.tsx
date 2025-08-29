"use client"

import type React from "react"

import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { useGetMeQuery } from "@/features/auth/api"
import { setUser, clearUser } from "@/features/auth/slice"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch()
  const { data: user, error, isLoading } = useGetMeQuery()

  useEffect(() => {
    if (user) {
      dispatch(setUser(user))
    } else if (error) {
      dispatch(clearUser())
    }
  }, [user, error, dispatch])

  return <>{children}</>
}
