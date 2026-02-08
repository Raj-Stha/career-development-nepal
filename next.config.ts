import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [
      "i.ytimg.com",
      "i.ibb.co",
      "images.pexels.com",
      "kadampa.org.np",
      "res.cloudinary.com",
      "img.youtube.com",
    ],
  },
  allowedDevOrigins: ["http://localhost:3000"],

};

export default nextConfig;
