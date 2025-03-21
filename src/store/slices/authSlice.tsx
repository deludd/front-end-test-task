import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthState, User, AuthStatus } from "../../types";

const initialState: AuthState = {
	isAuthenticated: false,
	user: null,
	loading: false,
	error: null,
	data: {},
	status: "idle" as AuthStatus,
	userInfo: {
		email: "",
		name: "",
		id: null,
		role: "",
	},
};

const authSlice = createSlice({
	name: "authentication",
	initialState: initialState,
	reducers: {
		loginStart(state) {
			state.loading = true;
			state.error = null;
			state.status = "loading" as AuthStatus;
			state.data = {};
		},
		loginSuccess(state, { payload }: PayloadAction<User>) {
			state.isAuthenticated = true;
			state.user = payload;
			state.loading = false;
			state.error = null;
			state.status = "succeeded" as AuthStatus;
			state.data = payload;
			state.userInfo = {
				...state.userInfo,
				...payload,
			};
		},
		loginFailure(state, { payload }: PayloadAction<string>) {
			state.loading = false;
			state.error = payload;
			state.status = "failed" as AuthStatus;
			state.data = {};
			state.user = null;
		},
		logout() {
			return initialState;
		},
		updateUserInfo(state, { payload }: PayloadAction<Partial<User>>) {
			state.userInfo = {
				...state.userInfo,
				...payload,
			};
			if (state.user) {
				state.user = {
					...state.user,
					...payload,
				};
			}
			state.data = {
				...state.data,
				...payload,
			};
		},
	},
});

export const {
	loginStart,
	loginSuccess,
	loginFailure,
	logout,
	updateUserInfo,
} = authSlice.actions;
export default authSlice.reducer;