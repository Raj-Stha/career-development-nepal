import { NextResponse } from "next/server"
import { withRole } from "@/lib/auth-middleware"
import db from "@/lib/db"

export const dynamic = 'force-dynamic'

async function handler(request) {
    // const userId = params.id
    const userId = request.headers.get("x-user-id");


    try {
        const { role } = await request.json()

        if (!["admin", "user", "editor"].includes(role)) {
            return NextResponse.json(
                {
                    error: "Invalid role specified",
                    validRoles: ["admin", "user", "editor"],
                },
                { status: 400 }
            )
        }

        const targetUser = await db.user.findFirst({
            where: {
                id: userId,
                isDeleted: false,
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                emailVerified: true,
            },
        })

        if (!targetUser) {
            return NextResponse.json({ error: "Target user not found or is deleted" }, { status: 404 })
        }

        if (!targetUser.emailVerified) {
            return NextResponse.json({ error: "Cannot change role of unverified user" }, { status: 400 })
        }

        if (targetUser.id === request.user.id) {
            return NextResponse.json({ error: "Cannot change your own role" }, { status: 400 })
        }

        if (targetUser.role === role) {
            return NextResponse.json(
                {
                    success: false,
                    message: `User already has the role '${role}'`,
                    user: targetUser,
                },
                { status: 200 }
            )
        }

        const updatedUser = await db.user.update({
            where: { id: userId },
            data: { role },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                updatedAt: true,
            },
        })

        return NextResponse.json(
            {
                success: true,
                message: `User role updated successfully`,
                user: updatedUser,
                changes: {
                    previousRole: targetUser.role,
                    newRole: role,
                    changedBy: request.user.email,
                    changedAt: new Date().toISOString(),
                },
            },
            { status: 200 }
        )
    } catch (error) {
        console.error("Role update error:", error)
        return NextResponse.json({ error: "Failed to update user role" }, { status: 500 })
    }
}

export const PATCH = withRole(["admin"])(handler)
