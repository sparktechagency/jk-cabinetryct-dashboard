import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const baseUrl = `${import.meta.env.VITE_BASE_URL}/api/v1`;

const baseQuery = fetchBaseQuery({
  baseUrl,
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("token");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});
// Enhanced base query with token refresh logic
const baseQueryWithRefreshToken = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  if (result?.error?.status === 401) {
    const refreshResult = await baseQuery(
      { url: "/auth/refresh-token" },
      api,
      extraOptions
    );
    if (refreshResult?.data) {
      localStorage.setItem("token", refreshResult?.data?.tokens?.accessToken);
      result = await baseQuery(args, api, extraOptions);
    }
  }

  return result;
};
export const baseApi = createApi({
  reducerPath: "pokemonApi",
  baseQuery: baseQueryWithRefreshToken,
  tagTypes: [
    "User",
    "Branch",
    "Cabinetry",
    "CabinetryCategory",
    "Order",
    "StockItem",
    "StockItemCategory",
    "Parts",
    "Settings",
    "AdminSupportingAdmin",
  ],
  endpoints: () => ({}),
});
