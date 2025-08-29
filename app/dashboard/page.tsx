"use client"

import { useState } from "react"
import { RouteGuard } from "@/components/auth/route-guard"
import { BreadcrumbNav } from "@/components/layout/breadcrumb-nav"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ProductManagement } from "@/components/admin/product-management"
import { DiscountManagement } from "@/components/admin/discount-management"
import { FeatureFlags } from "@/components/admin/feature-flags"
import { SystemStatus } from "@/components/admin/system-status"
import { TimelineDemo } from "@/components/timeline/timeline-demo"
import { Package, Tag, Settings, Activity, BarChart3, Users, Clock } from "lucide-react"

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <RouteGuard requireAuth requireRole="ADMIN">
      <div className="container mx-auto px-4 py-8">
        <BreadcrumbNav />

        <div className="flex items-center mb-8">
          <BarChart3 className="h-8 w-8 mr-3" />
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage your e-commerce platform</p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="products" className="flex items-center space-x-2">
              <Package className="h-4 w-4" />
              <span>Products</span>
            </TabsTrigger>
            <TabsTrigger value="discounts" className="flex items-center space-x-2">
              <Tag className="h-4 w-4" />
              <span>Discounts</span>
            </TabsTrigger>
            <TabsTrigger value="features" className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>Features</span>
            </TabsTrigger>
            <TabsTrigger value="status" className="flex items-center space-x-2">
              <Activity className="h-4 w-4" />
              <span>Status</span>
            </TabsTrigger>
            <TabsTrigger value="timeline" className="flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span>Timeline</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,234</div>
                  <p className="text-xs text-muted-foreground">+12% from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Discounts</CardTitle>
                  <Tag className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">23</div>
                  <p className="text-xs text-muted-foreground">5 expiring soon</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">5,678</div>
                  <p className="text-xs text-muted-foreground">+8% from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">System Health</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">99.9%</div>
                  <p className="text-xs text-muted-foreground">All systems operational</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest actions in your admin panel</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm">New product "Wireless Headphones" added</p>
                      <p className="text-xs text-muted-foreground">2 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm">Discount code "SAVE20" activated</p>
                      <p className="text-xs text-muted-foreground">15 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm">Product "Gaming Mouse" updated</p>
                      <p className="text-xs text-muted-foreground">1 hour ago</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common administrative tasks</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <Card
                      className="p-3 cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => setActiveTab("products")}
                    >
                      <div className="flex items-center space-x-2">
                        <Package className="h-4 w-4" />
                        <span className="text-sm font-medium">Add Product</span>
                      </div>
                    </Card>
                    <Card
                      className="p-3 cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => setActiveTab("discounts")}
                    >
                      <div className="flex items-center space-x-2">
                        <Tag className="h-4 w-4" />
                        <span className="text-sm font-medium">Create Discount</span>
                      </div>
                    </Card>
                    <Card
                      className="p-3 cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => setActiveTab("status")}
                    >
                      <div className="flex items-center space-x-2">
                        <Activity className="h-4 w-4" />
                        <span className="text-sm font-medium">Check Status</span>
                      </div>
                    </Card>
                    <Card
                      className="p-3 cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => setActiveTab("features")}
                    >
                      <div className="flex items-center space-x-2">
                        <Settings className="h-4 w-4" />
                        <span className="text-sm font-medium">Feature Flags</span>
                      </div>
                    </Card>
                    <Card
                      className="p-3 cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => setActiveTab("timeline")}
                    >
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4" />
                        <span className="text-sm font-medium">View Timeline</span>
                      </div>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="products">
            <ProductManagement />
          </TabsContent>

          <TabsContent value="discounts">
            <DiscountManagement />
          </TabsContent>

          <TabsContent value="features">
            <FeatureFlags />
          </TabsContent>

          <TabsContent value="status">
            <SystemStatus />
          </TabsContent>

          <TabsContent value="timeline" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Timeline Panel Demo
                </CardTitle>
                <CardDescription>
                  Interactive timeline component showing conversation history, website visits, and notes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TimelineDemo />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </RouteGuard>
  )
}
