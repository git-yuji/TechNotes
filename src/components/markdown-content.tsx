import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type MarkdownContentProps = {
	content: string;
};

export function MarkdownContent({ content }: MarkdownContentProps) {
	return (
		<div className="min-w-0 break-words text-[15px] leading-8 text-slate-700 sm:text-base">
			<ReactMarkdown
				remarkPlugins={[remarkGfm]}
				components={{
					h1: ({ children }) => (
						<h1 className="mb-5 mt-10 border-b border-slate-200 pb-3 text-2xl font-bold tracking-tight text-slate-950 first:mt-0 sm:text-3xl">
							{children}
						</h1>
					),
					h2: ({ children }) => (
						<h2 className="mb-4 mt-10 border-b border-slate-200 pb-3 text-xl font-bold tracking-tight text-slate-950 first:mt-0 sm:text-2xl">
							{children}
						</h2>
					),
					h3: ({ children }) => <h3 className="mb-3 mt-8 text-lg font-bold text-slate-900">{children}</h3>,
					p: ({ children }) => <p className="my-4">{children}</p>,
					strong: ({ children }) => <strong className="font-bold text-slate-950">{children}</strong>,
					ul: ({ children }) => <ul className="my-4 list-disc space-y-1 pl-6 marker:text-sky-600">{children}</ul>,
					ol: ({ children }) => <ol className="my-4 list-decimal space-y-1 pl-6 marker:font-semibold marker:text-sky-700">{children}</ol>,
					a: ({ href, children }) => (
						<a
							href={href}
							className="font-medium text-sky-700 underline decoration-sky-300 underline-offset-4 hover:text-sky-900"
						>
							{children}
						</a>
					),
					blockquote: ({ children }) => (
						<blockquote className="my-6 rounded-r-lg border-l-4 border-amber-400 bg-amber-50 px-5 py-3 text-amber-950">
							{children}
						</blockquote>
					),
					code: ({ className, children }) =>
						className ? (
							<code className={`${className} block min-w-max`}>{children}</code>
						) : (
							<code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[0.9em] font-medium text-slate-800">
								{children}
							</code>
						),
					pre: ({ children }) => (
						<pre className="my-6 max-w-full overflow-x-auto rounded-xl bg-slate-950 p-4 font-mono text-sm leading-6 text-slate-100 shadow-inner sm:p-5">
							{children}
						</pre>
					),
					table: ({ children }) => (
						<div className="my-6 overflow-x-auto">
							<table className="w-full min-w-lg border-collapse text-left text-sm">{children}</table>
						</div>
					),
					thead: ({ children }) => <thead className="bg-slate-100 text-slate-900">{children}</thead>,
					th: ({ children }) => <th className="border border-slate-200 px-4 py-3 font-semibold">{children}</th>,
					td: ({ children }) => <td className="border border-slate-200 px-4 py-3">{children}</td>,
					hr: () => <hr className="my-8 border-slate-200" />,
					img: ({ src, alt }) => (
						// Markdown内の画像は外部URLを含むため、サイズ最適化を行わず表示します。
						// eslint-disable-next-line @next/next/no-img-element
						<img
							src={src}
							alt={alt ?? ""}
							className="my-6 h-auto max-w-full rounded-xl border border-slate-200"
							loading="lazy"
						/>
					),
				}}
			>
				{content}
			</ReactMarkdown>
		</div>
	);
}
