"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type CodeBlockProps = {
	children: ReactNode;
};

type CopyStatus = "idle" | "copied" | "failed";

export function CodeBlock({ children }: CodeBlockProps) {
	const preRef = useRef<HTMLPreElement>(null);
	const [copyStatus, setCopyStatus] = useState<CopyStatus>("idle");

	useEffect(() => {
		if (copyStatus === "idle") {
			return;
		}

		const timeoutId = window.setTimeout(() => setCopyStatus("idle"), 2000);

		return () => window.clearTimeout(timeoutId);
	}, [copyStatus]);

	async function copyCode() {
		const code = preRef.current?.textContent;

		if (!code) {
			setCopyStatus("failed");
			return;
		}

		try {
			await navigator.clipboard.writeText(code.replace(/\n$/, ""));
			setCopyStatus("copied");
		} catch {
			setCopyStatus("failed");
		}
	}

	const buttonLabel =
		copyStatus === "copied" ? "コピーしました" : copyStatus === "failed" ? "コピー失敗" : "コピー";

	return (
		<div className="group relative my-6">
			<button
				type="button"
				onClick={copyCode}
				className="absolute right-3 top-3 rounded-md border border-slate-600 bg-slate-800 px-2.5 py-1.5 text-xs font-semibold text-slate-200 shadow-sm transition hover:border-slate-400 hover:bg-slate-700 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
				aria-live="polite"
			>
				{buttonLabel}
			</button>
			<pre
				ref={preRef}
				className="max-w-full overflow-x-auto rounded-xl bg-slate-950 px-6 pb-5 pt-14 font-mono text-sm leading-6 text-slate-100 shadow-inner"
			>
				{children}
			</pre>
		</div>
	);
}
