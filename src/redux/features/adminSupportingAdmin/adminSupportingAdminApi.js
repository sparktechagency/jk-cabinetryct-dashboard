import { baseApi } from "../../api/baseApi";

const adminSupportingAdminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createAdminSupportingAdmin: builder.mutation({
      query: (data) => ({
        url: `/user/admin-supporting-admin`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["AdminSupportingAdmin"],
    }),
    getAdminSupportingAdmin: builder.query({
      query: ({ branchId, role }) => {
        const params = new URLSearchParams();
        if (branchId) params.append("branchId", branchId);
        if (role) params.append("role", role);
        return {
          url: `/user/admin-supporting-admin`,
          method: "GET",
          params,
        };
      },
      providesTags: ["AdminSupportingAdmin"],
    }),
    getSingleAdminSupportingAdmin: builder.query({
      query: (id) => `/user/admin-supporting-admin/${id}`,
      providesTags: ["AdminSupportingAdmin"],
    }),
    updateAdminSupportingAdmin: builder.mutation({
      query: ({ data, id }) => ({
        url: `/user/admin-supporting-admin/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["AdminSupportingAdmin"],
    }),
    deleteAdminSupportingAdmin: builder.mutation({
      query: (id) => ({
        url: `/user/admin-supporting-admin/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["AdminSupportingAdmin"],
    }),
  }),
});
export const {
  useCreateAdminSupportingAdminMutation,
  useGetAdminSupportingAdminQuery,
  useGetSingleAdminSupportingAdminQuery,
  useUpdateAdminSupportingAdminMutation,
  useDeleteAdminSupportingAdminMutation,
} = adminSupportingAdminApi;
