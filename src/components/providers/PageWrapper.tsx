import React from "react";
import UIProvider from "./UIProvider";

interface PageWrapperProps {
	children: React.ReactNode;
}

const PageWrapper: React.FC<PageWrapperProps> = ({ children }) => {
	return <UIProvider>{children}</UIProvider>;
};

export default PageWrapper;