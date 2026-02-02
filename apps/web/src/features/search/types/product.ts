export interface SearchProduct {
	id: string;
	name: string;
	price: number;
	image?: string | null;
	url?: string | null;
	category: {
		name: string;
	};
}
