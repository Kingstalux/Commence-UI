"use client";

import { useState, useEffect, useRef } from "react";
import { RouteGuard } from "@/components/auth/route-guard";
import { BreadcrumbNav } from "@/components/layout/breadcrumb-nav";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ProductManagement } from "@/components/admin/product-management";
import { DiscountManagement } from "@/components/admin/discount-management";
import { FeatureFlags } from "@/components/admin/feature-flags";
import { SystemStatus } from "@/components/admin/system-status";
import { DashboardOverview } from "@/components/admin/dashboard-overview";
import { TimelineDemo } from "@/components/timeline/timeline-demo";
import {
  Package,
  Tag,
  Settings,
  Activity,
  BarChart3,
  Users,
  Clock,
} from "lucide-react";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const productManagementRef = useRef<{ triggerAdd: () => void } | null>(null);
  const discountManagementRef = useRef<{ triggerAdd: () => void } | null>(null);

  useEffect(() => {
    const handleSwitchToProducts = () => {
      setActiveTab("products");
    };

    const handleSwitchToDiscounts = () => {
      setActiveTab("discounts");
    };

    const handleSwitchToSystem = () => {
      setActiveTab("status");
    };

    const handleOpenProductModal = () => {
      // Small delay to ensure tab switch is complete
      setTimeout(() => {
        if (productManagementRef.current?.triggerAdd) {
          productManagementRef.current.triggerAdd();
        }
      }, 100);
    };

    const handleOpenDiscountModal = () => {
      // Small delay to ensure tab switch is complete
      setTimeout(() => {
        if (discountManagementRef.current?.triggerAdd) {
          discountManagementRef.current.triggerAdd();
        }
      }, 100);
    };

    window.addEventListener("switchToProductsTab", handleSwitchToProducts);
    window.addEventListener("switchToDiscountsTab", handleSwitchToDiscounts);
    window.addEventListener("switchToSystemTab", handleSwitchToSystem);
    window.addEventListener("openProductModal", handleOpenProductModal);
    window.addEventListener("openDiscountModal", handleOpenDiscountModal);

    return () => {
      window.removeEventListener("switchToProductsTab", handleSwitchToProducts);
      window.removeEventListener(
        "switchToDiscountsTab",
        handleSwitchToDiscounts
      );
      window.removeEventListener("switchToSystemTab", handleSwitchToSystem);
      window.removeEventListener("openProductModal", handleOpenProductModal);
      window.removeEventListener("openDiscountModal", handleOpenDiscountModal);
    };
  }, []);

  return (
    <RouteGuard requireAuth requireRole="ADMIN">
      <div className="container mx-auto px-4 py-8">
        <BreadcrumbNav />

        <div className="flex items-center mb-8">
          <BarChart3 className="h-8 w-8 mr-3" />
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your e-commerce platform
            </p>
          </div>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger
              value="overview"
              className="flex items-center space-x-2"
            >
              <BarChart3 className="h-4 w-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger
              value="products"
              className="flex items-center space-x-2"
            >
              <Package className="h-4 w-4" />
              <span>Products</span>
            </TabsTrigger>
            <TabsTrigger
              value="discounts"
              className="flex items-center space-x-2"
            >
              <Tag className="h-4 w-4" />
              <span>Discounts</span>
            </TabsTrigger>
            <TabsTrigger
              value="features"
              className="flex items-center space-x-2"
            >
              <Settings className="h-4 w-4" />
              <span>Features</span>
            </TabsTrigger>
            <TabsTrigger value="status" className="flex items-center space-x-2">
              <Activity className="h-4 w-4" />
              <span>Status</span>
            </TabsTrigger>
            <TabsTrigger
              value="timeline"
              className="flex items-center space-x-2"
            >
              <Clock className="h-4 w-4" />
              <span>Timeline</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <DashboardOverview />
          </TabsContent>

          <TabsContent value="products">
            <ProductManagement ref={productManagementRef} />
          </TabsContent>

          <TabsContent value="discounts">
            <DiscountManagement ref={discountManagementRef} />
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
                  Interactive timeline component showing conversation history,
                  website visits, and notes
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
  );
}
