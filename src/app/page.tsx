import { PostList } from "@/components/post-list";

export default function HomePage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const page = (() => {
    if (typeof searchParams.page !== "string") {
      return 1;
    }

    try {
      return parseInt(searchParams.page);
    } catch (error) {
      console.error(error);

      return 1;
    }
  })();

  return (
    <>
      {/* @ts-expect-error Async Server Component */}
      <PostList page={page} />
    </>
  );
}
