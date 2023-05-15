import { fetchPostDetail } from "@/lib/post";

export async function PostDetail({ id }: { id: string }) {
  const { title, content } = await fetchPostDetail({ id });

  return (
    <div className="space-y-7">
      <div className="shadow-md">
        <div className="p-3">
          <div className="pb-3">
            <div className="text-2xl">{title}</div>
          </div>
          <div
            className="prose prose-sm prose-img:max-w-xl prose-img:rounded-xl prose-h1:text-xl prose-h2:text-lg prose-h3:text-base max-w-none"
            dangerouslySetInnerHTML={{
              __html: `${content}`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
