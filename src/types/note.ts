import type { Category } from "@/data/categories";

export type Note = {
	id: string;
	title: string;
	category: Category;
	tags: string[];
	content: string;
	memo: string | null;
	createdAt: string;
	updatedAt: string;
	sourceFile: string;
};
