import { configureStore } from "@reduxjs/toolkit";
import { catsApi } from "../services/catsService";
import authReducer from "./slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../types";

const customMiddleware = (store: any) => (next: any) => (action: any) => {
	const result = next(action);
	return result;
};

const store = configureStore({
	reducer: {
		cats: catsApi.reducer,
		auth: authReducer,
		[catsApi.reducerPath]: catsApi.reducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware()
			.concat([catsApi.middleware, customMiddleware])
			.concat(catsApi.middleware),
});

type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector = <T extends any>(selector: (state: any) => T) =>
	useSelector((state: RootState) => selector(state as any));

export { store };