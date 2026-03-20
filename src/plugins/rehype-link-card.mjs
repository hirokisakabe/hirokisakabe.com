import { visit } from "unist-util-visit";

const cache = new Map();
const MAX_RESPONSE_BYTES = 1024 * 1024; // 1MB
const MAX_CONCURRENT_FETCHES = 4;

/**
 * OGP メタタグの content 属性値を抽出するヘルパー
 * property と content の属性順が逆の場合にも対応する
 */
function extractMetaContent(html, property) {
  // property="..." content="..." の順
  const pattern1 = new RegExp(
    `<meta[^>]+property=(["'])${property}\\1[^>]+content=(["'])([\\s\\S]*?)\\2`,
    "i",
  );
  const match1 = html.match(pattern1);
  if (match1) return match1[3];

  // content="..." property="..." の順
  const pattern2 = new RegExp(
    `<meta[^>]+content=(["'])([\\s\\S]*?)\\1[^>]+property=(["'])${property}\\3`,
    "i",
  );
  const match2 = html.match(pattern2);
  if (match2) return match2[2];

  return null;
}

/**
 * OGP メタタグを抽出する
 */
function extractOgp(html, url) {
  const ogp = {};

  ogp.title = extractMetaContent(html, "og:title");
  ogp.description = extractMetaContent(html, "og:description");
  ogp.image = extractMetaContent(html, "og:image");

  // タイトルのフォールバック: <title> タグ
  if (!ogp.title) {
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    if (titleMatch) ogp.title = titleMatch[1];
  }

  // 画像の相対パスを絶対 URL に変換（http/https のみ許可）
  if (ogp.image && !ogp.image.startsWith("http")) {
    try {
      const resolved = new URL(ogp.image, url).href;
      if (resolved.startsWith("http://") || resolved.startsWith("https://")) {
        ogp.image = resolved;
      } else {
        ogp.image = null;
      }
    } catch {
      ogp.image = null;
    }
  }

  return ogp;
}

/**
 * URL から OGP 情報を取得する
 */
async function fetchOgp(url) {
  if (cache.has(url)) {
    return cache.get(url);
  }

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "bot",
      },
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      cache.set(url, null);
      return null;
    }

    // Content-Type が HTML でない場合はスキップ
    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("text/html")) {
      cache.set(url, null);
      return null;
    }

    // Content-Length が上限を超える場合はスキップ
    const contentLength = response.headers.get("content-length");
    if (contentLength && parseInt(contentLength, 10) > MAX_RESPONSE_BYTES) {
      cache.set(url, null);
      return null;
    }

    const html = await response.text();
    const ogp = extractOgp(html, url);

    if (!ogp.title) {
      cache.set(url, null);
      return null;
    }

    cache.set(url, ogp);
    return ogp;
  } catch (error) {
    console.warn(
      `[rehype-link-card] Failed to fetch OGP: ${url}`,
      error.message,
    );
    cache.set(url, null);
    return null;
  }
}

/**
 * <p> ノードが単独リンクかどうか判定する
 * 条件: <p> の子要素が <a> 1つだけで、テキスト内容が href と同じ http/https URL
 */
function isSoloLink(node) {
  if (node.tagName !== "p") return false;

  const children = node.children.filter(
    (child) => !(child.type === "text" && child.value.trim() === ""),
  );

  if (children.length !== 1) return false;

  const child = children[0];
  if (child.type !== "element" || child.tagName !== "a") return false;

  const href = child.properties?.href;
  if (!href || typeof href !== "string") return false;

  // http/https スキームのみ対象
  if (!href.startsWith("http://") && !href.startsWith("https://")) {
    return false;
  }

  // リンクテキストが URL そのものであること（[テキスト](url) 形式は対象外）
  const textContent = child.children
    .filter((c) => c.type === "text")
    .map((c) => c.value)
    .join("")
    .trim();

  return textContent === href;
}

/**
 * リンクカードの HAST ノードを生成する
 */
function createLinkCardNode(url, ogp) {
  const hostname = new URL(url).hostname;

  const textChildren = [
    {
      type: "element",
      tagName: "div",
      properties: { className: ["link-card-title"] },
      children: [{ type: "text", value: ogp.title }],
    },
  ];

  if (ogp.description) {
    textChildren.push({
      type: "element",
      tagName: "div",
      properties: { className: ["link-card-description"] },
      children: [{ type: "text", value: ogp.description }],
    });
  }

  textChildren.push({
    type: "element",
    tagName: "div",
    properties: { className: ["link-card-url"] },
    children: [{ type: "text", value: hostname }],
  });

  const contentChildren = [
    {
      type: "element",
      tagName: "div",
      properties: { className: ["link-card-text"] },
      children: textChildren,
    },
  ];

  if (ogp.image) {
    contentChildren.push({
      type: "element",
      tagName: "div",
      properties: { className: ["link-card-image"] },
      children: [
        {
          type: "element",
          tagName: "img",
          properties: { src: ogp.image, alt: "", loading: "lazy" },
          children: [],
        },
      ],
    });
  }

  return {
    type: "element",
    tagName: "div",
    properties: { className: ["link-card"] },
    children: [
      {
        type: "element",
        tagName: "a",
        properties: {
          href: url,
          target: "_blank",
          rel: "noopener noreferrer",
        },
        children: [
          {
            type: "element",
            tagName: "div",
            properties: { className: ["link-card-content"] },
            children: contentChildren,
          },
        ],
      },
    ],
  };
}

/**
 * 同時実行数を制限して Promise を実行する
 */
async function promiseAllWithLimit(tasks, limit) {
  const results = new Array(tasks.length);
  let index = 0;

  async function runNext() {
    while (index < tasks.length) {
      const i = index++;
      results[i] = await tasks[i]();
    }
  }

  const workers = Array.from({ length: Math.min(limit, tasks.length) }, () =>
    runNext(),
  );
  await Promise.all(workers);
  return results;
}

/**
 * 記事内の単独行 URL をリンクカード（OGP プレビュー）に変換する rehype プラグイン
 */
export default function rehypeLinkCard() {
  return async (tree) => {
    const soloLinks = [];

    visit(tree, "element", (node, index, parent) => {
      if (isSoloLink(node)) {
        const linkChild = node.children.find(
          (c) => c.type === "element" && c.tagName === "a",
        );
        soloLinks.push({
          node,
          index,
          parent,
          url: linkChild.properties.href,
        });
      }
    });

    // OGP 情報を並列取得（同時実行数制限あり）
    const ogpResults = await promiseAllWithLimit(
      soloLinks.map(
        ({ url }) =>
          () =>
            fetchOgp(url),
      ),
      MAX_CONCURRENT_FETCHES,
    );

    // 後ろから置換（インデックスのずれを防止）
    for (let i = soloLinks.length - 1; i >= 0; i--) {
      const ogp = ogpResults[i];
      if (!ogp) continue;

      const { index, parent, url } = soloLinks[i];
      const cardNode = createLinkCardNode(url, ogp);
      parent.children.splice(index, 1, cardNode);
    }
  };
}
