"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Package, Tag, Users, Activity } from "lucide-react";
import {
  useGetDashboardAnalyticsQuery,
  useGetRecentActivityQuery,
} from "@/features/admin/analytics";
import { useRouter } from "next/navigation";

export function DashboardOverview() {
  const router = useRouter();

  const {
    data: analytics,
    isLoading: analyticsLoading,
    error: analyticsError,
  } = useGetDashboardAnalyticsQuery();

  const {
    data: activities,
    isLoading: activitiesLoading,
    error: activitiesError,
  } = useGetRecentActivityQuery({ limit: 5 });

  const handleQuickAction = (action: string) => {
    switch (action) {
      case "add-product":
        // Switch to products tab and trigger add product modal
        window.dispatchEvent(new CustomEvent("switchToProductsTab"));
        window.dispatchEvent(new CustomEvent("openProductModal"));
        break;
      case "create-discount":
        // Switch to discounts tab and trigger add discount modal
        window.dispatchEvent(new CustomEvent("switchToDiscountsTab"));
        window.dispatchEvent(new CustomEvent("openDiscountModal"));
        break;
      case "check-status":
        // Switch to system status tab
        window.dispatchEvent(new CustomEvent("switchToSystemTab"));
        break;
      case "user-management":
        // Switch to users tab (if exists) or show feature coming soon
        alert("User management feature coming soon!");
        break;
      default:
        break;
    }
  };

  if (analyticsLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                <div className="h-4 w-4 bg-muted animate-pulse rounded" />
              </CardHeader>
              <CardContent>
                <div className="h-8 w-16 bg-muted animate-pulse rounded mb-1" />
                <div className="h-3 w-24 bg-muted animate-pulse rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (analyticsError) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <p className="text-destructive">
              Failed to load dashboard data. Please try again.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getActivityDotColor = (type: string) => {
    switch (type) {
      case "product_created":
      case "product_updated":
        return "bg-blue-500";
      case "discount_activated":
      case "discount_created":
        return "bg-green-500";
      case "user_registered":
        return "bg-purple-500";
      case "order_completed":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Products
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics?.totalProducts.current.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {analytics?.totalProducts.growth} from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Discounts
            </CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics?.activeDiscounts.current}
            </div>
            <p className="text-xs text-muted-foreground">
              {analytics?.activeDiscounts.expiringSoon} expiring soon
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics?.totalUsers.current.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {analytics?.totalUsers.growth} from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {analytics?.systemHealth.percentage}%
            </div>
            <p className="text-xs text-muted-foreground">
              {analytics?.systemHealth.message}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest actions in your admin panel
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {activitiesLoading ? (
              [...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-muted animate-pulse rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 w-full bg-muted animate-pulse rounded mb-1" />
                    <div className="h-3 w-20 bg-muted animate-pulse rounded" />
                  </div>
                </div>
              ))
            ) : activitiesError ? (
              <p className="text-sm text-muted-foreground">
                Failed to load recent activity
              </p>
            ) : activities && activities.length > 0 ? (
              activities.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-3">
                  <div
                    className={`w-2 h-2 ${getActivityDotColor(
                      activity.type
                    )} rounded-full`}
                  ></div>
                  <div className="flex-1">
                    <p className="text-sm">{activity.message}</p>
                    <p className="text-xs text-muted-foreground">
                      {activity.timeAgo}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                No recent activity
              </p>
            )}
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
                onClick={() => handleQuickAction("add-product")}
              >
                <div className="flex items-center space-x-2">
                  <Package className="h-4 w-4" />
                  <span className="text-sm font-medium">Add Product</span>
                </div>
              </Card>
              <Card
                className="p-3 cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => handleQuickAction("create-discount")}
              >
                <div className="flex items-center space-x-2">
                  <Tag className="h-4 w-4" />
                  <span className="text-sm font-medium">Create Discount</span>
                </div>
              </Card>
              <Card
                className="p-3 cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => handleQuickAction("check-status")}
              >
                <div className="flex items-center space-x-2">
                  <Activity className="h-4 w-4" />
                  <span className="text-sm font-medium">Check Status</span>
                </div>
              </Card>
              <Card
                className="p-3 cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => handleQuickAction("user-management")}
              >
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span className="text-sm font-medium">User Management</span>
                </div>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
