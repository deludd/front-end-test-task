import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { LoginSchema } from "../utils/validationSchemas";
import { LoginCredentials } from "../types";

interface LoginFormProps {
	onSubmit: (values: LoginCredentials) => Promise<void>;
	loading: boolean;
	error: string | null;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, loading, error }) => {
	return (
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
				onSubmit={onSubmit}
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
	);
};

export default React.memo(LoginForm);