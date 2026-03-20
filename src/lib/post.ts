import { getCollection, getEntry, render } from "astro:content";

function sortByPublishedAtDesc<T extends { data: { publishedAt: Date } }>(
  posts: T[],
): T[] {
  return posts.sort(
    (a, b) => b.data.publishedAt.getTime() - a.data.publishedAt.getTime(),
  );
}

export async function getPostList() {
  const posts = await getCollection("posts");
  return sortByPublishedAtDesc(posts).map((post) => ({
    id: post.id,
    title: post.data.title,
    publishedAt: post.data.publishedAt,
  }));
}

export async function getPostIds() {
  const posts = await getCollection("posts");
  return sortByPublishedAtDesc(posts).map((post) => post.id);
}

export async function getPostMeta(id: string) {
  const post = await getEntry("posts", id);
  if (!post) throw new Error(`Post not found: ${id}`);
  return {
    title: post.data.title,
    publishedAt: post.data.publishedAt,
  };
}

export async function getPostDetail(id: string) {
  const post = await getEntry("posts", id);
  if (!post) throw new Error(`Post not found: ${id}`);
  const { Content } = await render(post);
  return {
    title: post.data.title,
    publishedAt: post.data.publishedAt,
    Content,
  };
}
