"use client"

import { useState } from "react"
import { useDispatch } from "react-redux"
import { useGetMeQuery } from "@/features/auth/api"
import { setUser, clearUser } from "@/features/auth/slice"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users } from "lucide-react"

// Demo users for switching context
const demoUsers = [
  {
    id: "user-1",
    name: "John Doe",
    email: "john@example.com",
    role: "USER" as const,
    avatarUrl: "/diverse-user-avatars.png",
  },
  {
    id: "admin-1",
    name: "Admin User",
    email: "admin@example.com",
    role: "ADMIN" as const,
    avatarUrl: "/admin-avatar.png",
  },
  {
    id: "user-2",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "USER" as const,
    avatarUrl: "/diverse-user-avatar-set-2.png",
  },
]

export function UserSelect() {
  const dispatch = useDispatch()
  const { data: currentUser } = useGetMeQuery()
  const [selectedUserId, setSelectedUserId] = useState(currentUser?.id || "")

  const handleUserChange = (userId: string) => {
    setSelectedUserId(userId)
    const selectedUser = demoUsers.find((user) => user.id === userId)

    if (selectedUser) {
      // In a real app, this would trigger a new API call to switch user context
      dispatch(setUser(selectedUser))
      // Trigger refetch of user data
      // refetch()
    } else {
      dispatch(clearUser())
    }
  }

  return (
    <div className="flex items-center space-x-2">
      <Users className="h-3 w-3 text-muted-foreground" />
      <Select value={selectedUserId} onValueChange={handleUserChange}>
        <SelectTrigger className="w-32 h-7 text-xs">
          <SelectValue placeholder="Switch user" />
        </SelectTrigger>
        <SelectContent>
          {demoUsers.map((user) => (
            <SelectItem key={user.id} value={user.id}>
              <div className="flex items-center space-x-2">
                <Avatar className="h-4 w-4">
                  <AvatarImage src={user.avatarUrl || "/placeholder.svg"} alt={user.name} />
                  <AvatarFallback className="text-xs">
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs">{user.name}</span>
                {user.role === "ADMIN" && <span className="text-xs text-primary">(Admin)</span>}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
