"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import Link from "next/link";

export default function YouTubeSection({ video }) {
  const [videos, setVideos] = useState([]);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      setError(null);
      const videoItems = video.filter(
        (item) => item.id && item.id.kind === "youtube#video" && item.id.videoId
      );

      setVideos(videoItems);
      if (videoItems.length > 0) {
        setCurrentVideo(videoItems[0]);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching videos:", error);
      setError(
        error instanceof Error ? error.message : "Failed to load videos"
      );
      setVideos([]);
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "1 day ago";
    if (diffDays < 30) return `${diffDays} days ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  const handleVideoSelect = (video) => {
    setCurrentVideo(video);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-xl">Loading videos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl text-red-500 mb-4">Error loading videos</div>
          <div className="text-gray-400 mb-4">{error}</div>
          <button
            onClick={fetchVideos}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-xl">No videos found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  ">
      <div className="container mx-auto max-w-7xl px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="poppins-text text-3xl sm:text-4xl md:text-5xl font-semibold text-primary">
              Popular Videos
            </h2>
            <div className="w-30 h-[3px] bg-secondary rounded-full mt-2"></div>
          </div>

          <Link
            href="/youtube"
            className="text-sm sm:text-base text-white px-4 py-2 bg-secondary hover:bg-secondary/80 font-medium  poppins-text"
          >
            View All
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Video Player */}
          <div className="lg:col-span-3">
            {currentVideo && (
              <div className="space-y-4">
                {/* Video Player */}
                <div className="relative aspect-video bg-gray-200 rounded-lg overflow-hidden">
                  <iframe
                    src={`https://www.youtube.com/embed/${currentVideo.id.videoId}?autoplay=1`}
                    title={currentVideo.snippet.title}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>

                {/* Video Info */}
                <div className="space-y-3 pt-4 bg-gray-100 px-5 py-4 rounded-2xl">
                  <h1 className="text-xl font-semibold leading-tight">
                    {currentVideo.snippet.title}
                  </h1>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600  text-white rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold">
                          {currentVideo.snippet.channelTitle.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium">
                          {currentVideo.snippet.channelTitle}
                        </div>
                        <div className="text-sm ">
                          {formatDate(currentVideo.snippet.publishedAt)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Other Videos */}
          <div className="lg:col-span-1">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold border-b border-gray-700 pb-2">
                Other Videos
              </h2>

              <div className="space-y-1">
                {videos
                  .filter(
                    (video) => video.id.videoId !== currentVideo?.id.videoId
                  )
                  .map((video, i) =>
                    i < 6 ? (
                      <div
                        key={video.id.videoId}
                        className="flex space-x-3 cursor-pointer hover:bg-gray-200 p-2 rounded-lg transition-colors"
                        onClick={() => handleVideoSelect(video)}
                      >
                        <div className="relative flex-shrink-0">
                          <Image
                            src={
                              video.snippet.thumbnails.medium.url ||
                              "/placeholder.svg"
                            }
                            alt={video.snippet.title}
                            width={120}
                            height={68}
                            className="rounded-lg object-cover"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg opacity-0 hover:opacity-100 transition-opacity">
                            <Play className="w-6 h-6 text-white" />
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium line-clamp-2 mb-1">
                            {video.snippet.title}
                          </h3>
                          <p className="text-xs text-gray-400 mb-1">
                            {video.snippet.channelTitle}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatDate(video.snippet.publishedAt)}
                          </p>
                        </div>
                      </div>
                    ) : null
                  )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
