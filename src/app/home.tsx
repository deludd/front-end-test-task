import React, { useState, useEffect } from "react";
import { useNavigate, NavigateFunction } from "react-router";
import { useAppSelector, useAppDispatch } from "../store/store";
import { logout } from "../store/slices/authSlice";
import { useGetBreedsQuery } from "../services/catsService";
import { CatBreed, ChartDataPoint, LifeSpanDataPoint } from "../types";
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

const COLORS: string[] = [
	"#0088FE",
	"#00C49F",
	"#FFBB28",
	"#FF8042",
	"#8884d8",
	"#82ca9d",
];

const HomePage: React.FC = () => {
	const navigate: NavigateFunction = useNavigate();
	const dispatch = useAppDispatch();
	const isAuthenticated = useAppSelector(
		(state) => state.auth.isAuthenticated
	);
	const userInfo = useAppSelector((state) => state.auth.userInfo);

	const { data: cats = [], isLoading, error } = useGetBreedsQuery({});

	const [adaptabilityData, setAdaptabilityData] = useState<ChartDataPoint[]>([]);
	const [affectionData, setAffectionData] = useState<ChartDataPoint[]>([]);
	const [originData, setOriginData] = useState<ChartDataPoint[]>([]);
	const [indoorData, setIndoorData] = useState<ChartDataPoint[]>([]);
	const [lapData, setLapData] = useState<ChartDataPoint[]>([]);
	const [lifeSpanData, setLifeSpanData] = useState<LifeSpanDataPoint[]>([]);

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
			cats.slice(0, 10).map((cat: CatBreed) => ({
				name: cat.name,
				value: cat.adaptability,
			})),
		);

		setAffectionData(
			cats.slice(0, 10).map((cat: CatBreed) => ({
				name: cat.name,
				value: cat.affection_level,
			})),
		);

		const originCounts: Record<string, number> = {};
		cats.forEach((cat: CatBreed) => {
			const origin = cat.origin || "Unknown";
			originCounts[origin] = (originCounts[origin] || 0) + 1;
		});
		
		setOriginData(
			Object.entries(originCounts)
				.map(([name, value]) => ({ name, value }))
				.sort((a, b) => b.value - a.value)
				.slice(0, 6)
		);

		const indoorCount = cats.reduce((acc: {indoor?: number; outdoor?: number}, cat: CatBreed) => {
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

		const lapCats = cats.filter((cat: CatBreed) => cat.lap === 1).length;
		const nonLapCats = cats.filter((cat: CatBreed) => cat.lap === 0 || cat.lap === undefined).length;
		
		setLapData([
			{ name: "Lap Cat", value: lapCats },
			{ name: "Not Lap Cat", value: nonLapCats },
		]);

		setLifeSpanData(
			cats.slice(0, 10).map((cat: CatBreed) => {
				const lifeSpanParts = cat.life_span.split('-')
					.map((part: string) => parseInt(part.trim()))
					.filter((num: number) => !isNaN(num));
					
				const averageLifeSpan = lifeSpanParts.length > 0 
					? lifeSpanParts.reduce((a: number, b: number) => a + b, 0) / lifeSpanParts.length
					: 0;
				
				return {
					name: cat.name,
					years: averageLifeSpan,
				};
			}),
		);
	}, [cats]);

	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-screen">
				<div className="animate-spin inline-block w-6 h-6 border-[3px] border-current border-t-transparent text-blue-600 rounded-full" />
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex items-center justify-center h-screen">
				<div className="text-red-500">Error loading cats data</div>
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
									label
								>
									{originData.map((_: ChartDataPoint, index: number) => (
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
									label
								>
									{indoorData.map((_: ChartDataPoint, index: number) => (
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
									label
								>
									{lapData.map((_: ChartDataPoint, index: number) => (
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
				{cats.map((cat: CatBreed) => (
					<div
						key={cat.id}
						className="group flex flex-col h-full bg-white border border-gray-200 shadow-sm rounded-xl"
					>
						<div className="p-4 md:p-6">
							<h3 className="text-xl font-semibold text-gray-800 mb-2">
								{cat.name}
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
									<span>{cat.adaptability}/5</span>
								</div>
								<div className="flex justify-between">
									<span>Affection Level:</span>
									<span>{cat.affection_level}/5</span>
								</div>
								<div className="flex justify-between">
									<span>Life Span:</span>
									<span>{cat.life_span} years</span>
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