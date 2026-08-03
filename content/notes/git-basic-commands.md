---
title: Gitでよく使う基本コマンド
category: 学習
tags: ["Git", "GitHub", "コマンド"]
createdAt: 2026-08-03
updatedAt: 2026-08-03
memo: Gitで普段よく使う基本コマンドと、作業の流れについてまとめる。
---

# Gitでよく使う基本コマンド

## 概要

Gitを使うときによく使う基本コマンドについてまとめる。

まだコマンドを忘れることがあるので、何をするためのコマンドなのかも一緒に覚えていきたい。

## git status

今のファイルの状態を確認するコマンド。

どのファイルを変更したのか、コミットする準備ができているのかを確認できる。

```sh
git status
```

作業を始める前やコミットする前など、迷ったときはまず`git status`を使う。

## git diff

ファイルの変更内容を確認するコマンド。

```sh
git diff
```

自分がどこを変更したのか、不要な変更が入っていないかを確認するときに使う。

## git add

変更したファイルをコミットの対象に追加するコマンド。

ファイルを指定して追加する場合は、次のようにする。

```sh
git add README.md
```

すべての変更を追加する場合は、次のコマンドを使う。

```sh
git add .
```

`git add .`は関係のない変更まで追加することがあるため、実行したあとは`git status`で確認する。

## git commit

追加した変更を、メッセージと一緒に記録するコマンド。

```sh
git commit -m "docs: Gitの基本コマンドを追記"
```

コミットメッセージを見たときに、何を変更したのか分かるように書く。

## git log

今までのコミット履歴を確認するコマンド。

```sh
git log --oneline
```

`--oneline`を付けると、1つのコミットが1行で表示されるため確認しやすい。

## git branch

ブランチの一覧と、今いるブランチを確認するコマンド。

```sh
git branch
```

先頭に`*`が付いているものが、現在作業しているブランチになる。

## git switch

ブランチを切り替えるコマンド。

```sh
git switch main
```

新しいブランチを作成して、そのブランチへ移動するときは`-c`を付ける。

```sh
git switch -c feature/note-search
```

## git pull

GitHubなどにある最新の変更を取得して、今いるブランチに反映するコマンド。

```sh
git pull origin main
```

作業を始める前に最新の状態にしておくことで、ほかの変更との差が大きくなりにくい。

## git push

自分のコミットをGitHubなどへ送るコマンド。

```sh
git push origin feature/note-search
```

初めて送るブランチでは、次のように`-u`を付けることがある。

```sh
git push -u origin feature/note-search
```

一度設定すると、次回からは`git push`だけでも送れるようになる。

## 基本的な作業の流れ

普段の作業では、次の順番で使うことが多い。

```sh
git status
git diff
git add ファイル名
git status
git commit -m "変更内容"
git push
```

特に`git add`や`git commit`の前後で状態を確認するようにしたい。

## まとめ

Gitはコマンドだけを覚えるのではなく、今どのブランチにいて、どの変更をコミットしようとしているのかを確認することが大切だと感じた。

まだ迷うこともあるので、まずは`git status`と`git diff`を使って、状態を確認する習慣をつけていきたい。

## 参考資料

- 特になし
