import { visit } from "unist-util-visit";
import { imageSize } from "image-size";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.resolve(__dirname, "../../public");

const cache = new Map();

/**
 * public ディレクトリの画像に width/height を自動付与する rehype プラグイン
 */
export default function rehypeImageSize() {
  return (tree) => {
    visit(tree, "element", (node) => {
      if (node.tagName !== "img") return;

      const src = node.properties?.src;
      if (!src || typeof src !== "string" || !src.startsWith("/")) return;

      const pathname = new URL(src, "http://localhost").pathname;
      const filePath = path.resolve(publicDir, `.${pathname}`);

      if (!filePath.startsWith(publicDir + path.sep)) return;

      if (cache.has(filePath)) {
        const cached = cache.get(filePath);
        node.properties.width = cached.width;
        node.properties.height = cached.height;
        return;
      }

      try {
        const buf = fs.readFileSync(filePath);
        const dimensions = imageSize(buf);
        if (dimensions.width && dimensions.height) {
          cache.set(filePath, {
            width: dimensions.width,
            height: dimensions.height,
          });
          node.properties.width = dimensions.width;
          node.properties.height = dimensions.height;
        }
      } catch (error) {
        if (error?.code !== "ENOENT") {
          console.warn(`[rehype-image-size] ${filePath}: ${error.message}`);
        }
      }
    });
  };
}
