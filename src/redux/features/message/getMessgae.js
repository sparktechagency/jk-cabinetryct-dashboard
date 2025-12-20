import { baseApi } from "../../api/baseApi";

const getMessage = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMessage: builder.query({
      query: (id) => `/message/${id}`,
      providesTags: [{ type: "Message" }],
    }),
  }),
});

export const { useGetMessageQuery } = getMessage;
