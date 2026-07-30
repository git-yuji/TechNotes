import type { Metadata } from "next";
import Link from "next/link";
import { DeleteNoteButton } from "@/components/delete-note-button";
import { getNotes } from "@/lib/notes";

export const metadata: Metadata = {
	title: "管理画面 | Tech Notes",
	description: "Tech Notesのノートを管理します",
};

export const dynamic = "force-dynamic";

export default async function AdminPage() {
	const notes = await getNotes();

	return (
		<main className="min-h-screen">
			<header className="border-b border-slate-200 bg-white">
				<div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-5 sm:px-8">
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
					<Link
						href="/admin/notes/new"
						className="inline-flex min-h-10 items-center justify-center rounded-lg bg-sky-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
					>
						新しいノート
					</Link>
				</div>
			</header>

			<div className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-14">
				<div>
					<p className="text-sm font-semibold text-sky-700">ADMIN</p>
					<h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">ノート管理</h1>
					<p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">
						ノートの新規作成や登録内容の確認、編集を行います。
					</p>
				</div>

				<section className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm" aria-labelledby="admin-notes-heading">
					<div className="flex items-center justify-between gap-4 border-b border-slate-200 px-5 py-4 sm:px-6">
						<h2 id="admin-notes-heading" className="font-bold text-slate-900">
							登録済みノート
						</h2>
						<p className="text-sm font-semibold text-slate-500">{notes.length}件</p>
					</div>

					{notes.length > 0 ? (
						<ul className="divide-y divide-slate-100">
							{notes.map((note) => (
								<li key={note.id} className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
									<div className="min-w-0">
										<p className="text-xs font-semibold text-sky-700">{note.category}</p>
										<h3 className="mt-1 truncate font-bold text-slate-900">{note.title}</h3>
									</div>
									<div className="flex shrink-0 gap-3">
										<Link
											href={`/notes/${note.id}`}
											className="inline-flex min-h-10 items-center justify-center rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
										>
											表示
										</Link>
										<Link
											href={`/admin/notes/${note.id}/edit`}
											className="inline-flex min-h-10 items-center justify-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
										>
											編集
										</Link>
										<DeleteNoteButton noteId={note.id} noteTitle={note.title} />
									</div>
								</li>
							))}
						</ul>
					) : (
						<div className="px-6 py-12 text-center">
							<p className="font-bold text-slate-900">ノートはまだありません</p>
							<p className="mt-2 text-sm text-slate-600">最初のノートを作成してください。</p>
						</div>
					)}
				</section>
			</div>
		</main>
	);
}
