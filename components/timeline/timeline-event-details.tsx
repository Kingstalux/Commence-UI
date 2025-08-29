"use client"

import { motion, AnimatePresence } from "framer-motion"
import type { TimelineEvent } from "@/features/timeline/types"
import { ConversationDetails } from "./conversation-details"
import { WebsiteDetails } from "./website-details"
import { NotesDetails } from "./notes-details"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, Globe, FileText, Clock, User } from "lucide-react"

interface TimelineEventDetailsProps {
  event?: TimelineEvent
}

const eventIcons = {
  Conversation: MessageCircle,
  Website: Globe,
  Notes: FileText,
}

export function TimelineEventDetails({ event }: TimelineEventDetailsProps) {
  if (!event) {
    return (
      <div className="h-full flex items-center justify-center text-center p-8">
        <div className="space-y-4">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
            <MessageCircle className="w-8 h-8 text-muted-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Select an Event</h3>
            <p className="text-muted-foreground">Choose an event from the timeline to view its details</p>
          </div>
        </div>
      </div>
    )
  }

  const Icon = eventIcons[event.type]

  const formatFullDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={event.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="h-full flex flex-col"
      >
        {/* Header */}
        <div className="p-6 border-b bg-muted/20">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
              <Icon className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-2">
                <Badge variant="outline">{event.type}</Badge>
                <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  <span>{formatFullDate(event.timestamp)}</span>
                </div>
              </div>
              <h2 className="text-xl font-semibold mb-2 line-clamp-2">{event.title}</h2>
              <p className="text-muted-foreground line-clamp-3">{event.description}</p>
              <div className="flex items-center space-x-2 mt-3">
                <User className="w-3 h-3 text-muted-foreground" />
                <Avatar className="w-5 h-5">
                  <AvatarImage src={event.user.avatarUrl || "/placeholder.svg"} alt={event.user.name} />
                  <AvatarFallback className="text-xs">
                    {event.user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm text-muted-foreground">{event.user.name}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
            {event.type === "Conversation" && <ConversationDetails event={event} />}
            {event.type === "Website" && <WebsiteDetails event={event} />}
            {event.type === "Notes" && <NotesDetails event={event} />}
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
