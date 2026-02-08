import { NextResponse } from "next/server"
import { withAuth } from "@/lib/auth-middleware"
import db from "@/lib/db"

export const dynamic = 'force-dynamic'

async function handler(request) {
    if (request.method !== "PATCH") {
        return NextResponse.json({ error: "Method not allowed" }, { status: 405 })
    }

    const userId = request.headers.get("x-user-id");
    // const userId = request.user?.id
    if (!userId) {
        return NextResponse.json({ error: "User ID not found in token" }, { status: 400 })
    }

    const user = await db.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            providerId: true,
            email: true,
        },
    })

    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // If user has a providerId (social login), do not allow profile update
    if (user.providerId) {
        return NextResponse.json(
            { error: "Profile update not allowed for social login users" },
            { status: 403 }
        )
    }

    const body = await request.json()

    // Reject if email is present in the update request
    if ("email" in body) {
        return NextResponse.json(
            { error: "Email cannot be changed" },
            { status: 400 }
        )
    }

    const { name, image } = body

    // Validate input - only allow name and image (optional)
    if (!name && !image) {
        return NextResponse.json(
            { error: "At least one of 'name' or 'image' must be provided" },
            { status: 400 }
        )
    }

    const dataToUpdate = {}
    if (name) dataToUpdate["name"] = name
    if (image) dataToUpdate["image"] = image

    const updatedUser = await db.user.update({
        where: { id: userId },
        data: dataToUpdate,
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            image: true,
            updatedAt: true,
        },
    })

    return NextResponse.json({ success: true, user: updatedUser })
}

export const PATCH = withAuth(handler)
