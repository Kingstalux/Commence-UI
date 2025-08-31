"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetMeQuery } from "@/features/auth/api";
import { setUser } from "@/features/auth/slice";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Shield, User } from "lucide-react";
import type { RootState } from "@/lib/store";

const roles = [
  {
    id: "USER",
    name: "User",
    icon: User,
    description: "Standard user access",
  },
  {
    id: "ADMIN",
    name: "Admin",
    icon: Shield,
    description: "Administrative access",
  },
];

export function RoleSelect() {
  const dispatch = useDispatch();
  const { data: currentUser } = useGetMeQuery();
  const currentUserFromState = useSelector(
    (state: RootState) => state.auth.user
  );

  // Initialize useState BEFORE any conditional returns
  const [selectedRole, setSelectedRole] = useState(
    currentUserFromState?.role || currentUser?.role || "USER"
  );

  // Only show role switcher if the user's original role is ADMIN
  const canSwitchRoles =
    currentUser?.role === "ADMIN" || currentUserFromState?.role === "ADMIN";

  if (!canSwitchRoles) {
    return null;
  }

  const handleRoleChange = (roleId: string) => {
    setSelectedRole(roleId as "USER" | "ADMIN");

    if (currentUser) {
      // Update user with new role
      dispatch(
        setUser({
          ...currentUser,
          role: roleId as "USER" | "ADMIN",
        })
      );
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Select value={selectedRole} onValueChange={handleRoleChange}>
        <SelectTrigger className="w-28 h-7 text-xs">
          <SelectValue placeholder="Role" />
        </SelectTrigger>
        <SelectContent>
          {roles.map((role) => {
            const Icon = role.icon;
            return (
              <SelectItem key={role.id} value={role.id}>
                <div className="flex items-center space-x-2">
                  <Icon className="h-3 w-3" />
                  <span className="text-xs">{role.name}</span>
                </div>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
}
