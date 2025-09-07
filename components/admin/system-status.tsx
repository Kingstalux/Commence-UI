"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Activity,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { TokenStorage } from "@/lib/token-storage";

interface EndpointStatus {
  name: string;
  url: string;
  status: "healthy" | "unhealthy" | "checking";
  responseTime?: number;
  lastChecked?: Date;
}

export function SystemStatus() {
  const [endpoints, setEndpoints] = useState<EndpointStatus[]>([
    { name: "Authentication API", url: "/api/auth/me", status: "checking" },
    { name: "Products API", url: "/api/products", status: "checking" },
    { name: "Cart API", url: "/api/cart", status: "checking" },
    {
      name: "Admin Discounts API",
      url: "/api/admin/discounts",
      status: "checking",
    },
    { name: "Transactions API", url: "/api/transactions", status: "checking" },
    { name: "Gateway Health", url: "/api", status: "checking" },
  ]);

  const checkEndpointHealth = async (
    endpoint: EndpointStatus
  ): Promise<EndpointStatus> => {
    const startTime = Date.now();
    try {
      const baseUrl =
        process.env.NEXT_PUBLIC_GATEWAY_URL || "http://10.0.0.2:3100";

      // Prepare headers for authentication
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };

      // Add auth token if available for protected endpoints
      const token = TokenStorage.getToken();
      if (
        token &&
        (endpoint.url.includes("/auth/me") ||
          endpoint.url.includes("/cart") ||
          endpoint.url.includes("/transactions"))
      ) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(`${baseUrl}${endpoint.url}`, {
        method: "GET",
        headers,
        credentials: "include",
      });

      const responseTime = Date.now() - startTime;

      // Consider 401 as "healthy" for auth endpoints (just means not logged in)
      // Consider 200-299 as healthy, 401 as healthy for auth endpoints
      const isHealthy =
        response.ok ||
        (response.status === 401 && endpoint.url.includes("/auth"));
      const status = isHealthy ? "healthy" : "unhealthy";

      return {
        ...endpoint,
        status,
        responseTime,
        lastChecked: new Date(),
      };
    } catch (error) {
      const responseTime = Date.now() - startTime;
      console.error(`Health check failed for ${endpoint.name}:`, error);

      return {
        ...endpoint,
        status: "unhealthy",
        responseTime,
        lastChecked: new Date(),
      };
    }
  };

  const checkAllEndpoints = async () => {
    setEndpoints((prev) =>
      prev.map((endpoint) => ({ ...endpoint, status: "checking" }))
    );

    const promises = endpoints.map(checkEndpointHealth);
    const results = await Promise.all(promises);
    setEndpoints(results);
  };

  useEffect(() => {
    checkAllEndpoints();
    // Set up periodic health checks every 30 seconds
    const interval = setInterval(checkAllEndpoints, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: EndpointStatus["status"]) => {
    switch (status) {
      case "healthy":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "unhealthy":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "checking":
        return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />;
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: EndpointStatus["status"]) => {
    switch (status) {
      case "healthy":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            Healthy
          </Badge>
        );
      case "unhealthy":
        return <Badge variant="destructive">Unhealthy</Badge>;
      case "checking":
        return <Badge variant="outline">Checking...</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const healthyCount = endpoints.filter((e) => e.status === "healthy").length;
  const totalCount = endpoints.length;
  const overallHealth =
    healthyCount === totalCount
      ? "healthy"
      : healthyCount > 0
      ? "partial"
      : "unhealthy";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Activity className="h-5 w-5" />
          <h3 className="text-lg font-semibold">System Status</h3>
        </div>
        <Button variant="outline" size="sm" onClick={checkAllEndpoints}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">Overall System Health</CardTitle>
              <CardDescription>
                {healthyCount} of {totalCount} services operational
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              {getStatusIcon(
                overallHealth === "healthy" ? "healthy" : "unhealthy"
              )}
              {overallHealth === "healthy" ? (
                <Badge className="bg-green-100 text-green-800 border-green-200">
                  All Systems Operational
                </Badge>
              ) : (
                <Badge variant="destructive">Service Degradation</Badge>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-3">
        {endpoints.map((endpoint) => (
          <Card key={endpoint.name}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(endpoint.status)}
                  <div>
                    <div className="font-medium">{endpoint.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {endpoint.url}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  {endpoint.responseTime && (
                    <div className="text-sm text-muted-foreground">
                      {endpoint.responseTime}ms
                    </div>
                  )}
                  {getStatusBadge(endpoint.status)}
                </div>
              </div>
              {endpoint.lastChecked && (
                <div className="text-xs text-muted-foreground mt-2">
                  Last checked: {endpoint.lastChecked.toLocaleTimeString()}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
