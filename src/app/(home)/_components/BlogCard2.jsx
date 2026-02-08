import Image from "next/image";
import Link from "next/link";

const BlogCard2 = ({ blog }) => {
  // Simple HTML sanitizer to strip tags
  const sanitizeText = (html) => {
    if (!html) return "";
    return html.replace(/<[^>]*>?/gm, "").trim(); // removes all HTML tags
  };

  return (
    <div className="h-full">
      <Link
        href={`/post/${blog.slug}`}
        className="bg-background overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col md:flex-row h-full group"
      >
        {/* Image Section */}
        <div className="relative h-48 md:h-auto md:w-40 w-full overflow-hidden flex-shrink-0">
          <Image
            src={blog.image || "/placeholder.png"}
            alt={blog.title || "Blog image"}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105 "
          />
        </div>

        {/* Content */}
        <div className="flex flex-col justify-between p-4 flex-grow">
          <h3 className="poppins-text text-xl text-gray-800 line-clamp-2 mb-2 leading-tight">
            {blog.title}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2 poppins-text">
            {sanitizeText(blog.description) || "Read more about this topic..."}
          </p>
        </div>
      </Link>
    </div>
  );
};

export default BlogCard2;
