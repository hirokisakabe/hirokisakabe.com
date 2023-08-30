import { PostListLoading } from "@/components/post-list-loading";

export default function Loading() {
  return (
    <>
      {/* @ts-expect-error Async Server Component */}
      <PostListLoading />
    </>
  );
}
