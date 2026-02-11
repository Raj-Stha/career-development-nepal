"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  User,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"; // Added ChevronLeft, ChevronRight
import { Button } from "@/components/ui/button";
import BlogSection from "../../../_components/Blogs";
import ShareThis from "../../../_components/ShareThis";
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { FacebookProvider, Comments, Page } from "react-facebook";

// Add this function after the imports
function generateStructuredData(post) {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL ||
    "https://career-development-nepal.vercel.app";
  const postUrl = `${baseUrl}/post/${post.slug}`;
  const imageUrl = post.image
    ? post.image.startsWith("http")
      ? post.image
      : `${baseUrl}${post.image}`
    : null;
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description:
      post.excerpt ||
      post.description?.replace(/<[^>]*>/g, "").substring(0, 160),
    image: imageUrl ? [imageUrl] : undefined,
    datePublished: new Date(post.createdAt).toISOString(),
    dateModified: new Date(post.updatedAt).toISOString(),
    author: post.author
      ? {
          "@type": "Person",
          name: post.author.name,
          email: post.author.email,
        }
      : undefined,
    publisher: {
      "@type": "Organization",
      name: "Master Builder Bible School",
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/logo.png`, // Replace with real logo URL if available
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": postUrl,
    },
    articleSection: post.category?.name,
    keywords: post.category?.name,
    url: postUrl,
    isAccessibleForFree: true,
    wordCount: post.description
      ? post.description.replace(/<[^>]*>/g, "").split(" ").length
      : undefined,
  };
}

export default function SinglePostClient({ post, relatedPosts }) {
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleImageClick = (index) => {
    setCurrentImageIndex(index);
    setIsGalleryOpen(true);
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % post.gallery.length);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex(
      (prevIndex) =>
        (prevIndex - 1 + post.gallery.length) % post.gallery.length,
    );
  };

  const postUrl = typeof window !== "undefined" ? window.location.href : "";

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateStructuredData(post)),
        }}
      />
      <div className="min-h-screen bg-gray-50">
        {/* Back Button */}
        <div className="container max-w-5xl mx-auto px-4 pt-8"></div>
        {/* Hero Section */}
        <div className="container max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row gap-4 md:gap-8">
          <article className="w-full md:basis-5xl">
            <Link
              href="/post"
              className="my-8 md:my-12 inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors poppins-text"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Posts
            </Link>
            {/* Post Header */}
            <header className="mb-8">
              <h1 className="poppins-text text-2xl sm:3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                {post.title}
              </h1>
              {post.excerpt && (
                <p className="nunito-text text-md text-gray-600 mb-6 leading-relaxed">
                  {post.excerpt}
                </p>
              )}
              {/* Meta Information */}
              <div className="flex flex-wrap items-center justify-between gap-6 text-gray-600 mb-6">
                <div className="flex flex-wrap items-center gap-6">
                  {post.author && (
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span className="nunito-text text-sm">
                        {post.author.name}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span className="nunito-text text-sm">
                      {formatDate(post.createdAt)}
                    </span>
                  </div>
                </div>
                {/* ShareThis component replaces the old share button */}
              </div>
            </header>
            {/* Featured Image */}
            {post.image && (
              <div className="relative h-64 md:h-96 lg:h-[500px] overflow-hidden mb-8 shadow-lg">
                <Image
                  src={post.image || "/placeholder.svg"}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}
            <div className=" mb-8">
              <ShareThis url={postUrl} />
            </div>

            {/* Post Content */}
            <div className="bg-white shadow-lg border border-gray-100 p-4 sm:p-8 mb-12">
              <div className="prose prose-lg max-w-none nunito-text">
                {post.description ? (
                  <div
                    className="ql-editor leading-relaxed text-justify"
                    dangerouslySetInnerHTML={{ __html: post.description }}
                  />
                ) : (
                  <p className="text-gray-700 leading-relaxed">
                    No content available for this post.
                  </p>
                )}
              </div>
              {/* Gallery */}
              {post.gallery && post.gallery.length > 0 && (
                <div className="mt-12 pt-8 border-t border-gray-200">
                  <h3 className="playfair-text text-2xl font-bold text-gray-900 mb-6">
                    Gallery
                  </h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {post.gallery.map((image, index) => (
                      <div
                        key={index}
                        className="relative h-48 rounded-lg overflow-hidden cursor-pointer"
                        onClick={() => handleImageClick(index)}
                      >
                        <Image
                          src={image || "/placeholder.svg"}
                          alt={`Gallery image ${index + 1}`}
                          fill
                          className="object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {/* Map */}
              {post.map && (
                <div className="mt-12 pt-8 border-t border-gray-200">
                  <h3 className="playfair-text text-2xl font-bold text-gray-900 mb-6">
                    Location
                  </h3>
                  <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                    <p className="poppins-text text-gray-600">
                      Map integration would go here
                    </p>
                  </div>
                </div>
              )}
            </div>
          </article>
          <div className="w-full md:basis-2xs py-4 md:py-12 ">
            <FacebookProvider appId="1336492651427299">
              <Page
                href="https://www.facebook.com/rajibkhatryofficial"
                tabs="timeline"
                width={Math.min(500, window?.innerWidth || 500)}
              />
            </FacebookProvider>
          </div>
        </div>
        {/* Related Posts */}
        {relatedPosts && relatedPosts.length > 0 && (
          <BlogSection
            title="Related Posts"
            blogs={relatedPosts}
            className="px-4 my-2"
          />
        )}
      </div>

      {/* Gallery Dialog */}
      <Dialog open={isGalleryOpen} onOpenChange={setIsGalleryOpen}>
        <DialogContent className="max-w-4xl w-full p-0 overflow-hidden">
          <div className="relative w-full h-[70vh] flex items-center justify-center bg-black">
            {post.gallery && post.gallery.length > 0 && (
              <Image
                src={post.gallery[currentImageIndex] || "/placeholder.svg"}
                alt={`Gallery image ${currentImageIndex + 1}`}
                fill
                className="object-contain"
              />
            )}
            {post.gallery && post.gallery.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
                  onClick={handlePrevImage}
                >
                  <ChevronLeft className="h-8 w-8" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
                  onClick={handleNextImage}
                >
                  <ChevronRight className="h-8 w-8" />
                </Button>
              </>
            )}
          </div>
          <div className="absolute bottom-4 left-0 right-0 text-center text-white text-sm bg-black/50 py-2">
            {currentImageIndex + 1} / {post.gallery?.length || 0}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
