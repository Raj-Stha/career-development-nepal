import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import DeleteForm from "../../_components/DeleteForm";
import EditForm from "./edit-form";

export default function CardList({
  data,
  onBlogUpdated,
  onBlogDeleted,
  showActions = true,
}) {

  // console.log("data", data)
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {data.map((blog) => (
        <div
          key={blog.id}
          className="overflow-hidden border border-gray-200 shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300"
        >
          {/* Featured Image */}
          <div className="relative aspect-video">
            <Image
              src={blog.image || "/placeholder.svg?height=200&width=300"}
              alt={blog.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              style={{ objectFit: "cover" }}
              className="rounded-t-lg"
            />
          </div>

          <div className="p-4 space-y-3">
            {/* Category */}
            <div>
              <Badge variant="outline" className="text-xs">
                {blog.category?.name || "Uncategorized"}
              </Badge>
            </div>

            {/* Title */}
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white line-clamp-2">
              {blog.title}
            </h3>

            {/* Action Buttons */}
            {showActions && (
              <div className="flex gap-2 pt-3 border-t">
                <EditForm data={blog} onBlogUpdated={onBlogUpdated} />
                <div className="w-[50%]">
                  <DeleteForm
                    id={blog.id}
                    title="Blog Post"
                    url="/api/protected/blog"
                    onDelete={(deletedId) => {
                      onBlogDeleted(deletedId);
                      // Refresh page after deletion
                      setTimeout(() => {
                        window.location.reload();
                      }, 1000);
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
