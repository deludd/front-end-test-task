import { useMemo } from "react";
import { CatBreed } from "../types";

export const useCatData = (cats: CatBreed[] = []) => {
	return useMemo(() => {
		if (!cats.length) return {
			adaptabilityData: [],
			affectionData: [],
			originData: [],
			indoorData: [],
			lapData: [],
			lifeSpanData: []
		};

		const adaptabilityData = cats.slice(0, 10).map((cat) => ({
			name: cat.name,
			value: cat.adaptability,
		}));

		const affectionData = cats.slice(0, 10).map((cat) => ({
			name: cat.name,
			value: cat.affection_level,
		}));

		const originCounts: Record<string, number> = {};
		cats.forEach((cat) => {
			const origin = cat.origin || "Unknown";
			originCounts[origin] = (originCounts[origin] || 0) + 1;
		});
		
		const originData = Object.entries(originCounts)
			.map(([name, value]) => ({ name, value }))
			.sort((a, b) => b.value - a.value)
			.slice(0, 6);

		const indoorCount = cats.reduce((acc: {indoor?: number; outdoor?: number}, cat) => {
			if (cat.indoor === 1) {
				acc.indoor = (acc.indoor || 0) + 1;
			} else {
				acc.outdoor = (acc.outdoor || 0) + 1;
			}
			return acc;
		}, {});

		const indoorData = [
			{ name: "Indoor", value: indoorCount.indoor || 0 },
			{ name: "Outdoor", value: indoorCount.outdoor || 0 },
		];

		const lapCats = cats.filter((cat) => cat.lap === 1).length;
		const nonLapCats = cats.filter((cat) => cat.lap === 0 || cat.lap === undefined).length;
		
		const lapData = [
			{ name: "Lap Cat", value: lapCats },
			{ name: "Not Lap Cat", value: nonLapCats },
		];

		const lifeSpanData = cats.slice(0, 10).map((cat) => {
			const lifeSpanParts = cat.life_span.split('-')
				.map((part) => parseInt(part.trim()))
				.filter((num) => !isNaN(num));
				
			const averageLifeSpan = lifeSpanParts.length > 0 
				? lifeSpanParts.reduce((a, b) => a + b, 0) / lifeSpanParts.length
				: 0;
			
			return {
				name: cat.name,
				years: averageLifeSpan,
			};
		});

		return {
			adaptabilityData,
			affectionData,
			originData,
			indoorData,
			lapData,
			lifeSpanData
		};
	}, [cats]);
};