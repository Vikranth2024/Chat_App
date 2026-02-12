const SidebarSkeleton = () => {
  const skeletonContacts = Array(8).fill(null);

  return (
    <aside className="h-full w-full lg:w-96 border-r border-base-200 flex flex-col bg-base-100">
      {/* Search Header Skeleton */}
      <div className="p-4 space-y-4">
        <div className="h-10 w-full bg-base-200 rounded-xl animate-pulse" />
      </div>

      {/* User List Skeleton */}
      <div className="flex-1 overflow-y-auto px-2 pb-4 space-y-1">
        {skeletonContacts.map((_, idx) => (
          <div key={idx} className="w-full p-3 flex items-center gap-3">
            <div className="size-12 rounded-full bg-base-200 animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="flex justify-between">
                <div className="h-4 w-24 bg-base-200 rounded animate-pulse" />
                <div className="h-3 w-8 bg-base-200/50 rounded animate-pulse" />
              </div>
              <div className="h-3 w-32 bg-base-200 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default SidebarSkeleton;