import React from "react";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
} from "recharts";
import { ChartDataPoint } from "../../types";
import ChartBox from "./ChartBox";

interface BarChartComponentProps {
	data: ChartDataPoint[];
	title: string;
	color?: string;
}

const BarChartComponent: React.FC<BarChartComponentProps> = ({
	data,
	title,
	color = "#0088FE",
}) => {
	return (
		<ChartBox title={title}>
			<ResponsiveContainer>
				<BarChart data={data}>
					<CartesianGrid strokeDasharray="3 3" />
					<XAxis dataKey="name" />
					<YAxis />
					<Tooltip />
					<Bar dataKey="value" fill={color} />
				</BarChart>
			</ResponsiveContainer>
		</ChartBox>
	);
};

export default React.memo(BarChartComponent);