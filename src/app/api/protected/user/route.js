import { NextResponse } from "next/server"
import { withRole } from "@/lib/auth-middleware"
import db from "@/lib/db"

async function handler() {
    const users = await db.user.findMany({
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

    return NextResponse.json({ users })
}

export const GET = withRole(['admin'])(handler)

export const dynamic = 'force-dynamic';
