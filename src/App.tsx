import React from "react";
import { BrowserRouter, Route, Routes } from "react-router";
import HomePage from "./app/home";
import { StoreProvider, PageWrapper } from "./components";
import SignInPage from "./app/signIn";

const App: React.FC = () => {
	return (
		<StoreProvider>
			<BrowserRouter>
				<Routes>
					<Route
						path="/"
						element={
							<PageWrapper>
								<HomePage />
							</PageWrapper>
						}
					/>
					<Route
						path="/sign-in"
						element={
							<PageWrapper>
								<SignInPage />
							</PageWrapper>
						}
					/>
				</Routes>
			</BrowserRouter>
		</StoreProvider>
	);
};

export default App;