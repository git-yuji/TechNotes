export type Note = {
	id: number;
	title: string;
	category: string;
	tags: string[];
	content: string;
	memo: string | null;
	createdAt: string;
	updatedAt: string;
};
