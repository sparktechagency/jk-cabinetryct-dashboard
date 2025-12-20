
import { baseApi } from "../../api/baseApi";

const createChat = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createChat: builder.mutation({
      query: (data) => ({
        url: `/chat`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Message" }],
    }),
  }),
});

export const { useCreateChatMutation } = createChat;
