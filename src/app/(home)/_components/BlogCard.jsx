import Image from "next/image";
import Link from "next/link";

const BlogCard = ({ blog }) => {
  return (
    <div className="h-full">
      <Link
        href={`/post/${blog.slug}`}
        className="bg-background overflow-hidden border border-transparent  shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col h-full group"
      >
        {/* Image Section */}
        <div className="relative h-48 w-full overflow-hidden flex-shrink-0">
          <Image
            src={blog.image || "/placeholder.png"}
            alt={blog.title || "Blog image"}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>

        {/* Content */}
        <div className="flex flex-col flex-grow">
          <div className="p-4 pb-2">
            <h3 className="solway-text text-xl text-gray-800 line-clamp-2 mb-1 min-h-[2.5rem] leading-tight">
              {blog.title}
            </h3>
          </div>

          {/* Spacer to push button to bottom */}
          <div className="flex-grow"></div>

          <div className="p-4 pt-0">
            <span className="inline-block bg-primary text-white text-sm font-medium  px-4 py-2 transition-colors duration-300 group-hover:bg-primary/80 nunito-text">
              Read More
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default BlogCard;
