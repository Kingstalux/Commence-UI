"use client"

import { useState } from "react"
import { TimelinePanel } from "./timeline-panel"
import type { TimelineEvent } from "@/features/timeline/types"
import { UserSelect } from "@/components/layout/user-select"

// Demo data
const demoEvents: TimelineEvent[] = [
  {
    id: "1",
    type: "Conversation",
    title: "Product Discussion with Customer",
    description: "Detailed conversation about product features and pricing",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    user: { id: "user1", name: "John Doe", avatarUrl: "/diverse-user-avatars.png" },
    messages: [
      {
        id: "m1",
        author: "user",
        text: "Hi, I'm interested in your wireless headphones. Can you tell me more about the battery life?",
        time: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "m2",
        author: "assistant",
        text: "Hello! Our wireless headphones offer up to 30 hours of battery life with ANC off, and 20 hours with ANC on. They also support fast charging - 15 minutes gives you 3 hours of playback.",
        time: new Date(Date.now() - 2 * 60 * 60 * 1000 + 60000).toISOString(),
      },
      {
        id: "m3",
        author: "user",
        text: "That sounds great! What about the sound quality? I mainly listen to classical music.",
        time: new Date(Date.now() - 2 * 60 * 60 * 1000 + 120000).toISOString(),
      },
      {
        id: "m4",
        author: "assistant",
        text: "Perfect choice for classical music! They feature 40mm drivers with a frequency response of 20Hz-40kHz, providing excellent clarity for orchestral pieces. The soundstage is particularly impressive.",
        time: new Date(Date.now() - 2 * 60 * 60 * 1000 + 180000).toISOString(),
      },
    ],
  },
  {
    id: "2",
    type: "Website",
    title: "Competitor Analysis - Audio Equipment",
    description: "Research on competitor pricing and features",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    user: { id: "admin1", name: "Admin User", avatarUrl: "/admin-avatar.png" },
    url: "https://www.sony.com/electronics/headband-headphones",
    meta: {
      title: "Sony WH-1000XM5 Wireless Headphones",
      description: "Industry-leading noise canceling with Dual Noise Sensor technology",
      domain: "sony.com",
      image: "/sony-headphones.png",
    },
  },
  {
    id: "3",
    type: "Notes",
    title: "Product Development Meeting Notes",
    description: "Key decisions and action items from today's product meeting",
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    user: { id: "user2", name: "Jane Smith", avatarUrl: "/diverse-user-avatar-set-2.png" },
    content: `# Product Development Meeting - Audio Division

## Attendees
- Jane Smith (Product Manager)
- Mike Johnson (Engineering Lead)
- Sarah Wilson (Design Lead)
- Tom Brown (Marketing)

## Key Decisions

### New Headphone Model
- **Target Price**: $299-349
- **Key Features**:
  - 40+ hour battery life
  - Advanced ANC technology
  - Premium materials (aluminum, leather)
  - Multi-device connectivity

### Timeline
- **Prototype**: End of Q1 2024
- **Testing Phase**: Q2 2024
- **Launch**: Q3 2024

## Action Items
- [ ] Engineering to finalize battery specifications
- [ ] Design to create mockups for premium materials
- [ ] Marketing to conduct competitor analysis
- [ ] Legal to review patent implications

## Notes
The team agreed that battery life is our key differentiator. We need to ensure we can deliver 40+ hours while maintaining premium sound quality.

Market research shows customers are willing to pay premium for exceptional battery life combined with superior ANC.`,
  },
  {
    id: "4",
    type: "Conversation",
    title: "Customer Support - Return Request",
    description: "Handling a product return and replacement",
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    user: { id: "user1", name: "John Doe", avatarUrl: "/diverse-user-avatars.png" },
    messages: [
      {
        id: "m5",
        author: "user",
        text: "I need to return my headphones. The left ear cup stopped working after 2 weeks.",
        time: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "m6",
        author: "assistant",
        text: "I'm sorry to hear about the issue with your headphones. I'd be happy to help you with the return process. Can you provide your order number?",
        time: new Date(Date.now() - 8 * 60 * 60 * 1000 + 30000).toISOString(),
      },
      {
        id: "m7",
        author: "user",
        text: "Sure, it's #ORD-2024-001234",
        time: new Date(Date.now() - 8 * 60 * 60 * 1000 + 60000).toISOString(),
      },
    ],
  },
  {
    id: "5",
    type: "Website",
    title: "Market Research - Premium Audio Trends",
    description: "Analysis of current trends in premium audio market",
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    user: { id: "admin1", name: "Admin User", avatarUrl: "/admin-avatar.png" },
    url: "https://www.audio-technica.com/en-us/headphones",
    meta: {
      title: "Audio-Technica Professional Headphones",
      description: "Professional audio equipment for studio and consumer use",
      domain: "audio-technica.com",
      image: "/audio-technica-headphones.png",
    },
  },
]

export function TimelineDemo() {
  const [selectedEventId, setSelectedEventId] = useState<string>("")

  return (
    <div className="h-[600px] w-full">
      <TimelinePanel
        events={demoEvents}
        selectedEventId={selectedEventId}
        onSelect={setSelectedEventId}
        toolbarRight={<UserSelect />}
      />
    </div>
  )
}
