"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, Loader2 } from "lucide-react";
import { toast } from "react-toastify";

const uploadGalleryImages = async (files) => {
  const uploadPromises = files.map(async (file) => {
    if (typeof file === "string") return file; // Already uploaded

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "janasambadh_upload");

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/dvhwrtaev/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    }
  });

  return Promise.all(uploadPromises);
};

export function GalleryUpload({ label, onChange, value, onUploadComplete }) {
  const [imagePreviews, setImagePreviews] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    // Clear existing previews
    setImagePreviews((prevPreviews) => {
      prevPreviews.forEach((preview) => {
        if (preview.startsWith("blob:")) {
          URL.revokeObjectURL(preview);
        }
      });
      return [];
    });

    // Create new previews for all files in the value array
    const newPreviews = value.map((file) => {
      if (file instanceof File) {
        return URL.createObjectURL(file);
      }
      return file; // If it's already a string URL, use it as is
    });
    setImagePreviews(newPreviews);

    // Cleanup function to revoke object URLs
    return () => {
      newPreviews.forEach((preview) => {
        if (preview.startsWith("blob:")) {
          URL.revokeObjectURL(preview);
        }
      });
    };
  }, [value]);

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files || []);
    const newFiles = [...value, ...files];
    onChange(newFiles);
  };

  const removeImage = (index) => {
    const newFiles = value.filter((_, i) => i !== index);
    onChange(newFiles);
  };

  const handleUploadAll = async () => {
    if (value.length === 0) {
      toast.error("No images to upload");
      return;
    }

    const hasNewFiles = value.some((file) => file instanceof File);
    if (!hasNewFiles) {
      toast.info("All images are already uploaded");
      if (onUploadComplete) {
        onUploadComplete(value);
      }
      return;
    }

    setIsUploading(true);
    try {
      toast.info("Uploading gallery images...");
      const uploadedUrls = await uploadGalleryImages(value);
      onChange(uploadedUrls); // Update with uploaded URLs
      toast.success("Gallery images uploaded successfully!");

      if (onUploadComplete) {
        onUploadComplete(uploadedUrls);
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload some images. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  // Function to get uploaded URLs (for forms to use)
  const getUploadedUrls = async () => {
    if (value.length === 0) return [];

    const hasNewFiles = value.some((file) => file instanceof File);
    if (!hasNewFiles) {
      return value; // All are already URLs
    }

    return await uploadGalleryImages(value);
  };

  // Expose the upload function to parent components
  useEffect(() => {
    if (onChange && typeof onChange === "function") {
      onChange.getUploadedUrls = getUploadedUrls;
    }
  }, [value, onChange]);

  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <FormControl>
        <Input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
          disabled={isUploading}
          className="file:mr-4 h-12 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
        />
      </FormControl>
      <FormMessage />

      {value.length > 0 && (
        <div className="mt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleUploadAll}
            disabled={isUploading}
            className="gap-2"
          >
            {isUploading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              "Upload All Images"
            )}
          </Button>
        </div>
      )}

      <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {imagePreviews.map((preview, index) => (
          <div key={index} className="relative">
            <Image
              src={preview || "/placeholder.svg"}
              alt={`Gallery Image ${index + 1}`}
              width={100}
              height={100}
              className="rounded-md object-cover w-full h-24"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-1 right-1 h-6 w-6"
              onClick={() => removeImage(index)}
              disabled={isUploading}
            >
              <X className="h-3 w-3" />
            </Button>
            {/* Show upload status */}
            {typeof value[index] === "string" && (
              <div className="absolute bottom-1 left-1 bg-green-500 text-white text-xs px-1 rounded">
                ✓
              </div>
            )}
          </div>
        ))}
      </div>

      {isUploading && (
        <div className="flex items-center justify-center py-2">
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
          <span className="text-sm text-gray-600">Uploading images...</span>
        </div>
      )}
    </FormItem>
  );
}

// Export the upload function for direct use if needed
export { uploadGalleryImages };
