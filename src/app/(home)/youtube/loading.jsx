import { Card, CardContent } from "@/components/ui/card";

export default function Loading() {
  return (
    <div className="container mx-auto xl:px-[5%] xl:py-[5%] sm:px-[3%] sm:py-[5%] px-[5%]">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card
            key={i}
            className="border-0 rounded-none shadow-none bg-transparent"
          >
            <CardContent className="p-0 space-y-3">
              {/* Thumbnail Skeleton */}
              <div className="aspect-video rounded-xl bg-muted animate-pulse" />

              <div className="flex gap-3">
                {/* Avatar Skeleton */}
                <div className="w-9 h-9 rounded-full bg-muted animate-pulse flex-shrink-0" />

                {/* Text Skeletons */}
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded animate-pulse w-full" />
                  <div className="h-3 bg-muted rounded w-2/3 animate-pulse" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
