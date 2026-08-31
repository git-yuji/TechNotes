---
title: 個人ブログを作った経緯とドメイン・サーバーの選定
category: 備忘録
tags: ["ブログ", "Astro", "Cloudflare Workers", "Cloudflare Registrar", "ドメイン移管"]
createdAt: 2026-08-31
updatedAt: 2026-08-31
memo: 個人ブログで利用しているドメインの取得先とサーバー、その構成を選んだ経緯をまとめる。
---

# 個人ブログを作った経緯とドメイン・サーバーの選定

## 概要

個人ブログを作るにあたり、ドメインはお名前.comで取得し、その後Cloudflare Registrarへ移管した。ブログはAstroで構築し、公開先にはCloudflare Workersを利用している。

この記事では、現在の構成に至った経緯と、それぞれのサービスを選んだ理由をまとめる。

## ドメインの取得先

ブログで使用するドメインは、最初にお名前.comで取得した。

その後、ドメインの管理先をCloudflare Registrarへ移した。お名前.comの利用に大きな不満があったわけではなく、ドメイン移管を自分で経験してみたかったことが移管の理由だった。

ドメイン移管では、現在の管理先でドメインのロックを解除し、認証コードを取得して、移管先から申請する。実際に移管したことで、ドメインの取得、DNSの設定、Webサイトの公開はそれぞれ別の仕組みであることを整理できた。

ドメインはWebサイトを公開したあとも継続して管理する必要がある。どこで取得するかだけでなく、更新やDNS設定をどのサービスで管理するかも考えておきたい。

## サーバーの選定

Astroで作ったブログの公開先には、Cloudflare Workersを選んだ。

選んだ主な理由は、デプロイが簡単なことと、Gitリポジトリを連携できることだった。GitHubのリポジトリをCloudflare Workersへ接続すると、変更をプッシュしたときにビルドとデプロイを自動で実行できる。

記事やコードをGitで管理し、その変更をそのまま公開につなげられるため、手作業でファイルをアップロードする必要がない。ブログの更新を続けるうえで、公開作業を簡単にできることを重視した。

CloudflareはドメインとDNSの管理にも利用している。管理先をまとめること自体が当初の目的ではなかったが、現在はドメイン、DNS、ブログの公開環境をCloudflare上で確認できる構成になっている。

## まとめ

このブログを作った理由は、学習した内容を記録し、アウトプットする場所を持ちたかったからだ。また、既存のブログサービスを利用するだけでなく、自分でブログを作って公開するところまで経験してみたいという目的もあった。

ドメインの取得や移管、Astroによるサイト構築、Cloudflare Workersへのデプロイまでを自分で行ったことで、記事を書く場所を用意するだけでなく、Webサイトを公開して運用する流れも学ぶことができた。

今後も、学習したことを記録するだけで終わらせず、あとから振り返れる形で継続してアウトプットしていきたい。

## 参考資料

- [Transfer your domain to Cloudflare | Cloudflare Registrar docs](https://developers.cloudflare.com/registrar/get-started/transfer-domain-to-cloudflare/)
- [Git integration | Cloudflare Workers docs](https://developers.cloudflare.com/workers/ci-cd/builds/git-integration/)
- [Astro | Cloudflare Workers docs](https://developers.cloudflare.com/workers/framework-guides/web-apps/astro/)
