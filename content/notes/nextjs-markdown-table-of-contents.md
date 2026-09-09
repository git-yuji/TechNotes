---
title: Next.jsでMarkdown記事に目次と見出しリンクを自動生成する方法
category: 設定手順
tags: ["Next.js", "Markdown", "React", "目次", "アクセシビリティ"]
createdAt: 2026-09-09
updatedAt: 2026-09-09
memo: react-markdownで表示するMarkdown記事から見出しを取り出し、目次と見出しリンクを自動生成する方法をまとめる。
---

# Next.jsでMarkdown記事に目次と見出しリンクを自動生成する方法

## 概要

長い記事では、最初に目次があると内容の全体像をつかみやすくなる。目次の項目を選んだときに対応する見出しまで移動できれば、必要な情報も探しやすい。

この記事では、Next.jsと`react-markdown`で作った記事ページに、次の機能を追加する方法をまとめる。

- Markdownの`##`と`###`から目次を自動生成する
- 目次を選ぶと対応する見出しまで移動する
- 各見出しに、その場所を直接共有できるリンクを付ける
- 同じ名前の見出しが複数あっても、リンク先が重複しないようにする
- コードブロック内の`##`を見出しとして扱わないようにする

この記事のコードはTypeScriptを使っている。見た目の指定にはTailwind CSSを使っているが、目次を作る処理自体は通常のCSSを使う場合でも同じように実装できる。

## はじめに知っておきたい用語

最初に、この記事で使う用語を確認する。

| 用語 | 意味 |
| --- | --- |
| Next.js | Reactを使ってWebサイトやWebアプリを作るためのフレームワーク。ページの作成やルーティングなど、Web開発に必要な仕組みが用意されている。 |
| Markdown | `# 見出し`や`- リスト`のような記号を使って文章の構造を表す書き方。拡張子には`.md`がよく使われる。 |
| `react-markdown` | Markdownの文字列をReactの画面として表示するライブラリ。見出しやリンクなどの表示方法をReactコンポーネントで変更できる。 |
| コンポーネント | ボタンや目次など、画面を構成する部品。Reactでは、表示内容を返す関数として作ることが多い。 |
| slug | 見出しなどの文字列を、URLで使いやすい形へ変換した文字列。この記事では「はじめに」を`はじめに`、「使い方の例」を`使い方の例`のように変換する。 |
| アンカーリンク | 同じページ内の特定の場所へ移動するリンク。`href="#概要"`のリンクは、`id="概要"`を持つ要素へ移動する。 |
| ハッシュ | URLの`#`以降の部分。`/notes/example#概要`では`#概要`がハッシュになる。フラグメントとも呼ばれる。 |
| 正規表現 | 文字列の並び方をパターンで表す方法。この記事では、行の先頭にある`##`や`###`を探すために使う。 |
| アクセシビリティ | 年齢や障害、利用環境などにかかわらず、できるだけ多くの人がWebサイトを利用できるようにする考え方。 |

## 今回作る仕組み

今回の処理は、大きく3つに分けられる。

```text
Markdownの記事
  ↓ 見出しを抽出する
見出しの一覧
  ├── 目次を表示する
  └── 本文の見出しへ同じidを付ける
```

たとえば、Markdownに次の見出しがあるとする。

```md
## 概要

### 必要なもの
```

見出しの一覧は、次のようなデータに変換する。

```ts
[
  { id: "概要", level: 2, text: "概要", offset: 0 },
  { id: "必要なもの", level: 3, text: "必要なもの", offset: 7 },
]
```

それぞれの値には、次の役割がある。

- `id`: 目次のリンク先と、本文の見出しを結び付ける名前
- `level`: `##`なら`2`、`###`なら`3`
- `text`: 画面に表示する見出しの文字
- `offset`: Markdown全体の先頭から、その見出しまでに何文字あるかを表す位置

`offset`は、目次から取り出した見出しと、`react-markdown`が表示している見出しを正しく対応させるために使う。

