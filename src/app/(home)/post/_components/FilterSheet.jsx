// Updated FilterSheet to use category-based filtering
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Search, Filter, X, Loader2 } from "lucide-react";

export default function FilterSheet({
  currentCategory,
  searchTerm,
  setSearchTerm,
  onCategoryChange,
  onSearch,
  onClearFilters,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [tempSearchTerm, setTempSearchTerm] = useState(searchTerm);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(currentCategory);

  const fetchCategories = async () => {
    setLoadingCategories(true);
    try {
      const response = await fetch("/api/public/blog/blog-category");
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      } else {
        setCategories([]);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([]);
    } finally {
      setLoadingCategories(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedCategory(currentCategory);
  }, [currentCategory]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchTerm(tempSearchTerm);
    onSearch(tempSearchTerm);
    setIsOpen(false);
  };

  const handleCategorySelect = (slug) => {
    setSelectedCategory(slug);
    onCategoryChange(slug);
  };

  const handleClearFilters = () => {
    setTempSearchTerm("");
    setSearchTerm("");
    setSelectedCategory("");
    onClearFilters();
    setIsOpen(false);
  };

  const activeFiltersCount = [currentCategory, searchTerm].filter(
    Boolean
  ).length;

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="relative poppins-text">
          <Filter className="w-4 h-4 mr-2" />
          Search & Filter
          {activeFiltersCount > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center bg-primary text-white text-xs">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent className="w-[300px] sm:w-[540px] z-[99] px-4 py-4">
        <SheetHeader>
          <SheetTitle className="playfair-text">
            Search & Filter Posts
          </SheetTitle>
          <SheetDescription className="poppins-text">
            Search and filter posts to find exactly what you're looking for.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Search */}
          <div className="space-y-2">
            <label className="nunito-text text-sm font-medium text-gray-700">
              Search Posts
            </label>
            <form onSubmit={handleSearch} className="flex gap-2">
              <Input
                type="text"
                placeholder="Search by title, content, or excerpt..."
                value={tempSearchTerm}
                onChange={(e) => setTempSearchTerm(e.target.value)}
                className="poppins-text"
              />
              <Button type="submit" size="icon">
                <Search className="h-4 w-4" />
              </Button>
            </form>
          </div>

          {/* Category Selection */}
          <div className="space-y-3">
            <label className="nunito-text text-sm font-medium text-gray-700">
              Category
            </label>
            {loadingCategories ? (
              <div className="flex items-center gap-2 py-4">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="poppins-text text-sm text-gray-600">
                  Loading categories...
                </span>
              </div>
            ) : categories.length > 0 ? (
              <div className="space-y-3 max-h-40 overflow-y-auto">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    onClick={() => handleCategorySelect(category.slug)}
                    className={`cursor-pointer text-sm poppins-text px-3 py-2 rounded-md transition-all border ${
                      selectedCategory === category.slug
                        ? "bg-primary text-white border-primary"
                        : "bg-white text-gray-800 border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    {category.name}
                  </div>
                ))}
              </div>
            ) : (
              <p className="poppins-text text-sm text-gray-500">
                No categories available
              </p>
            )}
          </div>

          {/* Active Filters */}
          {activeFiltersCount > 0 && (
            <div className="space-y-3">
              <label className="nunito-text text-sm font-medium text-gray-700">
                Active Filters
              </label>
              <div className="flex flex-wrap gap-2">
                {currentCategory && (
                  <Badge variant="secondary" className="nunito-text">
                    Category: {currentCategory}
                    <button
                      onClick={() => onCategoryChange("")}
                      className="ml-1 hover:text-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}

                {searchTerm && (
                  <Badge variant="secondary" className="nunito-text">
                    Search: {searchTerm}
                    <button
                      onClick={() => {
                        setTempSearchTerm("");
                        setSearchTerm("");
                        onSearch("");
                      }}
                      className="ml-1 hover:text-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              onClick={handleClearFilters}
              variant="outline"
              className="poppins-text flex-1"
            >
              Clear All
            </Button>
            <Button
              onClick={() => setIsOpen(false)}
              className="poppins-text flex-1"
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
