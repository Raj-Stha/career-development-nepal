import { NextResponse } from "next/server";
import db from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const whereClause = {};

    // Handle isFeatured filter
    const isFeatured = searchParams.get("featured");
    if (isFeatured === "true") {
      whereClause.isFeatured = true;
    } else if (isFeatured === "false") {
      whereClause.isFeatured = false;
    }

    // Single post fetch by slug
    const slug = searchParams.get("slug");
    if (slug) {
      const post = await db.post.findUnique({
        where: { slug },
        select: {
          id: true,
          title: true,
          slug: true,
          image: true,
          video: true,
          excerpt: true,
          description: true,
          gallery: true,
          isFeatured: true,
          map: true,
          createdAt: true,
          updatedAt: true,
          category: { select: { id: true, name: true, slug: true } },
          author: { select: { id: true, name: true, email: true } },
        },
      });

      if (!post) {
        return NextResponse.json(
          {
            error: "Post not found",
            message: `No post found with slug: ${slug}`,
          },
          { status: 404 }
        );
      }

      return NextResponse.json(post);
    }

    // Pagination
    const page = Number(searchParams.get("page") ?? 1);
    const limit = Number(searchParams.get("limit") ?? 10);

    if (page < 1) {
      return NextResponse.json(
        {
          error: "Invalid page parameter",
          message: "Page must be greater than 0",
        },
        { status: 400 }
      );
    }

    if (limit < 1 || limit > 100) {
      return NextResponse.json(
        {
          error: "Invalid limit parameter",
          message: "Limit must be between 1 and 100",
        },
        { status: 400 }
      );
    }

    const offset = (page - 1) * limit;

    // Category filtering
    const categorySlug = searchParams.get("category");
    if (categorySlug) {
      const category = await db.category.findUnique({
        where: { slug: categorySlug },
        select: { id: true },
      });

      if (!category) {
        return NextResponse.json(
          {
            error: "Category not found",
            message: `No category found with slug: ${categorySlug}`,
          },
          { status: 404 }
        );
      }

      whereClause.categoryId = category.id;
    }

    // Search filtering
    const searchText = searchParams.get("search")?.trim();
    if (searchText) {
      if (searchText.length < 2) {
        return NextResponse.json(
          {
            error: "Invalid search parameter",
            message: "Search text must be at least 2 characters long",
          },
          { status: 400 }
        );
      }

      // Wrap existing whereClause with AND if OR is added
      const existingWhere = { ...whereClause };
      whereClause.AND = [
        existingWhere,
        {
          OR: [
            { title: { contains: searchText, mode: "insensitive" } },
            { description: { contains: searchText, mode: "insensitive" } },
            { excerpt: { contains: searchText, mode: "insensitive" } },
          ],
        },
      ];
      delete whereClause.categoryId;
      delete whereClause.isFeatured;
    }

    // Sort: default to latest
    const sort = searchParams.get("sort") === "oldest" ? "asc" : "desc";

    const posts = await db.post.findMany({
      where: whereClause,
      orderBy: { createdAt: sort },
      skip: offset,
      take: limit,
      select: {
        id: true,
        title: true,
        slug: true,
        image: true,
        video: true,
        excerpt: true,
        description: true,
        gallery: true,
        isFeatured: true,
        map: true,
        createdAt: true,
        updatedAt: true,
        category: { select: { id: true, name: true, slug: true } },
        author: { select: { id: true, name: true, email: true } },
      },
    });

    const totalPosts = await db.post.count({ where: whereClause });
    const totalPages = Math.ceil(totalPosts / limit);

    return NextResponse.json({
      posts,
      meta: {
        currentPage: page,
        totalPages,
        totalPosts,
        limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching posts:", error);

    if (error instanceof Error) {
      if (error.message.includes("connect")) {
        return NextResponse.json(
          {
            error: "Database connection error",
            message: "Unable to connect to database. Please try again later.",
          },
          { status: 503 }
        );
      }

      if (
        error.message.includes("Invalid") ||
        error.message.includes("validation")
      ) {
        return NextResponse.json(
          {
            error: "Invalid request",
            message: error.message,
          },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      {
        error: "Internal server error",
        message: "An unexpected error occurred while fetching posts",
      },
      { status: 500 }
    );
  }
}