## 見出しを表す型を作る

まず、見出しのデータがどのような形になるかをTypeScriptの型で定義する。

`src/lib/markdown-headings.ts`を作成し、次の型を追加する。

```ts
export type MarkdownHeading = {
  id: string;
  level: 2 | 3;
  text: string;
  offset: number;
};
```

型は、データに入る値の種類を決めるもの。ここでは`level`を`2 | 3`としているため、`2`または`3`以外の数値は入れられない。

記事タイトルには`#`を使い、本文の大見出しには`##`、その中の小見出しには`###`を使う想定なので、目次の対象を`##`と`###`だけにしている。

## 見出しの文字を整える

Markdownの見出しには、リンクや強調などの記号が含まれることがある。

```md
## **重要**な[設定](https://example.com)
```

この文字列をそのまま目次へ表示すると、`**`やリンク先のURLまで残ってしまう。そのため、画面に見える文字だけを取り出す関数を作る。

```ts
function getHeadingText(source: string) {
  return source
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/`+([^`]+)`+/g, "$1")
    .replace(/<([^>]+)>/g, "$1")
    .replace(/[\*_~]/g, "")
    .replace(/\\([\\`*{}\[\]()#+\-.!_>~])/g, "$1")
    .trim();
}
```

`replace`は、条件に一致した文字を別の文字へ置き換える処理。たとえばMarkdownのリンクは、リンク先を取り除いて表示文字だけを残す。

この処理は、記事内で使用する基本的なMarkdown記法を対象にしている。複雑な独自記法も扱う場合は、正規表現だけで処理せず、Markdownを解析するライブラリの利用も検討する。

## URLで使うslugを作る

次に、見出しの文字から`id`に使うslugを作る。

```ts
function getHeadingSlug(text: string) {
  return (
    text
      .normalize("NFKC")
      .toLocaleLowerCase("ja-JP")
      .replace(/\s+/g, "-")
      .replace(/[^\p{Letter}\p{Number}_-]/gu, "")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "") || "section"
  );
}
```

処理の内容は次のとおり。

1. `normalize("NFKC")`で、全角英数字などの表記の違いを整える
2. `toLocaleLowerCase("ja-JP")`で、英字を小文字にする
3. 空白を`-`へ置き換える
4. URLで扱いにくい記号を取り除く
5. 連続した`-`や、先頭と末尾の`-`を取り除く
6. すべての文字がなくなった場合は`section`を使う

`NFKC`はUnicode正規化形式の一つ。同じように見える文字の表現をそろえ、安定したslugを作りやすくするために使っている。

## Markdownから見出しを抽出する

同じファイルへ、Markdown全体から見出しを取り出す関数を追加する。

```ts
export function extractMarkdownHeadings(markdown: string): MarkdownHeading[] {
  const headings: MarkdownHeading[] = [];
  const slugCounts = new Map<string, number>();
  let fence: { marker: "`" | "~"; length: number } | undefined;
  let offset = 0;

  for (const sourceLine of markdown.split("\n")) {
    const line = sourceLine.endsWith("\r")
      ? sourceLine.slice(0, -1)
      : sourceLine;
    const fenceMatch = line.match(/^ {0,3}(`{3,}|~{3,})/);

    if (fence) {
      if (
        fenceMatch &&
        fenceMatch[1][0] === fence.marker &&
        fenceMatch[1].length >= fence.length &&
        line.slice(fenceMatch[0].length).trim() === ""
      ) {
        fence = undefined;
      }
    } else if (fenceMatch) {
      fence = {
        marker: fenceMatch[1][0] as "`" | "~",
        length: fenceMatch[1].length,
      };
    } else {
      const headingMatch = line.match(/^ {0,3}(#{2,3})(?:[\t ]+|$)(.*)$/);

      if (headingMatch) {
        const text = getHeadingText(
          headingMatch[2].replace(/[\t ]+#+[\t ]*$/, ""),
        );

        if (text) {
          const baseSlug = getHeadingSlug(text);
          const count = (slugCounts.get(baseSlug) ?? 0) + 1;
          slugCounts.set(baseSlug, count);
          headings.push({
            id: count === 1 ? baseSlug : `${baseSlug}-${count}`,
            level: headingMatch[1].length as 2 | 3,
            text,
            offset,
          });
        }
      }
    }

    offset += sourceLine.length + 1;
  }

  return headings;
}
```

### コードブロックを除外する理由

Markdownでは、3個以上のバッククォートまたは`~`で囲んだ範囲をコードブロックとして表示できる。

````md
```md
## これはコード例
```
````

この中にある`##`は説明用のコードであり、記事の見出しではない。`fence`には、現在コードブロックの中にいるかどうかを保存している。コードブロック内では見出しを探さないことで、誤って目次へ追加されるのを防ぐ。

### 同じ見出し名へ連番を付ける理由

一つの記事で「まとめ」という見出しを2回使うと、どちらも`id="まとめ"`になってしまう。同じ`id`が複数あると、リンク先を正しく区別できない。

`Map`は、名前と値の組み合わせを保存する仕組み。ここではslugごとの登場回数を保存し、2回目以降に連番を付ける。

```text
まとめ
まとめ-2
まとめ-3
```

## 目次コンポーネントを作る

`src/components/table-of-contents.tsx`を作成し、抽出した見出しをリンクとして表示する。

```tsx
import type { MarkdownHeading } from "@/lib/markdown-headings";

type TableOfContentsProps = {
  headings: MarkdownHeading[];
};

export function TableOfContents({ headings }: TableOfContentsProps) {
  if (headings.length === 0) {
    return null;
  }

  return (
    <nav aria-labelledby="note-table-of-contents-heading">
      <p id="note-table-of-contents-heading">目次</p>
      <ul>
        {headings.map((heading) => (
          <li key={heading.id} className={heading.level === 3 ? "ml-5" : undefined}>
            <a href={`#${heading.id}`}>{heading.text}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
```

`<nav>`は、ページ内を移動するためのまとまりを表すHTML要素。`aria-labelledby`には「このナビゲーションの名前は、指定した`id`を持つ要素に書かれている」と支援技術へ伝える役割がある。

`###`の小見出しは`ml-5`で左側に余白を付け、`##`の下にある項目だと分かるようにしている。

## 本文の見出しへidを付ける

最後に、Markdownを表示するコンポーネントで目次と本文を結び付ける。

```tsx
import ReactMarkdown from "react-markdown";
import { TableOfContents } from "@/components/table-of-contents";
import { extractMarkdownHeadings } from "@/lib/markdown-headings";

type MarkdownContentProps = {
  content: string;
};

export function MarkdownContent({ content }: MarkdownContentProps) {
  const headings = extractMarkdownHeadings(content);
  const headingsByOffset = new Map(
    headings.map((heading) => [heading.offset, heading]),
  );

  return (
    <>
      <TableOfContents headings={headings} />
      <ReactMarkdown
        components={{
          h2: ({ children, node }) => {
            const offset = node?.position?.start.offset ?? -1;
            const heading = headingsByOffset.get(offset);

            return <h2 id={heading?.id}>{children}</h2>;
          },
          h3: ({ children, node }) => {
            const offset = node?.position?.start.offset ?? -1;
            const heading = headingsByOffset.get(offset);

            return <h3 id={heading?.id}>{children}</h3>;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </>
  );
}
```

`react-markdown`の`components`を使うと、Markdownから作られる`h2`や`h3`の表示方法を変更できる。各コンポーネントへ渡される`node`には、元のMarkdown内での位置が含まれている。

目次を作るときに保存した`offset`と、`node.position.start.offset`を照合することで、同じ場所にある見出しの`id`を設定している。

これで、目次のリンクが`href="#概要"`、本文の見出しが`id="概要"`となり、目次から見出しへ移動できる。

## 見出し自体にリンクを付ける

見出しの場所をURLとしてコピーできるように、`#`リンクも追加する。

```tsx
function HeadingLink({ id, text }: { id: string; text: string }) {
  return (
    <a
      href={`#${id}`}
      aria-label={`${text}へのリンク`}
      title="この見出しへのリンク"
    >
      <span aria-hidden="true">#</span>
    </a>
  );
}
```

先ほどの`h2`では、次のように呼び出す。

```tsx
return (
  <h2 id={heading?.id}>
    {children}
    {heading && <HeadingLink id={heading.id} text={heading.text} />}
  </h2>
);
```

画面に見える`#`だけではリンクの目的が分かりにくいため、`aria-label`で「概要へのリンク」のような名前を付ける。`aria-hidden="true"`は、装飾用の`#`をスクリーンリーダーの読み上げ対象から外す指定。

リンクを選ぶとURLにハッシュが付き、そのURLをコピーして見出しの場所を直接共有できる。

## 動作を確認する

開発サーバーを起動する。

```bash
npm run dev
```

目次を追加した記事を開き、次の内容を確認する。

- `##`と`###`が目次へ表示される
- `###`の項目が字下げされる
- 目次のリンクを選ぶと、対応する見出しへ移動する
- URLの末尾に`#見出し名`が付く
- 同じ名前の見出しを2個作ると、2個目のURLに`-2`が付く
- コードブロック内の`##`が目次へ表示されない
- キーボードのTabキーで目次と見出しリンクを選べる

表示だけでなく、ビルドも実行する。

```bash
npm run build
```

TypeScriptの型や、静的なページを生成するときの問題は、開発サーバーだけでは気付かない場合がある。実装後はビルドまで確認しておく。

## 実装するときの注意点

### 見出しを変更するとURLも変わる

slugは見出しの文字から作っているため、見出しを書き換えるとハッシュも変わる。以前のURLを共有していた場合、そのリンクでは同じ場所へ移動できなくなる。

公開済みの記事では見出しを頻繁に変更しないか、必要であればMarkdown側で固定の`id`を指定できる仕組みを検討する。

### 正規表現ですべてのMarkdownを解析しない

今回のコードでは、用途を`##`と`###`の抽出に限定している。Markdown全体を正しく解析する処理を自作するのは難しい。

引用やHTML、独自記法など複雑な形式を扱う場合は、`remark`や`rehype`のプラグインを利用する方法もある。たとえば`rehype-slug`で見出しに`id`を付け、`rehype-autolink-headings`で見出しリンクを追加できる。

### 固定ヘッダーがある場合は余白を付ける

ページ上部に固定ヘッダーがあると、移動後の見出しがヘッダーの下へ隠れることがある。

Tailwind CSSでは、見出しへ`scroll-mt-6`などを指定すると、スクロール後の上側に余白を作れる。

```tsx
<h2 id={heading?.id} className="scroll-mt-6">
  {children}
</h2>
```

## まとめ

Markdown記事へ目次を追加するには、見出しの文字だけでなく、リンク先として使う重複しない`id`が必要になる。

今回の実装では、Markdownから`##`と`###`を抽出し、同じ見出しデータを目次と本文の両方で使った。さらに、コードブロックの除外、同じ見出し名への連番、見出しリンクの読み上げ名なども追加した。

最初は処理が多く見えるが、次の順番で考えると役割を分けやすい。

1. Markdownから見出しを探す
2. 見出しごとにslugを作る
3. slugを使って目次のリンクを作る
4. 本文の見出しへ同じslugを`id`として付ける

目次と本文で別々にslugを作らず、一度抽出した見出しデータを共有することが、リンク先のずれを防ぐポイントになる。

## 参考資料

- [react-markdown | GitHub](https://github.com/remarkjs/react-markdown)
- [String.prototype.normalize() | MDN](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/String/normalize)
- [URI fragment | MDN](https://developer.mozilla.org/en-US/docs/Web/URI/Reference/Fragment)
- [ARIA: aria-labelledby attribute | MDN](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-labelledby)
