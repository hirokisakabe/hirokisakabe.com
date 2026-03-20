import { test, expect } from "@playwright/test";

test("rss.xml returns valid RSS feed", async ({ request }) => {
  const response = await request.get("http://localhost:4321/rss.xml");

  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toContain("xml");

  const body = await response.text();
  expect(body).toContain("<rss");
  expect(body).toContain("<channel>");
  expect(body).toContain("<item>");
});
