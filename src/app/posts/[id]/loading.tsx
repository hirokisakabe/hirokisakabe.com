import { PostDetailLoading } from "@/components/post-detail-loading";

export default function Loading() {
  return (
    <>
      {/* @ts-expect-error Async Server Component */}
      <PostDetailLoading />
    </>
  );
}
