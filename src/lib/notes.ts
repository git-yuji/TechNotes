import { categories, type Category } from "@/data/categories";
import { getDb } from "@/lib/db";
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
