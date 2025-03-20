import React, { useEffect } from "react";
import "preline/preline";
import { IStaticMethods } from "preline/preline";
import { useLocation } from "react-router";

declare global {
	interface Window {
		HSStaticMethods: IStaticMethods;
	}
}

interface UIProviderProps {
	children: React.ReactNode;
}

const UIProvider: React.FC<UIProviderProps> = ({ children }) => {
	const location = useLocation();

	useEffect(() => {
		window.HSStaticMethods.autoInit();
	}, [location.pathname]);

	return <>{children}</>;
};

export default UIProvider;