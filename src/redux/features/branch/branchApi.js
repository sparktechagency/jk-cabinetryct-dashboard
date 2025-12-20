import { baseApi } from "../../api/baseApi";

const branchapi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBranches: builder.query({
      query: () => `/branch`,
      providesTags: ["Branch"],
    }),
    getSingleBranch: builder.query({
      query: (id) => `/branch/${id}`,
      providesTags: ["Branch"],
    }),
    addBranch: builder.mutation({
      query: (data) => ({
        url: `/branch`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Branch"],
    }),
    updateBranch: builder.mutation({
      query: ({ data, id }) => ({
        url: `/branch/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Branch"],
    }),
    deleteBranch: builder.mutation({
      query: (id) => ({
        url: `/branch/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Branch"],
    }),
  }),
});

export const {
  useGetBranchesQuery,
  useAddBranchMutation,
  useDeleteBranchMutation,
  useUpdateBranchMutation,
  useGetSingleBranchQuery,
} = branchapi;
