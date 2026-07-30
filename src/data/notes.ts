import type { Note } from "@/types/note";

export const notes: Note[] = [
	{
		id: 1,
		title: "WordPressで403エラーが発生したときの確認手順",
		category: "トラブルシューティング",
		tags: ["WordPress", "サーバー"],
		content: `## 最初に確認すること

WordPressで突然403エラーが表示された場合は、変更直後の設定から順番に確認する。

1. 管理画面と公開画面のどちらで発生しているか確認する
2. 特定のURLだけか、サイト全体かを切り分ける
3. 直前に変更したプラグインやサーバー設定を確認する

## ファイルの権限

一般的な目安は次のとおり。

- ディレクトリ: \`755\`
- ファイル: \`644\`
- \`wp-config.php\`: サーバー環境に応じて適切に制限する

権限を一括変更する前に、必ず現在の設定を控えておく。

## .htaccessの確認

\`.htaccess\` を一時的に別名へ変更し、エラーが解消するか確認する。解消した場合は、WordPressのパーマリンク設定から再生成する。

> 本番環境で操作する前に、バックアップと作業対象を確認する。`,
		memo: "WAFやサーバー側のアクセス制限が原因の場合もある。顧客情報を含むログは公開用ノートへ貼り付けない。",
		createdAt: "2026-07-18",
		updatedAt: "2026-07-29",
	},
	{
		id: 2,
		title: "GitHubのSSHキーを仕事用と個人用で分ける方法",
		category: "設定手順",
		tags: ["Git", "GitHub", "SSH"],
		content: `## 方針

用途ごとにSSHキーを作成し、\`~/.ssh/config\` のホスト名で使い分ける。

## 設定例

\`\`\`text
Host github-personal
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_ed25519_personal

Host github-work
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_ed25519_work
\`\`\`

個人用リポジトリでは、リモートURLに \`github-personal\` を使用する。

\`\`\`bash
git remote set-url origin git@github-personal:username/repository.git
\`\`\`

## 接続確認

\`\`\`bash
ssh -T git@github-personal
ssh -T git@github-work
\`\`\`

それぞれ意図したGitHubアカウント名が表示されることを確認する。`,
		memo: "秘密鍵はGitへ追加しない。公開鍵のみGitHubへ登録する。",
		createdAt: "2026-07-20",
		updatedAt: "2026-07-27",
	},
	{
		id: 3,
		title: "Cloudflare WorkersへNext.jsをデプロイする方法",
		category: "学習",
		tags: ["Next.js", "Cloudflare"],
		content: `## 使用する構成

- Next.js
- OpenNext Cloudflare adapter
- Wrangler
- Cloudflare Workers Builds

## ローカルでの確認

Next.jsの本番ビルドとWorkers向けビルドを順番に確認する。

\`\`\`bash
npm run build
npm run preview
\`\`\`

通常の \`npm run dev\` はNode.js上で動作する。Workers本番環境に近い確認には \`npm run preview\` を使用する。

## GitHub連携時のコマンド

Cloudflare Workers Buildsでは次のように設定する。

| 項目 | コマンド |
| --- | --- |
| Build command | 空欄 |
| Deploy command | \`npm run deploy\` |
| Non-production deploy command | \`npm run upload\` |

\`main\` へプッシュすると、自動的にビルドとデプロイが実行される。`,
		memo: "D1のバインディングはデータベース接続のステップで追加する。",
		createdAt: "2026-07-22",
		updatedAt: "2026-07-25",
	},
	{
		id: 4,
		title: "作業前に確認したいGitコマンド",
		category: "備忘録",
		tags: ["Git", "コマンド"],
		content: `## 現在の状態を確認する

\`\`\`bash
git status -sb
git branch --show-current
\`\`\`

## 差分を確認する

\`\`\`bash
git diff
git diff --cached
\`\`\`

## 最近の履歴を確認する

\`\`\`bash
git log --oneline --decorate -10
\`\`\`

## 作業時の注意

- 変更内容を確認してからステージする
- 関係のない変更を同じコミットへ含めない
- プッシュ前に対象ブランチを確認する
- 強制プッシュは影響範囲を確認してから行う`,
		memo: null,
		createdAt: "2026-07-21",
		updatedAt: "2026-07-21",
	},
];

export function getNoteById(id: number) {
	return notes.find((note) => note.id === id);
}
