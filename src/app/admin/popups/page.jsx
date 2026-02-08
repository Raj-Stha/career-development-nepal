"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "react-toastify";
import {
  Loader2,
  Save,
  Trash2,
  Plus,
  Edit,
  Video,
  FileImage,
  ImageIcon,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import ImageUpload from "../_components/image-upload";

export default function PopupManagement() {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedMediaType, setSelectedMediaType] = useState("image");

  const [popup, setPopup] = useState({
    id: null,
    image: "",
    video: "",
    gif: "",
  });

  const [formData, setFormData] = useState({
    id: null,
    image: "",
    video: "",
    gif: "",
  });

  // CRUD Operations
  const fetchPopup = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/public/popup", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        const data = await res.json();
        setPopup(data);
        // Determine which media type is currently set
        if (data.image) setSelectedMediaType("image");
        else if (data.video) setSelectedMediaType("video");
        else if (data.gif) setSelectedMediaType("gif");
      } else if (res.status === 404) {
        setPopup({
          id: null,
          image: "",
          video: "",
          gif: "",
        });
      }
    } catch (error) {
      console.error("Fetch Error: ", error);
      toast.error("Failed to fetch popup data");
    } finally {
      setIsLoading(false);
    }
  };

  const createPopup = async (data) => {
    if (!session?.accessToken) {
      toast.error("Authentication required");
      return false;
    }

    setIsSaving(true);
    try {
      const res = await fetch("/api/protected/popup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.accessToken}`,
        },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        const result = await res.json();
        setPopup(result.data);
        toast.success("Popup created successfully!");
        return true;
      } else {
        const error = await res.json();
        toast.error(error.message || "Failed to create popup");
        return false;
      }
    } catch (error) {
      console.error("Create Error: ", error);
      toast.error("An error occurred while creating popup");
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const updatePopup = async (data) => {

    // console.log(data);

    if (!session?.accessToken) {
      toast.error("Authentication required");
      return false;
    }

    setIsSaving(true);
    try {
      const res = await fetch("/api/protected/popup", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.accessToken}`,
        },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        const result = await res.json();
        setPopup(result.data);
        toast.success("Popup updated successfully!");
        return true;
      } else {
        const error = await res.json();
        toast.error(error.message || "Failed to update popup");
        return false;
      }
    } catch (error) {
      console.error("Update Error: ", error);
      toast.error("An error occurred while updating popup");
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const deletePopup = async () => {
    if (!session?.accessToken || !popup.id) {
      toast.error("Authentication required or no popup to delete");
      return false;
    }

    setIsDeleting(true);
    try {
      const res = await fetch("/api/protected/popup", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.accessToken}`,
        },
        body: JSON.stringify({ id: popup.id }),
      });

      if (res.ok) {
        setPopup({
          id: null,
          image: "",
          video: "",
          gif: "",
        });
        toast.success("Popup deleted successfully!");
        return true;
      } else {
        const error = await res.json();
        toast.error(error.message || "Failed to delete popup");
        return false;
      }
    } catch (error) {
      console.error("Delete Error: ", error);
      toast.error("An error occurred while deleting popup");
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  // Form handlers
  const openDialog = (isEdit = false) => {
    if (isEdit) {
      setFormData({ ...popup });
      if (popup.image) setSelectedMediaType("image");
      else if (popup.video) setSelectedMediaType("video");
      else if (popup.gif) setSelectedMediaType("gif");
    } else {
      setFormData({
        id: null,
        image: "",
        video: "",
        gif: "",
      });
      setSelectedMediaType("image");
    }
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    // Validate that exactly one media type is provided
    const mediaCount = [formData.image, formData.video, formData.gif].filter(
      Boolean
    ).length;

    if (mediaCount === 0) {
      toast.error("Please provide one media type (image, video, or gif)");
      return;
    }

    if (mediaCount > 1) {
      toast.error("Please provide only one media type at a time");
      return;
    }

    const success = formData.id
      ? await updatePopup(formData)
      : await createPopup(formData);
    if (success) {
      setIsDialogOpen(false);
    }
  };

  const handleMediaTypeChange = (type) => {
    setSelectedMediaType(type);
    // Clear other media types when switching
    setFormData((prev) => ({
      ...prev,
      image: type === "image" ? prev.image : "",
      video: type === "video" ? prev.video : "",
      gif: type === "gif" ? prev.gif : "",
    }));
  };

  const handleImageUploaded = (imageUrl) => {
    setFormData((prev) => ({ ...prev, image: imageUrl }));
  };

  const handleImageRemoved = () => {
    setFormData((prev) => ({ ...prev, image: "" }));
  };

  const getCurrentMediaType = () => {
    if (popup.image) return "image";
    if (popup.video) return "video";
    if (popup.gif) return "gif";
    return null;
  };

  const getCurrentMediaValue = () => {
    if (popup.image) return popup.image;
    if (popup.video) return popup.video;
    if (popup.gif) return popup.gif;
    return "";
  };

  useEffect(() => {
    if (session) {
      fetchPopup();
    }
  }, [session]);

  if (status === "loading" || isLoading) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <Card>
          <CardContent className="flex items-center justify-center h-64">
            <p className="text-lg text-gray-500">
              Please sign in to manage popups
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          Popup Management
        </h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => openDialog(false)} className="gap-2">
              <Plus className="h-4 w-4" />
              Create Popup
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {formData.id ? "Edit Popup" : "Create New Popup"}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              {/* Media Type Selection */}
              <div className="space-y-3">
                <Label className="text-base font-medium">
                  Select Media Type
                </Label>
                <RadioGroup
                  value={selectedMediaType}
                  onValueChange={handleMediaTypeChange}
                  className="flex gap-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="image" id="image" />
                    <Label
                      htmlFor="image"
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <ImageIcon className="h-4 w-4" />
                      Image
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="video" id="video" />
                    <Label
                      htmlFor="video"
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <Video className="h-4 w-4" />
                      Video
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="gif" id="gif" />
                    <Label
                      htmlFor="gif"
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <FileImage className="h-4 w-4" />
                      GIF
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Media Input Based on Selection */}
              {selectedMediaType === "image" && (
                <div className="space-y-2">
                  <Label>Upload Image</Label>
                  <ImageUpload
                    onImageUploaded={handleImageUploaded}
                    currentImage={formData.image}
                    onImageRemoved={handleImageRemoved}
                  />
                </div>
              )}

              {selectedMediaType === "video" && (
                <div className="space-y-2">
                  <Label htmlFor="video-url">Video URL</Label>
                  <Input
                    id="video-url"
                    type="url"
                    placeholder="https://example.com/video.mp4"
                    value={formData.video}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        video: e.target.value,
                      }))
                    }
                  />
                </div>
              )}

              {selectedMediaType === "gif" && (
                <div className="space-y-2">
                  <Label htmlFor="gif-url">GIF URL</Label>
                  <Input
                    id="gif-url"
                    type="url"
                    placeholder="https://example.com/animation.gif"
                    value={formData.gif}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, gif: e.target.value }))
                    }
                  />
                </div>
              )}
            </div>

            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="gap-2"
              >
                {isSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {formData.id ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Current Popup Display */}
      {popup.id ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Current Popup</span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openDialog(true)}
                  className="gap-2"
                >
                  <Edit className="h-4 w-4" />
                  Edit
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm" className="gap-2">
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Popup</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this popup? This action
                        cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel disabled={isDeleting}>
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={deletePopup}
                        disabled={isDeleting}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        {isDeleting ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            Deleting...
                          </>
                        ) : (
                          "Delete"
                        )}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="font-medium">Media Type:</span>
                <span className="capitalize flex items-center gap-1">
                  {getCurrentMediaType() === "image" && (
                    <ImageIcon className="h-4 w-4" />
                  )}
                  {getCurrentMediaType() === "video" && (
                    <Video className="h-4 w-4" />
                  )}
                  {getCurrentMediaType() === "gif" && (
                    <FileImage className="h-4 w-4" />
                  )}
                  {getCurrentMediaType()}
                </span>
              </div>

              {/* Preview */}
              <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
                <Label className="text-sm font-medium mb-2 block">
                  Preview:
                </Label>
                {popup.image && (
                  <img
                    src={popup.image || "/placeholder.svg"}
                    alt="Popup preview"
                    className="max-w-full h-auto max-h-64 rounded-md"
                  />
                )}
                {popup.video && (
                  <video
                    src={popup.video}
                    controls
                    className="max-w-full h-auto max-h-64 rounded-md"
                  />
                )}
                {popup.gif && (
                  <img
                    src={popup.gif || "/placeholder.svg"}
                    alt="GIF preview"
                    className="max-w-full h-auto max-h-64 rounded-md"
                  />
                )}
              </div>

              <div className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-medium">URL:</span>{" "}
                {getCurrentMediaValue()}
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-64 text-center">
            <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-4 mb-4">
              <ImageIcon className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No popup configured
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Create your first popup to get started
            </p>
            <Button onClick={() => openDialog(false)} className="gap-2">
              <Plus className="h-4 w-4" />
              Create Popup
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
