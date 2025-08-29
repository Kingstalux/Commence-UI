"use client"

import type React from "react"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { TimelineEvent } from "@/features/timeline/types"
import { TimelineEventList } from "./timeline-event-list"
import { TimelineEventDetails } from "./timeline-event-details"
import { Card } from "@/components/ui/card"

interface TimelinePanelProps {
  events: TimelineEvent[]
  selectedEventId?: string
  onSelect: (id: string) => void
  toolbarRight?: React.ReactNode
}

export function TimelinePanel({ events, selectedEventId, onSelect, toolbarRight }: TimelinePanelProps) {
  const [hoveredEventId, setHoveredEventId] = useState<string | null>(null)
  const [previewPosition, setPreviewPosition] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  const selectedEvent = events.find((event) => event.id === selectedEventId)
  const hoveredEvent = events.find((event) => event.id === hoveredEventId)

  const handleMouseEnter = (eventId: string, mouseEvent: React.MouseEvent) => {
    const rect = mouseEvent.currentTarget.getBoundingClientRect()
    const containerRect = containerRef.current?.getBoundingClientRect()

    if (containerRect) {
      // Smart positioning: show on right side of left panel
      setPreviewPosition({
        x: rect.right - containerRect.left + 10,
        y: rect.top - containerRect.top,
      })
    }

    setHoveredEventId(eventId)
  }

  const handleMouseLeave = () => {
    setHoveredEventId(null)
  }

  return (
    <div ref={containerRef} className="h-full bg-background border rounded-2xl shadow-lg overflow-hidden">
      {/* Top Toolbar */}
      <div className="h-10 bg-background border-b flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="ml-2 text-sm font-medium">Timeline</span>
        </div>
        {toolbarRight && <div className="flex items-center">{toolbarRight}</div>}
      </div>

      <div className="flex h-[calc(100%-2.5rem)]">
        {/* Left Panel - Events List */}
        <div className="w-full md:w-[35%] border-r bg-muted/20 relative">
          <TimelineEventList
            events={events}
            selectedEventId={selectedEventId}
            onSelect={onSelect}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          />

          {/* Hover Preview */}
          <AnimatePresence>
            {hoveredEvent && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, x: -10 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95, x: -10 }}
                transition={{ duration: 0.15, delay: 0.2 }}
                className="absolute z-50 pointer-events-none hidden md:block"
                style={{
                  left: previewPosition.x,
                  top: previewPosition.y,
                }}
              >
                <Card className="w-80 p-4 shadow-xl border-2 bg-background/95 backdrop-blur-sm">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        {hoveredEvent.type}
                      </span>
                    </div>
                    <h4 className="font-semibold text-sm line-clamp-2">{hoveredEvent.title}</h4>
                    <p className="text-xs text-muted-foreground line-clamp-3">{hoveredEvent.description}</p>

                    {/* Type-specific preview content */}
                    {hoveredEvent.type === "Conversation" && (
                      <div className="space-y-1 pt-2 border-t">
                        {hoveredEvent.messages.slice(0, 2).map((message) => (
                          <div key={message.id} className="flex items-start space-x-2">
                            <div className="w-4 h-4 bg-muted rounded-full shrink-0 mt-0.5"></div>
                            <p className="text-xs line-clamp-2">{message.text}</p>
                          </div>
                        ))}
                        {hoveredEvent.messages.length > 2 && (
                          <p className="text-xs text-muted-foreground">+{hoveredEvent.messages.length - 2} more...</p>
                        )}
                      </div>
                    )}

                    {hoveredEvent.type === "Website" && (
                      <div className="pt-2 border-t">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-muted rounded flex items-center justify-center">
                            <span className="text-xs">🌐</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium line-clamp-1">
                              {hoveredEvent.meta?.title || hoveredEvent.url}
                            </p>
                            <p className="text-xs text-muted-foreground line-clamp-1">
                              {hoveredEvent.meta?.domain || new URL(hoveredEvent.url).hostname}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {hoveredEvent.type === "Notes" && (
                      <div className="pt-2 border-t">
                        <p className="text-xs line-clamp-4">{hoveredEvent.content.slice(0, 200)}...</p>
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Panel - Event Details */}
        <div className="hidden md:block w-[65%] bg-background">
          <TimelineEventDetails event={selectedEvent} />
        </div>
      </div>

      {/* Mobile Event Details */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="md:hidden fixed inset-0 bg-background z-50"
          >
            <div className="h-10 bg-background border-b flex items-center justify-between px-4">
              <span className="text-sm font-medium">Event Details</span>
              <button onClick={() => onSelect("")} className="text-sm text-muted-foreground">
                Close
              </button>
            </div>
            <div className="h-[calc(100%-2.5rem)] overflow-y-auto">
              <TimelineEventDetails event={selectedEvent} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
