---
title: T3 Codeとは？CodexやClaude Codeをまとめて操作するツールとOrcaの違い
category: 学習
tags: ["T3 Code", "Orca", "AIエージェント", "Codex", "Claude Code", "Git worktree"]
createdAt: 2026-10-25
updatedAt: 2026-10-25
memo: T3 Codeの概要と、普段利用しているOrcaとの違いを公式情報から整理した。T3 Codeは未使用。
---

# T3 Codeとは？CodexやClaude Codeをまとめて操作するツールとOrcaの違い

## 調べたきっかけ

普段は、AIコーディングエージェントを使う開発環境としてOrcaを利用している。

同じように複数のエージェントを操作できる[T3 Code](https://t3.codes/)を見かけたため、どのようなツールなのか、Orcaとは何が違うのかを調べた。

T3 Codeはまだ使っていない。この記事は2026年10月25日時点の公式サイトとドキュメントを基にした紹介で、操作感や性能を比較したレビューではない。

## T3 Codeとは

T3 Codeは、CodexやClaude CodeなどのAIコーディングエージェントを、一つの画面から操作するためのオープンソースツール。

公式READMEでは「agent harness control surface」と説明されている。ここでいうharnessは、AIモデルを使ってファイルの編集やコマンド実行などを行うエージェントの仕組みを指す。T3 Codeは、そのエージェントへ指示を送り、作業内容を確認する操作画面という位置付けになる。

現在はCodex、Claude Code、Cursor、Grok Build、OpenCode、Google Antigravityに対応し、デスクトップ版、Web版、iOS・Android版が案内されている。既存のAIサービスの契約や認証を利用する仕組みで、T3 Codeを入れるだけで各サービスを無制限に使えるわけではない。

導入方法や対応エージェントは[公式README](https://github.com/pingdotgg/t3code)で確認できる。

## どのような作業ができるのか

### エージェントへの依頼と変更内容の確認

エージェントとのスレッドで作業を依頼し、変更されたファイルや差分を確認できる。

たとえば、不具合修正を依頼してから、修正されたコードを読み、追加の指示を出す流れを同じツール内で進められる。T3 CodeにもGit worktreeを使う仕組みがあり、公式設定にはworktree用ブランチの命名設定が用意されている。

### コミット・プッシュ・PR作成

スレッドのGit操作から、コミット、プッシュ、Pull Requestの作成を行える。コミットメッセージやPRのタイトル・本文の生成にも対応している。

詳しい連携方法は[Source control](https://github.com/pingdotgg/t3code/blob/main/docs/user/source-control.md)、worktreeの設定は[Settings and project overrides](https://github.com/pingdotgg/t3code/blob/main/docs/user/project-settings.md)に記載されている。

### PC以外の端末から操作

Web版やモバイル版から、エージェントを動かしている環境へ接続して操作できる。

スマートフォンだけで開発環境が完結するという意味ではなく、接続先でリポジトリやエージェントを動かす構成として理解しておくとよい。

## Orcaとの違い

両方とも、複数のAIコーディングエージェントを扱い、既存の契約を利用するためのツール。worktree、差分レビュー、Git操作、モバイルからの操作など、共通する機能も多い。

そのため、「並行作業ができるのはOrcaだけ」「スマートフォンから使えるのはT3 Codeだけ」という分け方はできない。

公式情報から見ると、違いは次のように整理できる。

| 比較する点 | T3 Code | Orca |
| --- | --- | --- |
| 公式の位置付け | エージェントを操作する共通の画面 | Agent Development Environment（ADE） |
| 作業の見せ方 | エージェントとのスレッドと、その変更内容・PR操作を案内 | worktree単位でターミナル、エディタ、ブラウザ、差分を管理 |
| エージェント対応の説明 | 対応プロバイダーを個別に案内 | 対応済みエージェントに加え、任意のCLIエージェントの利用を案内 |
| 画面を使った修正依頼 | 利用時にブラウザ関連の操作範囲を確認したい | 内蔵ChromiumのDesign Modeで要素のHTML・CSS・画像を渡せる |
| 利用する画面 | デスクトップ・Web・モバイルを案内 | デスクトップとモバイルの組み合わせを案内 |

この表は公式が強調している点の比較で、片方に書いていない機能が存在しないと断定するものではない。Orcaの機能は[公式サイト](https://www.onorca.dev/)と[Worktrees](https://www.onorca.dev/docs/model/worktrees)を参照した。

Orcaでは、タスクごとにworktreeを作り、その中でターミナルやブラウザを開いて作業する流れが分かりやすく説明されている。[最初の3エージェントセッション](https://www.onorca.dev/docs/first-session)では、同じ課題を別々のエージェントへ依頼し、結果を比較する手順も紹介されている。

一方、T3 Codeはエージェントとの対話、差分の確認、PR作成をつなぐ画面を前面に出している。公式情報を読む限りでは、複数のエージェントとのやり取りをどのように整理して見せるかが、試してみたい点になる。

Orcaの概要は、以前書いた[Orcaの記事](/notes/orca-agent-development-environment)にもまとめている。

## 試すときに確認したいこと

普段のOrcaと比べるなら、同じリポジトリで小さな修正を一つ依頼し、次の点を確認したい。

- エージェントへの指示と作業状況を追いやすいか
- 変更差分を確認し、追加の修正を依頼しやすいか
- worktreeの作成から片付けまで迷わず進められるか
- Webアプリの表示確認を普段の手順に組み込めるか
- モバイルから接続したとき、どこまで作業を続けられるか

現時点では、速さや使いやすさ、Orcaから乗り換える必要があるかまでは判断していない。まずはエージェントを操作する画面の選択肢として把握しておき、実際に使ったあとで感想を追記したい。

## 参考資料

- [T3 Code公式サイト](https://t3.codes/)
- [pingdotgg/t3code | GitHub](https://github.com/pingdotgg/t3code)
- [Source control | T3 Code](https://github.com/pingdotgg/t3code/blob/main/docs/user/source-control.md)
- [Settings and project overrides | T3 Code](https://github.com/pingdotgg/t3code/blob/main/docs/user/project-settings.md)
- [Orca公式サイト](https://www.onorca.dev/)
- [Worktrees | Orca Docs](https://www.onorca.dev/docs/model/worktrees)
- [Your first 3-agent session | Orca Docs](https://www.onorca.dev/docs/first-session)
