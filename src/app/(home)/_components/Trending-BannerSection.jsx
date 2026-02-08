"use client";

import Image from "next/image";
import Link from "next/link";
import BlogCard2 from "./BlogCard2";

// function stripHtmlAndTruncate(html, maxLength = 150) {
//   const plainText = html?.replace(/<[^>]+>/g, "") || "";
//   return plainText.length > maxLength
//     ? plainText.slice(0, maxLength) + "..."
//     : plainText;
// }

export default function TrendingBannerSection({ blogs }) {
  if (!blogs || blogs.length === 0) {
    return null;
  }

  const mainBlog = blogs[0];
  const trendingBlogs = blogs.slice(1);
  const hasMultipleBlogs = trendingBlogs.length > 0;

  return (
    <section className="container max-w-7xl px-4 mx-auto py-8 poppins-text">
      <div className="mb-6">
        <h2 className="poppins-text text-3xl sm:text-4xl md:text-5xl font-semibold text-primary">
          Trending News
        </h2>
        <div className="w-30 h-[3px] bg-secondary rounded-full mt-2"></div>
      </div>

      <div
        className={`grid ${
          hasMultipleBlogs ? "lg:grid-cols-3" : "grid-cols-1"
        } gap-8`}
      >
        {/* Left Side (Main Blog) */}
        <div className={hasMultipleBlogs ? "lg:col-span-2" : "col-span-1"}>
          <div className="overflow-hidden flex flex-col poppins-text border">
            <div className="relative w-full h-64 md:h-96">
              <Image
                src={
                  mainBlog.image ||
                  "/placeholder.svg?height=400&width=600&query=blog-banner"
                }
                alt={mainBlog.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 50vw"
                priority
              />
            </div>
            <div className="p-5">
              <h3 className="text-2xl md:text-3xl font-semibold leading-tight mb-2">
                <Link
                  href={`/blog/${mainBlog.slug}`}
                  className="hover:text-primary transition-colors"
                >
                  {mainBlog.title}
                </Link>
              </h3>
              {/* <p className="text-base text-muted-foreground mb-3">
                {mainBlog.excerpt ||
                  stripHtmlAndTruncate(mainBlog.description, 200)}
              </p> */}
            </div>
          </div>
        </div>

        {/* Right Side (Trending List) */}
        {hasMultipleBlogs && (
          <div className="lg:col-span-1 flex flex-col">
            <div className="space-y-4 overflow-y-auto max-h-[600px] pr-2 custom-scrollbar">
              {trendingBlogs.map((blog) => (
                <BlogCard2 blog={blog} key={blog.id} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
