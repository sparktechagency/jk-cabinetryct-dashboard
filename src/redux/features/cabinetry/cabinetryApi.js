import { baseApi } from "../../api/baseApi";

const cabinetryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addcabinetry: builder.mutation({
      query: (data) => ({
        url: "/cabinetry",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Cabinetry"],
    }),
    getAllCabinetry: builder.query({
      query: () => {
        return {
          url: `/cabinetry`,
          method: "GET",
        };
      },
      providesTags: ["Cabinetry"],
    }),
    getSingleCabinetry: builder.query({
      query: (id) => {
        return {
          url: `/cabinetry/${id}`,
          method: "GET",
        };
      },
    }),
    updateCabinetry: builder.mutation({
      query: ({ data, id }) => ({
        url: `/cabinetry/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Cabinetry"],
    }),
    deletecabinetry: builder.mutation({
      query: (id) => ({
        url: `/cabinetry/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Cabinetry"],
    }),
  }),
});

export const {
  useAddcabinetryMutation,
  useGetAllCabinetryQuery,
  useGetSingleCabinetryQuery,
  useUpdateCabinetryMutation,
  useDeletecabinetryMutation,
} = cabinetryApi;
