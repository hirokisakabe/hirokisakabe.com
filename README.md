# hirokisakabe.com

https://hirokisakabe.com/

Hiroki SAKABE のブログサイト。Astro ベースの静的サイトジェネレーション（SSG）で構築し、Vercel にホスティングしています。

## 技術スタック

- [Astro](https://astro.build/) — 静的サイトジェネレーター
- [React](https://react.dev/) — OGP 画像生成などで使用
- [TypeScript](https://www.typescriptlang.org/) — strict モード
- [Tailwind CSS](https://tailwindcss.com/) — スタイリング
- [Playwright](https://playwright.dev/) — E2E テスト
- [Vercel](https://vercel.com/) — ホスティング・デプロイ

## セットアップ

```bash
npm install
npm run dev
```

開発サーバーが http://localhost:4321 で起動します。

## コマンド

| コマンド               | 用途                               |
| ---------------------- | ---------------------------------- |
| `npm run dev`          | 開発サーバー起動（localhost:4321） |
| `npm run build`        | 型チェック（astro check）+ ビルド  |
| `npm run format:check` | Prettier フォーマット確認          |
| `npm run format:write` | Prettier 自動フォーマット          |
| `npm run lint`         | ESLint チェック                    |
| `npx playwright test`  | E2E テスト実行                     |

## プロジェクト構成

```
src/
├── content/posts/   # Markdown 記事ファイル
├── content.config.ts # Content Collections スキーマ定義（Zod）
├── pages/
│   ├── [...page].astro        # トップページ（ページネーション付き）
│   ├── posts/[postId].astro   # 記事詳細ページ
│   └── **/ogp.png.ts          # OGP 画像動的生成
├── layouts/Layout.astro       # 共通レイアウト
└── lib/
    ├── post.ts   # 記事データ取得ロジック
    └── ogp.tsx   # OGP 画像生成（@vercel/og + React）
```

## 記事の追加

`src/content/posts/` に Markdown ファイルを追加します。フロントマターには `title` と `publishedAt` が必要です。

```markdown
---
title: 記事タイトル
publishedAt: 2026-01-01
---

記事の本文
```
