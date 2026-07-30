import Link from "next/link";
import type { Note } from "@/types/note";

type NoteCardProps = {
	note: Note;
};

const dateFormatter = new Intl.DateTimeFormat("ja-JP", {
	year: "numeric",
	month: "long",
	day: "numeric",
});

export function NoteCard({ note }: NoteCardProps) {
	return (
		<article className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-sky-300 hover:shadow-md sm:p-6">
			<div className="mb-5">
				<span className="inline-flex rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">
					{note.category}
				</span>
			</div>

			<h2 className="text-lg font-bold leading-7 tracking-tight text-slate-900 sm:text-xl">
				<Link
					href={`/notes/${note.id}`}
					className="outline-none transition-colors hover:text-sky-700 focus-visible:rounded focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-4"
				>
					{note.title}
				</Link>
			</h2>

			<ul className="mt-5 flex flex-wrap gap-2" aria-label="タグ">
				{note.tags.map((tag) => (
					<li key={tag} className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
						#{tag}
					</li>
				))}
			</ul>

			<div className="mt-auto flex items-end justify-between gap-4 border-t border-slate-100 pt-5">
				<p className="text-xs text-slate-500">
					<span className="block font-medium text-slate-400">更新日</span>
					<time dateTime={note.updatedAt}>{dateFormatter.format(new Date(`${note.updatedAt}T00:00:00+09:00`))}</time>
				</p>
				<Link
					href={`/notes/${note.id}`}
					className="inline-flex items-center gap-1 text-sm font-semibold text-sky-700 outline-none transition hover:text-sky-900 focus-visible:rounded focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-4"
					aria-label={`${note.title}の詳細を見る`}
				>
					詳細を見る
					<span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
						→
					</span>
				</Link>
			</div>
		</article>
	);
}
