"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import CardList from "./_components/card-list";
import { PlusIcon } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import AddForm from "./_components/add-form";
import SkeletonLoader from "../../_components/SkeletonLoader";
import { toast } from "react-toastify";

export default function BlogCategory() {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState([]);

  const getAllBlogCategories = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/public/blog/blog-category", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        const result = await res.json();
        setData(result.data || result);
      } else {
        console.error("Error Fetching Blog Categories");
        toast.error("Failed to fetch blog categories");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred while fetching blog categories");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategoryAdded = (newCategory) => {
    setData((prevData) => [...prevData, newCategory]);
  };

  const handleCategoryUpdated = (updatedCategory) => {
    setData((prevData) =>
      prevData.map((category) =>
        category?.id === updatedCategory?.id ? updatedCategory : category
      )
    );
  };

  const handleCategoryDeleted = (deletedId) => {
    setData((prevData) =>
      prevData.filter((category) => category?.id !== deletedId)
    );
  };

  useEffect(() => {
    getAllBlogCategories();
  }, []);

  if (status === "loading" || isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Blog Categories
          </h1>
        </div>
        <SkeletonLoader count={6} />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          Blog Categories
        </h1>
        {session && (
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 ease-in-out flex items-center space-x-2">
                <PlusIcon className="w-5 h-5" />
                <span className="hidden md:inline">Add Category</span>
              </Button>
            </DialogTrigger>
            <DialogContent
              className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto"
              onPointerDownOutside={(e) => e.preventDefault()}
              onInteractOutside={(e) => e.preventDefault()}
            >
              <AddForm
                setIsOpen={setIsOpen}
                onCategoryAdded={handleCategoryAdded}
              />
            </DialogContent>
          </Dialog>
        )}
      </div>

      {data.length > 0 ? (
        <CardList
          data={data}
          onCategoryUpdated={handleCategoryUpdated}
          onCategoryDeleted={handleCategoryDeleted}
          showActions={!!session}
        />
      ) : (
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center">
            <h2 className="text-2xl text-gray-500 dark:text-gray-400 mb-4">
              No blog categories found
            </h2>
            {session && (
              <Button onClick={() => setIsOpen(true)} className="gap-2">
                <PlusIcon className="w-4 h-4" />
                Add First Category
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
