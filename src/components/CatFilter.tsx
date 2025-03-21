import React, { useState, useCallback, useMemo } from "react";
import { CatBreed } from "../types";

interface CatFilterProps {
	onFilterChange: (filters: FilterOptions) => void;
	onSortChange: (sortOption: SortOption) => void;
}

export interface FilterOptions {
	origin: string;
	minAdaptability: number;
	minAffection: number;
}

export interface SortOption {
	field: keyof CatBreed | "";
	direction: "asc" | "desc";
}

const ORIGINS = [
	"United States",
	"United Kingdom",
	"Thailand",
	"Egypt",
	"Russia",
	"France",
	"Burma",
	"China",
	"Japan"
];

const SORT_OPTIONS = [
	{ value: "", label: "Default" },
	{ value: "name-asc", label: "Name (A-Z)" },
	{ value: "name-desc", label: "Name (Z-A)" },
	{ value: "adaptability-desc", label: "Adaptability (High-Low)" },
	{ value: "adaptability-asc", label: "Adaptability (Low-High)" },
	{ value: "affection_level-desc", label: "Affection (High-Low)" },
	{ value: "affection_level-asc", label: "Affection (Low-High)" }
];

const INITIAL_FILTERS: FilterOptions = {
	origin: "",
	minAdaptability: 0,
	minAffection: 0
};

const INITIAL_SORT: SortOption = {
	field: "" as "",
	direction: "asc"
};

const CatFilter: React.FC<CatFilterProps> = ({ onFilterChange, onSortChange }) => {
	const [filters, setFilters] = useState<FilterOptions>(INITIAL_FILTERS);
	const [sortOption, setSortOption] = useState<SortOption>(INITIAL_SORT);

	const handleFilterChange = useCallback((
		e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
	) => {
		const { name, value, type } = e.target;
		const newValue = type === 'range' ? Number(value) : value;
		
		setFilters(prev => {
			const newFilters = {
				...prev,
				[name]: newValue
			};
			onFilterChange(newFilters);
			return newFilters;
		});
	}, [onFilterChange]);

	const handleSortChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
		const { value } = e.target;
		
		if (!value) {
			setSortOption(INITIAL_SORT);
			onSortChange(INITIAL_SORT);
			return;
		}
		
		const [fieldValue, direction] = value.split('-');
		const newSortOption: SortOption = { 
			field: fieldValue as keyof CatBreed | "", 
			direction: direction as "asc" | "desc"
		};
		
		setSortOption(newSortOption);
		onSortChange(newSortOption);
	}, [onSortChange]);

	const resetFilters = useCallback(() => {
		setFilters(INITIAL_FILTERS);
		setSortOption(INITIAL_SORT);
		onFilterChange(INITIAL_FILTERS);
		onSortChange(INITIAL_SORT);
	}, [onFilterChange, onSortChange]);

	const RangeSlider = useMemo(() => {
		return ({ 
			name, 
			value, 
			label 
		}: { 
			name: keyof FilterOptions, 
			value: number, 
			label: string 
		}) => (
			<div>
				<label htmlFor={name} className="block text-sm font-medium mb-2">
					{label}: {value}
				</label>
				<input
					type="range"
					id={name}
					name={name}
					min="0"
					max="5"
					step="1"
					value={value}
					onChange={handleFilterChange}
					className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
					aria-valuemin={0}
					aria-valuemax={5}
					aria-valuenow={value}
				/>
				<div className="flex justify-between text-xs text-gray-500 mt-1">
					<span>Any</span>
					<span>5</span>
				</div>
			</div>
		);
	}, [handleFilterChange]);

	return (
		<div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6 mb-8">
			<div className="flex justify-between items-center mb-6">
				<h3 className="text-lg font-semibold text-gray-800">Filters</h3>
				<button
					type="button"
					className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50"
					onClick={resetFilters}
					aria-label="Reset all filters"
				>
					<svg className="h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
						<path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z"/>
						<path fillRule="evenodd" d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z"/>
					</svg>
					Reset
				</button>
			</div>
			
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				<div>
					<label htmlFor="origin" className="block text-sm font-medium mb-2">
						Origin
					</label>
					<div className="relative">
						<select
							id="origin"
							name="origin"
							className="py-3 px-4 pe-9 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
							onChange={handleFilterChange}
							value={filters.origin}
						>
							<option value="">All Origins</option>
							{ORIGINS.map((origin) => (
								<option key={origin} value={origin}>
									{origin}
								</option>
							))}
						</select>
					</div>
				</div>

				<div>
					<label htmlFor="sort" className="block text-sm font-medium mb-2">
						Sort By
					</label>
					<div className="relative">
						<select
							id="sort"
							name="sort"
							className="py-3 px-4 pe-9 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
							onChange={handleSortChange}
							value={sortOption.field ? `${sortOption.field}-${sortOption.direction}` : ""}
						>
							{SORT_OPTIONS.map(option => (
								<option key={option.value} value={option.value}>
									{option.label}
								</option>
							))}
						</select>
					</div>
				</div>

				<RangeSlider 
					name="minAdaptability"
					value={filters.minAdaptability}
					label="Min Adaptability"
				/>

				<RangeSlider 
					name="minAffection"
					value={filters.minAffection}
					label="Min Affection"
				/>
			</div>
		</div>
	);
};

export default React.memo(CatFilter);