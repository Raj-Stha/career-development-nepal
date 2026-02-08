import { NextResponse } from "next/server";
import db from "@/lib/db";
import { withRole } from "@/lib/auth-middleware";
import { generateUniqueSlug } from "@/lib/slugify";

export const dynamic = 'force-dynamic'

// CREATE a new blog
export const POST = withRole(["admin", "editor"])(async (request) => {
    try {
        const {
            title,
            slug: incomingSlug,
            image,
            excerpt,
            description,
            gallery,
            isFeatured,
            map,
            categoryId,
        } = await request.json();

        const authorId = request.headers.get("x-user-id");
        if (!authorId) {
            return NextResponse.json({ error: "Unauthorized: Missing user ID" }, { status: 401 });
        }

        if (!title || !description || !categoryId) {
            return NextResponse.json(
                { error: "Title, description, and categoryId are required" },
                { status: 400 }
            );
        }

        // Generate unique slug - create a proper callback function
        const checkSlugUnique = async (slug) => {
            const existing = await db.post.findFirst({ where: { slug } });
            return !existing; // return true if slug is available
        };

        const finalSlug = await generateUniqueSlug(incomingSlug || title, checkSlugUnique);

        const blog = await db.post.create({
            data: {
                title,
                slug: finalSlug,
                image,
                excerpt,
                description,
                gallery: gallery || [],
                isFeatured: !!isFeatured,
                map,
                categoryId,
                authorId,
            },
        });

        return NextResponse.json(blog, { status: 201 });
    } catch (error) {
        console.error("Error creating blog:", error);
        return NextResponse.json({ error: "Error creating blog" }, { status: 500 });
    }
});

// UPDATE blog by id
export const PUT = withRole(["admin", "editor"])(async (request) => {
    try {
        const {
            id,
            title,
            slug: incomingSlug,
            image,
            excerpt,
            description,
            gallery,
            isFeatured,
            map,
            categoryId,
        } = await request.json();

        if (!id) {
            return NextResponse.json({ error: "Blog ID is required" }, { status: 400 });
        }
        if (!title || !description || !categoryId) {
            return NextResponse.json(
                { error: "Title, description, and categoryId are required" },
                { status: 400 }
            );
        }

        // Fetch current blog to compare slug/title
        const existing = await db.post.findUnique({ where: { id } });
        if (!existing) {
            return NextResponse.json({ error: "Blog not found" }, { status: 404 });
        }

        let finalSlug = existing.slug;

        // Regenerate slug if title or slug changed
        if (incomingSlug && incomingSlug !== existing.slug) {
            const checkSlugUnique = async (slug) => {
                const existingSlug = await db.post.findFirst({
                    where: {
                        slug,
                        id: { not: id } // Exclude current blog from check
                    }
                });
                return !existingSlug;
            };
            finalSlug = await generateUniqueSlug(incomingSlug, checkSlugUnique);
        } else if (title !== existing.title) {
            const checkSlugUnique = async (slug) => {
                const existingSlug = await db.post.findFirst({
                    where: {
                        slug,
                        id: { not: id } // Exclude current blog from check
                    }
                });
                return !existingSlug;
            };
            finalSlug = await generateUniqueSlug(title, checkSlugUnique);
        }

        const updated = await db.post.update({
            where: { id },
            data: {
                title,
                slug: finalSlug,
                image,
                excerpt,
                description,
                gallery: gallery || [],
                isFeatured: !!isFeatured,
                map,
                categoryId,
            },
        });

        return NextResponse.json(updated, { status: 200 });
    } catch (error) {
        console.error("Error updating blog:", error);
        return NextResponse.json({ error: "Error updating blog" }, { status: 500 });
    }
});

// DELETE blog by id
export const DELETE = withRole(["admin", "editor"])(async (request) => {
    try {
        const { id } = await request.json();

        if (!id) {
            return NextResponse.json({ error: "Blog ID is required" }, { status: 400 });
        }

        await db.post.delete({ where: { id } });

        return NextResponse.json({ message: "Blog deleted" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting blog:", error);
        return NextResponse.json({ error: "Error deleting blog" }, { status: 500 });
    }
});