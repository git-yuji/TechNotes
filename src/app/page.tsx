import Link from "next/link";
import { NoteCard } from "@/components/note-card";
import { categories, type Category } from "@/data/categories";
import { getAvailableTags, getNotes } from "@/lib/notes";

export const dynamic = "force-dynamic";

type HomeProps = {
	searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function getSearchParam(value: string | string[] | undefined) {
	return typeof value === "string" ? value.trim() : "";
}

export default async function Home({ searchParams }: HomeProps) {
	const params = await searchParams;
	const keyword = getSearchParam(params.q).slice(0, 100);
	const categoryParam = getSearchParam(params.category);
	const category = categories.includes(categoryParam as Category)
		? (categoryParam as Category)
		: undefined;
	const tag = getSearchParam(params.tag);
	const availableTags = await getAvailableTags();
	const notes = await getNotes({
		keyword: keyword || undefined,
		category,
		tag: tag || undefined,
	});
	const hasFilters = Boolean(keyword || category || tag);

	return (
		<main className="min-h-screen">
			<header className="border-b border-slate-200 bg-white">
				<div className="mx-auto flex max-w-6xl items-center gap-4 px-5 py-5 sm:px-8">
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

					<details className="group mb-7" open={hasFilters}>
						<summary className="flex w-fit cursor-pointer list-none items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-sky-300 hover:bg-sky-50 hover:text-sky-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 [&::-webkit-details-marker]:hidden">
							<svg
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								className="size-4"
								aria-hidden="true"
							>
								<circle cx="11" cy="11" r="7" />
								<path d="m20 20-3.5-3.5" />
							</svg>
							<span>{hasFilters ? "検索条件を変更" : "ノートを検索・絞り込み"}</span>
							{hasFilters && (
								<span className="rounded-full bg-sky-100 px-2 py-0.5 text-xs font-bold text-sky-800">
									絞り込み中
								</span>
							)}
							<svg
								viewBox="0 0 20 20"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								className="size-4 transition-transform group-open:rotate-180"
								aria-hidden="true"
							>
								<path d="m5 7.5 5 5 5-5" />
							</svg>
						</summary>

						<form
							method="get"
							className="mt-4 grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)_auto] md:items-end"
							aria-label="ノートを検索・絞り込み"
						>
							<div>
								<label htmlFor="q" className="block text-sm font-bold text-slate-800">
									キーワード
								</label>
								<input
									id="q"
									name="q"
									type="search"
									defaultValue={keyword}
									maxLength={100}
									placeholder="タイトル、本文、メモを検索"
									className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
								/>
							</div>

							<div>
								<label htmlFor="category" className="block text-sm font-bold text-slate-800">
									カテゴリ
								</label>
								<select
									id="category"
									name="category"
									defaultValue={category ?? ""}
									className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
								>
									<option value="">すべて</option>
									{categories.map((item) => (
										<option key={item} value={item}>
											{item}
										</option>
									))}
								</select>
							</div>

							<div>
								<label htmlFor="tag" className="block text-sm font-bold text-slate-800">
									タグ
								</label>
								<select
									id="tag"
									name="tag"
									defaultValue={tag}
									className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
								>
									<option value="">すべて</option>
									{availableTags.map((item) => (
										<option key={item} value={item}>
											{item}
										</option>
									))}
								</select>
							</div>

							<div className="flex gap-3">
								{hasFilters && (
									<Link
										href="/"
										className="inline-flex min-h-10 items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
									>
										解除
									</Link>
								)}
								<button
									type="submit"
									className="inline-flex min-h-10 flex-1 items-center justify-center rounded-lg bg-sky-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
								>
									検索
								</button>
							</div>
						</form>
					</details>

					{notes.length > 0 ? (
						<div className="grid gap-5 md:grid-cols-2">
							{notes.map((note) => (
								<NoteCard key={note.id} note={note} />
							))}
						</div>
					) : (
						<div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
							<h2 className="text-lg font-bold text-slate-900">
								{hasFilters ? "条件に一致するノートがありません" : "ノートはまだありません"}
							</h2>
							<p className="mt-2 text-sm text-slate-600">
								{hasFilters
									? "検索条件を変更するか、条件を解除してもう一度お試しください。"
									: "最初の技術ノートを作成して、知識を記録しましょう。"}
							</p>
							{hasFilters ? (
								<Link
									href="/"
									className="mt-6 inline-flex min-h-10 items-center justify-center rounded-lg bg-sky-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
								>
									条件を解除する
								</Link>
							) : (
								<a
									href="https://github.com/git-yuji/TechNotes/tree/main/content/notes"
									target="_blank"
									rel="noreferrer"
									className="mt-6 inline-flex min-h-10 items-center justify-center rounded-lg bg-sky-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
								>
									GitHubでノートを追加する
								</a>
							)}
						</div>
					)}
				</section>
			</div>
		</main>
	);
}
