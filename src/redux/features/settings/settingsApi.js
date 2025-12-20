import { baseApi } from "../../api/baseApi";

const settingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSettings: builder.query({
      query: (type) => `/settings/${type}`,
      providesTags: ["Settings"],
    }),
    addOrUpdateSettings: builder.mutation({
      query: (data) => ({
        url: "/settings",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Settings"],
    }),
  }),
});
export const { useGetSettingsQuery, useAddOrUpdateSettingsMutation } =
  settingsApi;
