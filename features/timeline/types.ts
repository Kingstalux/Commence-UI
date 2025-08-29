export type TimelineEventBase = {
  id: string
  type: "Conversation" | "Website" | "Notes"
  title: string
  description: string
  timestamp: string // ISO
  user: { id: string; name: string; avatarUrl?: string }
}

export type ConversationEvent = TimelineEventBase & {
  type: "Conversation"
  messages: Array<{ id: string; author: "user" | "assistant"; text: string; time: string }>
}

export type WebsiteEvent = TimelineEventBase & {
  type: "Website"
  url: string
  meta?: { title?: string; description?: string; image?: string; domain?: string }
}

export type NotesEvent = TimelineEventBase & {
  type: "Notes"
  content: string // markdown
}

export type TimelineEvent = ConversationEvent | WebsiteEvent | NotesEvent
