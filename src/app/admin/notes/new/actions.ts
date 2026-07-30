"use server";

import { redirect } from "next/navigation";
import { type NoteActionState, validateNoteForm } from "@/lib/note-form";
import { createNote } from "@/lib/notes";

export async function createNoteAction(
	_previousState: NoteActionState,
	formData: FormData,
): Promise<NoteActionState> {
	const validation = validateNoteForm(formData);

	if (validation.errors) {
		return {
			errors: validation.errors,
			message: "入力内容を確認してください。",
		};
	}

	let noteId: number;

	try {
		noteId = await createNote(validation.input);
	} catch (error) {
		console.error("ノートの登録に失敗しました。", error);

		return {
			errors: {},
			message: "ノートを保存できませんでした。時間をおいて、もう一度お試しください。",
		};
	}

	redirect(`/notes/${noteId}`);
}
