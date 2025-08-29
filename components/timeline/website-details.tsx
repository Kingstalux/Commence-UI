"use client"

import { motion } from "framer-motion"
import type { WebsiteEvent } from "@/features/timeline/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Globe, ImageIcon } from "lucide-react"
import Image from "next/image"

interface WebsiteDetailsProps {
  event: WebsiteEvent
}

export function WebsiteDetails({ event }: WebsiteDetailsProps) {
  const domain = event.meta?.domain || new URL(event.url).hostname

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Website Preview</h3>
        <Button variant="outline" size="sm" asChild>
          <a href={event.url} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="w-4 h-4 mr-2" />
            Open Site
          </a>
        </Button>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="overflow-hidden">
          {event.meta?.image && (
            <div className="relative h-48 bg-muted">
              <Image
                src={event.meta.image || "/placeholder.svg"}
                alt={event.meta.title || "Website preview"}
                fill
                className="object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none"
                }}
              />
            </div>
          )}

          <CardHeader>
            <div className="flex items-center space-x-2 mb-2">
              <Globe className="w-4 h-4 text-muted-foreground" />
              <Badge variant="outline">{domain}</Badge>
            </div>
            <CardTitle className="line-clamp-2">{event.meta?.title || event.title}</CardTitle>
            {event.meta?.description && (
              <CardDescription className="line-clamp-3">{event.meta.description}</CardDescription>
            )}
          </CardHeader>

          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2">URL</h4>
                <div className="bg-muted p-2 rounded text-sm font-mono break-all">{event.url}</div>
              </div>

              {/* Website Preview Frame */}
              <div>
                <h4 className="text-sm font-medium mb-2">Live Preview</h4>
                <div className="border rounded-lg overflow-hidden bg-muted/50">
                  <div className="h-64 flex items-center justify-center">
                    <div className="text-center space-y-2">
                      <ImageIcon className="w-8 h-8 text-muted-foreground mx-auto" />
                      <p className="text-sm text-muted-foreground">Preview not available</p>
                      <p className="text-xs text-muted-foreground">Click "Open Site" to view the full website</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
