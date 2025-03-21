import React from "react";
import {
	PieChart,
	Pie,
	Cell,
	Tooltip,
	Legend,
	ResponsiveContainer,
} from "recharts";
import { ChartDataPoint } from "../../types";
import ChartBox from "./ChartBox";

export const CHART_COLORS: string[] = [
	"#0088FE",
	"#00C49F",
	"#FFBB28",
	"#FF8042",
	"#8884d8",
	"#82ca9d",
];

interface PieChartComponentProps {
	data: ChartDataPoint[];
	title: string;
}

const PieChartComponent: React.FC<PieChartComponentProps> = ({ data, title }) => {
	return (
		<ChartBox title={title}>
			<ResponsiveContainer>
				<PieChart>
					<Pie
						data={data}
						dataKey="value"
						nameKey="name"
						cx="50%"
						cy="50%"
						outerRadius={100}
						label
					>
						{data.map((_, index) => (
							<Cell
								key={`cell-${index}`}
								fill={CHART_COLORS[index % CHART_COLORS.length]}
							/>
						))}
					</Pie>
					<Tooltip />
					<Legend />
				</PieChart>
			</ResponsiveContainer>
		</ChartBox>
	);
};

export default React.memo(PieChartComponent);