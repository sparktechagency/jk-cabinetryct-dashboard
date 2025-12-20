import { baseApi } from "../../api/baseApi";

const stockItemTitleApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addStockItemTitle: builder.mutation({
      query: (data) => ({
        url: `/stock-item-title`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["StockItemTitle", "Parts"],
    }),
    getAllStockItemTitle: builder.query({
      query: () => `/stock-item-title`,
      providesTags: ["StockItemTitle"],
    }),
    getSingleStockItemTitle: builder.query({
      query: (id) => `/stock-item-title/${id}`,
      providesTags: ["StockItemTitle"],
    }),
    updateStockItemTitle: builder.mutation({
      query: ({ data, id }) => ({
        url: `/stock-item-title/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["StockItemTitle", "Parts"],
    }),
    deleteStockItemTitle: builder.mutation({
      query: (id) => ({
        url: `/stock-item-title/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["StockItemTitle", "Parts"],
    }),
  }),
});

export const {
  useAddStockItemTitleMutation,
  useGetAllStockItemTitleQuery,
  useGetSingleStockItemTitleQuery,
  useUpdateStockItemTitleMutation,
  useDeleteStockItemTitleMutation,
} = stockItemTitleApi;
