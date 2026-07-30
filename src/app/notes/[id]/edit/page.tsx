import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { NoteForm, type NoteFormValues } from "@/components/note-form";
import { getNoteById } from "@/lib/notes";

type EditNotePageProps = {
	params: Promise<{ id: string }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: EditNotePageProps): Promise<Metadata> {
	const { id } = await params;
	const note = await getNoteById(Number(id));

	if (!note) {
		return {
			title: "ノートが見つかりません | Tech Notes",
		};
	}

	return {
		title: `${note.title}を編集 | Tech Notes`,
		description: `${note.title}の編集画面`,
	};
}

export default async function EditNotePage({ params }: EditNotePageProps) {
	const { id } = await params;
	const noteId = Number(id);

	if (!Number.isInteger(noteId)) {
		notFound();
	}

	const note = await getNoteById(noteId);

	if (!note) {
		notFound();
	}

	const initialValues: NoteFormValues = {
		title: note.title,
		category: note.category,
		tags: note.tags.join(", "),
		content: note.content,
		memo: note.memo ?? "",
	};

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
					href={`/notes/${note.id}`}
					className="inline-flex items-center gap-2 text-sm font-semibold text-sky-700 transition hover:text-sky-900 focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-4"
				>
					<span aria-hidden="true">←</span>
					ノート詳細へ戻る
				</Link>

				<div className="mt-7">
					<p className="text-sm font-semibold text-sky-700">EDIT NOTE</p>
					<h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">ノートを編集</h1>
					<p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">
						登録済みの内容を確認し、必要な項目を編集します。
					</p>
				</div>

				<section className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8" aria-label="ノート編集フォーム">
					<NoteForm mode="edit" initialValues={initialValues} cancelHref={`/notes/${note.id}`} />
				</section>
			</div>
		</main>
	);
}
