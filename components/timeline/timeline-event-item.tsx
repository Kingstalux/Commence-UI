"use client"

import type React from "react"

import { motion } from "framer-motion"
import type { TimelineEvent } from "@/features/timeline/types"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, Globe, FileText } from "lucide-react"
import { cn } from "@/lib/utils"

interface TimelineEventItemProps {
  event: TimelineEvent
  isSelected: boolean
  onClick: () => void
  onMouseEnter: (event: React.MouseEvent) => void
  onMouseLeave: () => void
  index: number
}

const eventIcons = {
  Conversation: MessageCircle,
  Website: Globe,
  Notes: FileText,
}

const eventColors = {
  Conversation: "bg-blue-500",
  Website: "bg-green-500",
  Notes: "bg-purple-500",
}

export function TimelineEventItem({
  event,
  isSelected,
  onClick,
  onMouseEnter,
  onMouseLeave,
  index,
}: TimelineEventItemProps) {
  const Icon = eventIcons[event.type]
  const colorClass = eventColors[event.type]

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 1) {
      return `${Math.floor(diffInHours * 60)}m ago`
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`
    } else {
      return date.toLocaleDateString()
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="relative"
    >
      {/* Timeline Dot */}
      <div className="absolute left-2 top-3 z-40">
        <motion.div
          className={cn("w-4 h-4 rounded-full border-2 border-background flex items-center justify-center", colorClass)}
          whileHover={{ scale: 1.2 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          <Icon className="w-2 h-2 text-white" />
        </motion.div>
      </div>

      {/* Event Card */}
      <motion.div
        className={cn(
          "ml-10 p-3 rounded-lg border cursor-pointer transition-all duration-200",
          "hover:shadow-md hover:border-primary/50",
          isSelected ? "bg-primary/5 border-primary shadow-sm" : "bg-background hover:bg-muted/50 border-border",
        )}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        whileHover={{ y: -1 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-xs">
              {event.type}
            </Badge>
            <span className="text-xs text-muted-foreground">{formatTime(event.timestamp)}</span>
          </div>
          <Avatar className="w-5 h-5">
            <AvatarImage src={event.user.avatarUrl || "/placeholder.svg"} alt={event.user.name} />
            <AvatarFallback className="text-xs">
              {event.user.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
        </div>

        <h4 className="font-medium text-sm line-clamp-2 mb-1">{event.title}</h4>
        <p className="text-xs text-muted-foreground line-clamp-2">{event.description}</p>

        {/* Type-specific indicators */}
        {event.type === "Conversation" && (
          <div className="mt-2 flex items-center space-x-1">
            <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
            <span className="text-xs text-muted-foreground">{event.messages.length} messages</span>
          </div>
        )}

        {event.type === "Website" && event.meta?.domain && (
          <div className="mt-2 flex items-center space-x-1">
            <div className="w-1 h-1 bg-green-400 rounded-full"></div>
            <span className="text-xs text-muted-foreground">{event.meta.domain}</span>
          </div>
        )}

        {event.type === "Notes" && (
          <div className="mt-2 flex items-center space-x-1">
            <div className="w-1 h-1 bg-purple-400 rounded-full"></div>
            <span className="text-xs text-muted-foreground">{event.content.length} characters</span>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}
