# YUYU WEB セキュリティモデル（脅威モデル）

対象: `git-yuji/main-site`（コミット 273329d 時点）と `git-yuji/TechNotes`（コミット 66d3d9e 時点）。両リポジトリで同じ内容を管理しています。本書はコードから作成し、リポジトリ所有者の回答（2026-11-15）で確認された事実は「ユーザー確認済み」と明記しています。それ以外はコードからの推定です。セキュリティスキャンはこのファイルを出発点に検出結果の優先度を判断します。

## 1. システム概要と信頼境界

| コンポーネント | 対象コード | 概要 |
| --- | --- | --- |
| **main-site 静的サイト** | `git-yuji/main-site`: `src/**`, `public/**`, `astro.config.mjs` | Astro（`output: "static"`）で生成した yuyu-web.com のポータル。Cloudflare Workers Static Assets（`wrangler.jsonc`、Worker スクリプトなし）で配信。`public/_redirects` で `/blog*` を `/` へ 301。ユーザー入力・フォーム・サーバー処理なし。Vanta.js / Three.js による背景アニメーション。 |
| **TechNotes Web アプリ** | `git-yuji/TechNotes`: `src/app/**`, `src/components/**`, `src/lib/**` | notes.yuyu-web.com。Next.js 16 App Router を OpenNext で Cloudflare Workers 上で実行（`nodejs_compat`、`IMAGES` バインディング、`WORKER_SELF_REFERENCE`）。トップページ `src/app/page.tsx` は `force-dynamic` で検索パラメータ `q`/`category`/`tag` を受け取る。ノート詳細 `src/app/notes/[id]/page.tsx` は `generateStaticParams` で静的生成。 |
| **ノートコンテンツ生成** | `git-yuji/TechNotes`: `content/notes/*.md`, `scripts/generate-notes.mjs`, `src/components/markdown-content.tsx` | Git 管理の Markdown を独自 frontmatter パーサで `src/generated/notes.ts` に変換。`react-markdown` + `remark-gfm` で描画（`rehype-raw` なし＝生 HTML は描画されない）。リンク `href`・画像 `src` は Markdown の値をそのまま使用。 |
| **CI / デプロイ / 依存関係** | 両リポジトリ: `.github/workflows/*`, `.github/dependabot.yml`, `package.json`, `package-lock.json`, `wrangler.jsonc` | GitHub Actions（`permissions: contents: read`、PR でも実行）、Dependabot（main-site は月次）。デプロイは Cloudflare の Git 連携（TechNotes）/ `wrangler deploy`（main-site）。 |

信頼境界:
1. インターネット上の訪問者 → Cloudflare エッジ（両サイト）。
2. 訪問者のクエリ文字列 → TechNotes の Worker（`src/app/page.tsx`）。
3. リポジトリの `main` ブランチ → ビルド / デプロイ（Cloudflare Git 連携、GitHub Actions）。
4. npm レジストリ → ビルド成果物（サプライチェーン）。

インフラ用リポジトリ: なし（ユーザー確認済み: Cloudflare ダッシュボードで管理）。リポジトリ内の Cloudflare 設定は `wrangler.jsonc` / `public/_redirects` / `public/_headers` のみ。

## 2. エントリポイントと到達可能な主体

| エントリポイント | 到達できる主体 |
| --- | --- |
| main-site の静的ページ（`/`, `/about/`, `/works/`, 404） | 誰でも（匿名） |
| TechNotes `/`（`?q=&category=&tag=`） | 誰でも（匿名）。`q` は 100 文字に切り詰め、`category` は許可リスト照合、`tag` は無加工 |
| TechNotes `/notes/[id]` | 誰でも（匿名）。存在しない id は `notFound()` |
| TechNotes `/_next/image` 等 OpenNext の組み込みルート、`robots.ts` / `sitemap.ts` | 誰でも（匿名） |
| `content/notes/*.md` の追加・変更 | リポジトリへの書き込み権限を持つ人（ユーザー確認済み: オーナー本人のみ） |
| GitHub Actions（PR トリガー） | PR を作れる人（公開リポジトリなら誰でも。`contents: read` でシークレットは未使用） |

## 3. 資産とデータの重要度

- 利用者の個人データ・認証情報・データベース: **なし**（両サイトとも保持しない）。
- 次の3つは同程度に重要（ユーザー確認済み）:
  - **サイトの完全性**: コンテンツ・リダイレクト・配信内容の改ざん防止。
  - **訪問者のブラウザの安全**: XSS、オープンリダイレクト、悪性スクリプトの配信。
  - **デプロイ用認証情報**: Cloudflare API トークン / Git 連携、GitHub アカウント。リポジトリ内には存在しない想定（`.env*`, `.dev.vars*` は `.gitignore`）。
- 可用性: 対象外（ユーザー確認済み: DoS / レート制限は Cloudflare 任せ）。

## 4. 想定する攻撃者（ユーザー確認済み）

- **匿名のインターネット訪問者**: クエリ文字列や URL を操作できる。認証済み領域はない。
- **悪意のある Pull Request を送る外部の人**: 公開リポジトリへの PR で CI（GitHub Actions）や Cloudflare のビルドを動かせる。マージ権限はない。
- **サプライチェーン（依存パッケージの乗っ取り）**: 侵害された npm パッケージ（three / vanta / astro / next / react-markdown / @opennextjs/cloudflare 等）や GitHub Actions。
- **リポジトリ書き込み権限者**: オーナー本人のみで信頼済み。

## 5. 既存の対策

- main-site は完全静的でサーバー側の攻撃面がほぼない。
- TechNotes の Markdown 描画は生 HTML 無効（`rehype-raw` なし）。React のエスケープ。
- `category` は許可リスト、`q` は長さ制限。
- ノート詳細は `generateStaticParams` によるビルド時生成。
- `wrangler.jsonc`: `workers_dev: false`, `preview_urls: false`, `global_fetch_strictly_public`。
- GitHub Actions は `permissions: contents: read`。Dependabot による依存更新。
- `.env*` / `.dev.vars*` を Git 管理対象外に設定。
