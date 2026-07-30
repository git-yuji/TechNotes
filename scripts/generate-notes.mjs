import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { basename, join, relative, resolve } from "node:path";

const projectRoot = resolve(import.meta.dirname, "..");
const notesDirectory = join(projectRoot, "content", "notes");
const outputDirectory = join(projectRoot, "src", "generated");
const outputFile = join(outputDirectory, "notes.ts");
const allowedCategories = new Set(["学習", "設定手順", "トラブルシューティング", "備忘録"]);
const datePattern = /^\d{4}-\d{2}-\d{2}$/;

function parseFrontmatter(source, sourceFile) {
	const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);

	if (!match) {
		throw new Error(`${sourceFile}: frontmatterを読み取れません。`);
	}

	const metadata = {};

	for (const line of match[1].split(/\r?\n/)) {
		const separator = line.indexOf(":");

		if (separator < 1) {
			throw new Error(`${sourceFile}: frontmatterの形式が正しくありません。`);
		}

		metadata[line.slice(0, separator).trim()] = line.slice(separator + 1).trim();
	}

	let tags;

	try {
		tags = JSON.parse(metadata.tags ?? "[]");
	} catch {
		throw new Error(`${sourceFile}: tagsはJSON配列で記載してください。`);
	}

	const note = {
		id: basename(sourceFile, ".md"),
		title: metadata.title,
		category: metadata.category,
		tags,
		content: match[2].trim(),
		memo: metadata.memo || null,
		createdAt: metadata.createdAt,
		updatedAt: metadata.updatedAt,
		sourceFile,
	};

	if (!note.title || !note.content) {
		throw new Error(`${sourceFile}: titleと本文は必須です。`);
	}

	if (!allowedCategories.has(note.category)) {
		throw new Error(`${sourceFile}: categoryが未対応です。`);
	}

	if (!Array.isArray(note.tags) || note.tags.some((tag) => typeof tag !== "string" || !tag.trim())) {
		throw new Error(`${sourceFile}: tagsに空文字以外の文字列を指定してください。`);
	}

	if (!datePattern.test(note.createdAt ?? "") || !datePattern.test(note.updatedAt ?? "")) {
		throw new Error(`${sourceFile}: createdAtとupdatedAtはYYYY-MM-DD形式で指定してください。`);
	}

	return {
		...note,
		tags: [...new Set(note.tags.map((tag) => tag.trim()))],
	};
}

async function main() {
	const fileNames = (await readdir(notesDirectory))
		.filter((fileName) => fileName.endsWith(".md"))
		.sort();
	const notes = [];

	for (const fileName of fileNames) {
		const absolutePath = join(notesDirectory, fileName);
		const sourceFile = relative(projectRoot, absolutePath);
		const source = await readFile(absolutePath, "utf8");
		notes.push(parseFrontmatter(source, sourceFile));
	}

	await mkdir(outputDirectory, { recursive: true });
	await writeFile(
		outputFile,
		`// このファイルは scripts/generate-notes.mjs により自動生成されます。\n` +
			`import type { Note } from "@/types/note";\n\n` +
			`export const generatedNotes: Note[] = ${JSON.stringify(notes, null, 2)};\n`,
		"utf8",
	);

	console.log(`${notes.length}件のMarkdownノートを生成しました。`);
}

main().catch((error) => {
	console.error(error instanceof Error ? error.message : error);
	process.exitCode = 1;
});
