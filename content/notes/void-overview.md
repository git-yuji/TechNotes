---
title: Voidとは？ViteとCloudflareをつなぐフルスタック開発環境
category: 学習
tags: ["Void", "Vite", "Cloudflare", "Cloudflare Workers", "Web開発"]
createdAt: 2026-10-19
updatedAt: 2026-10-19
memo: Viteを使った開発からCloudflareへのデプロイまでを扱うVoidの概要と、利用方法をまとめる。
---

# Voidとは？ViteとCloudflareをつなぐフルスタック開発環境

## 概要

Voidは、Viteを基盤に、Webアプリケーションの開発とデプロイをまとめて扱うためのツールだ。

Publickeyの紹介記事をきっかけに知った。2026年3月の発表時には、VoidZeroが開発するViteネイティブなWebプラットフォームとして紹介されている。

現在の[公式ガイド](https://void.cloud/guide/)では、Cloudflare Workers向けのフルスタックフレームワークと説明されている。画面とサーバー側の処理を同じプロジェクトで開発し、データベースなどのリソースの準備や公開までをつなぐ仕組みになっている。

この記事は2026年10月19日時点の公式ドキュメントをもとにした概要で、実際の導入やデプロイはまだ試していない。

## ViteとVoidの役割

Viteは、開発サーバーや本番向けビルドを担うツールだ。Voidはその開発環境を利用しながら、サーバー側の処理、データアクセス、デプロイまでを扱う。

公式ガイドでは、React、Vue、Svelte、Solidで画面を作り、同じプロジェクト内にAPIやページ用のサーバー処理を記述する構成が紹介されている。

また、既存のフレームワークと組み合わせる使い方もある。その場合は、ルーティングや画面描画を既存のフレームワークが担当し、Voidがリソースの管理とデプロイを担当する。

## Cloudflareとの関係

VoidはCloudflare Workers上で動作し、アプリケーションが利用するCloudflareのリソースとの接続を管理する。

[Cloudflare連携のドキュメント](https://void.cloud/integrations/cloudflare)には、次のような対応が掲載されている。

| サービス | 用途 |
| --- | --- |
| Workers | サーバー側の処理を実行する |
| D1 | SQLでデータを保存・取得する |
| KV | キーと値の組み合わせでデータを扱う |
| R2 | 画像などのファイルを保存する |
| Queues | キューを使った非同期処理を行う |
| Workers AI | AIモデルを呼び出す |

アプリケーションが必要とするリソースをコードから検出し、接続設定やデプロイを行う点が特徴だ。既存のリソースを利用する場合などは、設定で接続先を指定することもできる。

## デプロイの流れ

デプロイ先への接続などを準備したうえで、次のコマンドを実行する。

```sh
void deploy
```

公式ドキュメントによると、この処理で必要なリソースの作成、アプリケーションのビルド、データベースのマイグレーション、Workerの公開などを行う。

ただし、コマンドを実行すればどのプロジェクトでもそのまま公開できるわけではない。利用するフレームワークに応じた設定や、認証、シークレットの登録、マイグレーションの準備が必要になる。

ここでは仕組みの概要を整理しているため、インストールからの具体的な手順は[公式ガイド](https://void.cloud/guide/)を参照する。

## Cloudflareアカウントは必要か

発表時と現在の説明で、特に区別しておきたいのがアカウントの扱いだ。

2026年3月のPublickeyの記事では、Cloudflareアカウントを用意せず、Void側でデプロイと管理を行うサービスとして紹介されていた。

現在の公式ドキュメントには、次の2つの利用方法がある。

- 自分のCloudflareアカウントへ直接デプロイする
- チームが運用するVoid Platformへ接続してデプロイする

直接デプロイする場合は、自分のCloudflareアカウントで認証する。一方、[チーム向けのVoid Platform](https://void.cloud/guide/self-hosted-platform)では、管理者が共有のCloudflareアカウント上に基盤を用意し、開発者がそのプラットフォームへログインして利用する。

そのため、現在のVoid全体を「Cloudflareアカウントが不要なサービス」と説明するのは正確ではない。どちらの方法で利用するかを確認する必要がある。

## 気になっていること

この技術ノートもCloudflare Workersを使って公開しているため、開発から公開までをまとめるVoidの仕組みは気になっている。

特に、データベースやストレージを追加するときに、コードとインフラの設定をどの程度まとめられるのかを確認したい。小さなアプリケーションで、APIとD1を使うところから試すと理解しやすそうだ。

導入を検討するときは、利用するフレームワークへの対応に加えて、生成される設定ファイル、既存リソースとの接続方法、デプロイ失敗時の挙動も確認したい。

## 参考資料

- [ViteネイティブなWebプラットフォーム「Void」発表。Cloudflareの上に構築されたフルスタックの実行環境 | Publickey](https://www.publickey1.jp/blog/26/vitewebvoidcloudflare.html)
- [Void公式サイト](https://void.cloud/)
- [What is Void? | Void](https://void.cloud/guide/)
- [Cloudflare | Void](https://void.cloud/integrations/cloudflare)
- [Install a Void Platform | Void](https://void.cloud/guide/self-hosted-platform)
