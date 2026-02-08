"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import CardList from "./card-list";
import { PlusIcon } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import AddForm from "./add-form";
import SkeletonLoader from "../../_components/SkeletonLoader";
import { toast } from "react-toastify";

export default function Blog() {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const getAllBlogs = async (page = 1, categorySlug = null, search = "") => {
    setIsLoading(true);
    try {
      let url = `/api/public/blog?page=${page}&limit=12`;
      if (categorySlug && categorySlug !== "all") {
        url += `&category=${categorySlug}`;
      }
      if (search.trim()) {
        url += `&search=${encodeURIComponent(search.trim())}`;
      }

      const res = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }, {
        cache: 'no-store'
      });

      if (res.ok) {
        const result = await res.json();
        // console.log("post", result);
        setData(result.posts || []);
        setTotalPages(result.meta?.totalPages || 1);
        setCurrentPage(result.meta?.currentPage || 1);
      } else {
        console.error("Error Fetching Blogs");
        toast.error("Failed to fetch blog posts");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred while fetching blog posts");
    } finally {
      setIsLoading(false);
    }
  };

  const getAllCategories = async () => {
    try {
      const res = await fetch("/api/public/blog/blog-category", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }, {
        cache: 'no-store'
      });

      if (res.ok) {
        const result = await res.json();
        // console.log("Result:", result);
        setCategories(result.categories || result || []);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleBlogAdded = (newBlog) => {
    if (!newBlog || !newBlog.id) {
      console.error("Invalid new blog data:", newBlog);
      return;
    }
    // The page will be refreshed by the AddForm component
  };

  const handleBlogUpdated = (updatedBlog) => {
    if (!updatedBlog || !updatedBlog.id) {
      console.error("Invalid blog data provided for update:", updatedBlog);
      return;
    }
    // The page will be refreshed by the EditForm component
  };

  const handleBlogDeleted = (deletedId) => {
    if (!deletedId) {
      console.error("Invalid blog ID provided for deletion");
      return;
    }
    // The page will be refreshed by the DeleteForm component
  };

  const handleCategoryChange = (categorySlug) => {
    setSelectedCategory(categorySlug);
    setCurrentPage(1);
    getAllBlogs(1, categorySlug === "all" ? null : categorySlug, searchText);
  };

  const handleSearch = () => {
    setCurrentPage(1);
    getAllBlogs(
      1,
      selectedCategory === "all" ? null : selectedCategory,
      searchText
    );
  };

  const handlePageChange = (page) => {
    getAllBlogs(
      page,
      selectedCategory === "all" ? null : selectedCategory,
      searchText
    );
  };

  useEffect(() => {
    getAllBlogs();
    getAllCategories();
  }, []);

  if (status === "loading" || isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Blog Posts
          </h1>
        </div>
        <SkeletonLoader count={8} />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          Blog Posts
        </h1>
        {session && (
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 ease-in-out flex items-center space-x-2">
                <PlusIcon className="w-5 h-5" />
                <span className="hidden md:inline">Add Blog Post</span>
              </Button>
            </DialogTrigger>
            <DialogContent
              className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto"
              onPointerDownOutside={(e) => e.preventDefault()}
              onInteractOutside={(e) => e.preventDefault()}
            >
              <AddForm setIsOpen={setIsOpen} onBlogAdded={handleBlogAdded} />
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        {/* Category Filter */}
        {selectedCategory && (<div className="flex items-center gap-2">
          <label className="text-sm font-medium whitespace-nowrap">
            Category:
          </label>
          <Select value={selectedCategory} onValueChange={handleCategoryChange}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.slug}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>)}

        {/* Search */}
        <div className="flex items-center gap-2 flex-1">
          <Input
            placeholder="Search blog posts..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            className="flex-1"
          />
          <Button onClick={handleSearch} variant="outline">
            Search
          </Button>
        </div>
      </div>

      {data && data.length > 0 ? (
        <>
          <CardList
            data={data}
            onBlogUpdated={handleBlogUpdated}
            onBlogDeleted={handleBlogDeleted}
            showActions={!!session}
          />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <Button
                variant="outline"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center">
            <h2 className="text-2xl text-gray-500 dark:text-gray-400 mb-4">
              No blog posts found
            </h2>
            {session && (
              <Button onClick={() => setIsOpen(true)} className="gap-2">
                <PlusIcon className="w-4 h-4" />
                Add First Blog Post
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
