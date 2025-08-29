"use client"

import { motion } from "framer-motion"
import type { NotesEvent } from "@/features/timeline/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, Hash, Code } from "lucide-react"
import type React from "react" // Import React to declare JSX

interface NotesDetailsProps {
  event: NotesEvent
}

export function NotesDetails({ event }: NotesDetailsProps) {
  // Simple markdown-like rendering
  const renderMarkdownContent = (content: string) => {
    const lines = content.split("\n")
    const elements: React.JSX.Element[] = [] // Declare JSX type

    lines.forEach((line, index) => {
      if (line.startsWith("# ")) {
        elements.push(
          <h1 key={index} className="text-2xl font-bold mb-4 mt-6 first:mt-0">
            {line.slice(2)}
          </h1>,
        )
      } else if (line.startsWith("## ")) {
        elements.push(
          <h2 key={index} className="text-xl font-semibold mb-3 mt-5 first:mt-0">
            {line.slice(3)}
          </h2>,
        )
      } else if (line.startsWith("### ")) {
        elements.push(
          <h3 key={index} className="text-lg font-medium mb-2 mt-4 first:mt-0">
            {line.slice(4)}
          </h3>,
        )
      } else if (line.startsWith("- ") || line.startsWith("* ")) {
        elements.push(
          <li key={index} className="ml-4 mb-1">
            {line.slice(2)}
          </li>,
        )
      } else if (line.startsWith("```")) {
        elements.push(
          <div key={index} className="bg-muted p-3 rounded font-mono text-sm my-3">
            <Code className="w-4 h-4 inline mr-2" />
            Code block
          </div>,
        )
      } else if (line.trim() === "") {
        elements.push(<br key={index} />)
      } else {
        elements.push(
          <p key={index} className="mb-3 leading-relaxed">
            {line}
          </p>,
        )
      }
    })

    return elements
  }

  const wordCount = event.content.split(/\s+/).length
  const readingTime = Math.ceil(wordCount / 200) // Assuming 200 words per minute

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Notes Content</h3>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-xs">
            {wordCount} words
          </Badge>
          <Badge variant="outline" className="text-xs">
            {readingTime} min read
          </Badge>
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4 text-muted-foreground" />
              <CardTitle className="text-base">Document Content</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none">{renderMarkdownContent(event.content)}</div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Content Statistics */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center">
              <Hash className="w-4 h-4 mr-2" />
              Content Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Characters:</span>
                <span className="ml-2 font-medium">{event.content.length}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Words:</span>
                <span className="ml-2 font-medium">{wordCount}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Lines:</span>
                <span className="ml-2 font-medium">{event.content.split("\n").length}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Reading time:</span>
                <span className="ml-2 font-medium">{readingTime} min</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
