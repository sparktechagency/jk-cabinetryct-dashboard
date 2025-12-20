import { baseApi } from "../../api/baseApi";

const getOrders = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOrders: builder.query({
      query: ({ searchTerm, status } = {}) => {
        const params = new URLSearchParams();
        if (searchTerm) params.append("searchTerm", searchTerm);
        if (status && status !== "all") params.append("status", status);
        const queryString = params.toString();
        return `/order${queryString ? `?${queryString}` : ""}`;
      },
      providesTags: [{ type: "Order" }],
    }),
    getOrderByOrderNumber: builder.query({
      query: (orderNumber) => `/order/order-number/${orderNumber}`,
      providesTags: (result, error, orderNumber) => [
        { type: "Order", id: orderNumber },
      ],
    }),
  }),
});

export const { useGetOrdersQuery, useGetOrderByOrderNumberQuery } = getOrders;
