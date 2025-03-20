// Redux State types
export interface RootState {
	auth: AuthState;
	cats: any;
	[key: string]: any;
}

// Auth state interface
export interface AuthState {
	isAuthenticated: boolean;
	user: User | null;
	loading: boolean;
	error: string | null;
	data: any;
	status: string;
	userInfo: {
		email: string;
		name: string;
		id: number | null;
		role: string;
	};
}

// User interface
export interface User {
	email: string;
	name: string;
	id: number;
	role: string;
}

// Authorization
export interface LoginCredentials {
	email: string;
	password: string;
}

export interface LoginResponse {
	success: boolean;
	user?: User;
	error?: string;
}

// Cat model interface
export interface CatBreed {
	weight: { imperial: string; metric: string };
	id: string;
	name: string;
	cfa_url?: string;
	vetstreet_url?: string;
	vcahospitals_url?: string;
	temperament: string;
	origin: string;
	country_codes: string;
	country_code: string;
	description: string;
	life_span: string;
	indoor: number;
	lap?: number;
	alt_names?: string;
	adaptability: number;
	affection_level: number;
	child_friendly: number;
	dog_friendly: number;
	energy_level: number;
	grooming: number;
	health_issues: number;
	intelligence: number;
	shedding_level: number;
	social_needs: number;
	stranger_friendly: number;
	vocalisation: number;
	experimental: number;
	hairless: number;
	natural: number;
	rare: number;
	rex: number;
	suppressed_tail: number;
	short_legs: number;
	wikipedia_url?: string;
	hypoallergenic: number;
	reference_image_id?: string;
	image?: {
		id: string;
		width: number;
		height: number;
		url: string;
	};
}