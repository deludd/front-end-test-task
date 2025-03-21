import { useCallback, useState, useMemo } from "react";
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

	const userInfo = useAppSelector((state) => state.auth.userInfo);

	const { 
		data: cats = [], 
		isLoading, 
		error, 
		refetch 
	} = useGetBreedsQuery({});
	
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

	const handleRetry = useCallback(() => {
		refetch();
	}, [refetch]);

	if (isLoading) {
		return <LoadingSpinner />;
	}

	if (error) {
		return (
			<ErrorDisplay 
				message="We couldn't load the cat breeds data" 
				error={error}
				retry={handleRetry}
			/>
		);
	}

	if (cats.length === 0) {
		return (
			<ErrorDisplay 
				message="No cat breeds data available" 
				retry={handleRetry}
			/>
		);
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
					<div className="text-center py-8 bg-gray-50 rounded-lg">
						<svg 
							className="mx-auto h-12 w-12 text-gray-400" 
							fill="none" 
							viewBox="0 0 24 24" 
							stroke="currentColor" 
							aria-hidden="true"
						>
							<path 
								strokeLinecap="round" 
								strokeLinejoin="round" 
								strokeWidth="2" 
								d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
							/>
						</svg>
						<p className="mt-2 text-gray-500">No cat breeds match your filters.</p>
						<button
							onClick={() => {
								setFilters({
									origin: "",
									minAdaptability: 0,
									minAffection: 0
								});
								setSortOption({
									field: "" as "",
									direction: "asc"
								});
							}}
							className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
						>
							Reset Filters
						</button>
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