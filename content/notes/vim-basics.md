---
title: cp・mkdir・Vimの基本操作
category: 学習
tags: ["Linux", "コマンド", "Vim"]
createdAt: 2026-07-31
updatedAt: 2026-07-31
memo: cp、mkdir、Vimの基本操作について学んだ内容をまとめる。
---

# cp・mkdir・Vimの基本操作

## 概要

今日学んだ`cp`、`mkdir`、`Vim`の基本操作についてまとめる。

## cp

### コマンドの役割
コピーコマンド、ディレクトやファイルやコピーできる。

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

## Vimの基本操作

### Vimの起動

```sh
vim index.html
```

### モードの切り替え
`Esc`と`i`,`a` でモードを切り替える。

### ファイルの保存と終了
- :w 保存
- :wq 保存して閉じる
- :q! 保存しないで強制的に閉じる

## まとめ
普段から使わないと忘れることがあるので、業務内からできるだけターミナルを使っていきたい。

## 参考資料

- 特になし
