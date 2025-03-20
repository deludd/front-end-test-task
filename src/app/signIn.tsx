import React, { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAppDispatch, useAppSelector } from "../store/store";
import {
	loginStart,
	loginSuccess,
	loginFailure,
} from "../store/slices/authSlice";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { LoginSchema } from "../utils/validationSchemas";
import { authService } from "../services/authService";

const SignInPage: React.FC = () => {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const { isAuthenticated, loading, error } = useAppSelector(
		(state) => state.auth
	);

	useEffect(() => {
		if (isAuthenticated === true) navigate("/");
	}, [isAuthenticated, navigate]);

	const handleSubmit = async (values: { email: string; password: string }) => {
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
			dispatch(loginFailure("An error occurred during login"));
		}
	};

	return (
		<div className="h-screen flex items-center justify-center bg-gray-50">
			<div className="w-full max-w-md">
				<div className="bg-white shadow-md rounded-xl p-8">
					<h1 className="text-2xl font-bold text-gray-800 text-center mb-6">
						Sign In
					</h1>

					{error && (
						<div className="mb-4 p-4 text-sm text-red-800 bg-red-50 rounded-lg">
							{error}
						</div>
					)}

					<Formik
						initialValues={{ email: "", password: "" }}
						validationSchema={LoginSchema}
						onSubmit={handleSubmit}
					>
						{({ errors, touched }) => (
							<Form>
								<div className="mb-4">
									<label htmlFor="email" className="block text-sm font-medium mb-2">
										Email address
									</label>
									<Field
										type="email"
										id="email"
										name="email"
										className={`py-3 px-4 block w-full border ${
											errors.email && touched.email
												? "border-red-500 focus:border-red-500 focus:ring-red-500"
												: "border-gray-200 focus:border-blue-500 focus:ring-blue-500"
										} rounded-lg text-sm`}
									/>
									<ErrorMessage
										name="email"
										component="p"
										className="mt-1 text-sm text-red-600"
									/>
								</div>

								<div className="mb-6">
									<label
										htmlFor="password"
										className="block text-sm font-medium mb-2"
									>
										Password
									</label>
									<Field
										type="password"
										id="password"
										name="password"
										className={`py-3 px-4 block w-full border ${
											errors.password && touched.password
												? "border-red-500 focus:border-red-500 focus:ring-red-500"
												: "border-gray-200 focus:border-blue-500 focus:ring-blue-500"
										} rounded-lg text-sm`}
									/>
									<ErrorMessage
										name="password"
										component="p"
										className="mt-1 text-sm text-red-600"
									/>
								</div>

								<button
									type="submit"
									disabled={loading}
									className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
								>
									{loading ? (
										<>
											<span className="animate-spin inline-block w-4 h-4 border-2 border-current border-t-transparent text-white rounded-full mr-2"></span>
											Signing in...
										</>
									) : (
										"Sign in"
									)}
								</button>
								
								<div className="mt-4 text-center text-sm text-gray-500">
									<p>Demo credentials: test@test.test / password</p>
								</div>
							</Form>
						)}
					</Formik>
				</div>
			</div>
		</div>
	);
};

export default SignInPage;