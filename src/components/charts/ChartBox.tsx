import React from "react";

interface ChartBoxProps {
	title: string;
	children: React.ReactNode;
}

const ChartBox: React.FC<ChartBoxProps> = ({ title, children }) => {
	return (
		<div className="bg-white p-4 rounded-xl shadow-sm">
			<h2 className="text-xl font-semibold mb-4">{title}</h2>
			<div className="h-[300px]">{children}</div>
		</div>
	);
};

export default React.memo(ChartBox);