import { baseApi } from "../../api/baseApi";

const collectionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addCollection: builder.mutation({
      query: (data) => ({
        url: "/collections", // Using separate endpoint for collections
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Collection"],
    }),
    getAllCollections: builder.query({
      query: () => {
        return {
          url: `/collections`, // Using separate endpoint for collections
          method: "GET",
        };
      },
      providesTags: ["Collection"],
    }),
    getSingleCollection: builder.query({
      query: (id) => {
        return {
          url: `/collections/${id}`, // Using separate endpoint for collections
          method: "GET",
        };
      },
    }),
    updateCollection: builder.mutation({
      query: ({ data, id }) => ({
        url: `/collections/${id}`, // Using separate endpoint for collections
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Collection"],
    }),
    deleteCollection: builder.mutation({
      query: (id) => ({
        url: `/collections/${id}`, // Using separate endpoint for collections
        method: "DELETE",
      }),
      invalidatesTags: ["Collection"],
    }),
  }),
});

export const {
  useAddCollectionMutation,
  useGetAllCollectionsQuery,
  useGetSingleCollectionQuery,
  useUpdateCollectionMutation,
  useDeleteCollectionMutation,
} = collectionApi;