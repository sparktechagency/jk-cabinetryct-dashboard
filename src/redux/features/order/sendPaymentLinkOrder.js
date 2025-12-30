import { baseApi } from "../../api/baseApi";

const sendPaymentLinkOrder = baseApi.injectEndpoints({
  endpoints: (build) => ({
    sendPaymentLinkOrder: build.mutation({
      query: (data) => ({
        url: "/order/send-payment-link",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Order"],
    }),
  }),
});
const { useSendPaymentLinkOrderMutation } = sendPaymentLinkOrder;
export { useSendPaymentLinkOrderMutation };
