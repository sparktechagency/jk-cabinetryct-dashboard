import { baseApi } from "../../api/baseApi";

const stockItemApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addStockItem: builder.mutation({
      query: (data) => ({
        url: `/stock-item`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["StockItem"],
    }),
    getAllStockItems: builder.query({
      query: () => `/stock-item`,
      providesTags: ["StockItem"],
    }),
    getSingleStockItem: builder.query({
      query: (id) => `/stock-item/${id}`,
      providesTags: ["StockItem"],
    }),
    updateStockItem: builder.mutation({
      query: ({ data, id }) => ({
        url: `/stock-item/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["StockItem"],
    }),
    deleteStockItem: builder.mutation({
      query: (id) => ({
        url: `/stock-item/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["StockItem", "StockItemTitle", "Parts"],
    }),
  }),
});

export const {
  useAddStockItemMutation,
  useGetAllStockItemsQuery,
  useGetSingleStockItemQuery,
  useUpdateStockItemMutation,
  useDeleteStockItemMutation,
} = stockItemApi;
