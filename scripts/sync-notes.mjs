import { mkdtemp, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, relative, resolve } from "node:path";
import { spawnSync } from "node:child_process";

const projectRoot = resolve(import.meta.dirname, "..");
const notesDirectory = join(projectRoot, "content", "notes");
const allowedCategories = new Set(["学習", "設定手順", "トラブルシューティング", "備忘録"]);
const datePattern = /^\d{4}-\d{2}-\d{2}$/;
const remote = process.argv.includes("--remote");

function parseFrontmatter(source, filePath) {
	const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);

	if (!match) {
		throw new Error(`${filePath}: frontmatterを読み取れません。`);
	}

	const metadata = {};

	for (const line of match[1].split(/\r?\n/)) {
		const separator = line.indexOf(":");

		if (separator < 1) {
			throw new Error(`${filePath}: frontmatterの形式が正しくありません。`);
		}

		const key = line.slice(0, separator).trim();
		const value = line.slice(separator + 1).trim();
		metadata[key] = value;
	}

	let tags;

	try {
		tags = JSON.parse(metadata.tags ?? "[]");
	} catch {
		throw new Error(`${filePath}: tagsはJSON配列で記載してください。`);
	}

	const note = {
		title: metadata.title,
		category: metadata.category,
		tags,
		createdAt: metadata.createdAt,
		updatedAt: metadata.updatedAt,
		memo: metadata.memo ?? "",
		content: match[2].trim(),
	};

	if (!note.title || !note.content) {
		throw new Error(`${filePath}: titleと本文は必須です。`);
	}

	if (!allowedCategories.has(note.category)) {
		throw new Error(`${filePath}: categoryが未対応です。`);
	}

	if (!Array.isArray(note.tags) || note.tags.some((tag) => typeof tag !== "string" || !tag.trim())) {
		throw new Error(`${filePath}: tagsに空文字以外の文字列を指定してください。`);
	}

	if (!datePattern.test(note.createdAt ?? "") || !datePattern.test(note.updatedAt ?? "")) {
		throw new Error(`${filePath}: createdAtとupdatedAtはYYYY-MM-DD形式で指定してください。`);
	}

	return {
		...note,
		tags: [...new Set(note.tags.map((tag) => tag.trim()))],
	};
}

function sqlValue(value) {
	return `'${String(value).replaceAll("'", "''")}'`;
}

function createNoteSql(note, sourceFile) {
	const noteIdQuery = `(SELECT id FROM notes WHERE source_file = ${sqlValue(sourceFile)})`;
	const statements = [
		`INSERT INTO notes (title, category_id, content, memo, created_at, updated_at, source_file)
SELECT
	${sqlValue(note.title)},
	(SELECT id FROM categories WHERE name = ${sqlValue(note.category)}),
	${sqlValue(note.content)},
	${note.memo ? sqlValue(note.memo) : "NULL"},
	${sqlValue(note.createdAt)},
	${sqlValue(note.updatedAt)},
	${sqlValue(sourceFile)}
WHERE NOT EXISTS (
	SELECT 1 FROM notes WHERE source_file = ${sqlValue(sourceFile)}
);`,
		`UPDATE notes
SET
	title = ${sqlValue(note.title)},
	category_id = (SELECT id FROM categories WHERE name = ${sqlValue(note.category)}),
	content = ${sqlValue(note.content)},
	memo = ${note.memo ? sqlValue(note.memo) : "NULL"},
	created_at = ${sqlValue(note.createdAt)},
	updated_at = ${sqlValue(note.updatedAt)}
WHERE source_file = ${sqlValue(sourceFile)};`,
		`DELETE FROM note_tags WHERE note_id = ${noteIdQuery};`,
	];

	for (const tag of note.tags) {
		statements.push(
			`INSERT OR IGNORE INTO tags (name) VALUES (${sqlValue(tag)});`,
			`INSERT OR IGNORE INTO note_tags (note_id, tag_id)
SELECT ${noteIdQuery}, id FROM tags WHERE name = ${sqlValue(tag)};`,
		);
	}

	return statements.join("\n\n");
}

async function main() {
	const fileNames = (await readdir(notesDirectory))
		.filter((fileName) => fileName.endsWith(".md"))
		.sort();

	if (fileNames.length === 0) {
		throw new Error("同期対象のMarkdownファイルがありません。");
	}

	const sqlSections = ["BEGIN TRANSACTION;"];

	for (const fileName of fileNames) {
		const absolutePath = join(notesDirectory, fileName);
		const source = await readFile(absolutePath, "utf8");
		const sourceFile = relative(projectRoot, absolutePath);
		const note = parseFrontmatter(source, sourceFile);
		sqlSections.push(createNoteSql(note, sourceFile));
	}

	sqlSections.push("COMMIT;");
	const temporaryDirectory = await mkdtemp(join(tmpdir(), "tech-notes-sync-"));
	const sqlFile = join(temporaryDirectory, "notes.sql");

	try {
		await writeFile(sqlFile, `${sqlSections.join("\n\n")}\n`, "utf8");

		const args = [
			"wrangler",
			"d1",
			"execute",
			"tech-notes-db",
			remote ? "--remote" : "--local",
			`--file=${sqlFile}`,
		];
		const result = spawnSync("npx", args, {
			cwd: projectRoot,
			stdio: "inherit",
		});

		if (result.error) {
			throw result.error;
		}

		if (result.status !== 0) {
			throw new Error(`D1への同期に失敗しました（終了コード: ${result.status}）。`);
		}
	} finally {
		await rm(temporaryDirectory, { recursive: true, force: true });
	}

	console.log(`${fileNames.length}件のノートを${remote ? "本番" : "ローカル"}D1へ同期しました。`);
}

main().catch((error) => {
	console.error(error instanceof Error ? error.message : error);
	process.exitCode = 1;
});
