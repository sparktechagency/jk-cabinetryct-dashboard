import { baseApi } from "../../api/baseApi";

const partsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllParts: builder.query({
      query: (stockItemId) => `/parts?stockItemId=${stockItemId}`,
      providesTags: ["Parts"],
    }),
    getSinglePart: builder.query({
      query: (id) => `/parts/${id}`,
      providesTags: ["Parts"],
    }),
    addPart: builder.mutation({
      query: (data) => ({
        url: `/parts`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Parts"],
    }),
    updatePart: builder.mutation({
      query: ({ data, id }) => ({
        url: `/parts/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Parts"],
    }),
    deletePart: builder.mutation({
      query: (id) => ({
        url: `/parts/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Parts"],
    }),
  }),
});

export const {
  useGetAllPartsQuery,
  useGetSinglePartQuery,
  useAddPartMutation,
  useUpdatePartMutation,
  useDeletePartMutation,
} = partsApi;
