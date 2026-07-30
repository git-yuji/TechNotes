import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MarkdownContent } from "@/components/markdown-content";
import { getNoteById } from "@/lib/notes";

type NoteDetailPageProps = {
	params: Promise<{ id: string }>;
};

export const dynamic = "force-dynamic";

const dateFormatter = new Intl.DateTimeFormat("ja-JP", {
	year: "numeric",
	month: "long",
	day: "numeric",
});

function formatDate(date: string) {
	return dateFormatter.format(new Date(`${date}T00:00:00+09:00`));
}

export async function generateMetadata({ params }: NoteDetailPageProps): Promise<Metadata> {
	const { id } = await params;
	const note = await getNoteById(Number(id));

	if (!note) {
		return {
			title: "ノートが見つかりません | Tech Notes",
		};
	}

	return {
		title: `${note.title} | Tech Notes`,
		description: `${note.category}に関する技術ノート`,
	};
}

export default async function NoteDetailPage({ params }: NoteDetailPageProps) {
	const { id } = await params;
	const noteId = Number(id);

	if (!Number.isInteger(noteId)) {
		notFound();
	}

	const note = await getNoteById(noteId);

	if (!note) {
		notFound();
	}

	return (
		<main className="min-h-screen">
			<header className="border-b border-slate-200 bg-white">
				<div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-5 py-5 sm:px-8">
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
						href={`/notes/${note.id}/edit`}
						className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-sky-300 hover:text-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
					>
						編集する
					</Link>
				</div>
			</header>

			<div className="mx-auto max-w-4xl px-5 py-8 sm:px-8 sm:py-12">
				<Link
					href="/"
					className="inline-flex items-center gap-2 text-sm font-semibold text-sky-700 transition hover:text-sky-900 focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-4"
				>
					<span aria-hidden="true">←</span>
					ノート一覧へ戻る
				</Link>

				<article className="mt-7">
					<header className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
						<span className="inline-flex rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">
							{note.category}
						</span>
						<h1 className="mt-5 text-3xl font-bold leading-tight tracking-tight text-slate-950 sm:text-4xl">
							{note.title}
						</h1>

						<ul className="mt-6 flex flex-wrap gap-2" aria-label="タグ">
							{note.tags.map((tag) => (
								<li key={tag} className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
									#{tag}
								</li>
							))}
						</ul>

						<dl className="mt-7 flex flex-wrap gap-x-8 gap-y-3 border-t border-slate-100 pt-5 text-sm">
							<div>
								<dt className="text-xs font-medium text-slate-400">作成日</dt>
								<dd className="mt-1 text-slate-600">
									<time dateTime={note.createdAt}>{formatDate(note.createdAt)}</time>
								</dd>
							</div>
							<div>
								<dt className="text-xs font-medium text-slate-400">更新日</dt>
								<dd className="mt-1 text-slate-600">
									<time dateTime={note.updatedAt}>{formatDate(note.updatedAt)}</time>
								</dd>
							</div>
						</dl>
					</header>

					<section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8" aria-label="本文">
						<MarkdownContent content={note.content} />
					</section>

					{note.memo && (
						<aside className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-6 sm:p-7" aria-labelledby="memo-heading">
							<h2 id="memo-heading" className="text-sm font-bold text-amber-950">
								メモ
							</h2>
							<p className="mt-2 text-sm leading-7 text-amber-900">{note.memo}</p>
						</aside>
					)}
				</article>
			</div>
		</main>
	);
}
