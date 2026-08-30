---
title: MiMo Codeとは？Xiaomiが公開したAIコーディングエージェント
category: 学習
tags: ["MiMo Code", "Xiaomi", "AI", "AIエージェント", "開発環境"]
createdAt: 2026-08-30
updatedAt: 2026-08-30
memo: XiaomiのMiMoチームが公開したMiMo Codeについて、現時点で分かっていることをまとめる。
---

# MiMo Codeとは？Xiaomiが公開したAIコーディングエージェント

## 概要

XiaomiのMiMoチームが2026年6月10日に、ターミナルで動作するAIコーディングエージェント「MiMo Code」を公開した。

MiMo Codeは、コードの読み書き、コマンドの実行、Gitの操作などをAIへ依頼できるツール。OpenCodeをもとに開発されており、ソースコードはMIT Licenseで公開されている。

## MiMo Codeの特徴

MiMo Codeは、数十回から数百回のやり取りが続く長い開発作業を重視している。

会話が長くなると、専用のサブエージェントが現在の目的、次の作業、変更中のファイルなどをチェックポイントへ保存する。コンテキストが上限へ近づいたときは、その情報から作業状況を再構築して会話を続ける。

公式サイトでは「無限コンテキスト」と紹介されているが、AIモデルが一度に扱える情報量そのものが無制限になるわけではない。保存した作業状況を引き継ぎながら、長い作業を論理的に継続する仕組みになっている。

ほかにも、次の機能が用意されている。

- 調査用の`plan`、開発用の`build`などの作業モード
- 複数のサブエージェントによる並行作業
- プロジェクトのルールや設計判断を残す永続メモリ
- 終了条件を別のモデルが確認する`/goal`コマンド
- MiMo以外のLLMプロバイダーやOpenAI互換APIへの接続

## インストール方法

macOSとLinuxでは、公式のインストールスクリプトを利用できる。

```bash
curl -fsSL https://mimo.xiaomi.com/install | bash
```

npmからインストールする方法も用意されている。

```bash
npm install -g @mimo-ai/cli
mimo
```

接続するAIモデルによって料金や利用上限は異なる。MiMo Code本体がオープンソースでも、利用するモデルまで常に無料になるわけではない点には注意したい。

## 現時点で気になっていること

まだMiMo Codeを実際には使っていないため、使いやすさや回答の精度は分からない。

特に気になったのは、長い会話を単純に要約するのではなく、作業状況やプロジェクトの知識をファイルへ分けて保存する点。AIが何を記憶しているのかを人間が確認し、古い情報を修正できるのは便利そうに感じた。

今後は実際のプロジェクトで試し、導入のしやすさ、権限の設定、長い作業でどの程度情報を引き継げるのかを確認したい。

## 参考資料

- [MiMo Code | Xiaomi MiMo](https://mimo.xiaomi.com/coder?lang=en)
- [MiMo Code：将编程 Agent 扩展到长程任务 | Xiaomi MiMo](https://mimo.xiaomi.com/zh/blog/mimo-code-long-horizon)
- [XiaomiMiMo/MiMo-Code | GitHub](https://github.com/XiaomiMiMo/MiMo-Code)
