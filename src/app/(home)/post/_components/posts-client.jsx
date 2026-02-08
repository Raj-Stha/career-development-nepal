// Updated PostsClient.js
"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import BlogCard from "../../_components/BlogCard";
import BlogListCard from "../../_components/BlogListCard";
import FilterSheet from "./FilterSheet";
import { Button } from "@/components/ui/button";
import { Grid, List, Search } from "lucide-react";

export default function PostsClient() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid");

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const currentPage = Number.parseInt(searchParams.get("page") || "1");
  const currentCategory = searchParams.get("category") || "";
  const currentSort = searchParams.get("sort") || "latest";

  useEffect(() => {
    const urlSearchTerm = searchParams.get("search") || "";
    setSearchTerm(urlSearchTerm);
  }, [searchParams]);

  const updateURL = (params) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());

    Object.entries(params).forEach(([key, value]) => {
      if (value && (Array.isArray(value) ? value.length > 0 : true)) {
        newSearchParams.set(key, value.toString());
      } else {
        newSearchParams.delete(key);
      }
    });

    router.push(`${pathname}?${newSearchParams.toString()}`);
  };

  const fetchPosts = async () => {
    setLoading(true);
    try {
      let url = "/api/public/blog";
      const params = new URLSearchParams();

      if (currentPage > 1) params.set("page", currentPage.toString());
      params.set("limit", "12");
      if (searchTerm) params.set("search", searchTerm);
      if (currentSort !== "latest") params.set("sort", currentSort);
      if (currentCategory) params.set("category", currentCategory);

      const queryString = params.toString();
      if (queryString) url += `?${queryString}`;

      const response = await fetch(url);
      const data = await response.json();

      if (response.ok) {
        setPosts(data.posts || []);
        setMeta(data.meta);
      } else {
        console.error("Error fetching posts:", data.error);
        setPosts([]);
        setMeta(null);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      setPosts([]);
      setMeta(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [currentPage, currentCategory, currentSort, searchTerm]);

  const handleSearch = (term) => {
    updateURL({ search: term, page: 1 });
  };

  const handleCategoryChange = (category) => {
    updateURL({ category, page: 1 });
  };

  const handleSortChange = (sort) => {
    updateURL({ sort, page: 1 });
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    updateURL({ search: "", category: "", page: 1 });
  };

  const handlePageChange = (page) => {
    updateURL({ page });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="container max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-row gap-4 items-center justify-between mb-8 md:mt-12">
          <div className="flex items-center gap-4">
            <FilterSheet
              currentCategory={currentCategory}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              onCategoryChange={handleCategoryChange}
              onSearch={handleSearch}
              onClearFilters={handleClearFilters}
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="nunito-text text-sm text-gray-600 hidden sm:block">
                Sort:
              </span>
              <select
                value={currentSort}
                onChange={(e) => handleSortChange(e.target.value)}
                className="poppins-text px-3 py-2 border border-gray-300 rounded-md bg-white"
              >
                <option value="latest">Latest</option>
                <option value="oldest">Oldest</option>
              </select>
            </div>

            <div className="flex gap-1 border border-gray-300 rounded-md p-1 bg-white">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="h-8 w-8 p-0"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="h-8 w-8 p-0"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {!loading && (
          <div className="mb-6">
            <p className="poppins-text text-sm text-gray-600">
              {meta ? (
                <>
                  Showing {posts.length} of {meta.totalPosts} posts
                </>
              ) : (
                `Showing ${posts.length} posts`
              )}
            </p>
          </div>
        )}

        {loading ? (
          <div
            className={
              viewMode === "grid"
                ? "grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-6"
            }
          >
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div
                    className={
                      viewMode === "grid"
                        ? "h-48 bg-gray-200"
                        : "h-40 bg-gray-200"
                    }
                  ></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : posts.length > 0 ? (
          <>
            <div
              className={
                viewMode === "grid"
                  ? "grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "space-y-6"
              }
            >
              {posts.map((post) => (
                <div
                  key={post.id}
                  className={viewMode === "list" ? "max-w-5xl mx-auto" : ""}
                >
                  {viewMode === "grid" ? (
                    <BlogCard blog={post} />
                  ) : (
                    <BlogListCard blog={post} />
                  )}
                </div>
              ))}
            </div>

            {meta && meta.totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-12">
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={!meta.hasPrevPage}
                  className="poppins-text"
                >
                  Previous
                </Button>

                <div className="flex gap-1">
                  {[...Array(Math.min(5, meta.totalPages))].map((_, i) => {
                    const pageNum = Math.max(1, currentPage - 2) + i;
                    if (pageNum > meta.totalPages) return null;
                    return (
                      <Button
                        key={pageNum}
                        variant={
                          pageNum === currentPage ? "default" : "outline"
                        }
                        onClick={() => handlePageChange(pageNum)}
                        className="poppins-text w-10 h-10"
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={!meta.hasNextPage}
                  className="poppins-text"
                >
                  Next
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="playfair-text text-xl font-semibold text-gray-900 mb-2">
                No posts found
              </h3>
              <p className="poppins-text text-gray-600 mb-4">
                Try adjusting your search terms or filters
              </p>
              <Button onClick={handleClearFilters} className="poppins-text">
                Clear Filters
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
