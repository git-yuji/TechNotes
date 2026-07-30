"use client";

import { useActionState, type FormEvent } from "react";
import {
	deleteNoteAction,
	initialDeleteNoteState,
} from "@/app/admin/notes/[id]/actions";

type DeleteNoteButtonProps = {
	noteId: number;
	noteTitle: string;
};

export function DeleteNoteButton({ noteId, noteTitle }: DeleteNoteButtonProps) {
	const [state, formAction, isPending] = useActionState(
		deleteNoteAction.bind(null, noteId),
		initialDeleteNoteState,
	);

	function handleSubmit(event: FormEvent<HTMLFormElement>) {
		const confirmed = window.confirm(
			`「${noteTitle}」を削除します。\nこの操作は取り消せません。`,
		);

		if (!confirmed) {
			event.preventDefault();
		}
	}

	return (
		<div className="min-w-0">
			<form action={formAction} onSubmit={handleSubmit}>
				<button
					type="submit"
					disabled={isPending}
					className="inline-flex min-h-10 w-full items-center justify-center rounded-lg border border-red-300 bg-white px-3 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-400 sm:px-4"
				>
					{isPending ? "削除中..." : "削除"}
				</button>
			</form>

			{state.message && (
				<p role="alert" className="mt-2 max-w-sm text-sm font-medium text-red-700">
					{state.message}
				</p>
			)}
		</div>
	);
}
