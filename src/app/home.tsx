import React, { useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import { useAppSelector, useAppDispatch } from "../store/store";
import { logout } from "../store/slices/authSlice";
import { useGetBreedsQuery } from "../services/catsService";

import {
	LoadingSpinner,
	ErrorDisplay,
	CatCard,
	PageHeader,
	BarChartComponent,
	PieChartComponent,
	LineChartComponent
} from "../components";

import { useCatData } from "../hooks/useCatData";

const HomePage: React.FC = () => {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const isAuthenticated = useAppSelector(
		(state) => state.auth.isAuthenticated
	);
	const userInfo = useAppSelector((state) => state.auth.userInfo);

	const { data: cats = [], isLoading, error } = useGetBreedsQuery({});

	const chartData = useCatData(cats);

	useEffect(() => {
		if (!isAuthenticated) {
			navigate("/sign-in");
		}
	}, [isAuthenticated, navigate]);

	const handleLogout = useCallback(() => {
		dispatch(logout());
		navigate("/sign-in");
	}, [dispatch, navigate]);

	if (isLoading) {
		return <LoadingSpinner />;
	}

	if (error) {
		return <ErrorDisplay message="Error loading cats data" />;
	}

	return (
		<div className="container mx-auto px-4 py-8">
			<PageHeader 
				title="Cat Breeds Statistics" 
				userName={userInfo.name} 
				onLogout={handleLogout} 
			/>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
				<BarChartComponent
					data={chartData.adaptabilityData}
					title="Adaptability Distribution"
					color="#0088FE"
				/>
				
				<BarChartComponent
					data={chartData.affectionData}
					title="Affection Levels"
					color="#00C49F"
				/>
				
				<PieChartComponent
					data={chartData.originData}
					title="Top Origins"
				/>
				
				<PieChartComponent
					data={chartData.indoorData}
					title="Indoor vs Outdoor Preference"
				/>
				
				<PieChartComponent
					data={chartData.lapData}
					title="Lap Cat Distribution"
				/>
				
				<LineChartComponent
					data={chartData.lifeSpanData}
					title="Life Span Distribution"
				/>
			</div>

			{/* Cats Grid */}
			<div className="mt-12">
				<h2 className="text-2xl font-bold mb-4">Cat Breeds</h2>
				<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
					{cats.map((cat) => (
						<CatCard key={cat.id} cat={cat} />
					))}
				</div>
			</div>
		</div>
	);
};

export default HomePage;