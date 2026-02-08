"use client";

import Image from "next/image";
import { Play } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import VideoDialog from "./video-dialog";

function processYouTubeData(data) {
  return data
    .filter((item) => item.id.videoId)
    .map((item) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      channel: item.snippet.channelTitle,
      channelId: item.snippet.channelId,
      thumbnail: item.snippet.thumbnails.medium.url,
      description: item.snippet.description,
      isChannel: item.id.kind === "youtube#channel",
    }));
}

export default function YouTubeGrid({ data }) {
  const processedVideos = processYouTubeData(data);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleVideoClick = (video) => {
    setSelectedVideo(video);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedVideo(null);
  };

  return (
    <>
      <div className="container mx-auto xl:px-[5%] xl:py-[5%] sm:px-[3%] sm:py-[5%] px-[5%]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {processedVideos.map((video) => (
            <Card
              key={video.id}
              className="group cursor-pointer border-0 rounded-none shadow-none bg-transparent"
              onClick={() => handleVideoClick(video)}
            >
              <CardContent className="p-0 space-y-3">
                {/* Video Thumbnail */}
                <div className="relative aspect-video rounded-xl overflow-hidden bg-muted">
                  <Image
                    src={video.thumbnail || "/placeholder.svg"}
                    alt={video.title}
                    fill
                    className="object-cover transition-transform duration-200 group-hover:scale-105"
                  />

                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <div className="bg-black/80 rounded-full p-3">
                        <Play className="w-6 h-6 text-white fill-white" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Video Info */}
                <div className="flex gap-3">
                  {/* Channel Avatar */}
                  <div className="flex-shrink-0">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                      {video.channel.charAt(0).toUpperCase()}
                    </div>
                  </div>

                  {/* Video Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                      {video.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mt-1 hover:text-foreground transition-colors cursor-pointer">
                      {video.channel}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Video Dialog */}
      <VideoDialog
        video={selectedVideo}
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
      />
    </>
  );
}
