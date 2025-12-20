import { baseApi } from "../../api/baseApi";

const updateOrderStatus = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    updateOrderStatus: builder.mutation({
      query: ({ status, id }) => ({
        url: `/order/${id}`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: [{ type: "Order" }],
    }),
  }),
});

export const { useUpdateOrderStatusMutation } = updateOrderStatus;
