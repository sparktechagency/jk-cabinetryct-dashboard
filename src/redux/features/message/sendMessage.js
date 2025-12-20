import { baseApi } from "../../api/baseApi";

const sendMessage = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    sendMessage: builder.mutation({
      query: (formData) => ({
        url: `/message/send-message`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: [{ type: "Message" }],
    }),
  }),
});

export const { useSendMessageMutation } = sendMessage;
