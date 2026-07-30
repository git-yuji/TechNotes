import { categories, type Category } from "@/data/categories";
import { getDb } from "@/lib/db";
import type { ValidatedNoteInput } from "@/lib/note-form";
import type { Note } from "@/types/note";

type NoteRow = {
	id: number;
	title: string;
	category: string;
	content: string;
	memo: string | null;
	createdAt: string;
	updatedAt: string;
};

type TagRow = {
	noteId: number;
	name: string;
};

type ReadRow = NoteRow | TagRow;

const noteSelect = `
	SELECT
		n.id,
		n.title,
		c.name AS category,
		n.content,
		n.memo,
		n.created_at AS createdAt,
		n.updated_at AS updatedAt
	FROM notes AS n
	INNER JOIN categories AS c ON c.id = n.category_id
`;

function toCategory(value: string): Category {
	if (categories.includes(value as Category)) {
		return value as Category;
	}

	throw new Error(`未対応のカテゴリです: ${value}`);
}

function toDate(value: string) {
	return value.slice(0, 10);
}

function toNote(row: NoteRow, tags: string[]): Note {
	return {
		...row,
		category: toCategory(row.category),
		tags,
		createdAt: toDate(row.createdAt),
		updatedAt: toDate(row.updatedAt),
	};
}

export async function getNotes(): Promise<Note[]> {
	const db = getDb();
	const [notesResult, tagsResult] = await db.batch<ReadRow>([
		db.prepare(`${noteSelect} ORDER BY datetime(n.updated_at) DESC, n.id DESC`),
		db.prepare(`
			SELECT nt.note_id AS noteId, t.name
			FROM note_tags AS nt
			INNER JOIN tags AS t ON t.id = nt.tag_id
			ORDER BY t.name
		`),
	]);

	const tagsByNoteId = new Map<number, string[]>();

	for (const tag of tagsResult.results as TagRow[]) {
		const tags = tagsByNoteId.get(tag.noteId) ?? [];
		tags.push(tag.name);
		tagsByNoteId.set(tag.noteId, tags);
	}

	return (notesResult.results as NoteRow[]).map((note) => toNote(note, tagsByNoteId.get(note.id) ?? []));
}

export async function getNoteById(id: number): Promise<Note | undefined> {
	if (!Number.isInteger(id) || id < 1) {
		return undefined;
	}

	const db = getDb();
	const [noteResult, tagsResult] = await db.batch<ReadRow>([
		db.prepare(`${noteSelect} WHERE n.id = ?`).bind(id),
		db
			.prepare(`
				SELECT nt.note_id AS noteId, t.name
				FROM note_tags AS nt
				INNER JOIN tags AS t ON t.id = nt.tag_id
				WHERE nt.note_id = ?
				ORDER BY t.name
			`)
			.bind(id),
	]);
	const note = (noteResult.results as NoteRow[])[0];

	if (!note) {
		return undefined;
	}

	return toNote(
		note,
		(tagsResult.results as TagRow[]).map((tag) => tag.name),
	);
}

export async function createNote(input: ValidatedNoteInput): Promise<number> {
	const db = getDb();
	const category = await db
		.prepare("SELECT id FROM categories WHERE name = ?")
		.bind(input.category)
		.first<{ id: number }>();

	if (!category) {
		throw new Error("指定されたカテゴリがデータベースに存在しません。");
	}

	const insertedNote = await db
		.prepare(`
			INSERT INTO notes (title, category_id, content, memo)
			VALUES (?, ?, ?, ?)
			RETURNING id
		`)
		.bind(input.title, category.id, input.content, input.memo)
		.first<{ id: number }>();

	if (!insertedNote) {
		throw new Error("ノートIDを取得できませんでした。");
	}

	if (input.tags.length === 0) {
		return insertedNote.id;
	}

	try {
		const statements = input.tags.flatMap((tag) => [
			db.prepare("INSERT OR IGNORE INTO tags (name) VALUES (?)").bind(tag),
			db
				.prepare(`
					INSERT INTO note_tags (note_id, tag_id)
					SELECT ?, id FROM tags WHERE name = ?
				`)
				.bind(insertedNote.id, tag),
		]);

		await db.batch(statements);
	} catch (error) {
		await db.prepare("DELETE FROM notes WHERE id = ?").bind(insertedNote.id).run();
		throw error;
	}

	return insertedNote.id;
}

export async function updateNote(id: number, input: ValidatedNoteInput): Promise<boolean> {
	if (!Number.isInteger(id) || id < 1) {
		return false;
	}

	const db = getDb();
	const [categoryResult, noteResult] = await db.batch<{ id: number }>([
		db.prepare("SELECT id FROM categories WHERE name = ?").bind(input.category),
		db.prepare("SELECT id FROM notes WHERE id = ?").bind(id),
	]);
	const category = categoryResult.results[0];
	const note = noteResult.results[0];

	if (!category) {
		throw new Error("指定されたカテゴリがデータベースに存在しません。");
	}

	if (!note) {
		return false;
	}

	if (input.tags.length > 0) {
		await db.batch(input.tags.map((tag) => db.prepare("INSERT OR IGNORE INTO tags (name) VALUES (?)").bind(tag)));
	}

	await db.batch([
		db
			.prepare(`
				UPDATE notes
				SET title = ?, category_id = ?, content = ?, memo = ?, updated_at = CURRENT_TIMESTAMP
				WHERE id = ?
			`)
			.bind(input.title, category.id, input.content, input.memo, id),
		db.prepare("DELETE FROM note_tags WHERE note_id = ?").bind(id),
		...input.tags.map((tag) =>
			db
				.prepare(`
					INSERT INTO note_tags (note_id, tag_id)
					SELECT ?, id FROM tags WHERE name = ?
				`)
				.bind(id, tag),
		),
	]);

	return true;
}

export async function deleteNote(id: number): Promise<boolean> {
	if (!Number.isInteger(id) || id < 1) {
		return false;
	}

	const deletedNote = await getDb()
		.prepare("DELETE FROM notes WHERE id = ? RETURNING id")
		.bind(id)
		.first<{ id: number }>();

	return Boolean(deletedNote);
}
