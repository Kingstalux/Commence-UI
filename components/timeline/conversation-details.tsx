"use client"

import { motion } from "framer-motion"
import type { ConversationEvent } from "@/features/timeline/types"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { User, Bot } from "lucide-react"

interface ConversationDetailsProps {
  event: ConversationEvent
}

export function ConversationDetails({ event }: ConversationDetailsProps) {
  const groupMessagesByDay = (messages: ConversationEvent["messages"]) => {
    const groups: Record<string, ConversationEvent["messages"]> = {}

    messages.forEach((message) => {
      const date = new Date(message.time).toDateString()
      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push(message)
    })

    return Object.entries(groups).map(([date, msgs]) => ({ date, messages: msgs }))
  }

  const messageGroups = groupMessagesByDay(event.messages)

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Conversation History</h3>
        <Badge variant="secondary">{event.messages.length} messages</Badge>
      </div>

      <div className="space-y-6">
        {messageGroups.map((group, groupIndex) => (
          <div key={group.date}>
            {/* Date Separator */}
            <div className="flex items-center justify-center mb-4">
              <div className="bg-muted px-3 py-1 rounded-full text-xs text-muted-foreground">
                {new Date(group.date).toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            </div>

            {/* Messages */}
            <div className="space-y-4">
              {group.messages.map((message, messageIndex) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: (groupIndex * group.messages.length + messageIndex) * 0.05 }}
                  className={`flex items-start space-x-3 ${
                    message.author === "user" ? "flex-row-reverse space-x-reverse" : ""
                  }`}
                >
                  <Avatar className="w-8 h-8 shrink-0">
                    <AvatarFallback>
                      {message.author === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                    </AvatarFallback>
                  </Avatar>

                  <div className={`flex-1 max-w-[80%] ${message.author === "user" ? "text-right" : ""}`}>
                    <Card
                      className={`p-3 ${
                        message.author === "user" ? "bg-primary text-primary-foreground ml-auto" : "bg-muted"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                    </Card>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(message.time).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
