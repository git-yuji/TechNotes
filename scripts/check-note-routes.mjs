import { spawn } from "node:child_process";
import { readFile, readdir } from "node:fs/promises";
import { basename, join, resolve } from "node:path";

const projectRoot = resolve(import.meta.dirname, "..");
const notesDirectory = join(projectRoot, "content", "notes");
const port = 8787;
const baseUrl = `http://127.0.0.1:${port}`;
const wranglerCommand = process.platform === "win32" ? "wrangler.cmd" : "wrangler";
const noteFiles = (await readdir(notesDirectory))
	.filter((fileName) => fileName.endsWith(".md"))
	.sort();

if (noteFiles.length === 0) {
	throw new Error("検証対象のMarkdownノートがありません。");
}

const notes = await Promise.all(
	noteFiles.map(async (fileName) => {
		const source = await readFile(join(notesDirectory, fileName), "utf8");
		const title = source.match(/^title:\s*(.+)$/m)?.[1]?.trim();

		if (!title) {
			throw new Error(`${fileName}: titleを読み取れません。`);
		}

		return {
			id: basename(fileName, ".md"),
			title,
		};
	}),
);

const wrangler = spawn(
	wranglerCommand,
	[
		"dev",
		"--local",
		"--port",
		String(port),
		"--inspector-port",
		"9230",
		"--show-interactive-dev-session=false",
	],
	{
		cwd: projectRoot,
		env: {
			...process.env,
			PATH: `${join(projectRoot, "node_modules", ".bin")}:${process.env.PATH ?? ""}`,
		},
		stdio: ["ignore", "pipe", "pipe"],
	},
);

let output = "";

function appendOutput(chunk) {
	const text = chunk.toString();
	output += text;
	process.stdout.write(text);
}

wrangler.stdout.on("data", appendOutput);
wrangler.stderr.on("data", appendOutput);

const ready = new Promise((resolveReady, rejectReady) => {
	const timeout = setTimeout(() => {
		rejectReady(new Error(`Wranglerの起動がタイムアウトしました。\n${output}`));
	}, 30_000);

	function checkReady(chunk) {
		if (chunk.toString().includes("Ready on")) {
			clearTimeout(timeout);
			wrangler.stdout.off("data", checkReady);
			wrangler.stderr.off("data", checkReady);
			resolveReady();
		}
	}

	wrangler.stdout.on("data", checkReady);
	wrangler.stderr.on("data", checkReady);

	wrangler.once("exit", (code) => {
		clearTimeout(timeout);
		rejectReady(new Error(`Wranglerが起動前に終了しました（終了コード: ${code}）。\n${output}`));
	});
});

try {
	await ready;

	for (const note of notes) {
		const response = await fetch(`${baseUrl}/notes/${note.id}`);
		const body = await response.text();
		const expectedTitle = `<title>${note.title} | Tech Notes</title>`;

		if (!response.ok || !body.includes(expectedTitle)) {
			throw new Error(`/notes/${note.id} の表示確認に失敗しました（HTTP ${response.status}）。`);
		}

		console.log(`✓ ${response.status} /notes/${note.id}`);
	}

	console.log(`${notes.length}件のノート詳細ページを確認しました。`);
} finally {
	wrangler.kill("SIGTERM");
}
