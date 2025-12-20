import { baseApi } from "../../api/baseApi";

const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllUsersByBranch: builder.query({
      query: ({ page, limit, searchTerm, status }) => {
        const params = new URLSearchParams();
        if (page) params.append("page", page);
        if (limit) params.append("limit", limit);
        if (searchTerm) params.append("searchTerm", searchTerm);
        if (status) params.append("status", status);
        return {
          url: `/user/get-all-users`,
          method: "GET",
          params,
        };
      },
      providesTags: ["User"],
    }),
    getSingleUser: builder.query({
      query: (id) => `/user/get-all-users/${id}`,
      providesTags: ["User"],
    }),
    updateUserStatus: builder.mutation({
      query: ({ id, data }) => ({
        url: `/user/get-all-users/status/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    verifyUser: builder.mutation({
      query: ({ id, data }) => ({
        url: `/user/get-all-users/verify/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    rejectUser: builder.mutation({
      query: ({ id, data }) => ({
        url: `/get-all-users/reject/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useGetAllUsersByBranchQuery,
  useGetSingleUserQuery,
  useUpdateUserStatusMutation,
  useVerifyUserMutation,
  useRejectUserMutation,
} = usersApi;
