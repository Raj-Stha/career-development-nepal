import { notFound } from "next/navigation";
import SinglePostClient from "./_components/single-post-client";

async function getPost(slug) {
  try {
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
      }/api/public/blog?slug=${slug}`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching post:", error);
    return null;
  }
}

async function getRelatedPosts(categorySlug, currentSlug) {
  try {
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
      }/api/public/blog?category=${categorySlug}&limit=6`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    return data.blogs?.filter((blog) => blog.slug !== currentSlug) || [];
  } catch (error) {
    console.error("Error fetching related posts:", error);
    return [];
  }
}

export default async function SinglePostPage({ params }) {
  const post = await getPost(params.slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = await getRelatedPosts(post.category?.slug, post.slug);

  return <SinglePostClient post={post} relatedPosts={relatedPosts} />;
}

export async function generateMetadata({ params }) {
  const post = await getPost(params.slug);

  if (!post) {
    return {
      title: "Post Not Found",
      description: "The requested post could not be found.",
    };
  }

  const siteName = process.env.NEXT_PUBLIC_WEBSITE_NAME;
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const fallbackImage =
    process.env.NEXT_PUBLIC_WEBSITE_META_OG_IMAGE ||
    `${baseUrl}/placeholder.svg`;

  const postUrl = `${baseUrl}/post/${post.slug}`;
  const imageUrl = post.image?.startsWith("http")
    ? post.image
    : post.image
    ? `${baseUrl}${post.image}`
    : fallbackImage;

  const description =
    post.excerpt ||
    (post.description
      ? post.description.replace(/<[^>]*>/g, "").substring(0, 160)
      : `Read ${post.title} from ${siteName}.`);

  const publishedTime = new Date(post.createdAt).toISOString();
  const modifiedTime = new Date(post.updatedAt).toISOString();

  return {
    title: `${post.title} | ${siteName} - Post & Analysis`,
    description,
    keywords: [
      post.category?.name,
      ...post.title.split(" ").slice(0, 5),
      "politics",
      "education",
      "fact check",
    ]
      .filter(Boolean)
      .join(", "),
    alternates: {
      canonical: postUrl,
    },
    openGraph: {
      title: post.title,
      description,
      url: postUrl,
      siteName,
      type: "article",
      locale: "en_US",
      publishedTime,
      modifiedTime,
      authors: post.author?.name ? [post.author.name] : undefined,
      section: post.category?.name,
      tags: post.category?.name ? [post.category.name] : undefined,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
      images: [imageUrl],
      creator: post.author?.name
        ? `@${post.author.name.replace(/\s+/g, "").toLowerCase()}`
        : undefined,
      site: "@dhruvrathee", // Replace with your real handle if available
    },
    other: {
      "article:author": post.author?.name,
      "article:published_time": publishedTime,
      "article:modified_time": modifiedTime,
      "article:section": post.category?.name,
      "article:tag": post.category?.name,
      robots:
        "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
      googlebot: "index, follow",
      bingbot: "index, follow",
      "og:locale": "en_US",
      "og:site_name": siteName,
      "fb:app_id": "your-facebook-app-id", // Replace or remove if not used
    },
  };
}
