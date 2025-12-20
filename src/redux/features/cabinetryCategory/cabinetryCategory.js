import { baseApi } from "../../api/baseApi";

const cabinetryCategory = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCabinetryCategory: builder.query({
      query: () => `/cabinetry-category`,
      providesTags: ["CabinetryCategory"],
    }),
    addCabinetryCategory: builder.mutation({
      query: (data) => ({
        url: `/cabinetry-category`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["CabinetryCategory", "Cabinetry"],
    }),
    updateCabinetryCategory: builder.mutation({
      query: ({ data, id }) => ({
        url: `/cabinetry-category/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["CabinetryCategory", "Cabinetry"],
    }),
    deleteCabinetryCategory: builder.mutation({
      query: (id) => ({
        url: `/cabinetry-category/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["CabinetryCategory", "Cabinetry"],
    }),
  }),
});

export const {
  useGetCabinetryCategoryQuery,
  useAddCabinetryCategoryMutation,
  useUpdateCabinetryCategoryMutation,
  useDeleteCabinetryCategoryMutation,
} = cabinetryCategory;
