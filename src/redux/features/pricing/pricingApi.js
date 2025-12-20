import { baseApi } from "../../api/baseApi";

const pricingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPricing: builder.query({
      query: () => `/pricing`,
      providesTags: ["Pricing"],
    }),
    addPricing: builder.mutation({
      query: (data) => ({
        url: "/pricing",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Pricing"],
    })
  }),
});

export const {
  useGetPricingQuery,
  useAddPricingMutation
} = pricingApi;
