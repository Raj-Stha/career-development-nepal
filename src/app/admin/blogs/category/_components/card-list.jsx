import DeleteForm from "../../../_components/DeleteForm";
import EditForm from "./edit-form"
export default function CardList({
  data,
  onCategoryUpdated,
  onCategoryDeleted,
  showActions = true,
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {data?.map((category) => (
        <div
          key={category?.id}
          className="overflow-hidden  border-1 border-gray-400 px-2 py-2 shadow-lg rounded-md"
        >
          <div className="relative">
            <img
              className="w-full h-48 object-cover"
              src={category?.image || "/placeholder.svg?height=200&width=300"}
              alt={`${category?.name}'s picture`}
            />
          </div>

          <div className="space-y-3">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-1 truncate">
                {category?.name}
              </h3>

              {/* Action Buttons */}
              {showActions && (
                <div className="flex gap-2 pt-3">
                  <EditForm
                    data={category}
                    oncategoryUpdated={onCategoryUpdated}
                  />
                  <div className="w-[50%]">
                    <DeleteForm
                      id={category?.id}
                      title="category"
                      url={"/api/protected/blog/blog-category"}
                      onDelete={onCategoryDeleted}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
