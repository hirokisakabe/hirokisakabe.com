import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getPostList } from "../lib/post";

export async function GET(context: APIContext) {
  const posts = await getPostList();
  return rss({
    title: "Hiroki SAKABE",
    description: "hiroki sakabe's blog",
    site: context.site?.toString() ?? "https://hirokisakabe.com",
    items: posts.map((post) => ({
      title: post.title,
      pubDate: post.publishedAt,
      link: `/posts/${post.id}/`,
    })),
  });
}
