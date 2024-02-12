import type { APIRoute } from "astro";
import { getOgImage } from "../lib/ogp";

export const GET: APIRoute = async () => {
  return getOgImage("hirokisakabe.com", "public/icon.jpg");
};
