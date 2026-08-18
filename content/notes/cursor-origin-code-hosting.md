---
title: Cursor Originとは？AIエージェント時代のコードホスティング
category: 学習
tags: ["Cursor", "Origin", "Git", "GitHub", "AIエージェント"]
createdAt: 2026-08-18
updatedAt: 2026-08-18
memo: Cursorが発表したコードホスティング機能「Origin」でできることと、気になった点をまとめる。
---

# Cursor Originとは？AIエージェント時代のコードホスティング

## 概要

Cursorが2026年8月17日に、コードホスティング機能「Origin」のearly betaを開始した。

コードホスティングは、Gitリポジトリをサーバー上で保管し、チームで共有するための仕組み。GitHub、GitLab、Bitbucketなどがよく知られている。

Originでは、リポジトリの作成、コードの閲覧、Pull Requestの作成やレビューなどをCursor内で行える。GitHubのリポジトリを同期して使うこともできる。

## Originでできること

### リポジトリを作成する

Cursorの新しい`Codebase`タブからOriginのリポジトリを作成できる。

リポジトリを作成すると、Origin CLIのインストール方法や、リポジトリをcloneするコマンド、手元のプロジェクトをpushするコマンドが表示される。

最初のリポジトリを作成するときに、コードベースの名前を設定する。この名前は`cursor.com/codebase/acme-corp`のように、各リポジトリのURLの一部として使われる。

### GitHubのリポジトリを同期する

Originで新しくリポジトリを作るだけでなく、既存のGitHubリポジトリを同期できる。

GitHubをCursorへ接続し、Organizationと対象のリポジトリを選ぶと、Originへリポジトリが取り込まれる。同期するリポジトリは個別に選択でき、あとから接続を解除することもできる。

同期したリポジトリはOrigin上で閲覧、検索、pullできる。一方、push先は引き続きGitHubとなり、GitHubが正しい情報の置き場所である「source of truth」として扱われる。

そのため、GitHubからOriginへリポジトリを完全に移行しなくても試せる。

### Pull Requestを確認する

各リポジトリでは、Pull Requestのタイムライン、コミット、チェック結果、変更ファイルを確認できる。

コードの差分をレビューし、コメントを付け、マージまで行える。GitHubから同期したPull Requestは双方向で更新され、Cursorで書いたコメントはGitHubへ反映される。GitHub側の返信やリアクションもCursorへ表示される。

GitHubで自分に割り当てられたレビューを、Cursorから確認してマージする使い方もできる。

### 外部サービスと連携する

Originは、Vercel、Depot、Buildkiteとの連携に対応している。

Vercelを接続すると、Pull Requestごとにプレビューデプロイを作成し、動作確認やコメントを行える。マージ後の本番デプロイにもつながる。

DepotとBuildkiteは、既存のGitHub Actionsワークフローを実行できる。Buildkiteでは、Buildkite独自のパイプラインも利用できる。

リポジトリの設定画面では、GitHubとの同期状況、アクセスできる人、接続中のアプリを確認できる。

## 現時点で分かっていること

Originは、Cursorのすべての有料プランを対象にearly betaとして順次提供される。Enterpriseでは、管理者が無効にした組織を除いて提供される。

最初に提供されるのは、リポジトリ、Pull Request、コード閲覧、GitHub同期など、コードホスティングに必要な基本機能。Cursorは、AIエージェント向けの機能も今後追加すると案内している。

正式版の提供時期、Origin単体の料金、保存容量や利用量の上限など、公式発表だけでは分からない部分もある。early betaの間は、重要なリポジトリをすぐに移行するのではなく、機能や制限を確認しながら試す必要がある。

## 発表を読んで感じたこと

Originで気になったのは、AIエージェントがコードを変更する場所と、その変更を保存してレビューする場所がCursorの中でつながることだった。

これまでもCursorでコードを変更し、GitHubでPull Requestをレビューできた。ただし、作業の途中でCursorとGitHubを行き来する場面は多い。Originによってリポジトリ、エージェント、レビュー、デプロイがまとまれば、作業の流れは分かりやすくなりそう。

一方で、コードホスティングはソースコードを預ける重要なサービス。使いやすさだけでなく、障害時の対応、バックアップ、アクセス権限、監査ログ、外部サービスとの連携なども確認したい。

現時点ではGitHubとの同期が用意されており、GitHubをsource of truthのまま使える。まずは既存の作業方法を残しながらOriginを試し、Cursor内でのレビューやAIエージェントとの連携がどれだけ便利になるかを見るのがよさそう。

## まとめ

Cursor Originは、リポジトリの保管、コード閲覧、Pull Request、GitHub同期をCursor内で扱うためのコードホスティング機能。

Vercel、Depot、Buildkiteとの連携も用意されており、コードの変更からレビュー、テスト、デプロイまでを1つの流れにまとめようとしている。

まだearly betaのため、すぐにGitHubの代わりとして使うというより、GitHubと同期しながら新しい開発の進め方を試す段階だと思う。今後追加されるAIエージェント向けの機能や、正式版の料金と制限も確認したい。

## 参考資料

- [Origin コードホスティング | Cursor](https://cursor.com/ja/changelog/origin-code-hosting)
- [Cursor Origin](https://cursor.com/origin)
