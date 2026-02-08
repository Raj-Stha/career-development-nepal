"use client";

import {
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";
import ImageUpload from "../../../_components/image-upload";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  name: z.string().min(1, "Category name is required"),
  priority: z.preprocess(
    (value) => (value === "" ? undefined : Number.parseInt(value, 10)),
    z.number().int().positive("Priority must be a positive number").optional()
  ),
  image: z.string().optional(),
  description: z.string().optional(),
});

export default function AddForm({ setIsOpen, onCategoryAdded }) {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      priority: undefined,
      image: "",
      description: "",
    },
  });

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
      const response = await fetch("/api/protected/blog/blog-category", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.accessToken}`,
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || data.message || "Something went wrong!");
      } else {
        onCategoryAdded(data.data);
        setIsOpen(false);
        form.reset();
        toast.success("Blog category added successfully!");
        window.location.reload();
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("An error occurred while adding blog category");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-2xl font-semibold">
          Add Blog Category
        </DialogTitle>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Technology" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Display Priority</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <Label>Category Image</Label>
            <ImageUpload
              onImageUploaded={handleImageUploaded}
              currentImage={form.watch("image")}
              onImageRemoved={handleImageRemoved}
            />
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Write a brief description of this category..."
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="gap-2">
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add Category"
              )}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </>
  );
}
