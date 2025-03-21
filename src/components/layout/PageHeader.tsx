import React from "react";

interface PageHeaderProps {
	title: string;
	userName: string;
	onLogout: () => void;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, userName, onLogout }) => {
	return (
		<div className="flex justify-between items-center mb-8">
			<h1 className="text-4xl font-bold">{title}</h1>
			<div className="flex items-center space-x-4">
				<span className="text-gray-600">Welcome, {userName}</span>
				<button
					onClick={onLogout}
					className="py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
				>
					Log Out
				</button>
			</div>
		</div>
	);
};

export default React.memo(PageHeader);