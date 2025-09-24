export type Category = {
	id: number;
	name: string;
	createdAt: Date;
};

export type CategoryQuery = {
	categories: Category[];
};
