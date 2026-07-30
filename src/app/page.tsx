import Link from "next/link";
import { NoteCard } from "@/components/note-card";
import { getNotes } from "@/lib/notes";

export const dynamic = "force-dynamic";

export default async function Home() {
	const notes = await getNotes();

	return (
		<main className="min-h-screen">
			<header className="border-b border-slate-200 bg-white">
				<div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-5 sm:px-8">
					<div className="flex items-center gap-3">
						<div
							className="grid size-10 place-items-center rounded-xl bg-sky-700 text-sm font-bold tracking-tight text-white shadow-sm"
							aria-hidden="true"
						>
							TN
						</div>
						<div>
							<p className="text-lg font-bold tracking-tight text-slate-900">Tech Notes</p>
							<p className="hidden text-xs text-slate-500 sm:block">技術知識を記録し、必要なときに再利用する</p>
						</div>
					</div>
					<Link
						href="/admin"
						className="inline-flex min-h-10 items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-sky-300 hover:text-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
					>
						管理画面
					</Link>
				</div>
			</header>

			<div className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
				<section aria-labelledby="notes-heading">
					<div className="mb-7 flex items-end justify-between gap-6">
						<div>
							<p className="mb-2 text-sm font-semibold text-sky-700">KNOWLEDGE BASE</p>
							<h1 id="notes-heading" className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
								ノート一覧
							</h1>
							<p className="mt-3 max-w-xl text-sm leading-6 text-slate-600 sm:text-base">
								学習内容や設定手順、トラブル対応の記録をまとめています。
							</p>
						</div>
						<p className="shrink-0 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm">
							{notes.length}件
						</p>
					</div>

					{notes.length > 0 ? (
						<div className="grid gap-5 md:grid-cols-2">
							{notes.map((note) => (
								<NoteCard key={note.id} note={note} />
							))}
						</div>
					) : (
						<div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
							<h2 className="text-lg font-bold text-slate-900">ノートはまだありません</h2>
							<p className="mt-2 text-sm text-slate-600">最初の技術ノートを作成して、知識を記録しましょう。</p>
							<Link
								href="/admin/notes/new"
								className="mt-6 inline-flex min-h-10 items-center justify-center rounded-lg bg-sky-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
							>
								ノートを作成する
							</Link>
						</div>
					)}
				</section>
			</div>
		</main>
	);
}
