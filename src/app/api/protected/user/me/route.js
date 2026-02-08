import { NextResponse } from "next/server"
import { withAuth } from "@/lib/auth-middleware"
import db from "@/lib/db"

async function handler(request) {
    // const userId = request.user?.id
    const userId = request.headers.get("x-user-id");

    if (!userId) {
        return NextResponse.json({ error: "User ID not found in token" }, { status: 400 })
    }

    const user = await db.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            image: true,
            provider: true,
            providerId: true,
            emailVerificationToken: true,
            emailVerificationTokenExpiry: true,
            emailVerified: true,
            createdAt: true,
            updatedAt: true,
        },
    })

    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ user })
}

export const GET = withAuth(handler)

export const dynamic = 'force-dynamic';
