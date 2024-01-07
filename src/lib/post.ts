import { PostList, PostDetail } from "../types/post";

const BASE_URL = "https://hirokisakabe.microcms.io/api/v1/blogs";
const HEADERS = { "X-MICROCMS-API-KEY": process.env.X_MICROCMS_API_KEY || "" };

export async function fetchPostList({ page }: { page: number }) {
  const url = `${BASE_URL}?orders=-publishedAt&limit=1000`;

  const res = await fetch(url, { headers: HEADERS });

  if (!res.ok) {
    throw new Error("Failed to fetch PostList");
  }

  const data = await res.json();

  const parsed = PostList.safeParse(data);

  if (!parsed.success) {
    console.error(parsed.error);
    throw new Error("Failed to fetch PostList");
  }

  return parsed.data;
}

export async function fetchPostIds() {
  const url = `${BASE_URL}?orders=-publishedAt&limit=1000`;

  const res = await fetch(url, { headers: HEADERS });

  if (!res.ok) {
    throw new Error("Failed to fetch PostIds");
  }

  const data = await res.json();

  const parsed = PostList.safeParse(data);

  if (!parsed.success) {
    console.error(parsed.error);
    throw new Error("Failed to fetch PostIds");
  }

  return parsed.data.contents.map((content) => content.id);
}

export async function fetchPostDetail({ id }: { id: string }) {
  const url = `${BASE_URL}/${id}`;

  const res = await fetch(url, { headers: HEADERS });

  if (!res.ok) {
    throw new Error("Failed to fetch PostDetail");
  }

  const data = await res.json();

  const parsed = PostDetail.safeParse(data);

  if (!parsed.success) {
    console.error(parsed.error);
    throw new Error("Failed to fetch PostDetail");
  }

  return parsed.data;
}
