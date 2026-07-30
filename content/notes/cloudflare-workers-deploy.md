---
title: Next.jsをCloudflare Workersへデプロイする手順
category: 設定手順
tags: ["Next.js", "Cloudflare Workers", "OpenNext", "Wrangler", "デプロイ"]
createdAt: 2026-07-30
updatedAt: 2026-07-30
memo: Cloudflareで「Open Next configが見つからない」というエラーが出た場合は、ビルドコマンドが通常のnext buildになっていないか確認する。
---
# Next.jsをCloudflare Workersへデプロイする手順

## 概要

Next.jsアプリをOpenNext経由でCloudflare Workersへデプロイする手順をまとめる。

通常の`next build`だけでは、Cloudflare WorkersへデプロイするためのOpenNext成果物は生成されない。ビルド時には`opennextjs-cloudflare build`を実行する必要がある。

## 必要なパッケージ

```bash
npm install @opennextjs/cloudflare
npm install --save-dev wrangler
```

## package.jsonの設定

Cloudflare向けのビルドとデプロイを行うスクリプトを追加する。

```json
{
  "scripts": {
    "build": "next build",
    "deploy": "opennextjs-cloudflare build && opennextjs-cloudflare deploy",
    "preview": "opennextjs-cloudflare build && opennextjs-cloudflare preview"
  }
}
```

## Cloudflareのビルド設定

Cloudflareの管理画面で、次のように設定する。

### ビルドコマンド

```bash
npx opennextjs-cloudflare build
```

### デプロイコマンド

```bash
npx wrangler deploy
```

### パス

```text
/
```

## 注意点

ビルドコマンドを`npm run build`にすると、通常のNext.jsビルドだけが実行される。

その状態で`npx wrangler deploy`を実行すると、次のエラーが発生することがある。

```text
ERROR Could not find compiled Open Next config, did you run the build command?
```

これは、Cloudflare用のOpenNext成果物が生成されていないことが原因。

`npx opennextjs-cloudflare build`をビルドコマンドに指定してから、再度デプロイする。

## ローカルでの確認

通常のNext.js環境で確認する場合は、次のコマンドを使う。

```bash
npm run dev
```

Cloudflare環境に近い状態で確認する場合は、次のコマンドを使う。

```bash
npm run preview
```

## カスタムドメインの設定

Cloudflare Workersの設定からカスタムドメインを追加する。

今回使用したドメインは次のとおり。

```text
notes.yuyu-web.com
```

カスタムドメインを設定した後、ブラウザからアクセスして表示を確認する。

## workers.devを無効化する

カスタムドメインだけで公開する場合は、`wrangler.jsonc`に次の設定を追加する。

```json
{
  "workers_dev": false,
  "preview_urls": false
}
```

これにより、公開用の`workers.dev` URLとプレビューURLを無効化できる。

## 確認項目

- トップページが表示される
- ノート一覧が表示される
- ノート詳細へ移動できる
- カスタムドメインでHTTPS接続できる
- `workers.dev` URLからアクセスできない
