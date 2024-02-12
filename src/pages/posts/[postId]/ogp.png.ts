import type { APIRoute } from "astro";
import { fetchPostIds, fetchPostDetail } from "../../../lib/post";
import { getOgImage } from "../../../lib/ogp";

export async function getStaticPaths() {
  const ids = await fetchPostIds();

  return ids.map((id) => ({
    params: {
      postId: id,
    },
  }));
}

export const GET: APIRoute = async ({ params }) => {
  if (!params.postId) {
    return new Response("Not Found", { status: 404 });
  }

  const post = await fetchPostDetail({ id: params.postId });

  return getOgImage(post.title, "public/icon.jpg");
};
