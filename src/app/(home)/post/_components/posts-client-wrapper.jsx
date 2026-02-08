"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";

const PostsClient = dynamic(() => import("./posts-client"), { ssr: false });

export default function PostsPageClient() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <Suspense fallback={<PostsLoading />}>
        <PostsClient />
      </Suspense>
    </div>
  );
}

function PostsLoading() {
  return (
    <div className="container max-w-7xl mx-auto px-4 py-12">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm p-4">
              <div className="h-48 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
