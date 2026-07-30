"use server";

import { redirect } from "next/navigation";
import { categories, type Category } from "@/data/categories";
import { createNote } from "@/lib/notes";

export type CreateNoteErrors = Partial<Record<"title" | "category" | "content", string>>;

export type CreateNoteState = {
	errors: CreateNoteErrors;
	message?: string;
};

export const initialCreateNoteState: CreateNoteState = {
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

export async function createNoteAction(
	_previousState: CreateNoteState,
	formData: FormData,
): Promise<CreateNoteState> {
	const title = getString(formData, "title");
	const category = getString(formData, "category");
	const content = getString(formData, "content");
	const memo = getString(formData, "memo");
	const tags = normalizeTags(getString(formData, "tags"));
	const errors: CreateNoteErrors = {};

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
		return {
			errors,
			message: "入力内容を確認してください。",
		};
	}

	let noteId: number;

	try {
		noteId = await createNote({
			title,
			category: category as Category,
			tags,
			content,
			memo: memo || null,
		});
	} catch (error) {
		console.error("ノートの登録に失敗しました。", error);

		return {
			errors: {},
			message: "ノートを保存できませんでした。時間をおいて、もう一度お試しください。",
		};
	}

	redirect(`/notes/${noteId}`);
}
