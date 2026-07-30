"use server";

import { redirect } from "next/navigation";
import { type NoteActionState, validateNoteForm } from "@/lib/note-form";
import { updateNote } from "@/lib/notes";

export async function updateNoteAction(
	noteId: number,
	_previousState: NoteActionState,
	formData: FormData,
): Promise<NoteActionState> {
	if (!Number.isInteger(noteId) || noteId < 1) {
		return {
			errors: {},
			message: "更新対象のノートが正しくありません。",
		};
	}

	const validation = validateNoteForm(formData);

	if (validation.errors) {
		return {
			errors: validation.errors,
			message: "入力内容を確認してください。",
		};
	}

	try {
		const updated = await updateNote(noteId, validation.input);

		if (!updated) {
			return {
				errors: {},
				message: "更新対象のノートが見つかりません。",
			};
		}
	} catch (error) {
		console.error("ノートの更新に失敗しました。", error);

		return {
			errors: {},
			message: "ノートを更新できませんでした。時間をおいて、もう一度お試しください。",
		};
	}

	redirect(`/notes/${noteId}`);
}
