"use client";

import Link from "next/link";
import { useActionState, useState, type FormEvent } from "react";
import {
	createNoteAction,
	initialCreateNoteState,
	type CreateNoteErrors,
} from "@/app/admin/notes/new/actions";
import { categories, type Category } from "@/data/categories";

export type NoteFormValues = {
	title: string;
	category: "" | Category;
	tags: string;
	content: string;
	memo: string;
};

type FormErrors = CreateNoteErrors;

type NoteFormProps = {
	mode?: "create" | "edit";
	initialValues?: NoteFormValues;
	cancelHref?: string;
};

const emptyValues: NoteFormValues = {
	title: "",
	category: "",
	tags: "",
	content: "",
	memo: "",
};

function normalizeTags(value: string) {
	return [
		...new Set(
			value
				.split(/[,、\n]/)
				.map((tag) => tag.trim())
				.filter(Boolean),
		),
	];
}

export function NoteForm({ mode = "create", initialValues = emptyValues, cancelHref = "/" }: NoteFormProps) {
	const [values, setValues] = useState(initialValues);
	const [errors, setErrors] = useState<FormErrors>({});
	const [isValidated, setIsValidated] = useState(false);
	const [createState, createAction, isPending] = useActionState(createNoteAction, initialCreateNoteState);
	const normalizedTags = normalizeTags(values.tags);
	const isEditMode = mode === "edit";
	const displayedErrors = { ...createState.errors, ...errors };

	function updateValue<Key extends keyof NoteFormValues>(key: Key, value: NoteFormValues[Key]) {
		setValues((current) => ({ ...current, [key]: value }));
		setIsValidated(false);

		if (key in errors) {
			setErrors((current) => {
				const next = { ...current };
				delete next[key as keyof FormErrors];
				return next;
			});
		}
	}

	function handleTagsBlur() {
		updateValue("tags", normalizedTags.join(", "));
	}

	function handleSubmit(event: FormEvent<HTMLFormElement>) {
		const nextErrors: FormErrors = {};

		if (!values.title.trim()) {
			nextErrors.title = "タイトルを入力してください。";
		}

		if (!values.category || !categories.includes(values.category)) {
			nextErrors.category = "カテゴリを選択してください。";
		}

		if (!values.content.trim()) {
			nextErrors.content = "内容を入力してください。";
		}

		setErrors(nextErrors);

		if (Object.keys(nextErrors).length > 0 || isEditMode) {
			event.preventDefault();
		}

		setIsValidated(isEditMode && Object.keys(nextErrors).length === 0);
	}

	return (
		<form action={isEditMode ? undefined : createAction} onSubmit={handleSubmit} noValidate className="space-y-7">
			{isEditMode && (
				<div className="rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm leading-6 text-amber-950">
					<p className="font-bold">現在は編集画面の確認用です</p>
					<p className="mt-1">保存機能はまだ実装されていません。変更した内容はデータベースへ保存されません。</p>
				</div>
			)}

			{(Object.keys(displayedErrors).length > 0 || createState.message) && (
				<div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-900">
					<p className="font-bold">{createState.message ?? "入力内容を確認してください"}</p>
					{Object.keys(displayedErrors).length > 0 && (
						<ul className="mt-2 list-disc space-y-1 pl-5">
							{Object.values(displayedErrors).map((error) => (
								<li key={error}>{error}</li>
							))}
						</ul>
					)}
				</div>
			)}

			{isValidated && (
				<div role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-900">
					<p className="font-bold">{isEditMode ? "変更内容" : "入力内容"}に問題はありません。</p>
					<p className="mt-1">保存処理は今後のステップで実装します。</p>
				</div>
			)}

			<div>
				<label htmlFor="title" className="block text-sm font-bold text-slate-800">
					タイトル
					<span className="ml-2 text-xs font-semibold text-red-600">必須</span>
				</label>
				<input
					id="title"
					name="title"
					type="text"
					value={values.title}
					onChange={(event) => updateValue("title", event.target.value)}
					aria-invalid={Boolean(displayedErrors.title)}
					aria-describedby={displayedErrors.title ? "title-error" : undefined}
					placeholder="例: Cloudflare Workersのデプロイ手順"
					className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
				/>
				{displayedErrors.title && (
					<p id="title-error" className="mt-2 text-sm font-medium text-red-600">
						{displayedErrors.title}
					</p>
				)}
			</div>

			<div>
				<label htmlFor="category" className="block text-sm font-bold text-slate-800">
					カテゴリ
					<span className="ml-2 text-xs font-semibold text-red-600">必須</span>
				</label>
				<select
					id="category"
					name="category"
					value={values.category}
					onChange={(event) => updateValue("category", event.target.value as NoteFormValues["category"])}
					aria-invalid={Boolean(displayedErrors.category)}
					aria-describedby={displayedErrors.category ? "category-error" : undefined}
					className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
				>
					<option value="">選択してください</option>
					{categories.map((category) => (
						<option key={category} value={category}>
							{category}
						</option>
					))}
				</select>
				{displayedErrors.category && (
					<p id="category-error" className="mt-2 text-sm font-medium text-red-600">
						{displayedErrors.category}
					</p>
				)}
			</div>

			<div>
				<label htmlFor="tags" className="block text-sm font-bold text-slate-800">
					タグ
					<span className="ml-2 text-xs font-medium text-slate-400">任意</span>
				</label>
				<input
					id="tags"
					name="tags"
					type="text"
					value={values.tags}
					onChange={(event) => updateValue("tags", event.target.value)}
					onBlur={handleTagsBlur}
					placeholder="例: Next.js, TypeScript, Cloudflare"
					className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
				/>
				<p className="mt-2 text-xs leading-5 text-slate-500">カンマ区切りで入力してください。前後の空白と重複は自動で整理します。</p>
				{normalizedTags.length > 0 && (
					<ul className="mt-3 flex flex-wrap gap-2" aria-label="入力中のタグ">
						{normalizedTags.map((tag) => (
							<li key={tag} className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
								#{tag}
							</li>
						))}
					</ul>
				)}
			</div>

			<div>
				<div className="flex items-end justify-between gap-4">
					<label htmlFor="content" className="block text-sm font-bold text-slate-800">
						内容
						<span className="ml-2 text-xs font-semibold text-red-600">必須</span>
					</label>
					<span className="text-xs text-slate-400">Markdown形式</span>
				</div>
				<textarea
					id="content"
					name="content"
					value={values.content}
					onChange={(event) => updateValue("content", event.target.value)}
					aria-invalid={Boolean(displayedErrors.content)}
					aria-describedby={displayedErrors.content ? "content-error" : "content-help"}
					placeholder={"## 見出し\n\n本文をMarkdown形式で入力します。"}
					rows={15}
					className="mt-2 w-full resize-y rounded-xl border border-slate-300 bg-white px-4 py-3 font-mono text-sm leading-7 text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
				/>
				{displayedErrors.content ? (
					<p id="content-error" className="mt-2 text-sm font-medium text-red-600">
						{displayedErrors.content}
					</p>
				) : (
					<p id="content-help" className="mt-2 text-xs text-slate-500">
						見出し、箇条書き、リンク、インラインコード、コードブロックを利用できます。
					</p>
				)}
			</div>

			<div>
				<label htmlFor="memo" className="block text-sm font-bold text-slate-800">
					メモ
					<span className="ml-2 text-xs font-medium text-slate-400">任意</span>
				</label>
				<textarea
					id="memo"
					name="memo"
					value={values.memo}
					onChange={(event) => updateValue("memo", event.target.value)}
					placeholder="補足情報や注意点を入力します。"
					rows={5}
					className="mt-2 w-full resize-y rounded-xl border border-slate-300 bg-white px-4 py-3 leading-7 text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
				/>
			</div>

			<div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-7 sm:flex-row sm:justify-end">
				<Link
					href={cancelHref}
					className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
				>
					キャンセル
				</Link>
				<button
					type="submit"
					disabled={isPending}
					className="inline-flex min-h-11 items-center justify-center rounded-xl bg-sky-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-400"
				>
					{isPending ? "保存中..." : isEditMode ? "変更を保存する" : "保存する"}
				</button>
			</div>
		</form>
	);
}
