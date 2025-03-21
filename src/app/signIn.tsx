import React, { useEffect, useCallback, useState } from "react";
import { useNavigate } from "react-router";
import { useAppDispatch, useAppSelector } from "../store/store";
import {
	loginStart,
	loginSuccess,
	loginFailure,
} from "../store/slices/authSlice";

import { authService } from "../services/authService";
import { LoginCredentials } from "../types";
import { LoginForm, ErrorDisplay } from "../components";

const SignInPage: React.FC = () => {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const { isAuthenticated, loading, error } = useAppSelector(
		(state) => state.auth
	);
	const [fatalError, setFatalError] = useState<Error | null>(null);

	useEffect(() => {
		if (isAuthenticated === true) navigate("/");
	}, [isAuthenticated, navigate]);

	const handleSubmit = useCallback(async (values: LoginCredentials) => {
		try {
			dispatch(loginStart());
			
			const response = await authService.login(values);
			
			if (response.success && response.user) {
				dispatch(loginSuccess(response.user));
				navigate("/");
			} else {
				dispatch(loginFailure(response.error || "Unknown error occurred"));
			}
		} catch (error) {
			console.error("Login error:", error);
			const errorMessage = error instanceof Error 
				? error.message
				: "An unexpected error occurred during login";
				
			dispatch(loginFailure(errorMessage));
			
			if (error instanceof Error && 
				(error.name === "NetworkError" || error.name === "FatalError")) {
				setFatalError(error);
			}
		}
	}, [dispatch, navigate]);

	if (fatalError) {
		return (
			<ErrorDisplay
				message="Unable to access the authentication service"
				error={fatalError}
				retry={() => window.location.reload()}
			/>
		);
	}

	return (
		<div className="h-screen flex items-center justify-center bg-gray-50">
			<div className="w-full max-w-md">
				<LoginForm 
					onSubmit={handleSubmit}
					loading={loading}
					error={error}
				/>
			</div>
		</div>
	);
};

export default SignInPage;