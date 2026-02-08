export default function SkeletonLoader({ count = 4 }) {
  return (
    <div className="flex px-3 flex-wrap gap-4 w-[100%]">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="flex relative w-[300px] h-[400px] flex-col bg-white border shadow-sm rounded-xl dark:bg-neutral-900 dark:border-neutral-700 animate-pulse"
        >
          <div className="w-full h-[220px] bg-gray-300 dark:bg-gray-700 rounded-t-xl"></div>
          <div className="p-4 space-y-3">
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
            <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
            <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-2/3"></div>
            <div className="flex justify-between gap-4 pt-4">
              <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-[45%]"></div>
              <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-[45%]"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
