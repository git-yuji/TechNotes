import type { MarkdownHeading } from "@/lib/markdown-headings";

type TableOfContentsProps = {
	headings: MarkdownHeading[];
};

export function TableOfContents({ headings }: TableOfContentsProps) {
	if (headings.length === 0) {
		return null;
	}

	return (
		<nav
			className="rounded-xl border border-sky-100 bg-sky-50/70 p-5 sm:p-6"
			aria-labelledby="note-table-of-contents-heading"
		>
			<p id="note-table-of-contents-heading" className="text-sm font-bold text-slate-900">
				目次
			</p>
			<ul className="mt-3 space-y-1.5 text-sm leading-6">
				{headings.map((heading) => (
					<li
						key={heading.id}
						className={heading.level === 3 ? "ml-5 border-l border-sky-200 pl-3" : undefined}
					>
						<a
							href={`#${heading.id}`}
							className="inline-block rounded text-slate-600 transition hover:text-sky-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 focus-visible:ring-offset-sky-50"
						>
							{heading.text}
						</a>
					</li>
				))}
			</ul>
		</nav>
	);
}
