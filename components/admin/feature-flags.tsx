"use client"

import { useSelector, useDispatch } from "react-redux"
import { toggleBurstCheckout, setBurstCheckoutCount } from "@/features/feature-flags/slice"
import type { RootState } from "@/lib/store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Settings, Zap } from "lucide-react"

export function FeatureFlags() {
  const dispatch = useDispatch()
  const { burstCheckoutEnabled, burstCheckoutCount } = useSelector((state: RootState) => state.featureFlags)

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Settings className="h-5 w-5" />
        <h3 className="text-lg font-semibold">Feature Flags</h3>
      </div>

      <div className="grid gap-4">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="text-base flex items-center">
                  <Zap className="h-4 w-4 mr-2" />
                  Burst Checkout Testing
                </CardTitle>
                <CardDescription>Enable load testing with multiple simultaneous checkout requests</CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <Switch checked={burstCheckoutEnabled} onCheckedChange={() => dispatch(toggleBurstCheckout())} />
                <Badge variant={burstCheckoutEnabled ? "default" : "secondary"}>
                  {burstCheckoutEnabled ? "Enabled" : "Disabled"}
                </Badge>
              </div>
            </div>
          </CardHeader>
          {burstCheckoutEnabled && (
            <CardContent className="pt-0">
              <div className="space-y-2">
                <Label htmlFor="burstCount">Number of Requests</Label>
                <Input
                  id="burstCount"
                  type="number"
                  min="1"
                  max="100"
                  value={burstCheckoutCount}
                  onChange={(e) => dispatch(setBurstCheckoutCount(Number.parseInt(e.target.value) || 1))}
                  className="w-24"
                />
                <p className="text-xs text-muted-foreground">
                  Configure how many checkout requests to send simultaneously (1-100)
                </p>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Additional feature flags can be added here */}
        <Card className="opacity-50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="text-base">Advanced Analytics</CardTitle>
                <CardDescription>Enhanced tracking and reporting features</CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <Switch disabled />
                <Badge variant="outline">Coming Soon</Badge>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card className="opacity-50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="text-base">Real-time Notifications</CardTitle>
                <CardDescription>Push notifications for order updates</CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <Switch disabled />
                <Badge variant="outline">Coming Soon</Badge>
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>
    </div>
  )
}
