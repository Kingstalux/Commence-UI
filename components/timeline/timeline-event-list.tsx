"use client"

import type React from "react"

import { useRef } from "react"
import { motion } from "framer-motion"
import type { TimelineEvent } from "@/features/timeline/types"
import { TimelineEventItem } from "./timeline-event-item"

interface TimelineEventListProps {
  events: TimelineEvent[]
  selectedEventId?: string
  onSelect: (id: string) => void
  onMouseEnter: (eventId: string, event: React.MouseEvent) => void
  onMouseLeave: () => void
}

export function TimelineEventList({
  events,
  selectedEventId,
  onSelect,
  onMouseEnter,
  onMouseLeave,
}: TimelineEventListProps) {
  const listRef = useRef<HTMLDivElement>(null)

  return (
    <div className="relative h-full">
      {/* Vertical Timeline Bar with Animated Spark */}
      <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-slate-400 via-blue-500 to-slate-400 z-10">
        <motion.div
          className="absolute w-2 h-2 bg-blue-400 rounded-full shadow-lg"
          style={{
            left: "-3px",
            filter: "drop-shadow(0 0 4px rgba(59, 130, 246, 0.6))",
          }}
          animate={{
            y: ["0%", "100%"],
          }}
          transition={{
            duration: 3,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
      </div>

      {/* Fade Masks */}
      <div
        className="absolute inset-0 z-20 pointer-events-none"
        style={{
          maskImage: "linear-gradient(to bottom, transparent 0%, black 5%, black 95%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 5%, black 95%, transparent 100%)",
        }}
      />

      {/* Events List */}
      <div
        ref={listRef}
        className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent px-4 py-6"
        style={{ scrollbarWidth: "thin" }}
      >
        <div className="space-y-4 relative z-30">
          {events.map((event, index) => (
            <TimelineEventItem
              key={event.id}
              event={event}
              isSelected={event.id === selectedEventId}
              onClick={() => onSelect(event.id)}
              onMouseEnter={(e) => onMouseEnter(event.id, e)}
              onMouseLeave={onMouseLeave}
              index={index}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
