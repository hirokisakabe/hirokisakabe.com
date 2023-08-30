export async function PostListLoading() {
  const PER_PAGE = 10;

  return (
    <div className="space-y-7">
      {[...Array(PER_PAGE)].map((_, i) => {
        return (
          <div key={i} className="px-3 py-5 shadow-md">
            <h3 className="font-medium">--</h3>
            <div className="pt-3">
              <div className="text-xs">0000/00/00</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
