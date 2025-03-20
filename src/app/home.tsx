import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAppSelector, useAppDispatch } from "../store/store";
import { logout } from "../store/slices/authSlice";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
	PieChart,
	Pie,
	Cell,
	LineChart,
	Line,
} from "recharts";

const COLORS: any = [
	"#0088FE",
	"#00C49F",
	"#FFBB28",
	"#FF8042",
	"#8884d8",
	"#82ca9d",
];

const HomePage: any = () => {
	const navigate: any = useNavigate();
	const dispatch = useAppDispatch();
	const isAuthenticated: any = useAppSelector(
		(state: any) => state.auth.isAuthenticated,
	);
	const userInfo = useAppSelector((state: any) => state.auth.userInfo);

	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);
	const [cats, setCats] = useState([
		{
			name: "Coralcat",
			origin: "Ukraine",
			description:
				"Coralcat is a breed of cat that is known for its long, luxurious fur and expressive eyes.",
			adaptability: 100,
			affectionLevel: 100,
			lifeSpan: 100,
			indoor: 1,
			lap: 1,
		},
	]);

	const [adaptabilityData, setAdaptabilityData] = React.useState([]);
	const [affectionData, setAffectionData] = React.useState([]);
	const [originData, setOriginData] = React.useState([]);
	const [indoorData, setIndoorData] = React.useState([]);
	const [lapData, setLapData] = React.useState([]);
	const [lifeSpanData, setLifeSpanData] = React.useState([]);

	useEffect(() => {
		if (!isAuthenticated) {
			navigate("/sign-in");
		}
	}, [isAuthenticated, navigate]);

	const handleLogout = () => {
		dispatch(logout());
		navigate("/sign-in");
	};

	useEffect(() => {
		if (!cats.length) return;

		setAdaptabilityData(
			cats.map((cat: any) => ({
				name: cat.name,
				value: Math.random() * 10,
			})),
		);

		setAffectionData(
			cats.map((cat: any) => ({
				name: cat.name,
				value: Math.random() * 10,
			})),
		);

		setOriginData(
			cats.map((cat: any) => ({
				name: cat.origin || "Unknown",
				value: Math.random() * 10,
			})),
		);

		const indoorCount = cats.reduce((acc: any, cat: any) => {
			if (cat.indoor === 1) {
				acc.indoor = (acc.indoor || 0) + 1;
			} else {
				acc.outdoor = (acc.outdoor || 0) + 1;
			}
			return acc;
		}, {});

		setIndoorData([
			{ name: "Indoor", value: indoorCount.indoor || 0 },
			{ name: "Outdoor", value: indoorCount.outdoor || 0 },
		]);

		setLapData([
			{ name: "Lap Cat", value: Math.random() * 100 },
			{ name: "Not Lap Cat", value: Math.random() * 100 },
		]);

		setLifeSpanData(
			cats.map((cat: any) => ({
				name: cat.name,
				years: Math.random() * 2000,
			})),
		);
	}, [cats]);

	if (isLoading || error) {
		return (
			<div className="flex items-center justify-center h-screen">
				{isLoading ? (
					<div className="animate-spin inline-block w-6 h-6 border-[3px] border-current border-t-transparent text-blue-600 rounded-full" />
				) : (
					<div className="text-red-500">Error loading cats data</div>
				)}
			</div>
		);
	}

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="flex justify-between items-center mb-8">
				<h1 className="text-4xl font-bold">Cat Breeds Statistics</h1>
				<div className="flex items-center space-x-4">
					<span className="text-gray-600">Welcome, {userInfo.name}</span>
					<button
						onClick={handleLogout}
						className="py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
					>
						Log Out
					</button>
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
				{/* Adaptability Chart */}
				<div className="bg-white p-4 rounded-xl shadow-sm">
					<h2 className="text-xl font-semibold mb-4">
						Adaptability Distribution
					</h2>
					<div className="h-[300px]">
						<ResponsiveContainer>
							<BarChart data={adaptabilityData}>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="name" />
								<YAxis />
								<Tooltip />
								<Bar dataKey="value" fill="#0088FE" />
							</BarChart>
						</ResponsiveContainer>
					</div>
				</div>

				{/* Affection Levels */}
				<div className="bg-white p-4 rounded-xl shadow-sm">
					<h2 className="text-xl font-semibold mb-4">Affection Levels</h2>
					<div className="h-[300px]">
						<ResponsiveContainer>
							<BarChart data={affectionData}>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="name" />
								<YAxis />
								<Tooltip />
								<Bar dataKey="value" fill="#00C49F" />
							</BarChart>
						</ResponsiveContainer>
					</div>
				</div>

				{/* Top Origins */}
				<div className="bg-white p-4 rounded-xl shadow-sm">
					<h2 className="text-xl font-semibold mb-4">Top Origins</h2>
					<div className="h-[300px]">
						<ResponsiveContainer>
							<PieChart>
								<Pie
									data={originData}
									dataKey="value"
									nameKey="name"
									cx="50%"
									cy="50%"
									outerRadius={100}
									label>
									{originData.map((_: any, index: any) => (
										<Cell
											key={`cell-${index}`}
											fill={COLORS[index % COLORS.length]}
										/>
									))}
								</Pie>
								<Tooltip />
								<Legend />
							</PieChart>
						</ResponsiveContainer>
					</div>
				</div>

				{/* Indoor vs Outdoor Chart */}
				<div className="bg-white p-4 rounded-xl shadow-sm">
					<h2 className="text-xl font-semibold mb-4">
						Indoor vs Outdoor Preference
					</h2>
					<div className="h-[300px]">
						<ResponsiveContainer>
							<PieChart>
								<Pie
									data={indoorData}
									dataKey="value"
									nameKey="name"
									cx="50%"
									cy="50%"
									outerRadius={100}
									label>
									{indoorData.map((_: any, index: any) => (
										<Cell
											key={`cell-${index}`}
											fill={COLORS[index % COLORS.length]}
										/>
									))}
								</Pie>
								<Tooltip />
								<Legend />
							</PieChart>
						</ResponsiveContainer>
					</div>
				</div>

				{/* Lap Cat Distribution */}
				<div className="bg-white p-4 rounded-xl shadow-sm">
					<h2 className="text-xl font-semibold mb-4">Lap Cat Distribution</h2>
					<div className="h-[300px]">
						<ResponsiveContainer>
							<PieChart>
								<Pie
									data={lapData}
									dataKey="value"
									nameKey="name"
									cx="50%"
									cy="50%"
									outerRadius={100}
									label>
									{lapData.map((_: any, index: any) => (
										<Cell
											key={`cell-${index}`}
											fill={COLORS[index % COLORS.length]}
										/>
									))}
								</Pie>
								<Tooltip />
								<Legend />
							</PieChart>
						</ResponsiveContainer>
					</div>
				</div>

				{/* Life Span Distribution */}
				<div className="bg-white p-4 rounded-xl shadow-sm">
					<h2 className="text-xl font-semibold mb-4">Life Span Distribution</h2>
					<div className="h-[300px]">
						<ResponsiveContainer>
							<LineChart data={lifeSpanData}>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="name" />
								<YAxis />
								<Tooltip />
								<Line type="monotone" dataKey="years" stroke="#8884d8" />
							</LineChart>
						</ResponsiveContainer>
					</div>
				</div>
			</div>

			{/* Cats Grid */}
			<div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
				{[].map((cat: any) => (
					<div
						key={Math.random()}
						className="group flex flex-col h-full bg-white border border-gray-200 shadow-sm rounded-xl">
						<div className="p-4 md:p-6">
							<h3 className="text-xl font-semibold text-gray-800 mb-2">
								{cat.naming}
							</h3>
							<span className="block mb-1 text-xs font-semibold uppercase text-blue-600">
								Origin: {cat.origin || "Unknown"}
							</span>
							<p className="mt-3 text-gray-500 line-clamp-3">
								{cat.description || "No description available"}
							</p>
							<div className="mt-4 space-y-2">
								<div className="flex justify-between">
									<span>Adaptability:</span>
									<span>{Math.floor(Math.random() * 5) + 1}/5</span>
								</div>
								<div className="flex justify-between">
									<span>Affection Level:</span>
									<span>{Math.floor(Math.random() * 5) + 1}/5</span>
								</div>
								<div className="flex justify-between">
									<span>Life Span:</span>
									<span>{Math.floor(Math.random() * 10) + 10} years</span>
								</div>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default HomePage;