"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ExternalLink, X } from "lucide-react";

interface Video {
  id: string;
  title: string;
  channel: string;
  channelId: string;
  thumbnail: string;
  description: string;
}

interface VideoDialogProps {
  video: Video | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function VideoDialog({
  video,
  isOpen,
  onClose,
}: VideoDialogProps) {
  if (!video) return null;

  const embedUrl = `https://www.youtube.com/embed/${video.id}?autoplay=1&rel=0`;
  const youtubeUrl = `https://www.youtube.com/watch?v=${video.id}`;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="xl:!max-w-[40vw] w-full p-0 overflow-hidden [&>button.absolute]:hidden">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-start justify-between">
            <DialogTitle className="text-lg font-semibold line-clamp-2 pr-8">
              {video.title}
            </DialogTitle>
            <Button
              variant="default"
              size="icon"
              onClick={onClose}
              className="shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        {/* Video Player */}
        <div className="px-6">
          <div className="relative aspect-video rounded-lg overflow-hidden bg-black">
            <iframe
              src={embedUrl}
              title={video.title}
              className="absolute inset-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>

        {/* Video Info */}
        <div className="p-6 pt-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                {video.channel.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-sm">{video.channel}</p>
              </div>
            </div>
            <Button variant="outline" size="sm" asChild>
              <a
                href={youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center hover:bg-primary hover:text-white gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                Watch on YouTube
              </a>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
