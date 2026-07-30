import { categories, type Category } from "@/data/categories";

export type NoteFormErrors = Partial<Record<"title" | "category" | "content", string>>;

export type NoteActionState = {
	errors: NoteFormErrors;
	message?: string;
};

export type ValidatedNoteInput = {
	title: string;
	category: Category;
	tags: string[];
	content: string;
	memo: string | null;
};

export const initialNoteActionState: NoteActionState = {
	errors: {},
};

function getString(formData: FormData, name: string) {
	const value = formData.get(name);
	return typeof value === "string" ? value.trim() : "";
}

function normalizeTags(value: string) {
	return [
		...new Set(
			value
				.split(/[,、\n]/)
				.map((tag) => tag.trim())
				.filter(Boolean),
		),
	];
}

export function validateNoteForm(formData: FormData):
	| { input: ValidatedNoteInput; errors: null }
	| { input: null; errors: NoteFormErrors } {
	const title = getString(formData, "title");
	const category = getString(formData, "category");
	const content = getString(formData, "content");
	const errors: NoteFormErrors = {};

	if (!title) {
		errors.title = "タイトルを入力してください。";
	}

	if (!categories.includes(category as Category)) {
		errors.category = "カテゴリを選択してください。";
	}

	if (!content) {
		errors.content = "内容を入力してください。";
	}

	if (Object.keys(errors).length > 0) {
		return { input: null, errors };
	}

	const memo = getString(formData, "memo");

	return {
		input: {
			title,
			category: category as Category,
			tags: normalizeTags(getString(formData, "tags")),
			content,
			memo: memo || null,
		},
		errors: null,
	};
}
