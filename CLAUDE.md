# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

Astro ベースの静的ブログサイト（https://hirokisakabe.com/）。Markdown ファイル（Content Collections）でコンテンツ管理し、Vercel にホスティング。

## コマンド

| コマンド               | 用途                               |
| ---------------------- | ---------------------------------- |
| `npm run dev`          | 開発サーバー起動（localhost:4321） |
| `npm run build`        | 型チェック（astro check）+ ビルド  |
| `npm run format:check` | Prettier フォーマット確認          |
| `npm run format:write` | Prettier 自動フォーマット          |
| `npm run lint`         | ESLint チェック                    |

CI では `format:check` → `lint` → `build` の順で実行される。

## アーキテクチャ

### データフロー

`src/content/posts/*.md`（Markdown）→ Content Collections（`src/content.config.ts` で Zod スキーマ定義）→ `src/lib/post.ts` → Astro ページ（SSG で静的生成）

### ページ構成

- `src/pages/[...page].astro` — トップページ（10件/ページのページネーション、`getStaticPaths` 使用）
- `src/pages/posts/[postId].astro` — 記事詳細ページ
- `src/pages/**/ogp.png.ts` — @vercel/og + React で OGP 画像を動的生成（`src/lib/ogp.tsx`）

### コンテンツ管理

`src/content/posts/` に Markdown ファイルを配置。フロントマター（title, publishedAt）は `src/content.config.ts` の Zod スキーマでビルド時に検証。

### レイアウト

`src/layouts/Layout.astro` が共通レイアウト。Tailwind CSS でレスポンシブ対応（モバイル: 縦並び、デスクトップ: 左サイドバー固定 + 右コンテンツ）。

## 技術スタック

Astro 6 / React 18 / TypeScript（strict）/ Tailwind CSS 4 / @tailwindcss/typography / Prettier（astro + tailwindcss プラグイン）/ ESLint
