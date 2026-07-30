import type { Metadata } from "next";
import Link from "next/link";
import { createNoteAction } from "@/app/admin/notes/new/actions";
import { NoteForm } from "@/components/note-form";

export const metadata: Metadata = {
	title: "ノートを新規作成 | Tech Notes",
	description: "Tech Notesの管理画面から新しい技術ノートを作成します",
};

export default function NewNotePage() {
	return (
		<main className="min-h-screen">
			<header className="border-b border-slate-200 bg-white">
				<div className="mx-auto flex max-w-4xl items-center px-5 py-5 sm:px-8">
					<Link
						href="/"
						className="flex items-center gap-3 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-4"
					>
						<span
							className="grid size-10 place-items-center rounded-xl bg-sky-700 text-sm font-bold tracking-tight text-white shadow-sm"
							aria-hidden="true"
						>
							TN
						</span>
						<span className="font-bold tracking-tight text-slate-900">Tech Notes</span>
					</Link>
				</div>
			</header>

			<div className="mx-auto max-w-4xl px-5 py-8 sm:px-8 sm:py-12">
				<Link
					href="/admin"
					className="inline-flex items-center gap-2 text-sm font-semibold text-sky-700 transition hover:text-sky-900 focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-4"
				>
					<span aria-hidden="true">←</span>
					管理画面へ戻る
				</Link>

				<div className="mt-7">
					<p className="text-sm font-semibold text-sky-700">NEW NOTE</p>
					<h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">ノートを新規作成</h1>
					<p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">
						学習内容や設定手順を、あとから再利用できる形で記録します。
					</p>
				</div>

				<section className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8" aria-label="ノート入力フォーム">
					<NoteForm action={createNoteAction} cancelHref="/admin" />
				</section>
			</div>
		</main>
	);
}
