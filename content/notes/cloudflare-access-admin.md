---
title: Cloudflare Accessで管理画面を本人限定にする方法
category: 設定手順
tags: ["Cloudflare", "Cloudflare Access", "Zero Trust", "認証", "セキュリティ"]
createdAt: 2026-07-31
updatedAt: 2026-07-31
memo: /adminと/admin/*の両方を保護する。カスタムドメイン以外の公開経路も無効化する。
---
# Cloudflare Accessで管理画面を本人限定にする方法

## 概要

公開サイトの管理画面だけをCloudflare Accessで保護し、指定したメールアドレスを持つ本人だけがアクセスできるようにする。

一般公開するノート一覧と詳細画面は保護せず、`/admin`以下だけに認証を適用する。

## 保護するURL

```text
https://notes.yuyu-web.com/admin
https://notes.yuyu-web.com/admin/*
```

`/admin`と`/admin/*`の両方を登録する。

`/admin/*`だけでは、末尾にパスを含まない`/admin`自体が保護対象から外れる可能性があるため注意する。

## アプリケーションを追加する

Cloudflare Zero Trustの管理画面で、次の順番で進む。

1. 「Access」を開く
2. 「アプリケーション」を開く
3. 「アプリケーションを追加する」を選択
4. 「セルフホストとプライベート」を選択
5. 宛先として「パブリックDNS」を選択

## パブリックホスト名を設定する

1つ目の宛先を次のように設定する。

```text
サブドメイン: notes
ドメイン: yuyu-web.com
パス: admin
```

パブリックホスト名を追加し、2つ目を設定する。

```text
サブドメイン: notes
ドメイン: yuyu-web.com
パス: admin/*
```

これにより、管理画面とその配下のページが保護される。

## 認証方法を設定する

個人用の管理画面では、メールアドレスへ確認コードを送るCloudflareの認証方法を利用できる。

ログイン方法が1つだけの場合は「インスタント認証を適用」を有効にすると、IDプロバイダーの選択画面を省略できる。

## Accessポリシーを作成する

次の内容で許可ポリシーを作成する。

```text
ポリシー名: 本人のみ許可
アクション: 許可
含める: メール
値: 自分のメールアドレス
```

「すべての認証済みユーザー」を許可条件にすると、認証できた他の利用者もアクセスできる可能性がある。

個人専用の管理画面では、自分のメールアドレスを明示的に指定する。

## セッション期間

個人利用では、次の設定にすると一定時間ごとの再認証になる。

```text
24 hours
```

## 認証が必要な画面

```text
/admin
/admin/notes/new
/admin/notes/{id}/edit
```

一般公開するページは保護しない。

```text
/
/notes/{id}
```

## workers.dev経由の迂回を防ぐ

カスタムドメインだけにCloudflare Accessを設定しても、`workers.dev`のURLが有効だと、そちらから管理画面へアクセスできる可能性がある。

`wrangler.jsonc`で次の設定を行う。

```json
{
  "workers_dev": false,
  "preview_urls": false
}
```

Cloudflareの管理画面でも、Workers URLとプレビューURLが無効になっていることを確認する。

## 動作確認

未認証状態を確認できるシークレットウィンドウなどを使用する。

### 公開ページ

```text
https://notes.yuyu-web.com/
```

認証なしで表示されることを確認する。

### 管理画面

```text
https://notes.yuyu-web.com/admin
```

Cloudflare Accessのログイン画面へ移動することを確認する。

指定したメールアドレスで認証すると管理画面が表示され、許可していないメールアドレスでは管理画面へ入れないことを確認する。

## 注意点

Cloudflare Accessはアプリケーションへ到達する前に認証を行う。

Next.js側で独自のログイン機能を実装しなくても管理画面を本人限定にできるが、カスタムドメイン以外の公開経路が残っていると認証を迂回される可能性がある。不要な公開URLも合わせて無効化する。
