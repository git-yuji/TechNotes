import type { Note } from "@/types/note";

export const notes: Note[] = [
	{
		id: 1,
		title: "WordPressで403エラーが発生したときの確認手順",
		category: "トラブルシューティング",
		tags: ["WordPress", "サーバー"],
		updatedAt: "2026-07-29",
	},
	{
		id: 2,
		title: "GitHubのSSHキーを仕事用と個人用で分ける方法",
		category: "設定手順",
		tags: ["Git", "GitHub", "SSH"],
		updatedAt: "2026-07-27",
	},
	{
		id: 3,
		title: "Cloudflare WorkersへNext.jsをデプロイする方法",
		category: "学習",
		tags: ["Next.js", "Cloudflare"],
		updatedAt: "2026-07-25",
	},
	{
		id: 4,
		title: "作業前に確認したいGitコマンド",
		category: "備忘録",
		tags: ["Git", "コマンド"],
		updatedAt: "2026-07-21",
	},
];
