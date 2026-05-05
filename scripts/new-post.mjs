#!/usr/bin/env node
import { mkdir, writeFile } from "node:fs/promises";
import { randomBytes } from "node:crypto";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ALPHABET = "abcdefghijklmnopqrstuvwxyz0123456789";
const ID_LENGTH = 10;

function generateId() {
  const bytes = randomBytes(ID_LENGTH);
  let id = "";
  for (let i = 0; i < ID_LENGTH; i++) {
    id += ALPHABET[bytes[i] % ALPHABET.length];
  }
  return id;
}

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, "..");

const title = process.argv[2] ?? "";
const id = generateId();
const publishedAt = new Date().toISOString();

const postPath = join(projectRoot, "src/content/posts", `${id}.md`);
const imageDir = join(projectRoot, "public/images/posts", id);

const frontmatter = `---
title: "${title.replace(/"/g, '\\"')}"
publishedAt: "${publishedAt}"
---

`;

await writeFile(postPath, frontmatter, { flag: "wx" });
await mkdir(imageDir, { recursive: true });
await writeFile(join(imageDir, ".gitkeep"), "", { flag: "wx" });

console.log(`Created post: ${postPath}`);
console.log(`Created image dir: ${imageDir}`);
console.log(`Post ID: ${id}`);
