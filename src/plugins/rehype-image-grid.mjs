import { SKIP, visit } from "unist-util-visit";

const isWhitespaceText = (node) =>
  node.type === "text" && node.value.trim() === "";

const isBr = (node) => node.type === "element" && node.tagName === "br";

const isImg = (node) => node.type === "element" && node.tagName === "img";

/**
 * 連続する複数の <img> を <div class="image-grid image-grid-N"> に変換する
 * rehype プラグイン
 *
 * <p> を <br> で chunk に分割し、img のみで構成される chunk (2+ 枚) を
 * 独立した grid コンテナに切り出す。前後のテキスト系 chunk は <p> に戻す。
 */
export default function rehypeImageGrid() {
  return (tree) => {
    visit(tree, "element", (node, index, parent) => {
      if (node.tagName !== "p") return;
      if (!parent || typeof index !== "number") return;

      const chunks = [[]];
      for (const child of node.children) {
        if (isBr(child)) {
          chunks.push([]);
        } else {
          chunks[chunks.length - 1].push(child);
        }
      }

      const classified = chunks.map((chunk) => {
        const meaningful = chunk.filter((c) => !isWhitespaceText(c));
        const isGrid = meaningful.length >= 2 && meaningful.every(isImg);
        return { chunk, meaningful, isGrid };
      });

      if (!classified.some((c) => c.isGrid)) return;

      const newNodes = [];
      let pending = [];

      const flushPending = () => {
        if (pending.length === 0) return;
        const children = [];
        pending.forEach((chunk, i) => {
          if (i > 0) {
            children.push({
              type: "element",
              tagName: "br",
              properties: {},
              children: [],
            });
          }
          children.push(...chunk);
        });
        const hasContent = children.some(
          (c) => !isWhitespaceText(c) && !isBr(c),
        );
        if (hasContent) {
          newNodes.push({
            type: "element",
            tagName: "p",
            properties: { ...(node.properties ?? {}) },
            children,
          });
        }
        pending = [];
      };

      for (const { chunk, meaningful, isGrid } of classified) {
        if (isGrid) {
          flushPending();
          const count = meaningful.length;
          const variant = count >= 5 ? "many" : String(count);
          newNodes.push({
            type: "element",
            tagName: "div",
            properties: {
              className: ["image-grid", `image-grid-${variant}`],
            },
            children: meaningful,
          });
        } else {
          pending.push(chunk);
        }
      }
      flushPending();

      parent.children.splice(index, 1, ...newNodes);
      return [SKIP, index + newNodes.length];
    });
  };
}
