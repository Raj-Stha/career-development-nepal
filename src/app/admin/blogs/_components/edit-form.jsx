"use client";

import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogContent,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-toastify";
import { Loader2, EditIcon } from "lucide-react";
import ImageUpload from "../../_components/image-upload";
import {
  GalleryUpload,
  uploadGalleryImages,
} from "../../_components/gallery-upload";
import CustomEditor from "../../_components/CustomEditor";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  image: z.string().optional(),
  excerpt: z.string().optional(),
  description: z.string().min(1, "Description is required"),
  isFeatured: z.boolean().default(false),
  map: z.string().optional(),
  categoryId: z.string().min(1, "Please select a category"),
});

export default function EditForm({ data, onBlogUpdated }) {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [galleryFiles, setGalleryFiles] = useState([]);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: data?.title || "",
      image: data?.image || "",
      excerpt: data?.excerpt || "",
      description: data?.description || "",
      isFeatured: data?.isFeatured || false,
      map: data?.map || "",
      categoryId: data?.category?.id || "",
    },
  });

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/public/blog/blog-category");
        if (response.ok) {
          const result = await response.json();
          setCategories(result.categories || result || []);
        } else {
          toast.error("Failed to fetch categories");
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Error loading categories");
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  // Reset form when data changes
  useEffect(() => {
    if (data) {
      form.reset({
        title: data.title || "",
        image: data.image || "",
        excerpt: data.excerpt || "",
        description: data.description || "",
        isFeatured: data.isFeatured || false,
        map: data.map || "",
        categoryId: data.category?.id || "",
      });
      // Set gallery files with existing URLs
      setGalleryFiles(data.gallery || []);
    }
  }, [data, form]);

  const handleImageUploaded = (imageUrl) => {
    form.setValue("image", imageUrl);
  };

  const handleImageRemoved = () => {
    form.setValue("image", "");
  };

  async function onSubmit(values) {
    if (!session?.accessToken) {
      toast.error("Authentication required");
      return;
    }

    setIsLoading(true);
    try {
      // Upload gallery images if any new files
      let galleryUrls = [];
      if (galleryFiles.length > 0) {
        galleryUrls = await uploadGalleryImages(galleryFiles);
      }

      const response = await fetch("/api/protected/blog", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.accessToken}`,
        },
        body: JSON.stringify({
          id: data.id,
          ...values,
          gallery: galleryUrls,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.error || "Something went wrong!");
      } else {
        // Ensure we have the complete updated object
        const updatedBlog = {
          ...result,
          category:
            categories.find((cat) => cat.id === values.categoryId) ||
            data.category,
        };

        onBlogUpdated(updatedBlog);
        setIsOpen(false);
        toast.success("Blog post updated successfully!");
        // Refresh the page after a short delay
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("An error occurred while updating blog post");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex-1 gap-2">
          <EditIcon className="w-4 h-4" />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto"
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">
            Edit Blog Post
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter blog title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Category Selection */}
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            loadingCategories
                              ? "Loading categories..."
                              : "Select a category"
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Featured Image */}
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <ImageUpload
                      onImageUploaded={handleImageUploaded}
                      currentImage={field.value}
                      onImageRemoved={handleImageRemoved}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Excerpt */}
            <FormField
              control={form.control}
              name="excerpt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Excerpt</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Brief description of the blog post"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <CustomEditor
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Write your blog content here..."
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Gallery Upload */}
            <GalleryUpload
              label="Gallery Images (Optional)"
              onChange={setGalleryFiles}
              value={galleryFiles}
            />

            {/* Map */}
            {/* <FormField
              control={form.control}
              name="map"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Map Embed Code (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Google Maps embed code or location info"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}

            {/* Featured Checkbox */}
            {/* <FormField
              control={form.control}
              name="isFeatured"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Featured Post</FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Mark this post as featured
                    </p>
                  </div>
                </FormItem>
              )}
            /> */}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading || loadingCategories}
                className="gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Blog Post"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
