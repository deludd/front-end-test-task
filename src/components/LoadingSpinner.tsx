import React from "react";

const LoadingSpinner: React.FC = () => {
	return (
		<div className="flex items-center justify-center h-screen">
			<div className="animate-spin inline-block w-6 h-6 border-[3px] border-current border-t-transparent text-blue-600 rounded-full" />
		</div>
	);
};

export default LoadingSpinner;