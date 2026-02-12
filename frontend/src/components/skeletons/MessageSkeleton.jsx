const MessageSkeleton = () => {
  const skeletonMessages = Array(6).fill(null);

  return (
    <div className="flex-1 overflow-y-auto p-4 lg:px-12 space-y-6 bg-base-200">
      {skeletonMessages.map((_, idx) => (
        <div key={idx} className={`flex flex-col ${idx % 2 === 0 ? "items-start" : "items-end"}`}>
          <div className="flex flex-col gap-1 max-w-[80%]">
            <div className={`h-12 w-48 sm:w-64 bg-base-100 rounded-2xl animate-pulse shadow-sm border border-base-300 ${idx % 2 === 0 ? "rounded-bl-none" : "rounded-br-none"}`} />
            <div className="h-2 w-10 bg-base-300 rounded animate-pulse ml-2" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageSkeleton;