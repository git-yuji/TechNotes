---
title: cp・mkdirの基本操作とVimの起動方法
category: 学習
tags: ["Linux", "コマンド", "Vim"]
createdAt: 2026-07-31
updatedAt: 2026-08-04
memo: cp、mkdirの基本操作とVimの起動方法について学んだ内容をまとめる。
---

# cp・mkdirの基本操作とVimの起動方法

## 概要

`cp`、`mkdir`の基本操作とVimの起動方法についてまとめる。

## cp

### コマンドの役割

ファイルやディレクトリをコピーするコマンド。

### 基本的な使い方

```sh
cp index.html /path/sample/
cp -r sample-dir /path/sample/
```

## mkdir

### コマンドの役割

フォルダを作成するコマンド。

### 基本的な使い方

```sh
mkdir sample
```

## Vimの起動

Vimでファイルを開く場合は、`vim`コマンドにファイル名を指定する。

```sh
vim index.html
```

カーソル移動、編集、検索、保存などの操作は、[よく使うVim操作のチートシート](/notes/vim-cheatsheet)にまとめる。

## まとめ

普段から使わないと忘れることがあるため、日常的にターミナルを使って操作に慣れていきたい。

## 参考資料

- 特になし
