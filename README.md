# Tech Notes

日々の学習内容、設定手順、トラブル対応を記録する個人用の技術ノートです。

ノートはMarkdownファイルとしてGitで管理し、Next.jsで静的ページを生成してCloudflare Workersへ公開します。データベースやWeb上の管理画面は使用しません。

## 公開URL

[https://notes.yuyu-web.com](https://notes.yuyu-web.com)

## 主な機能

- キーワードによるノート検索
- カテゴリとタグによる絞り込み
- MarkdownとGitHub Flavored Markdownの表示
- ノート詳細ページの静的生成
- Gitのコミット履歴による変更管理

## 技術構成

- Next.js
- React
- TypeScript
- Tailwind CSS
- OpenNext for Cloudflare
- Cloudflare Workers

## ローカル開発

### 必要な環境

- Node.js
- npm

### セットアップ

```sh
git clone git@github.com:git-yuji/TechNotes.git
cd TechNotes
npm install
npm run dev
```

起動後、[http://localhost:3000](http://localhost:3000)を開きます。

## ノートの管理

ノートは`content/notes`配下のMarkdownファイルで管理します。ファイル名はノート詳細ページのURLとして使用されるため、英数字とハイフンで付けます。

```text
content/notes/cloudflare-workers-deploy.md
↓
/notes/cloudflare-workers-deploy
```

公開済みノートのURLを維持するため、ファイル名は原則として変更しません。

### ノートの書式

ファイルの先頭にfrontmatterを記載し、その下へMarkdown形式で本文を書きます。

```markdown
---
title: ノートのタイトル
category: 設定手順
tags: ["Next.js", "Cloudflare"]
createdAt: 2026-07-31
updatedAt: 2026-07-31
memo: 任意の補足
---

# ノートのタイトル

ここに本文を書きます。
```

利用できるカテゴリは次の4つです。

- `学習`
- `設定手順`
- `トラブルシューティング`
- `備忘録`

`title`、`category`、`tags`、`createdAt`、`updatedAt`、本文は必須です。日付は`YYYY-MM-DD`形式、`tags`はJSON配列で記載します。`memo`は省略できます。

### ノートを追加・更新する流れ

1. `main`から作業ブランチを作成する
2. `content/notes`のMarkdownを追加または更新する
3. ノート生成と本番ビルドを確認する
4. コミットしてGitHubへプッシュする
5. PRを作成して`main`へマージする

```sh
npm run notes:check
npm run build
```

`main`へマージするとCloudflareのGit連携によってデプロイされ、本番サイトへ反映されます。

## npm scripts

| コマンド | 内容 |
| --- | --- |
| `npm run dev` | 開発サーバーを起動 |
| `npm run notes:generate` | Markdownからノートデータを生成 |
| `npm run notes:check` | ノートの書式を検証してデータを生成 |
| `npm run build` | Next.jsの本番ビルドを実行 |
| `npm run preview` | Cloudflare向けビルドをローカルで確認 |
| `npm run deploy` | Cloudflare Workersへデプロイ |
| `npm run cf-typegen` | Cloudflareの型定義を生成 |

生成された`src/generated/notes.ts`はGit管理の対象外です。`npm install`、`npm run dev`、`npm run build`の実行時にも自動生成されます。

## ディレクトリ構成

```text
.
├── content/notes/         # Gitで管理するMarkdownノート
├── scripts/               # ノート生成スクリプト
├── src/app/               # Next.js App Router
├── src/components/        # UIコンポーネント
├── src/lib/               # ノートの検索・取得処理
├── src/types/             # 型定義
└── wrangler.jsonc         # Cloudflare Workers設定
```

## コミットメッセージ

コミットメッセージは英語の接頭辞と日本語の要約を組み合わせます。

```text
feat: ノート検索機能を追加
fix: ノート詳細の表示崩れを修正
docs: Cloudflareの設定手順を追加
chore: 依存パッケージを更新
```
