---
title: Cloudflare OSの発表を読んで気になったこと
category: 学習
tags: ["Cloudflare", "Cloudflare OS", "AI", "AIエージェント", "Zero Trust"]
createdAt: 2026-08-08
updatedAt: 2026-08-08
memo: Cloudflare OSの発表を読んで気になったことをまとめる。
---

# Cloudflare OSの発表を読んで気になったこと

## 概要

Cloudflareが2026年8月5日に、企業向けのAIワークスペース「Cloudflare OS」を発表した。

名前にOSと付いているが、WindowsやmacOSのようなOSではない。企業が持つ情報や業務システムとAIエージェントをつなぎ、従業員が仕事に使うための環境として「OS」と表現されている。

## Cloudflare OSでできること

Cloudflare OSでは、ブラウザからAIエージェントへ調査や文書作成、繰り返し作業の自動化などを依頼できる。

AIへ依頼して、業務で使う小さなアプリを作ることもできる。このアプリは「Gadget」と呼ばれ、自分で使うだけでなく、他の人との共有も想定されている。

外部サービスとの接続には「Gatekeeper」という仕組みを使う。AIは最初からすべての情報へアクセスできるわけではなく、必要なものだけを許可する。変更を伴う操作では、人が承認または拒否できるようになっている。

## 現時点で分かっていること

Cloudflare OSは、Cloudflareが自社の従業員向けに開発してきた仕組みを元にしている。ソースコードはGitHubで公開されており、自分のCloudflareアカウントへデプロイする方法も用意されている。

ただし、今回公開されたバージョンは公式リポジトリでも「early access」と案内されている。正式な管理機能の提供時期、具体的な料金、実際の運用に必要な知識などは、まだ分からない部分が多い。

公式発表には「初のAIワークスペース」とあるが、これはCloudflareによる表現であり、他の製品と比較して確認されたものではない。

## 発表を読んで感じたこと

気になったのは、AIとのチャットだけで終わらず、社内の情報を使った作業やアプリ作成までを1つの環境で扱おうとしている点だった。

必要な人がAIと一緒に小さな業務アプリを作れるようになれば、手作業を減らしやすくなるかもしれない。

一方で、AIが作ったアプリを誰が確認し、増えたアプリをどう管理するのかは気になる。作れることと、会社で安心して使い続けられることは別の問題だと思う。

現時点では、すぐに業務の中心へ導入する完成品というより、Cloudflareが考える企業向けAI環境を試せるプロジェクトとして見ている。今後、料金や導入事例が公開されたら、もう一度確認したい。

## 参考資料

- [Cloudflare OS、企業の実際の働き方に基づいて構築された初のAIワークスペース | Cloudflare](https://www.cloudflare.com/ja-jp/press/press-releases/2026/cloudflare-os-is-the-first-ai-workspace-built-around-how-companies-actually-work/)
- [cloudflare/cloudflare-os | GitHub](https://github.com/cloudflare/cloudflare-os)
