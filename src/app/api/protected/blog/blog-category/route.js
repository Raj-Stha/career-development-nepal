import { NextResponse } from "next/server";
import db from "@/lib/db";
import { withRole } from "@/lib/auth-middleware";
import { generateUniqueSlug } from "@/lib/slugify";

export const dynamic = 'force-dynamic'

// CREATE a new category
export const POST = withRole(["admin", "editor"])(async (request) => {
    try {
        const {
            name,
            slug: incomingSlug,
            image,
            description,
            priority,
        } = await request.json();

        const userId = request.headers.get("x-user-id");
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized: Missing user ID" }, { status: 401 });
        }

        if (!name) {
            return NextResponse.json(
                { error: "Name is required" },
                { status: 400 }
            );
        }

        // Generate unique slug
        const finalSlug = await generateUniqueSlug(incomingSlug || name, db.category);

        const category = await db.category.create({
            data: {
                name,
                slug: finalSlug,
                image: image || null,
                description: description || null,
                priority: priority || null,
                userId,
            },
        });

        return NextResponse.json(category, { status: 201 });
    } catch (error) {
        console.error("Error creating category:", error);
        return NextResponse.json({ error: "Error creating category" }, { status: 500 });
    }
});

// UPDATE category by id
export const PUT = withRole(["admin", "editor"])(async (request) => {
    try {
        const {
            id,
            name,
            slug: incomingSlug,
            image,
            description,
            priority,
        } = await request.json();

        if (!id) {
            return NextResponse.json({ error: "Category ID is required" }, { status: 400 });
        }
        if (!name) {
            return NextResponse.json(
                { error: "Name is required" },
                { status: 400 }
            );
        }

        // Fetch current category to compare slug/name
        const existing = await db.category.findUnique({ where: { id } });
        if (!existing) {
            return NextResponse.json({ error: "Category not found" }, { status: 404 });
        }

        let finalSlug = existing.slug;
        // Regenerate slug if name or slug changed
        if (incomingSlug && incomingSlug !== existing.slug) {
            finalSlug = await generateUniqueSlug(incomingSlug, db.category);
        } else if (name !== existing.name) {
            finalSlug = await generateUniqueSlug(name, db.category);
        }

        const updated = await db.category.update({
            where: { id },
            data: {
                name,
                slug: finalSlug,
                image: image || null,
                description: description || null,
                priority: priority || null,
            },
        });

        return NextResponse.json(updated, { status: 200 });
    } catch (error) {
        console.error("Error updating category:", error);
        return NextResponse.json({ error: "Error updating category" }, { status: 500 });
    }
});

// DELETE category by id
export const DELETE = withRole(["admin", "editor"])(async (request) => {
    try {
        const { id } = await request.json();

        if (!id) {
            return NextResponse.json({ error: "Category ID is required" }, { status: 400 });
        }

        await db.category.delete({ where: { id } });

        return NextResponse.json({ message: "Category deleted" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting category:", error);
        return NextResponse.json({ error: "Error deleting category" }, { status: 500 });
    }
});