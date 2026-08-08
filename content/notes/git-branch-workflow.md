---
title: Gitブランチを作成してPull Requestを出すまでの基本手順
category: 学習
tags: ["Git", "GitHub", "ブランチ", "Pull Request", "コマンド"]
createdAt: 2026-08-08
updatedAt: 2026-08-08
memo: mainブランチを直接変更せず、作業用ブランチの作成からPull Requestまで進める基本的な流れをまとめる。
---

# Gitブランチを作成してPull Requestを出すまでの基本手順

## 概要

Gitでファイルを変更するときは、`main`ブランチを直接変更せず、作業内容ごとにブランチを作成する。

この記事では、作業前の確認からブランチの作成、コミット、GitHubへのプッシュ、Pull Requestの作成までの基本的な流れをまとめる。

Gitの各コマンドの役割は、[Gitでよく使う基本コマンド](/notes/git-basic-commands)にもまとめている。

## ブランチとは

ブランチは、現在のコードから作業を分けるための仕組み。

機能追加や不具合修正など、作業内容ごとにブランチを作成すると、公開中のコードへ直接影響を与えずに変更を進められる。また、Pull Requestではブランチ間の差分を確認してから`main`へ反映できる。

```text
main
  └── docs/git-branch-workflow
        └── 記事を追加する
```

## 作業前の状態を確認する

最初に、現在のブランチとファイルの状態を確認する。

```sh
git status
```

出力の先頭に、現在のブランチ名が表示される。

```text
On branch main
Your branch is up to date with 'origin/main'.
nothing to commit, working tree clean
```

`working tree clean`と表示されていれば、コミットしていない変更はない。

変更中のファイルが表示された場合は、その変更が現在の作業に必要なものか確認してから次へ進む。内容を確認せずに削除したり、別のブランチへ移動したりしないようにする。

## mainブランチを最新にする

`main`ブランチへ切り替える。

```sh
git switch main
```

GitHubにある最新の変更を取得して、ローカルの`main`へ反映する。

```sh
git pull origin main
```

古い`main`からブランチを作ると、ほかの変更との差分が増えたり、Pull Requestで競合したりすることがある。そのため、ブランチを作る前に`main`を最新にしておく。

## 作業用ブランチを作成する

`git switch -c`を使うと、新しいブランチを作成し、そのブランチへ切り替えられる。

```sh
git switch -c docs/git-branch-workflow
```

`-c`は、新しいブランチを作成するためのオプション。

ブランチ名には、作業内容に合う接頭辞を付けると目的が分かりやすい。

| 接頭辞 | 用途 | 例 |
| --- | --- | --- |
| `feat/` | 機能の追加 | `feat/note-search` |
| `fix/` | 不具合の修正 | `fix/search-error` |
| `docs/` | ドキュメントの追加・更新 | `docs/git-branch-workflow` |
| `style/` | 見た目やレイアウトの変更 | `style/note-card-layout` |
| `refactor/` | 挙動を変えないコードの整理 | `refactor/note-loader` |
| `test/` | テストの追加・修正 | `test/note-search` |
| `chore/` | 設定や依存関係の変更 | `chore/update-nextjs` |

切り替えたあとは、もう一度現在のブランチを確認する。

```sh
git branch --show-current
```

```text
docs/git-branch-workflow
```

## ファイルを変更する

作業用ブランチへ切り替えた状態で、ファイルの追加や修正を行う。

変更後は、対象のファイルを確認する。

```sh
git status
```

さらに、ファイルの具体的な変更内容を確認する。

```sh
git diff
```

意図した変更だけが含まれていることを確認してから、コミットの準備へ進む。

## 変更をコミットする

コミットへ含めるファイルを指定する。

```sh
git add content/notes/git-branch-workflow.md
```

`git add .`でもすべての変更を追加できるが、関係のないファイルまで含まれることがある。ファイルを指定して追加すると、コミットの範囲を確認しやすい。

ステージングした内容を確認する。

```sh
git diff --staged
```

問題がなければ、変更内容を表すメッセージを付けてコミットする。

```sh
git commit -m "docs: Gitブランチの作業手順を追加"
```

コミット後は、状態を確認する。

```sh
git status
```

## GitHubへプッシュする

作成したブランチを初めてGitHubへ送るときは、次のコマンドを実行する。

```sh
git push -u origin docs/git-branch-workflow
```

`-u`を付けると、ローカルブランチとGitHub上のブランチが関連付けられる。2回目以降は、次のコマンドだけでプッシュできる。

```sh
git push
```

## Pull Requestを作成する

プッシュ後、GitHubでPull Requestを作成する。

ブランチの指定は次のようになる。

```text
base: main
compare: docs/git-branch-workflow
```

- `base`は変更を取り込むブランチ
- `compare`は今回変更した作業用ブランチ

Pull Requestのタイトルと本文には、何を変更したのか、なぜ変更したのか、どのように確認したのかを書く。

書き方は、[GitHub PRのタイトルと本文を書くときのテンプレート](/notes/github-pr-template)にまとめている。

## マージ後にブランチを整理する

Pull Requestをマージしたら、ローカルの`main`へ戻る。

```sh
git switch main
```

マージされた変更を取得する。

```sh
git pull origin main
```

作業用ブランチが不要になったことを確認してから、ローカルブランチを削除する。

```sh
git branch -d docs/git-branch-workflow
```

`-d`は、まだマージされていない変更がある場合に削除を止めてくれる。警告が表示されたときは、強制削除せず、ブランチの状態を確認する。

## よくある問題

### ブランチがすでに存在する

`git switch -c`で既存のブランチ名を指定すると、次のようなエラーが表示される。

```text
fatal: a branch named 'docs/git-branch-workflow' already exists
```

新しく作る必要はないため、既存のブランチへ切り替える。

```sh
git switch docs/git-branch-workflow
```

### 変更が残っていてブランチを切り替えられない

ブランチを切り替えると変更が失われる可能性がある場合、Gitは切り替えを中止する。

```text
error: Your local changes to the following files would be overwritten by checkout
```

この場合は、`git status`と`git diff`で変更内容を確認する。必要な変更であればコミットするなど、現在の作業を整理してから切り替える。

### 間違ったブランチで作業を始めた

コミット前に気付いた場合は、まず変更内容を確認する。変更を残したまま安全に移動できるかは、移動先ブランチとの差分によって異なる。

慌てて変更を削除せず、必要に応じて一度コミットするか、`git stash`で一時的に退避してから正しいブランチへ移動する。

## 作業の流れ

基本的な流れをまとめると、次のようになる。

```sh
git status
git switch main
git pull origin main
git switch -c docs/git-branch-workflow

# ファイルを変更する

git status
git diff
git add content/notes/git-branch-workflow.md
git diff --staged
git commit -m "docs: Gitブランチの作業手順を追加"
git push -u origin docs/git-branch-workflow
```

作業を始める前とコミット前に、現在のブランチと変更内容を確認することが大切。

## まとめ

作業用ブランチを使うと、`main`を安定した状態に保ちながら変更を進められる。

最初はコマンドの順番を忘れることがあるため、`git status`で現在の状態を確認しながら、一つずつ進めるようにしたい。

## 参考資料

- [Git - git-switch Documentation](https://git-scm.com/docs/git-switch)
- [GitHub Docs - Branches](https://docs.github.com/ja/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-branches)
- [GitHub Docs - Creating a pull request](https://docs.github.com/ja/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request)
