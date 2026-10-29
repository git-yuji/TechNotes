"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";

const subscribe = () => () => {};

export function ThemeSwitcher() {
	const { theme, setTheme } = useTheme();
	const mounted = useSyncExternalStore(subscribe, () => true, () => false);

	return (
		<label className="flex shrink-0 items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-300">
			<span className="sr-only sm:not-sr-only">配色</span>
			<select
				aria-label="配色テーマ"
				value={mounted ? theme : "system"}
				disabled={!mounted}
				onChange={(event) => setTheme(event.target.value)}
				className="min-h-11 rounded-lg border border-slate-300 bg-white px-2 py-2 text-sm text-slate-700 outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200"
			>
				<option value="system">システム</option>
				<option value="light">ライト</option>
				<option value="dark">ダーク</option>
			</select>
		</label>
	);
}
