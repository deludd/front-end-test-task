import { createApi, fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { CatBreed, CatImage } from "../types";

export interface GetBreedsParams {
	limit?: number;
	page?: number;
	attach_breed?: 0 | 1;
}

const API_URL = "https://api.thecatapi.com/v1";

const baseQuery = fetchBaseQuery({
	baseUrl: API_URL,
	prepareHeaders: (headers) => {
		const apiKey = import.meta.env.VITE_CATS_API_KEY;
		if (apiKey) {
			headers.set('x-api-key', apiKey);
		}

		return headers;
	}
});

const baseQueryWithRetry: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
	let result = await baseQuery(args, api, extraOptions);
	if (result.error) {
		await new Promise(resolve => setTimeout(resolve, 1000));

		result = await baseQuery(args, api, extraOptions);
	}
	
	return result;
};

export const catsApi = createApi({
	reducerPath: "catsApi",
	baseQuery: baseQueryWithRetry,
	endpoints: (builder) => ({
		getBreeds: builder.query<CatBreed[], GetBreedsParams>({
			query: (params = {}) => ({
				url: "/breeds",
				params,
			}),
		}),
		getBreedById: builder.query<CatBreed, string>({
			query: (id) => `/breeds/${id}`,
		}),
		getBreedImages: builder.query<CatImage[], { breedId: string; limit?: number }>({
			query: ({ breedId, limit = 1 }) => ({
				url: "/images/search",
				params: {
					breed_ids: breedId,
					limit,
				},
			}),
		}),
	}),
});

export const { useGetBreedsQuery, useGetBreedByIdQuery, useGetBreedImagesQuery } = catsApi;