import { z } from "zod";

export const PostList = z.object({
  contents: z
    .object({
      id: z.string(),
      title: z.string(),
      publishedAt: z.string(),
    })
    .array(),
  totalCount: z.number(),
});

export type PostList = z.infer<typeof PostList>;

export const PostDetail = z.object({
  title: z.string(),
  content: z.string(),
});

export type PostDetail = z.infer<typeof PostDetail>;
