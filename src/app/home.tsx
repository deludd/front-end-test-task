import React, { useEffect, useCallback, useState, useMemo } from "react";
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
	LineChartComponent,
	CatFilter,
} from "../components";

import { FilterOptions, SortOption } from "../components/CatFilter";
import { useCatData } from "../hooks/useCatData";
import { CatBreed } from "../types";

const applyFilters = (cats: CatBreed[], filters: FilterOptions): CatBreed[] => {
	return cats.filter(cat => {
		if (filters.origin && cat.origin !== filters.origin) {
			return false;
		}
		
		if (filters.minAdaptability > 0 && cat.adaptability < filters.minAdaptability) {
			return false;
		}
		
		if (filters.minAffection > 0 && cat.affection_level < filters.minAffection) {
			return false;
		}
		
		return true;
	});
};

const applySorting = (cats: CatBreed[], sortOption: SortOption): CatBreed[] => {
	if (!sortOption.field) {
		return cats;
	}
	
	return [...cats].sort((a, b) => {
		const field = sortOption.field as keyof CatBreed;
		const aValue = a[field];
		const bValue = b[field];
		
		const sortDirection = sortOption.direction === 'asc' ? 1 : -1;
		
		if (typeof aValue === 'string' && typeof bValue === 'string') {
			return sortDirection * aValue.localeCompare(bValue);
		} else {
			return sortDirection * ((aValue as number) - (bValue as number));
		}
	});
};

const HomePage: React.FC = () => {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const isAuthenticated = useAppSelector(
		(state) => state.auth.isAuthenticated
	);
	const userInfo = useAppSelector((state) => state.auth.userInfo);

	const { data: cats = [], isLoading, error } = useGetBreedsQuery({});
	
	const [filters, setFilters] = useState<FilterOptions>({
		origin: "",
		minAdaptability: 0,
		minAffection: 0
	});
	
	const [sortOption, setSortOption] = useState<SortOption>({
		field: "" as "",
		direction: "asc"
	});
	
	const filteredCats = useMemo(() => {
		if (!cats.length) return [];
		
		const filteredResults = applyFilters(cats, filters);
		return applySorting(filteredResults, sortOption);
		
	}, [cats, filters, sortOption]);

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
	
	const handleFilterChange = useCallback((newFilters: FilterOptions) => {
		setFilters(newFilters);
	}, []);
	
	const handleSortChange = useCallback((newSortOption: SortOption) => {
		setSortOption(newSortOption);
	}, []);

	if (isLoading) {
		return <LoadingSpinner />;
	}

	if (error) {
		return <ErrorDisplay message="Error loading cats data" />;
	}

	return (
		<div className="container mx-auto px-4 py-8">
			<PageHeader 
				title="Cat Breeds Dashboard" 
				userName={userInfo.name} 
				onLogout={handleLogout} 
			/>
			
			<CatFilter 
				onFilterChange={handleFilterChange}
				onSortChange={handleSortChange}
			/>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
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
				
				<LineChartComponent
					data={chartData.lifeSpanData}
					title="Life Span Distribution"
				/>
			</div>

			<div className="mt-12">
				<h2 className="text-2xl font-bold mb-4">Cat Breeds ({filteredCats.length})</h2>
				
				{filteredCats.length === 0 ? (
					<div className="text-center py-8">
						<p className="text-gray-500">No cat breeds match your filters.</p>
					</div>
				) : (
					<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
						{filteredCats.map((cat) => (
							<CatCard key={cat.id} cat={cat} />
						))}
					</div>
				)}
			</div>
		</div>
	);
};

export default HomePage;