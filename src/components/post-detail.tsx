import { format } from "date-fns";
import { fetchPostDetail } from "@/lib/post";

export async function PostDetail({ id }: { id: string }) {
  const postDetail = await fetchPostDetail({ id });

  if (!postDetail) {
    return (
      <div className="space-y-7">
        <div className="shadow-md"></div>
      </div>
    );
  }

  return (
    <div className="space-y-7">
      <div className="shadow-md">
        <div className="p-3">
          <div className="pb-3">
            <div className="text-2xl">{postDetail.title}</div>
            <div className="py-1 text-sm text-slate-600">
              {format(new Date(postDetail.publishedAt), "yyyy/MM/dd")}
            </div>
          </div>
          <div
            className="prose prose-sm max-w-none prose-h1:text-xl prose-h2:text-lg prose-h3:text-base prose-img:max-w-full prose-img:rounded-xl lg:prose-img:max-w-xl"
            dangerouslySetInnerHTML={{
              __html: `${postDetail.content}`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
