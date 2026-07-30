# 管理画面のアクセス制限

公開側のノート一覧・詳細は誰でも閲覧できる状態を保ち、`/admin` 配下だけを
Cloudflare Accessで本人限定にする。

`wrangler.jsonc` では `workers_dev` と `preview_urls` を無効にする。
これにより、Accessを設定したカスタムドメイン以外の公開URLから管理画面へ
迂回されることを防ぐ。

## 保護するパス

Cloudflare Zero TrustのSelf-hosted applicationに、次の2つのパスを登録する。

- `/admin`
- `/admin/*`

`/admin/*` だけでは親パスの `/admin` は保護されないため、両方を登録する。

## 許可ポリシー

Allowポリシーを1つ作成し、本人のメールアドレスだけを指定する。

| 項目 | 設定値 |
| --- | --- |
| Action | `Allow` |
| Rule type | `Include` |
| Selector | `Emails` |
| Value | 本人のメールアドレス |

メールアドレスのドメイン全体ではなく、本人のメールアドレスを完全一致で指定する。
認証方法はOne-time PIN、Google、GitHubなど、Cloudflare Accessで設定済みのIdPを使用する。

## 動作確認

本番反映前に、シークレットウィンドウを使って次を確認する。

1. `/` と `/notes/{id}` はログインせずに表示できる
2. `/admin` はCloudflare Accessの認証画面へ移動する
3. 許可したメールアドレスでは管理画面を表示できる
4. 許可していないメールアドレスでは管理画面を表示できない
5. 新規登録後に公開側の詳細画面へ移動する
6. `*.workers.dev` とPreview URLからアプリへアクセスできない

Cloudflare Accessの設定が完了するまでは、管理機能を本番環境へ反映しない。
