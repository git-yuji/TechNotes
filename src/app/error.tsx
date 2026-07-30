"use client";

import Link from "next/link";
import { useEffect } from "react";

type ErrorPageProps = {
	error: Error & { digest?: string };
	reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorPageProps) {
	useEffect(() => {
		console.error("ページの表示中にエラーが発生しました", error);
	}, [error]);

	return (
		<main className="grid min-h-screen place-items-center px-5 py-12">
			<section className="w-full max-w-lg rounded-2xl border border-red-200 bg-white p-7 text-center shadow-sm sm:p-10">
				<p className="text-sm font-bold tracking-wide text-red-700">ERROR</p>
				<h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
					ページを表示できませんでした
				</h1>
				<p className="mt-4 text-sm leading-7 text-slate-600">
					一時的な問題が発生しています。少し時間を置いてから、もう一度お試しください。
				</p>
				<div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
					<button
						type="button"
						onClick={reset}
						className="inline-flex min-h-11 items-center justify-center rounded-xl bg-sky-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
					>
						もう一度試す
					</button>
					<Link
						href="/"
						className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
					>
						ノート一覧へ戻る
					</Link>
				</div>
			</section>
		</main>
	);
}
