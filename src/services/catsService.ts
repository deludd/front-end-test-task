import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { CatBreed } from "../types";

export interface GetBreedsParams {
	limit?: number;
	page?: number;
	attach_breed?: 0 | 1;
}

const baseQuery = fetchBaseQuery({
	baseUrl: "/",
});

const baseQueryWithRetry = async (args: any, api: any, extraOptions: any) => {
	let result = await baseQuery(args, api, extraOptions);
	if (result.error) {
		await new Promise((resolve) => setTimeout(resolve, 1000));
		result = await baseQuery(args, api, extraOptions);
	}
	return result;
};

export const catsApi = createApi({
	reducerPath: "catsApi",
	baseQuery: baseQueryWithRetry,
	endpoints: (builder) => ({
		getBreeds: builder.query<CatBreed[], GetBreedsParams>({
			query: () => "/breeds",
		}),
	}),
});

export const { useGetBreedsQuery } = catsApi;