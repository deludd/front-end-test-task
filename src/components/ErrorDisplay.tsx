import React from "react";
import { ApiError } from "../types";

interface ErrorDisplayProps {
	message: string;
	error?: unknown;
	retry?: () => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message, error, retry }) => {
	const getErrorDetails = (): string => {
		if (!error) return "";
		
		if (typeof error === "object" && error !== null) {
			if ("status" in error && "data" in error) {
				const apiError = error as ApiError;
				return `Status: ${apiError.status}${apiError.data.details ? ` - ${apiError.data.details}` : ""}`;
			}
			if (error instanceof Error) {
				return `${error.name}: ${error.message}`;
			}
		}
		
		return String(error);
	};

	const errorDetails = getErrorDetails();

	return (
		<div className="flex flex-col items-center justify-center h-screen">
			<div className="max-w-md p-6 bg-white border border-red-100 rounded-lg shadow-sm">
				<div className="flex items-center mb-4">
					<svg 
						className="w-8 h-8 text-red-500 mr-3" 
						fill="none" 
						stroke="currentColor" 
						viewBox="0 0 24 24" 
						xmlns="http://www.w3.org/2000/svg"
					>
						<path 
							strokeLinecap="round" 
							strokeLinejoin="round" 
							strokeWidth="2" 
							d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
						></path>
					</svg>
					<h2 className="text-xl font-semibold text-gray-800">Error Occurred</h2>
				</div>
				
				<div className="mb-4">
					<p className="text-red-600 mb-2">{message}</p>
					{errorDetails && (
						<p className="text-sm text-gray-600 bg-gray-50 p-2 rounded-md">{errorDetails}</p>
					)}
				</div>
				
				{retry && (
					<div className="flex justify-end">
						<button
							onClick={retry}
							className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
						>
							Try Again
						</button>
					</div>
				)}
			</div>
		</div>
	);
};

export default React.memo(ErrorDisplay);