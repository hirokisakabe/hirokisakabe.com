import Link from "next/link";
import { format } from "date-fns";
import { fetchPostList } from "@/lib/post";

export async function PostList({ page }: { page: number }) {
  const postList = await fetchPostList({ page });

  if (!postList) {
    return <div className="space-y-7"></div>;
  }

  const PER_PAGE = 10;

  const range = (start: number, end: number) =>
    [...Array(end - start + 1)].map((_, i) => start + i);

  return (
    <div className="space-y-7">
      {postList.contents.map((content) => {
        return (
          <div key={content.id} className="px-3 py-5 shadow-md">
            <Link href={`/posts/${content.id}`}>
              <h3 className="font-medium hover:underline">{content.title}</h3>
            </Link>
            <div className="pt-3">
              <div className="text-xs">
                {format(new Date(content.publishedAt), "yyyy/MM/dd")}
              </div>
            </div>
          </div>
        );
      })}
      <div className="flex pb-6">
        {range(1, Math.ceil(postList.totalCount / PER_PAGE)).map(
          (number, index) => (
            <div className="px-3" key={index}>
              <div className="font-medium hover:underline">
                <Link href={`?page=${number}`}>{number}</Link>{" "}
              </div>
            </div>
          ),
        )}
      </div>
    </div>
  );
}
