---
title: Orcaとは？複数のAIコーディングエージェントを並行管理できるADE
category: 学習
tags: ["Orca", "ADE", "AIエージェント", "Codex", "Claude Code", "Git worktree"]
createdAt: 2026-08-30
updatedAt: 2026-08-30
memo: Orcaは、複数のAIコーディングエージェントを独立したGit worktreeで動かし、結果の比較やレビューまで行える開発環境。
---

# Orcaとは？複数のAIコーディングエージェントを並行管理できるADE

## 概要

AIコーディングエージェントを使う機会が増えると、複数の作業を同時に進めたい場面も増えてくる。

しかし、一つの作業ディレクトリで複数のエージェントを動かすと、同じファイルを同時に変更したり、ブランチの切り替えが必要になったりする。

[Orca](https://www.onorca.dev/)は、Claude Code、Codex、OpenCodeなどのCLI型AIコーディングエージェントを、一つの画面から実行・管理するための開発環境。Git worktreeを利用して作業場所を分離し、複数のエージェントを並行して動かせる。

公式サイトでは、OrcaをIDEではなく「ADE（Agent Development Environment）」と呼んでいる。

## ADEとは

ADEは、Agent Development Environmentの略。

従来のIDEは、人がコードを書き、ファイルを探し、デバッグすることを中心に作られている。一方、OrcaのようなADEは、人と複数のAIエージェントが一緒に作業することを前提としている。

| 種類 | 主な役割 |
| --- | --- |
| IDE | 人がコードの編集、実行、デバッグを行う |
| ADE | AIエージェントの実行、並行作業、進捗確認、差分レビューを管理する |

Orcaにはターミナルやファイルエディタも含まれているため、IDEの機能がまったくないわけではない。特徴は、エージェントごとの作業環境や状態をまとめて管理できることにある。

## Orcaの主な特徴

### Git worktreeで作業を分離する

Orcaでは、タスクごとにGit worktreeとブランチを作成する。

Git worktreeを使うと、同じGitリポジトリに対して複数の作業ディレクトリを用意できる。各エージェントは別のディレクトリとブランチで作業するため、一方のエージェントによるファイル変更が、作業中の別のエージェントへ直接影響しにくい。

公式ドキュメントでは、タスクの流れを次のように説明している。

1. worktreeとブランチを作成する
2. エージェントに作業を依頼する
3. 基準ブランチとの差分を確認する
4. コミット、プッシュ、Pull Requestの作成を行う
5. 不要になったworktreeを削除する

詳しい仕組みは[Worktreesの公式ドキュメント](https://www.onorca.dev/docs/model/worktrees)で確認できる。

### 複数のCLIエージェントを利用できる

Orcaは、Claude Code、Codex、Cursor CLI、GitHub Copilot、Gemini、OpenCodeなど、複数のCLIエージェントに対応している。

Orca自体がAIモデルを提供するのではなく、インストール済みのCLIエージェントをOrcaから起動する仕組み。利用するエージェントは、事前にインストールとログインを行い、必要に応じて各サービスの契約を用意する。

たとえばCodexを使う場合は、Codexをインストールしてログインしたあと、OrcaでCodexを選択する。Orcaは選択したworktreeを作業ディレクトリとしてCodexを起動する。詳細は[Codex in Orca](https://www.onorca.dev/docs/agents/codex)にまとめられている。

### 同じタスクを複数のエージェントへ依頼できる

同じ課題を複数のエージェントへ依頼し、それぞれの実装を比較する使い方もできる。

たとえば、Claude Code、Codex、Cursor CLIへ同じ不具合修正を依頼すると、エージェントごとに別のworktreeとブランチで作業が進む。完了後に差分を比較し、最も目的に合う実装を選べる。

一つのエージェントへ複数のタスクを任せる場合にも、タスクごとにworktreeを分けることで進捗を整理しやすくなる。

### 差分の確認とフィードバックができる

OrcaにはDiff Viewerがあり、AIが変更した内容を基準ブランチと比較できる。

差分の行へコメントを付け、その内容をエージェントへ送り返す機能もある。エージェントの出力を受け取るだけでなく、レビューと修正依頼を同じ画面で繰り返せる。

### ブラウザとDesign Modeを利用できる

worktreeごとにChromiumブラウザを開き、Webアプリの表示を確認できる。

Design Modeでは、画面上の要素を選択し、そのHTML、CSS、スクリーンショットをエージェントへ渡せる。見た目の不具合を文章だけで説明しにくい場合に役立つ。

### スマートフォンから状態を確認できる

デスクトップ版とモバイル版をペアリングすると、スマートフォンからエージェントの状態を確認し、追加の指示を送れる。

デスクトップ版はmacOS、Windows、Linuxに対応し、モバイル版はiOSとAndroid向けに提供されている。

## インストール方法

デスクトップ版は[公式ダウンロードページ](https://www.onorca.dev/download)から取得できる。

macOSでは、Homebrewを使ったインストールにも対応している。

```bash
brew install --cask stablyai/orca/orca
```

OrcaはMIT Licenseで公開されており、ソースコードは[GitHubのstablyai/orcaリポジトリ](https://github.com/stablyai/orca)で確認できる。

## 基本的な使い方

基本的な流れは次のとおり。

1. 利用するCLIエージェントをインストールしてログインする
2. OrcaへローカルのGitリポジトリを追加する
3. タスク名と基準ブランチを指定してworktreeを作成する
4. 利用するエージェントを選び、作業を依頼する
5. エージェントの進捗と変更差分を確認する
6. 必要に応じて修正を依頼する
7. テスト後にコミットやPull Requestの作成を行う

公式ドキュメントの[Your first 3-agent session](https://www.onorca.dev/docs/first-session)では、三つのエージェントへ同じタスクを依頼し、結果を比較するまでの手順が紹介されている。

## 利用するときの注意点

### AIが変更した内容を確認する

worktreeで作業を分離しても、AIが作成したコードが正しいとは限らない。

差分、テスト結果、ブラウザの表示を確認し、意図しないファイル変更やセキュリティ上の問題がないかを人が判断する必要がある。

### マージ時には競合する可能性がある

worktreeを使うと、複数のエージェントが作業中に同じファイルを直接上書きすることは避けやすい。

ただし、複数のブランチが同じ部分を変更していれば、最終的なマージ時に競合する。同時に進めるタスクの範囲を分け、取り込む順番を考えることが大切。

### worktreeごとの環境を確認する

新しいworktreeは独立した作業ディレクトリになるため、Gitで管理していない`.env`、`node_modules`、キャッシュなどは自動で揃わない場合がある。

Orcaには共有ディレクトリや`.worktreeinclude`を使う仕組みがあるが、秘密情報を含むファイルの扱いには注意する。

### テレメトリーの設定を確認する

パッケージ版のOrcaは、匿名の利用状況データを収集する。公式説明では、ファイルの内容、プロンプト、エージェントの出力、リポジトリ名などは送信しないとしている。

匿名データの共有は、アプリの設定または環境変数`DO_NOT_TRACK=1`、`ORCA_TELEMETRY_DISABLED=1`で無効化できる。収集項目と無効化方法は[Privacy & Telemetry](https://www.onorca.dev/docs/telemetry)で確認できる。

## まとめ

Orcaは、複数のAIコーディングエージェントを一つの画面で管理し、タスクごとに独立したGit worktreeで動かせるADE。

特に、複数のタスクを同時に進めたい場合や、同じ課題に対する複数の実装を比較したい場合に役立つ。ターミナル、ファイル編集、ブラウザでの確認、差分レビューまでを一つの環境で行える点も特徴。

一方で、AIの変更内容を確認すること、ブランチをマージするときの競合を解決すること、認証情報や秘密情報を適切に扱うことは利用者の役割になる。

まずは一つのリポジトリと一つのエージェントで基本的な流れを確認し、慣れてから並行作業へ広げると理解しやすい。

## 参考資料

- [Orca公式サイト](https://www.onorca.dev/)
- [Orca公式ドキュメント](https://www.onorca.dev/docs)
- [stablyai/orca | GitHub](https://github.com/stablyai/orca)
- [Worktrees | Orca Docs](https://www.onorca.dev/docs/model/worktrees)
- [Privacy & Telemetry | Orca Docs](https://www.onorca.dev/docs/telemetry)
