import Link from "next/link";

export default function NotFound() {
	return (
		<main className="grid min-h-screen place-items-center px-5 py-12">
			<section className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-7 text-center shadow-sm sm:p-10">
				<p className="text-sm font-bold tracking-wide text-sky-700">404</p>
				<h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
					ページが見つかりません
				</h1>
				<p className="mt-4 text-sm leading-7 text-slate-600">
					URLが正しいか確認するか、ノート一覧から目的のページを探してください。
				</p>
				<Link
					href="/"
					className="mt-7 inline-flex min-h-11 items-center justify-center rounded-xl bg-sky-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
				>
					ノート一覧へ戻る
				</Link>
			</section>
		</main>
	);
}
