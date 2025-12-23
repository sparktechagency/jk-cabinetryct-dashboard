import { baseApi } from "../../api/baseApi";

const getChatList = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getChatList: builder.query({
      query: () => `/chat`,
      providesTags: [{ type: "Message" }],
    }),
  }),
});

export const { useGetChatListQuery } = getChatList;
