import "server-only";

const BASE_URL = "https://hirokisakabe.microcms.io/api/v1/blogs";

const HEADERS = { "X-MICROCMS-API-KEY": process.env.X_MICROCMS_API_KEY || "" };

export async function fetchPostList({ page }: { page: number }) {
  const url = `${BASE_URL}?orders=-publishedAt&offset=${(page - 1) * 10}`;

  const res = await fetch(url, { headers: HEADERS, next: { revalidate: 60 } });

  if (!res.ok) {
    return null;
  }

  return res.json();
}

export async function fetchPostDetail({ id }: { id: string }) {
  const url = `${BASE_URL}/${id}`;

  const res = await fetch(url, { headers: HEADERS, next: { revalidate: 60 } });

  if (!res.ok) {
    return null;
  }

  return res.json();
}
