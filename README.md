# Tech Notes

Next.jsとCloudflare Workersで公開する、Git管理の個人用技術ノートです。

ノート本文は`content/notes`のMarkdownファイルだけで管理します。データベースや管理画面は使用しません。

## 開発

```sh
npm install
npm run dev
```

## ノートを追加する

`content/notes`へ、URLに使用する英数字のファイル名でMarkdownファイルを追加します。

```text
content/notes/cloudflare-access-admin.md
```

ファイルの先頭にはfrontmatterを記載します。

```markdown
---
title: ノートのタイトル
category: 備忘録
tags: ["GitHub", "Git"]
createdAt: 2026-07-31
updatedAt: 2026-07-31
memo: 任意のメモ
---
# 本文
```

利用できるカテゴリは次の4つです。

- `学習`
- `設定手順`
- `トラブルシューティング`
- `備忘録`

ノートを追加・変更したら、生成とビルドを確認します。

```sh
npm run notes:generate
npm run build
```

## 公開する

ノートの追加・変更は機能ブランチでコミットし、PRを`main`へマージします。

CloudflareのGit連携による通常のデプロイが完了すると、本番サイトへ反映されます。D1同期用のGitHub ActionsやCloudflare APIトークンは使用しません。

## URL

Markdownのファイル名がノートのURLになります。

```text
content/notes/cloudflare-access-admin.md
↓
/notes/cloudflare-access-admin
```

公開後のURLを維持するため、公開済みMarkdownのファイル名は原則として変更しません。
