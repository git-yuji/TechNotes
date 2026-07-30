type PageLoadingProps = {
	label?: string;
};

export function PageLoading({ label = "ノートを読み込んでいます" }: PageLoadingProps) {
	return (
		<main className="min-h-screen" aria-busy="true" aria-live="polite">
			<header className="border-b border-slate-200 bg-white">
				<div className="mx-auto flex max-w-6xl items-center gap-3 px-5 py-5 sm:px-8">
					<div className="size-10 animate-pulse rounded-xl bg-slate-200" />
					<div className="h-5 w-28 animate-pulse rounded bg-slate-200" />
				</div>
			</header>

			<div className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
				<p className="sr-only">{label}</p>
				<div className="h-4 w-32 animate-pulse rounded bg-sky-100" />
				<div className="mt-4 h-10 w-52 animate-pulse rounded-lg bg-slate-200" />
				<div className="mt-8 grid gap-5 md:grid-cols-2">
					{Array.from({ length: 4 }, (_, index) => (
						<div
							key={index}
							className="h-52 animate-pulse rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
						>
							<div className="h-6 w-24 rounded-full bg-slate-100" />
							<div className="mt-6 h-6 w-4/5 rounded bg-slate-200" />
							<div className="mt-4 h-4 w-2/5 rounded bg-slate-100" />
						</div>
					))}
				</div>
			</div>
		</main>
	);
}
