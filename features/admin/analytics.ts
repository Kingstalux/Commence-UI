import { baseApi } from "@/lib/api-base";

export interface DashboardAnalytics {
  totalProducts: {
    current: number;
    lastMonth: number;
    growth: string;
  };
  activeDiscounts: {
    current: number;
    expiringSoon: number;
  };
  totalUsers: {
    current: number;
    lastMonth: number;
    growth: string;
  };
  systemHealth: {
    percentage: number;
    status: string;
    message: string;
  };
}

export interface Activity {
  id: string;
  type: string;
  message: string;
  timestamp: string;
  timeAgo: string;
  user: string;
  metadata: any;
}

export const analyticsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardAnalytics: builder.query<DashboardAnalytics, void>({
      query: () => "admin/analytics/dashboard",
      providesTags: ["Analytics"],
    }),
    getRecentActivity: builder.query<Activity[], { limit?: number }>({
      query: ({ limit = 10 } = {}) => `admin/analytics/activity?limit=${limit}`,
      providesTags: ["Activity"],
    }),
    logActivity: builder.mutation<
      Activity,
      { type: string; message: string; user: string; metadata?: any }
    >({
      query: (data) => ({
        url: "admin/analytics/activity",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Activity"],
    }),
  }),
});

export const {
  useGetDashboardAnalyticsQuery,
  useGetRecentActivityQuery,
  useLogActivityMutation,
} = analyticsApi;
