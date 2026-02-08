import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const BlogListCard = ({ blog }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="w-full">
      <Link
        href={`/post/${blog.slug}`}
        className="bg-white overflow-hidden border border-transparent  shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col md:flex-row h-full group "
      >
        {/* Image Section */}
        <div className="relative h-48 md:h-56 md:w-80 w-full overflow-hidden flex-shrink-0">
          <Image
            src={blog.image || "/placeholder.png"}
            alt={blog.title || "Blog image"}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 320px"
          />
        </div>

        {/* Content */}
        <div className="flex flex-col flex-grow p-6">
          {/* Title */}
          <h3 className="solway-text text-xl md:text-2xl text-gray-800 line-clamp-2 mb-3 leading-tight group-hover:text-primary transition-colors">
            {blog.title}
          </h3>

          {/* Excerpt */}
          {blog.excerpt && (
            <p className="poppins-text text-gray-600 line-clamp-2 mb-4 leading-relaxed">
              {blog.excerpt}
            </p>
          )}

          {/* Read More Button */}
          <div className="mt-auto">
            <span className="inline-block bg-primary text-white text-sm font-medium px-6 py-2  transition-colors duration-300 group-hover:bg-primary/80 nunito-text">
              Read More
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default BlogListCard;
