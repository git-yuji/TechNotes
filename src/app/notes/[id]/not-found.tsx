import Link from "next/link";

export default function NoteNotFound() {
	return (
		<main className="grid min-h-screen place-items-center px-5">
			<div className="max-w-md text-center">
				<p className="text-sm font-semibold text-sky-700">404</p>
				<h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">ノートが見つかりません</h1>
				<p className="mt-4 leading-7 text-slate-600">
					指定されたノートは存在しないか、URLが変更された可能性があります。
				</p>
				<Link
					href="/"
					className="mt-7 inline-flex rounded-lg bg-sky-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-4"
				>
					ノート一覧へ戻る
				</Link>
			</div>
		</main>
	);
}
