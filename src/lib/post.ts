import "server-only";
import { PostList, PostDetail } from "@/types/post";

const BASE_URL = "https://hirokisakabe.microcms.io/api/v1/blogs";

const HEADERS = { "X-MICROCMS-API-KEY": process.env.X_MICROCMS_API_KEY || "" };

export async function fetchPostList({ page }: { page: number }) {
  const url = `${BASE_URL}?orders=-publishedAt&offset=${(page - 1) * 10}`;

  const res = await fetch(url, { headers: HEADERS, next: { revalidate: 60 } });

  if (!res.ok) {
    return null;
  }

  const data = await res.json();

  const parsed = PostList.safeParse(data);

  if (!parsed.success) {
    console.error(parsed.error);
    return null;
  }

  return parsed.data;
}

export async function fetchPostDetail({ id }: { id: string }) {
  const url = `${BASE_URL}/${id}`;

  const res = await fetch(url, { headers: HEADERS, next: { revalidate: 60 } });

  if (!res.ok) {
    return null;
  }

  const data = await res.json();

  const parsed = PostDetail.safeParse(data);

  if (!parsed.success) {
    console.error(parsed.error);
    return null;
  }

  return parsed.data;
}
