import { categories, type Category } from "@/data/categories";
import { generatedNotes } from "@/generated/notes";
import type { Note } from "@/types/note";

export type NoteFilters = {
	keyword?: string;
	category?: Category;
	tag?: string;
};

function normalize(value: string) {
	return value.toLocaleLowerCase("ja-JP");
}

export async function getNotes(filters: NoteFilters = {}): Promise<Note[]> {
	const keyword = filters.keyword ? normalize(filters.keyword) : undefined;

	return generatedNotes
		.filter((note) => {
			if (
				keyword &&
				![note.title, note.content, note.memo ?? ""].some((value) =>
					normalize(value).includes(keyword),
				)
			) {
				return false;
			}

			if (filters.category && note.category !== filters.category) {
				return false;
			}

			if (filters.tag && !note.tags.includes(filters.tag)) {
				return false;
			}

			return true;
		})
		.sort(
			(left, right) =>
				right.updatedAt.localeCompare(left.updatedAt) ||
				left.title.localeCompare(right.title, "ja"),
		);
}

export async function getAvailableTags(): Promise<string[]> {
	return [...new Set(generatedNotes.flatMap((note) => note.tags))].sort((left, right) =>
		left.localeCompare(right, "ja"),
	);
}

export async function getNoteById(id: string): Promise<Note | undefined> {
	return generatedNotes.find((note) => note.id === id);
}

export function getNoteIds() {
	return generatedNotes.map((note) => note.id);
}

export function isCategory(value: string): value is Category {
	return categories.includes(value as Category);
}
