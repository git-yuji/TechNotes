---
title: Kitesurfとは？Cloudflareが公開したAIエージェント向けブラウザ
category: 学習
tags: ["Kitesurf", "Cloudflare", "Browser Run", "AIエージェント", "ブラウザ自動化"]
createdAt: 2026-09-01
updatedAt: 2026-09-01
memo: Cloudflareが公開したAIエージェント向けブラウザKitesurfの特徴と、Chromiumとの違いをまとめる。
---

# Kitesurfとは？Cloudflareが公開したAIエージェント向けブラウザ

## 概要

Cloudflareは2026年8月6日、AIエージェント向けブラウザ「Kitesurf」をベータ公開した。

Kitesurfは、人がWebサイトを見るためのデスクトップブラウザではない。AIエージェントによるHTMLの取得、スクリーンショットの撮影、Webページの操作などを想定したブラウザエンジンで、Cloudflare Workers上で動作する。

Cloudflareのブラウザ自動化サービス「Browser Run」から利用でき、ベータ期間中はアカウントごとの上限内で無料提供されている。

## AIエージェント向けに作られたブラウザ

一般的なブラウザエンジンであるChromiumは、人がWebサイトを快適に閲覧するための多くの機能を備えている。一方、AIエージェントがWebページから情報を取得する場合、タブ、テーマ、拡張機能、滑らかなスクロールなどは必ずしも必要ではない。

Kitesurfは、次のようなAIエージェントの処理に重点を置いている。

- HTMLやページ内情報の取得
- スクリーンショットやPDFの生成
- Webページ上の要素の操作
- 多数の短いブラウザ処理の実行
- CPU使用量、メモリ使用量、実行コストの削減

人向けの機能やピクセル単位で正確な描画を省く代わりに、AIエージェントが必要とする処理を軽量に実行する設計になっている。

## Chromiumとの違い

Cloudflareの計測では、スクリーンショットとHTML取得において、KitesurfはChromiumよりCPU使用量が約3倍から4倍、メモリ使用量が約5倍から7倍少なかった。一方、処理の完了までにかかる時間はChromiumより約1.7倍から1.8倍長い結果になっている。

この結果はCloudflareが14個のURLを使って実施した計測によるもので、すべてのWebサイトで同じ差になるとは限らない。ただし、1回の処理速度だけでなく、多数のAIエージェントへブラウザ環境を提供するときの計算資源を重視していることが分かる。

## Kitesurfの利用方法

KitesurfはBrowser RunのQuick ActionsまたはChrome DevTools Protocol（CDP）経由で利用できる。

Quick Actionsでスクリーンショットを撮る場合は、APIのURLへ`browser=kitesurf`を追加する。

```bash
curl -X POST \
  "https://api.cloudflare.com/client/v4/accounts/<ACCOUNT_ID>/browser-run/screenshot?browser=kitesurf" \
  -H "Authorization: Bearer <API_TOKEN>" \
  -H "Content-Type: application/json" \
  --data '{"url":"https://example.com"}' \
  --output screenshot.png
```

CDPに対応しているため、既存のPuppeteer、Playwright、`chrome-remote-interface`から接続することもできる。MCPとCDPに対応したAIエージェントへ接続し、Webページを読むためのツールとして使う方法も公式ドキュメントで紹介されている。

コードを書かずに試したい場合は、公開されているKitesurf PlaygroundへURLを入力すると、ページの描画やDOM、コンソール、ネットワーク通信などを確認できる。

## 現時点での制限

Kitesurfはベータ版であり、Chromiumの代わりとしてすべてのWebサイトに対応するものではない。

公式ドキュメントでは、現時点で次の用途には向いていないとされている。

- 動画の再生やWebGLの描画
- 実際のTLSフィンガープリントが必要なBot対策の通過
- 状態を維持する長時間の認証済みセッション
- ピクセル単位で正確な画面表示が必要なテスト

これらの機能が必要な場合は、Browser Runで標準提供されているChromiumを利用する。対象サイトをKitesurfで正しく扱えるかは、Playgroundなどで実際に試して確認する必要がある。

## 現時点で気になっていること

AIエージェントがWebページを操作するときも、これまでは人向けに作られたChromiumを利用することが多かった。Kitesurfは、AIエージェントには何が必要で、何を省けるのかという視点からブラウザを作り直している点が興味深い。

特に、多数のエージェントが短時間だけブラウザを使う場合に、CPUとメモリの削減がどの程度コストへ反映されるのかが気になる。一方で、実際のWebサイトは構成がさまざまであるため、描画の違いやログインが必要なページでどこまで利用できるのかも確認したい。

今後はPlaygroundやQuick Actionsを使い、静的なページとJavaScriptで描画するページの両方で、HTML取得やスクリーンショットを試してみたい。

## 参考資料

- [Introducing Kitesurf: The agent-first browser that runs in V8 isolates on Cloudflare Workers | Cloudflare Blog](https://blog.cloudflare.com/kitesurf/)
- [Kitesurf | Cloudflare Browser Run docs](https://developers.cloudflare.com/browser-run/kitesurf/)
- [Get started | Cloudflare Browser Run docs](https://developers.cloudflare.com/browser-run/get-started/)
