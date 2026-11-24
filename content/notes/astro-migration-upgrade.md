---
title: 小さなサイトをAstroに移行して、Astro 7まで上げた記録
category: 学習
tags: ["Astro", "Cloudflare Workers", "静的サイト", "バージョンアップ"]
createdAt: 2026-11-24
updatedAt: 2026-11-24
memo: HTMLとCSSのサンプルサイトをAstroへ移行し、更新履歴、404、OGP、noindexを整備してAstro 7まで更新した記録。
---

# 小さなサイトをAstroに移行して、Astro 7まで上げた記録

## 概要

[以前の記事](/notes/muse-github-workflow)で作った、素のHTMLとCSSで書かれた小さなサンプルサイトをAstroに移行した。

移行だけで終わらせず、更新履歴のMarkdown化、カスタム404ページ、OGPとfavicon、noindexの設定も整えた。Astro本体も5.18.2から7.4.13へアップグレードしている。

今回も「Issueを作る → ブランチを切る → Pull Requestを作る → mainにマージする」という流れで進めた。リポジトリは非公開のため、記事内ではリンクしていない。

## Astroへの移行

移行前は、`index.html`や`about.html`を直接書いていた。ヘッダーやフッターもページごとにコピーしていたため、ページが増えると同じ修正を何度も行う必要があった。

Astroでは、次のように整理した。

- 共通部分は`src/layouts/Layout.astro`にまとめる
- ページは`src/pages/`に1ページ1ファイルで置く
- CSSは`src/styles/global.css`にまとめる
- ダークモード切り替えのスクリプトは`public/`に置く

ビルド結果は`dist/`へ出力される。Cloudflare Workers側のビルドコマンドを`npm run build`に設定し、mainへのマージで自動的に公開サイトへ反映されるようにした。

ページの内容や見た目は変えず、構成だけを置き換えた。まずは「移行前と同じように表示できること」を目標にしたので、確認する範囲を絞りやすかった。

## 移行後に整えたこと

### 更新履歴をMarkdownで管理する

更新履歴は、最初はHTMLに直接書いていた。履歴が増えるたびにHTMLを編集するのは手間なので、AstroのContent Collectionsを使ってMarkdown管理に切り替えた。

履歴1件につきMarkdownファイルを一つ用意し、日付、タイトル、関連Issue、並び順をfrontmatterに書く。ページ側ではコレクションを読み込んで表示するようにした。

これで、履歴を足すときはファイルを追加するだけで済む。CIにもfrontmatterの検証を加え、書き間違いをPRの段階で見つけられるようにした。

### カスタム404ページ

存在しないURLを開いたときのために、`src/pages/404.astro`を用意した。

ここで一つ学びがあった。今回のCloudflare Workersの構成では、ページを作るだけでは独自の404が返らず、`wrangler.jsonc`の配信設定も必要だった。

```json
{
  "assets": {
    "directory": "./dist",
    "not_found_handling": "404-page"
  }
}
```

上は静的アセットに関する設定部分の例。Astroで生成した404ページを、Cloudflare側が存在しないURLに対して返すようにする。静的サイトでも、生成側と配信側をセットで確認する必要があると分かった。

### OGPとfavicon

SNSなどで共有されたときの表示も整えた。

- 共通レイアウトに`og:title`、`og:description`、`og:image`などを追加する
- ページごとに説明文を設定する
- faviconを用意する
- OGP用のSVGを、ビルド時にsharpでPNGへ変換する

SVGを元データとして管理し、生成したPNGはGit管理しない構成にした。文言を変えるときはSVGを直してビルドすればよい。

### noindexの設定

実験用のサイトなので、検索結果に載せないよう、共通レイアウトに次のタグを追加した。

```html
<meta name="robots" content="noindex, nofollow">
```

サイトマップは追加せず、CIにはnoindexの設定漏れを確認するチェックも入れた。

`robots.txt`でクロールを遮断すると、クローラーがnoindexを読めなくなるため、今回はメタタグで指定した。ただし、noindexは閲覧を制限する設定ではないので、URLへアクセスすればサイトは見られる。

## Astro 5から7へアップグレード

Astro本体は、5.18.2から7.4.13へ上げた。二つのメジャーバージョンをまたぐため、先にAstro 6と7の公式アップグレードガイドを確認した。

### 事前に確認したこと

今回のサイトで確認した主な点は、次のとおり。

- Astro 6でNode.js 22.12.0以上が必要になる
- Astro 6のガイドでは、`z`を`astro:content`からではなく`astro/zod`から読み込むよう案内されている
- Astro 7では、標準のMarkdown処理エンジンがSätteriに変わる

手元もCloudflare側もNode.js 24を使っていたため、Node.jsの変更は不要だった。一方、更新履歴はMarkdownから表示しているので、ビルドが通るだけでなく、表示も確認することにした。

### 実施した変更と確認

主に変更したのは、次の2点。

1. `package.json`のAstroを`^7.4.13`へ更新する
2. `src/content.config.ts`の`z`のimport先を`astro/zod`へ変える

いきなりPRにせず、先にローカルで同じ変更を試した。ビルド、更新履歴の表示、OGP画像の生成、404ページを確認してから変更を取り込んだ。

今回の計測では、ビルド時間は約2.4秒から約1.6秒になった。小さなサイトでの結果なので一般的な性能差とはいえないが、このサイトでは短くなった。

マージ後は公開サイトでも更新履歴を目視で確認し、表示が崩れていないことを確かめた。

## やってみて分かったこと

### 移行と見た目の変更は分けると進めやすい

Astroへの移行では、内容と見た目を変えずに構成だけを変えた。変更の目的が一つなので、何か違いが出たときも移行に関係する箇所から調べやすい。

### 小さな整備も仕組みに寄せると後が楽

更新履歴はファイルを追加するだけにし、frontmatterやnoindexはCIで確認するようにした。毎回気を付ける項目を増やすより、仕組み側で確認できるようにすると後の作業が楽になる。

### アップグレードは変更前の確認が大きい

最終的な修正は少なかったが、公式ガイドを読み、影響する部分を絞り、ローカルで試すところに時間を使った。コードを直す量より、何を確認すればよいかを先に決めることが大事だと感じた。

## まとめ

素のHTMLだったサイトをAstroに移行し、更新履歴、404、OGP、noindexを整え、Astro 7まで上げることができた。

一つ一つは小さな変更でも、IssueとPRで積み重ねると、サイトの土台はかなり変わる。次は、この土台の上でデータベースを使うような動的な機能も試してみたい。

## 参考資料

- [Astro 6へのアップグレード | Astro Docs](https://docs.astro.build/ja/guides/upgrade-to/v6/)
- [Astro 7へのアップグレード | Astro Docs](https://docs.astro.build/ja/guides/upgrade-to/v7/)
- [Content Collections | Astro Docs](https://docs.astro.build/ja/guides/content-collections/)
- [Wranglerの設定（Assets）| Cloudflare Docs](https://developers.cloudflare.com/workers/wrangler/configuration/#assets)
