import { baseApi } from "../../api/baseApi";

const analyticsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardAnalytics: builder.query({
      query: () => "/analytics/dashboard-overview",
    }),
    getOrderStatics: builder.query({
      query: ({ period, year }) => `/analytics/order-statistics?period=${period}&year=${year}`,
    }),
    getRecentOrders: builder.query({
      query: () => "/analytics/recent-orders",
    }),
  }),
});

export const {
  useGetDashboardAnalyticsQuery,
  useGetOrderStaticsQuery,
  useGetRecentOrdersQuery,
} = analyticsApi;
