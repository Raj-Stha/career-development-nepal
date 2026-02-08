import { Suspense } from "react";
import PostsPageClient from "./_components/posts-client-wrapper.jsx";

const siteName = process.env.NEXT_PUBLIC_WEBSITE_NAME;
const ogImage = process.env.NEXT_PUBLIC_WEBSITE_META_OG_IMAGE;

// Extract and sanitize keywords
const keywords = process.env.NEXT_PUBLIC_WEBSITE_META_KEYWORDS_POSTS
  ? process.env.NEXT_PUBLIC_WEBSITE_META_KEYWORDS_POSTS.split(",").map((k) =>
      k.trim()
    )
  : [];

export const metadata = {
  title: `Posts - ${siteName}`,
  description: `Explore in-depth posts and analyses on politics, science, environment, and society by ${siteName}. Stay informed with fact-checked content.`,
  keywords,
  authors: [{ name: siteName }],
  creator: siteName,
  publisher: siteName,
  openGraph: {
    title: `${siteName} - Posts `,
    description: `Dive into ${siteName}’s latest posts and videos on Indian politics, world affairs, and public awareness.`,
    type: "website",
    images: [
      {
        url: ogImage,
        width: 1280,
        height: 720,
        alt: `${siteName} - Posts `,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteName} - Posts `,
    description: `Stay updated with ${siteName}’s informative posts on trending topics, politics, and fact-checks.`,
    images: [ogImage],
  },
};

export default function PostsPage() {
  return <PostsPageClient />;
}
