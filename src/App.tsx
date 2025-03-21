import React from "react";
import { BrowserRouter, Route, Routes } from "react-router";
import HomePage from "./app/home";
import SignInPage from "./app/signIn";
import { StoreProvider, PageWrapper, ProtectedRoute } from "./components";

const App: React.FC = () => {
  return (
    <StoreProvider>
      <BrowserRouter>
        <PageWrapper>
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              }
            />
            <Route path="/sign-in" element={<SignInPage />} />
          </Routes>
        </PageWrapper>
      </BrowserRouter>
    </StoreProvider>
  );
};

export default App;