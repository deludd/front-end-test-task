import { User, LoginCredentials, LoginResponse } from "../types";

export const authService = {
	login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
		await new Promise(resolve => setTimeout(resolve, 1000));
		
		if (credentials.email === "test@test.test" && credentials.password === "password") {
			const user: User = {
				email: credentials.email,
				name: credentials.email.split("@")[0],
				id: 1,
				role: "user"
			};
			
			return {
				success: true,
				user
			};
		} else {
			return {
				success: false,
				error: "User not found. Please use test@test.test / password"
			};
		}
	},
	
	logout: async (): Promise<void> => {
		await new Promise(resolve => setTimeout(resolve, 500));
	}
};