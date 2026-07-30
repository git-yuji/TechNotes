# Tech Notes

Next.js、Cloudflare Workers、Cloudflare D1で構築した個人用の技術ノートです。

## 開発

```sh
npm install
npm run db:migrate:local
npm run dev
```

## Gitでノートを管理する

Gitの履歴に残したいノートは、`content/notes`へMarkdownファイルとして追加します。

```markdown
---
title: ノートのタイトル
category: 備忘録
tags: ["GitHub", "Git"]
createdAt: 2025-07-30
updatedAt: 2025-07-30
memo: 任意のメモ
---
# 本文
```

利用できるカテゴリは次の4つです。

- `学習`
- `設定手順`
- `トラブルシューティング`
- `備忘録`

ローカルD1へ同期します。

```sh
npm run db:migrate:local
npm run notes:sync:local
```

本番D1へ同期する場合は、先にマイグレーションを適用します。

```sh
npm run db:migrate:remote
npm run notes:sync:remote
```

同じMarkdownファイルを再度同期すると、対応するノートが更新されます。Markdownファイルを削除しても、D1のノートは自動削除されません。

ノートの追加・変更は機能ブランチでコミットし、PRを`main`へマージします。
