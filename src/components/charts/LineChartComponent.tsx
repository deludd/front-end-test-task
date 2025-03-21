import React from "react";
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
} from "recharts";
import { LifeSpanDataPoint } from "../../types";
import ChartBox from "../ChartBox";

interface LineChartComponentProps {
	data: LifeSpanDataPoint[];
	title: string;
	color?: string;
}

const LineChartComponent: React.FC<LineChartComponentProps> = ({
	data,
	title,
	color = "#8884d8",
}) => {
	return (
		<ChartBox title={title}>
			<ResponsiveContainer>
				<LineChart data={data}>
					<CartesianGrid strokeDasharray="3 3" />
					<XAxis dataKey="name" />
					<YAxis />
					<Tooltip />
					<Line type="monotone" dataKey="years" stroke={color} />
				</LineChart>
			</ResponsiveContainer>
		</ChartBox>
	);
};

export default React.memo(LineChartComponent);