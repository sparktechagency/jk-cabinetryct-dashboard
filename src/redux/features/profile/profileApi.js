import { baseApi } from "../../api/baseApi";

const profileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getLoggedUser: builder.query({
      query: () => `/user/get-my-profile`,
      providesTags: ["User"],
      transformResponse: (response) => response.data,
    }),
    updateProfile: builder.mutation({
      query: (data) => ({
        url: `/user/update-my-profile`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    changePassword: builder.mutation({
      query: (data) => ({
        url: `/auth/change-password`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    deleteProfile: builder.mutation({
      query: () => ({
        url: `/user/delete-my-profile`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useGetLoggedUserQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useDeleteProfileMutation,
} = profileApi;
