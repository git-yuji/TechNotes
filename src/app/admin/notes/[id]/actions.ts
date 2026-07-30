"use server";

import { redirect } from "next/navigation";
import { deleteNote } from "@/lib/notes";

export type DeleteNoteState = {
	message?: string;
};

export const initialDeleteNoteState: DeleteNoteState = {};

export async function deleteNoteAction(
	noteId: number,
	_previousState: DeleteNoteState,
	_formData: FormData,
): Promise<DeleteNoteState> {
	if (!Number.isInteger(noteId) || noteId < 1) {
		return {
			message: "削除対象のノートが正しくありません。",
		};
	}

	try {
		const deleted = await deleteNote(noteId);

		if (!deleted) {
			return {
				message: "削除対象のノートが見つかりません。",
			};
		}
	} catch (error) {
		console.error("ノートの削除に失敗しました。", error);

		return {
			message: "ノートを削除できませんでした。時間をおいて、もう一度お試しください。",
		};
	}

	redirect("/admin");
}
