export default function EmptyState() {
  return (
    <div className="col-span-full flex flex-col items-center justify-center sm:py-[10%] py-[25%] text-center">
      <h3 className="text-lg font-semibold mb-2">No videos found</h3>
      <p className="text-muted-foreground max-w-md">
        We couldn't find any videos matching your search. Try different keywords
        or check your spelling.
      </p>
    </div>
  );
}
