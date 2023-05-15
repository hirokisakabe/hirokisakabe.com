import { PostDetail } from "@/components/post-detail";

export default function PostPage({ params }: { params: { id: string } }) {
  return (
    <>
      {/* @ts-expect-error Async Server Component */}
      <PostDetail id={params.id} />
    </>
  );
}
